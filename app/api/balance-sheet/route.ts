import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { startDate, endDate } = await req.json();

    const statements = await prisma.statement.findMany({
      where: {
        name: {
          in: ["Asset", "Liability", "Equity"],
        },
      },
      include: {
        accounts: {
          select: {
            id: true,
            name: true,
            number: true,
            description: true,
            normalSide: true,
            category: { select: { name: true } },
            subcategory: { select: { name: true } },
            order: { select: { name: true } },
            transactions: {
              where: {
                date: {
                  gte: new Date(startDate),
                  lte: new Date(endDate),
                },
              },
              select: {
                type: true,
                amount: true,
              },
            },
          },
          orderBy: {
            orderId: "asc",
          },
        },
      },
    });

    let totals = {
      Asset: 0,
      Liability: 0,
      Equity: 0,
    };

    const balanceSheet = statements.map((statement) => {
      const accounts = statement.accounts.map((account) => {
        const balance = account.transactions.reduce((sum, tx) => {
          const isIncrease =
            (statement.name === "Asset" && tx.type === "DEBIT") ||
            ((statement.name === "Liability" || statement.name === "Equity") &&
              tx.type === "CREDIT");

          const isDecrease =
            (statement.name === "Asset" && tx.type === "CREDIT") ||
            ((statement.name === "Liability" || statement.name === "Equity") &&
              tx.type === "DEBIT");

          if (isIncrease) return sum + tx.amount;
          if (isDecrease) return sum - tx.amount;

          return sum;
        }, 0);

        return {
          id: account.id,
          name: account.name,
          number: account.number,
          description: account.description,
          balance,
          normalSide: account.normalSide,
          category: account.category.name,
          subcategory: account.subcategory.name,
          order: account.order.name,
        };
      });

      const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
      totals[statement.name as "Asset" | "Liability" | "Equity"] = totalBalance;

      return {
        statementType: statement.name,
        totalBalance,
        accounts,
      };
    });

    const allEmpty = Object.values(totals).every((total) => total === 0);

    if (allEmpty) {
      return NextResponse.json({ message: "No results" }, { status: 404 });
    }

    const grandTotal = totals.Asset - (totals.Liability + totals.Equity);

    return NextResponse.json(
      { balanceSheet, totals, grandTotal },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
