import bcrypt from "bcryptjs";
import { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "@/app/libs/prismadb";

const sessionStrategy: SessionStrategy = "jwt";
const MAX_ATTEMPTS = 4;
const MAX_ATTEMPTS_TIME = 1000 * 60 * 60;

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        if (user.lastFailedLoginAttempt && user.failedLoginAttempts) {
          const timeBetweenFailedAttempts =
            new Date().getTime() - user.lastFailedLoginAttempt!.getTime();
          if (timeBetweenFailedAttempts > MAX_ATTEMPTS_TIME) {
            await prisma.user.update({
              where: {
                email: credentials.email,
              },
              data: {
                lastFailedLoginAttempt: null,
                failedLoginAttempts: 0,
              },
            });
          } else if (user.failedLoginAttempts > MAX_ATTEMPTS) {
            throw new Error("Exceeded maximum number of attempts");
          }
        }

        if (!user.passwordHashToVerify) {
          throw new Error("Invalid credentials");
        }

        const match = await bcrypt.compare(
          user.email + credentials.password,
          user.passwordHashToVerify!
        );
        if (!match) {
          await prisma.user.update({
            where: {
              email: credentials.email,
            },
            data: {
              lastFailedLoginAttempt: new Date(),
              failedLoginAttempts: user.failedLoginAttempts + 1,
            },
          });
          throw new Error("Invalid credentials");
        }
        await prisma.user.update({
          where: {
            email: credentials.email,
          },
          data: {
            passwordHashToVerify: null,
            lastUsedMaskId: null,
            lastFailedLoginAttempt: null,
            failedLoginAttempts: 0,
          },
        });

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const user = await prisma.user.findUnique({
        where: {
          email: token.email!,
        },
        select: {
          id: true,
        },
      });

      const balance = await prisma.bankAccount.findFirst({
        where: {
          userId: user?.id,
        },
        select: {
          balance: true,
        },
      });

      session.balance = balance?.balance!;

      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: sessionStrategy,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
