import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  try {
    const userSecurityQuestions = await prisma.userSecurityQuestion.findMany({
      where: {
        userId: id,
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
