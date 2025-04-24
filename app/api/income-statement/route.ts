import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { startDate, endDate } = await req.json();

    // Build transaction date filter
    let transactionDateFilter = { isApproved: true } as any;

    if (startDate && endDate) {
      transactionDateFilter.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate && endDate === "") {
      transactionDateFilter.date = {
        gte: new Date(startDate),
      };
    }

    // Fetch Revenue and Expense accounts with their categories and transactions
    const [revenueAccounts, expenseAccounts] = await Promise.all([
      prisma.account.findMany({
        where: {
          statementId: 4,
        },
        include: {
          category: true,
          transactions: {
            where: transactionDateFilter,
          },
        },
      }),
      prisma.account.findMany({
        where: {
          statementId: 5,
        },
        include: {
          category: true,
          transactions: {
            where: transactionDateFilter,
          },
        },
      }),
    ]);

    const allRevenueEmpty = revenueAccounts.every(
      (acc) => acc.transactions.length === 0
    );
    const allExpensesEmpty = expenseAccounts.every(
      (acc) => acc.transactions.length === 0
    );

    if (allRevenueEmpty && allExpensesEmpty) {
      return NextResponse.json({ message: "No results" }, { status: 404 });
    }

    // Compute total revenue and total expense from transactions
    const sumTransactions = (transactions: any[]) =>
      transactions.reduce((sum, t) => {
        return t.type === "CREDIT"
          ? sum + t.amount
          : t.type === "DEBIT"
          ? sum - t.amount
          : sum;
      }, 0);

    const revenueData = revenueAccounts.map((acc) => {
      const balance = sumTransactions(acc.transactions);
      return {
        name: acc.name,
        balance,
        category: acc.category.name,
      };
    });

    const expenseData = expenseAccounts.map((acc) => {
      const balance = sumTransactions(acc.transactions);
      return {
        name: acc.name,
        balance: Math.abs(balance),
        category: acc.category.name,
      };
    });

    const totalRevenue = revenueData.reduce((sum, r) => sum + r.balance, 0);
    const totalExpenses = expenseData.reduce((sum, e) => sum + e.balance, 0);
    const netIncome = totalRevenue - totalExpenses;

    return NextResponse.json({
      totalRevenue: Math.abs(totalRevenue),
      totalExpenses: Math.abs(totalExpenses),
      netIncome,
      revenues: revenueData,
      expenses: expenseData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
