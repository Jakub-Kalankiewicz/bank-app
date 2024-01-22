import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET(
  req: Request,
  context: { params: { token: string } }
) {
  try {
    const { token } = context.params;
    if (!token) {
      return new NextResponse("Invalid Token", {
        status: 400,
        statusText: "Invalid Token",
      });
    }
    const tokenExists = await prisma.resetPasswordToken.findUnique({
      where: {
        token: token,
      },
    });
    if (!tokenExists) {
      return new NextResponse("Invalid Token", {
        status: 404,
        statusText: "Invalid Token",
      });
    }

    if (tokenExists.expires < new Date(Date.now())) {
      await prisma.resetPasswordToken.delete({
        where: {
          token: token,
        },
      });
      return new NextResponse("Invalid Token", {
        status: 400,
        statusText: "Invalid Token",
      });
    }

    return NextResponse.json("Token found");
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
