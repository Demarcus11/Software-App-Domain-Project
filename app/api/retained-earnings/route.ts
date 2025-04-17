import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { startDate, endDate } = await req.json();

    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate && endDate === "") {
      dateFilter.date = {
        gte: new Date(startDate),
      };
    }

    // Fetch Operating Revenue transactions (credits)
    const revenueTransactions = await prisma.transaction.findMany({
      where: {
        type: "CREDIT",
        date: dateFilter.date,
        account: {
          category: {
            name: "Operating Revenue",
          },
        },
      },
      select: { amount: true },
    });

    // Fetch Operating Expense transactions (debits)
    const expenseTransactions = await prisma.transaction.findMany({
      where: {
        type: "DEBIT",
        date: dateFilter.date,
        account: {
          category: {
            name: "Operating Expense",
          },
        },
      },
      select: { amount: true },
    });

    // Return 404 if no results
    const noResults =
      revenueTransactions.length === 0 && expenseTransactions.length === 0;

    if (noResults) {
      return NextResponse.json({ message: "No results" }, { status: 404 });
    }

    const totalRevenue = revenueTransactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );
    const totalExpenses = expenseTransactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    const retainedEarnings = totalRevenue - totalExpenses;

    return NextResponse.json({
      retainedEarnings,
      totalRevenue,
      totalExpenses,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
