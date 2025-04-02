import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { description, date, transactions, userId } = await request.json();

    // 1. Validate required fields
    if (!description || !transactions || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. Validate transaction structure
    if (!Array.isArray(transactions)) {
      return NextResponse.json(
        { error: "Transactions must be an array" },
        { status: 400 }
      );
    }

    // 3. Convert account IDs to numbers
    const accountIds = transactions.map((t) => Number(t.accountId));
    if (accountIds.some(isNaN)) {
      return NextResponse.json(
        { error: "Invalid account ID format" },
        { status: 400 }
      );
    }

    // 4. Validate debit/credit match
    const debitTotal = transactions
      .filter((t) => t.type === "DEBIT")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const creditTotal = transactions
      .filter((t) => t.type === "CREDIT")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    if (debitTotal !== creditTotal) {
      return NextResponse.json(
        {
          error: "Debits and credits must balance",
          debitTotal,
          creditTotal,
        },
        { status: 400 }
      );
    }

    // 5. Validate all accounts exist and are active
    const validAccounts = await prisma.account.findMany({
      where: {
        id: { in: accountIds },
        isActive: true,
      },
      select: { id: true },
    });

    if (validAccounts.length !== accountIds.length) {
      const invalidIds = accountIds.filter(
        (id) => !validAccounts.some((a) => a.id === id)
      );
      return NextResponse.json(
        {
          error: "Invalid or inactive accounts detected",
          invalidAccountIds: invalidIds,
        },
        { status: 400 }
      );
    }

    // 6. Create journal entry with transactions atomically
    const result = await prisma.$transaction(async (prisma) => {
      const journalEntry = await prisma.journalEntry.create({
        data: {
          pr: `PR-${Date.now()}`,
          description,
          date: new Date(date),
          status: "PENDING",
          userId: Number(userId),
        },
      });

      await prisma.transaction.createMany({
        data: transactions.map((t) => ({
          accountId: Number(t.accountId),
          amount: Number(t.amount),
          type: t.type,
          description: t.description || "",
          date: new Date(t.date || date),
          journalEntryId: journalEntry.id,
          userId: Number(userId),
          balance: 0, // Will be calculated on approval
          isApproved: false,
        })),
      });

      return journalEntry;
    });

    // 7. Return the created journal entry with transactions
    const createdEntry = await prisma.journalEntry.findUnique({
      where: { id: result.id },
      include: { transactions: true },
    });

    // 8. Send notification to all managers
    const allManagerIds = await prisma.user.findMany({
      where: {
        role: "MANAGER",
        isActive: true,
      },
      select: { id: true },
    });
    for (const manager of allManagerIds) {
      await prisma.notification.create({
        data: {
          userId: manager.id,
          message: `New journal entry created with PR#: ${result.pr}. Please review it.`,
          isRead: false,
        },
      });
    }

    return NextResponse.json(createdEntry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
