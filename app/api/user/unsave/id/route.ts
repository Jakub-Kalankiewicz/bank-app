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

    const identityDocument = await prisma.sensitiveData.findUnique({
      where: {
        userId: currentUser.id,
      },
      select: {
        identityDocument: true,
      },
    });

    if (!identityDocument) {
      return new NextResponse("User not found", { status: 404 });
    }

    const decryptedIdentityDocument = decryptSensitiveData(
      identityDocument.identityDocument
    );

    return NextResponse.json({
      identityDocument: decryptedIdentityDocument,
    });
  } catch (error: any) {
    return new NextResponse(error.mesage, { status: 500 });
  }
}
