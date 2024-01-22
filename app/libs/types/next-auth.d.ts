import { Decimal } from "@prisma/client/runtime/library";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
    };
    balance: Decimal;
  }
}
