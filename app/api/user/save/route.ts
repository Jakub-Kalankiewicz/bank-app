import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { decryptSensitiveData } from "@/app/utils/registerHelpers";

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userDetails = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      include: {
        bankAccounts: {
          select: {
            accountNumber: true,
            balance: true,
          },
        },
        sensitiveData: {
          select: {
            cardNumber: true,
          },
        },
      },
    });

    if (!userDetails) {
      return new NextResponse("User not found", { status: 404 });
    }

    const decryptedCardNumber = decryptSensitiveData(
      userDetails.sensitiveData?.cardNumber
    ).slice(-4);

    return NextResponse.json({
      email: userDetails.email,
      name: userDetails.name,
      surname: userDetails.surname,
      cardNumber: decryptedCardNumber,
      accountNumber: userDetails.bankAccounts?.accountNumber,
      amount: userDetails.bankAccounts?.balance,
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
