import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// validate security answers
export async function POST(request: Request) {
  try {
    const { token, answers } = await request.json();

    const user = await prisma.user.findFirst({
      where: { passwordResetToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid token, try again" },
        { status: 400 }
      );
    }

    const userSecurityQuestions = await prisma.userSecurityQuestion.findMany({
      where: {
        userId: user.id,
      },
      select: {
        questionId: true,
        answerHash: true,
      },
    });

    for (const userAnswer of answers) {
      const securityQuestion = userSecurityQuestions.find(
        (q) => q.questionId === userAnswer.questionId
      );

      if (!securityQuestion) {
        return NextResponse.json(
          { message: "Invalid question ID, please try again" },
          { status: 400 }
        );
      }

      const isValid = bcrypt.compareSync(
        userAnswer.answer.toLowerCase(),
        securityQuestion.answerHash
      );

      if (!isValid) {
        return NextResponse.json(
          { message: "One or more answers is incorrect" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ message: "Answers validated successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred, please try again later" },
      { status: 500 }
    );
  }
}
