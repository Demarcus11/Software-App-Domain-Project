import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// validate security answers
export async function POST(request: Request) {
  try {
    const { token, answers } = await request.json();

    console.log(answers);

    const user = await prisma.user.findFirst({
      where: { passwordResetToken: token },
      include: { securityQuestions: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid token, please try again" },
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
          },
        },
        answerHash: true,
      },
    });

    userSecurityQuestions.forEach((userSecurityQuestion, index) => {
      const answer = answers[index].answer;
      const answerHash = userSecurityQuestion.answerHash;
      const isValid = bcrypt.compareSync(answer, answerHash);

      if (!isValid) {
        return NextResponse.json(
          { message: "Invalid answer, please try again" },
          { status: 400 }
        );
      }

      return;
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: null,
      },
    });

    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred, please try again later" },
      { status: 500 }
    );
  }
}
