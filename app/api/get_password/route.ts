import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import Joi from "joi";

const schema = Joi.object({
  email: Joi.string().email().required(),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { error } = schema.validate(data);
    if (error) {
      return new NextResponse(error.details[0].message, { status: 400 });
    }
    const { email } = data;
    if (!email) {
      return new NextResponse("Missing required fields", {
        status: 400,
        statusText: "All fields are required",
      });
    }

    const passwords = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        passwords: true,
      },
    });

    if (passwords && passwords.passwords.length > 0) {
      const isAnotherLoginTry = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          lastUsedMaskId: true,
          passwordHashToVerify: true,
        },
      });
      const { lastUsedMaskId, passwordHashToVerify } = isAnotherLoginTry || {};
      if (lastUsedMaskId && passwordHashToVerify) {
        const mask = await prisma.mask.findUnique({
          where: {
            id: lastUsedMaskId,
          },
          select: {
            mask: true,
          },
        });
        return NextResponse.json(mask);
      }
      const randomIndex = Math.floor(
        Math.random() * passwords.passwords.length
      );
      const randomPassword = passwords.passwords[randomIndex];
      const mask = await prisma.mask.findUnique({
        where: {
          id: randomPassword.maskId || undefined,
        },
        select: {
          mask: true,
        },
      });
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          passwordHashToVerify: randomPassword.password,
          lastUsedMaskId: randomPassword.maskId,
        },
      });
      return NextResponse.json(mask);
    } else {
      return new NextResponse("No passwords found", {
        status: 400,
        statusText: "No passwords found",
      });
    }
  } catch (error: any) {
    return new NextResponse(error.message, { status: 400 });
  }
}
