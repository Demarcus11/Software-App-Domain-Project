import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// we need to create new transaction and update account balance, debits, and credits
export async function POST(request: Request) {
  try {
    const { description, date, amount, userId, accountId } =
      await request.json();

    // Fetch the account we're adding the transaction to, so we can update its balance, debits, and credits
    const account = await prisma.account.findUnique({
      where: { id: parseInt(accountId) },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // create transaction
    const transaction = await prisma.transaction.create({
      data: {
        description,
        date: new Date(date),
        amount,
        balance:
          account.normalSide === "Debit"
            ? Math.abs(account.balance + amount)
            : Math.abs(account.balance - amount),
        accountId: parseInt(accountId),
        userId,
      },
    });

    // Log the CREATE event
    await prisma.eventLog.create({
      data: {
        eventType: "CREATE",
        tableName: "Transaction",
        recordId: transaction.id,
        beforeState: Prisma.JsonNull,
        afterState: transaction,
        userId,
      },
    });

    // update balance, debits, and credits for the account
    await prisma.account.update({
      where: { id: parseInt(accountId) },
      data: {
        balance: Math.abs(transaction.balance),
        totalDebits:
          account.normalSide === "Debit"
            ? account.totalDebits + amount
            : account.totalDebits,
        totalCredits:
          account.normalSide === "Credit"
            ? account.totalCredits + amount
            : account.totalCredits,
      },
    });

    return NextResponse.json(
      { message: "Transaction created" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}
