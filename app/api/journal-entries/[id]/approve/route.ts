import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// TODO: Work on approving journal entry, update transactions, and update account balances
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const journalEntryId = parseInt((await params).id);
    if (isNaN(journalEntryId)) {
      return NextResponse.json(
        { message: "Invalid journal entry ID" },
        { status: 400 }
      );
    }

    // approve entry, update transaction balances, and account balances
    const result = await prisma.$transaction(async (prisma) => {
      // approve journal entry
      const journalEntry = await prisma.journalEntry.update({
        where: { id: journalEntryId },
        data: { status: "APPROVED" },
        include: { transactions: true },
      });

      // update transactions
      for (const transaction of journalEntry.transactions) {
        const account = await prisma.account.findUnique({
          where: { id: transaction.accountId },
        });
        if (!account) {
          throw new Error(`Account with ID ${transaction.accountId} not found`);
        }
        let newBalance = account.balance;
        if (account.normalSide === "Debit") {
          if (transaction.type === "DEBIT") {
            newBalance += transaction.amount; // increase balance for debit transactions when the normal side is debit
          } else {
            newBalance -= transaction.amount; // decrease balance for credit transactions when the normal side is debit
          }
        } else if (account.normalSide === "Credit") {
          if (transaction.type === "CREDIT") {
            newBalance += transaction.amount; // increase balance for credit transactions when the normal side is credit
          } else {
            newBalance -= transaction.amount; // decrease balance for debit transactions when the normal side is credit
          }
        }

        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            isApproved: true,
            balance: newBalance,
          },
        });

        await prisma.account.update({
          where: { id: transaction.accountId },
          data: {
            balance: newBalance,
            totalDebits:
              transaction.type === "DEBIT"
                ? account.totalDebits + transaction.amount
                : account.totalDebits,
            totalCredits:
              transaction.type === "CREDIT"
                ? account.totalCredits + transaction.amount
                : account.totalCredits,
          },
        });
      }
      return journalEntry;
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error approving journal entry" },
      { status: 500 }
    );
  }
}
