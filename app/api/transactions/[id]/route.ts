import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        accountId: parseInt(id),
      },
    });

    if (!transactions) {
      return NextResponse.json(
        { error: "Transactions not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
