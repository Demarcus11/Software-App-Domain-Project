// app/api/trial-balance/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { startDate, endDate } = await req.json();

    let accounts = [];
    if (startDate === "" && endDate === "") {
      accounts = await prisma.account.findMany({
        where: { isActive: true },
        include: {
          transactions: {
            where: {
              isApproved: true,
            },
          },
        },
        orderBy: {
          orderId: "asc",
        },
      });
    } else if (startDate && endDate === "") {
      accounts = await prisma.account.findMany({
        where: { isActive: true },
        include: {
          transactions: {
            where: {
              isApproved: true,
              date: {
                gte: new Date(startDate),
              },
            },
          },
        },
        orderBy: {
          orderId: "asc",
        },
      });
    } else {
      accounts = await prisma.account.findMany({
        where: { isActive: true },
        include: {
          transactions: {
            where: {
              isApproved: true,
              date: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            },
          },
        },
        orderBy: {
          orderId: "asc",
        },
      });
    }

    const allTransactionsEmpty = accounts.every(
      (account) => account.transactions.length === 0
    );

    if (allTransactionsEmpty) {
      return NextResponse.json({ message: "No results" }, { status: 404 });
    }

    const trialBalanceData = accounts.map((account) => {
      const debit = account.totalDebits ?? 0;
      const credit = account.totalCredits ?? 0;

      return {
        account: `${account.number} - ${account.name}`,
        debit,
        credit,
        balance: debit - credit,
      };
    });

    // Calculate totals
    const totalDebit = trialBalanceData.reduce(
      (sum, item) => sum + item.debit,
      0
    );
    const totalCredit = trialBalanceData.reduce(
      (sum, item) => sum + item.credit,
      0
    );
    const totalBalance = trialBalanceData.reduce(
      (sum, item) => sum + item.balance,
      0
    );

    // Add totals row
    const trialBalanceWithTotals = [
      ...trialBalanceData,
      {
        account: "TOTAL",
        debit: totalDebit,
        credit: totalCredit,
        balance: totalBalance,
      },
    ];

    return NextResponse.json(trialBalanceWithTotals);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
