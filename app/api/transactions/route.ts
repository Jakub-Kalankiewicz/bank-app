import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userTransactions = await prisma.bankAccount.findUnique({
      where: {
        userId: currentUser.id,
      },
      select: {
        sentTransactions: true,
        receivedTransactions: true,
      },
    });
    if (!userTransactions) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (
      userTransactions.sentTransactions.length === 0 &&
      userTransactions.receivedTransactions.length === 0
    ) {
      return NextResponse.json([]);
    } else if (userTransactions.sentTransactions.length === 0) {
      return NextResponse.json(
        userTransactions.receivedTransactions.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      );
    } else if (userTransactions.receivedTransactions.length === 0) {
      return NextResponse.json(
        userTransactions.sentTransactions.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      );
    }

    const allTransactions = [
      ...(userTransactions?.sentTransactions || []),
      ...(userTransactions?.receivedTransactions || []),
    ];

    allTransactions.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    return NextResponse.json(allTransactions);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
