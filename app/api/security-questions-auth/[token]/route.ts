import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        passwordResetToken: token,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const userSecurityQuestions = await prisma.userSecurityQuestion.findMany({
      where: {
        userId: user.id,
      },
      select: {
        securityQuestion: {
          select: {
            id: true,
            question: true,
          },
        },
      },
    });

    return NextResponse.json(userSecurityQuestions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch security questions" },
      { status: 500 }
    );
  }
}
