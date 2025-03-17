import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const statements = await prisma.statement.findMany();

    if (!statements) {
      return NextResponse.json(
        { error: "No statements found" },
        { status: 404 }
      );
    }

    return NextResponse.json(statements);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch statements" },
      { status: 500 }
    );
  }
}
