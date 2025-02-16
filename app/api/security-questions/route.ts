import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const securityQuestions = await prisma.securityQuestion.findMany({
      select: {
        id: true,
        question: true,
      },
    });

    return NextResponse.json(securityQuestions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch security questions" },
      { status: 500 }
    );
  }
}
