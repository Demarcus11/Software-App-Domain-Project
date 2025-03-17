import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const statement = await prisma.statement.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!statement) {
      return NextResponse.json(
        { error: "Statement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(statement);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch statement" },
      { status: 500 }
    );
  }
}
