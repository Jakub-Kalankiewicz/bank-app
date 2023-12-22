import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { decryptSensitiveData } from "@/app/utils/registerHelpers";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cardNumber = await prisma.sensitiveData.findUnique({
      where: {
        userId: currentUser.id,
      },
      select: {
        cardNumber: true,
      },
    });

    if (!cardNumber) {
      return new NextResponse("User not found", { status: 404 });
    }

    const decryptedCardNumber = decryptSensitiveData(cardNumber.cardNumber);

    return NextResponse.json({
      cardNumber: decryptedCardNumber,
    });
  } catch (error: any) {
    return new NextResponse(error.mesage, { status: 500 });
  }
}
