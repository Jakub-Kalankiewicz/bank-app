import { NextResponse } from "next/server";
import Joi from "joi";
import prisma from "@/app/libs/prismadb";
import { getHashesAndMasks } from "@/app/utils/registerHelpers";

const changePasswordSchema = Joi.object({
  newPassword: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$"
      )
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
    }),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("newPassword"))
    .messages({
      "any.only": "Passwords do not match",
    }),
  token: Joi.string().required(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { error } = changePasswordSchema.validate(body);
    if (error) {
      return new NextResponse(error.details[0].message, { status: 400 });
    }

    const { newPassword, confirmPassword, token } = body;

    if (!newPassword || !confirmPassword || !token) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return new NextResponse("Password not match", { status: 400 });
    }

    const data = await prisma.resetPasswordToken.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });

    const user = data?.user;

    if (!user) {
      return new NextResponse("Token not found", { status: 404 });
    }

    const userId = user.id;

    await prisma.$transaction(async (prisma) => {
      // Step 1: Delete old passwords and masks
      await prisma.mask.deleteMany({
        where: { userId },
      });
      await prisma.hashedPasswords.deleteMany({
        where: { userId },
      });

      const passwordData = await getHashesAndMasks(
        newPassword,
        newPassword.length / 2,
        newPassword.length,
        user.email
      );

      for (const hashData of passwordData) {
        const hashedPassword = await prisma.hashedPasswords.create({
          data: {
            userId,
            password: hashData.hash,
          },
        });

        await prisma.mask.create({
          data: {
            mask: hashData.mask,
            hashedPasswords: {
              connect: {
                id: hashedPassword.id,
              },
            },
            userId,
          },
        });
      }
      await prisma.resetPasswordToken.delete({
        where: { token },
      });
    });
    return new NextResponse("Password changed successfully", { status: 200 });
  } catch (error: any) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
