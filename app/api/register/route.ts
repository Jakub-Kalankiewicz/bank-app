import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import {
  getHashesAndMasks,
  generateBankAccount,
  encryptSensitiveData,
} from "@/app/utils/registerHelpers";

export async function POST(request: Request) {
  const data = await request.json();
  const {
    email,
    name,
    surname,
    password,
    repeatPassword,
    cardNumber,
    identityDocument,
  } = data;

  if (
    !email ||
    !name ||
    !surname ||
    !password ||
    !repeatPassword ||
    !cardNumber ||
    !identityDocument
  ) {
    return new NextResponse("Missing required fields", {
      status: 400,
      statusText: "All fields are required",
    });
  }

  if (name.length < 3) {
    return new NextResponse("Invalid name", {
      status: 400,
      statusText: "Name must contain at least 3 characters",
    });
  }

  if (surname.length < 3) {
    return new NextResponse("Invalid surname", {
      status: 400,
      statusText: "Surname must contain at least 3 characters",
    });
  }

  if (password !== repeatPassword) {
    return new NextResponse("Passwords do not match", {
      status: 400,
      statusText: "Passwords do not match",
    });
  }

  if (
    !password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
    )
  ) {
    return new NextResponse("Invalid password format", {
      status: 400,
      statusText:
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
    });
  }

  if (!cardNumber.match(/^[0-9]{16}$/)) {
    return new NextResponse("Invalid card number", {
      status: 400,
      statusText: "Card number must contain 16 digits",
    });
  }

  if (!identityDocument.match(/^[A-Z]{2}-\d{3}$/)) {
    return new NextResponse("Invalid identity document format", {
      status: 400,
      statusText:
        "Identity document must contain 2 uppercase letters, a dash and 3 digits",
    });
  }

  const sensitiveData = encryptSensitiveData(cardNumber, identityDocument);
  const { encryptedCardNumber, encryptedIdentityNumber } = sensitiveData;

  const user = await prisma.user.create({
    data: {
      email,
      name,
      surname,
    },
  });

  const passwordData = await getHashesAndMasks(
    password,
    password.length / 2,
    password.length,
    user.email
  );
  await prisma.sensitiveData.create({
    data: {
      userId: user.id,
      cardNumber: encryptedCardNumber,
      identityDocument: encryptedIdentityNumber,
    },
  });

  const hashedPasswords = await Promise.all(
    passwordData.map(async (hashData) => {
      const hashedPassword = await prisma.hashedPasswords.create({
        data: {
          userId: user.id,
          password: hashData.hash,
        },
      });

      return hashedPassword;
    })
  );

  await Promise.all(
    passwordData.map(async (hashData, index) => {
      await prisma.mask.create({
        data: {
          mask: hashData.mask,
          hashedPasswords: {
            connect: {
              id: hashedPasswords[index].id,
            },
          },
          userId: user.id,
        },
      });
    })
  );

  await prisma.bankAccount.create({
    data: {
      userId: user.id,
      balance: 1000000.0,
      accountNumber: generateBankAccount(),
    },
  });
  return NextResponse.json(user);
}
