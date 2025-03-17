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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { description, date, amount, userId } = await request.json();

    // Fetch the transaction to get the accountId
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Update the transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: {
        description,
        date: new Date(date),
        amount,
        userId,
      },
    });

    await prisma.eventLog.create({
      data: {
        eventType: "UPDATE",
        tableName: "Transaction",
        recordId: updatedTransaction.id,
        beforeState: transaction, // Before state is the old transaction data
        afterState: updatedTransaction, // After state is the updated transaction data
        userId,
      },
    });

    // Recalculate balances for subsequent transactions
    const subsequentTransactions = await prisma.transaction.findMany({
      where: {
        accountId: transaction.accountId,
        date: { gte: new Date(date) }, // Transactions on or after the updated date
      },
      orderBy: { date: "asc" },
    });

    let runningBalance = updatedTransaction.balance;
    for (const subsequentTransaction of subsequentTransactions) {
      runningBalance += subsequentTransaction.amount; // Adjust based on normalSide if needed
      await prisma.transaction.update({
        where: { id: subsequentTransaction.id },
        data: { balance: runningBalance },
      });
    }

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}
