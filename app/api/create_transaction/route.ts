import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { Decimal } from "@prisma/client/runtime/library";
import Joi from "joi";

interface RequestBody {
  amount: Decimal;
  title: string;
  recipientNumber: string;
}

const CreateTransactionSchema = Joi.object({
  amount: Joi.number().required().min(0),
  title: Joi.string().required(),
  recipientNumber: Joi.string().required(),
});

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 400 });
    }
    
    const body = await request.json();
    const { error } = CreateTransactionSchema.validate(body);
    if (error) {
      return new NextResponse(error.details[0].message, { status: 400 });
    }
    const { amount, title, recipientNumber }: RequestBody = body;
    const amountDecimal = new Decimal(amount);

    if (!amount || !title || !recipientNumber) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    if (amountDecimal.lte(0)) {
      return new NextResponse("Amount must be greater than 0", { status: 400 });
    }

    const recipient = await prisma.user.findFirst({
      where: {
        bankAccounts: {
          accountNumber: recipientNumber,
        },
      },
    });

    if (!recipient) {
      return new NextResponse("Recipient not found", { status: 404 });
    }

    if (recipient.id === currentUser.id) {
      return new NextResponse("You can't send money to yourself", {
        status: 400,
      });
    }

    try {
      await prisma.$transaction(async (prisma) => {
        const senderBankAccount = await prisma.bankAccount.findUnique({
          where: { userId: currentUser.id },
        });

        if (!senderBankAccount) {
          throw new Error("Sender bank account not found");
        }

        if (senderBankAccount.balance.lessThan(amount)) {
          throw new Error("Insufficient balance");
        }

        const recipientBankAccount = await prisma.bankAccount.findUnique({
          where: { userId: recipient.id },
        });

        if (!recipientBankAccount) {
          throw new Error("Recipient bank account not found");
        }

        const transaction = await prisma.transaction.create({
          data: {
            amount: amountDecimal.toNumber(),
            title: title,
            senderNumber: senderBankAccount.accountNumber,
            recipientNumber: recipientBankAccount.accountNumber,
            recipientName: recipient.name!,
            senderName: currentUser.name!,
          },
        });

        await prisma.bankAccount.update({
          where: { id: senderBankAccount.id },
          data: { balance: { decrement: amount } },
        });

        await prisma.bankAccount.update({
          where: { id: recipientBankAccount.id },
          data: { balance: { increment: amount } },
        });

        return transaction;
      });
      const senderBankAccountBalance = await prisma.bankAccount.findUnique({
        where: { userId: currentUser.id },
        select: { balance: true },
      });
      const returnBalance = senderBankAccountBalance?.balance;
      return new NextResponse(`${returnBalance}`, {
        status: 201,
      });
    } catch (error: any) {
      return new NextResponse(error.message, { status: 400 });
    }
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
