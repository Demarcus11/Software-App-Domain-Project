import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ExtendedJournalEntry } from "@/types/journal";

export async function GET() {
  try {
    const entries = await prisma.journalEntry.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(entries);

    // 2. Fetch transactions for each journal entry
    const entriesWithTransactions = await Promise.all(
      entries.map(async (entry) => {
        const transactions = await prisma.transaction.findMany({
          where: { journalEntryId: entry.id },
          include: {
            account: {
              select: {
                id: true,
                name: true,
                number: true,
              },
            },
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        });
        return {
          ...entry,
          transactions,
        };
      })
    );

    return NextResponse.json(entriesWithTransactions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
      { status: 500 }
    );
  }
}
