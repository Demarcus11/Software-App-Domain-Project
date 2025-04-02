import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const journalEntries = await prisma.journalEntry.findMany({
      where: {
        status: "APPROVED",
      },
      include: {
        transactions: {
          include: {
            account: {
              select: {
                id: true,
                name: true,
                number: true,
                normalSide: true,
              },
            },
          },
          orderBy: { amount: "desc" }, // Debits first typically
        },
        user: {
          select: { username: true },
        },
      },
      orderBy: { date: "desc" },
    });

    // Transform to ledger-friendly format
    const ledger = journalEntries.map((entry) => ({
      id: entry.id,
      date: entry.date,
      pr: entry.pr,
      description: entry.description,
      user: entry.user.username,
      transactions: entry.transactions.map((t) => ({
        accountId: t.account.id,
        accountName: t.account.name,
        accountNumber: t.account.number,
        debit: t.type === "DEBIT" ? t.amount : 0,
        credit: t.type === "CREDIT" ? t.amount : 0,
        balance: t.balance,
      })),
    }));

    return NextResponse.json(ledger);
  } catch (error) {
    console.error("Error fetching ledger:", error);
    return NextResponse.json(
      { error: "Failed to fetch ledger" },
      { status: 500 }
    );
  }
}
