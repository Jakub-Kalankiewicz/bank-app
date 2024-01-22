import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { accountNumber: string } }
) {
  try {
    const { accountNumber } = context.params;
    if (!accountNumber) {
      return new NextResponse("Missing required fields", {
        status: 400,
        statusText: "All fields are required",
      });
    }
    if (accountNumber.length !== 26) {
      return new NextResponse("Invalid account number", {
        status: 400,
        statusText: "Invalid account number",
      });
    }

    const user = await prisma?.bankAccount.findUnique({
      where: {
        accountNumber,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
        statusText: "User not found",
      });
    }

    return NextResponse.json(user.user);
  } catch (error: any) {
    return new NextResponse(error, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
