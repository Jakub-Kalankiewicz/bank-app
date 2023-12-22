import { NextResponse } from "next/server";
import Joi from "joi";
import crypto from "crypto";
import prisma from "@/app/libs/prismadb";

function generateToken(length = 48) {
  return crypto.randomBytes(length).toString("hex");
}

const ResetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { error } = ResetPasswordSchema.validate(body);
    if (error) {
      return new NextResponse(error.details[0].message, { status: 400 });
    }
    const { email } = body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return new NextResponse("Email not found", { status: 404 });
    }

    const token = generateToken();

    await prisma.resetPasswordToken.create({
      data: {
        token,
        userId: user.id,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 4),
      },
    });

    return NextResponse.json({
      url: `${process.env.NEXTAUTH_URL}/reset-password/${token}`,
      email,
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
