// app/api/accounts/[id]/transactions/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: any) {
  try {
    const accountId = parseInt(params.id);

    if (isNaN(accountId)) {
      return NextResponse.json(
        { error: "Invalid account ID" },
        { status: 400 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        accountId: accountId,
        JournalEntry: {
          status: "APPROVED", // Only include transactions with approved journal entries
        },
      },
      include: {
        account: {
          select: {
            name: true,
            number: true,
          },
        },
        JournalEntry: {
          select: {
            id: true,
            pr: true,
            description: true,
            status: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    // Transform to match ExtendedTransaction type
    const transformed = transactions.map((t) => ({
      ...t,
      debit: t.type === "DEBIT" ? t.amount : 0,
      credit: t.type === "CREDIT" ? t.amount : 0,
      JournalEntry: t.JournalEntry,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
