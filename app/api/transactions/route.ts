import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany();

    if (!transactions) {
      return NextResponse.json(
        { error: "No transactions found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transactions);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
