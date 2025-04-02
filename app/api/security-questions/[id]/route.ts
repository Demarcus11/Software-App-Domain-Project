import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: any) {
  try {
    const { id } = await params;

    const userSecurityQuestions = await prisma.userSecurityQuestion.findMany({
      where: {
        userId: parseInt(id),
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
