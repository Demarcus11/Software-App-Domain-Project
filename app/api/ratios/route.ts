import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getRatioStatusColor } from "@/lib/account-utils";

export async function GET() {
  try {
    // Fetch relevant accounts
    const accounts = await prisma.account.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        number: true,
        balance: true,
        normalSide: true,
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
        statement: {
          select: {
            name: true,
          },
        },
      },
    });

    // Helper to sum balances by category name
    const sumByCategory = (categoryName: string) =>
      accounts
        .filter((a) => a.category.name === categoryName)
        .reduce((sum, a) => sum + a.balance, 0);

    // Current Assets are assets with category "Current Asset"
    const currentAssets = sumByCategory("Current Asset");
    // Current Liabilities are liabilities with category "Current Liability"
    const currentLiabilities = sumByCategory("Current Liability");
    // Total Liabilities are accounts with statement "Liability"
    const totalLiabilities = accounts
      .filter((a) => a.statement.name === "Liability")
      .reduce((sum, a) => sum + a.balance, 0);
    // Total Equity is accounts with statement "Equity"
    const totalEquity = accounts
      .filter((a) => a.statement.name === "Equity")
      .reduce((sum, a) => sum + a.balance, 0);
    // Total Revenue is accounts with statement "Revenue"
    const totalRevenue = accounts
      .filter((a) => a.statement.name === "Revenue")
      .reduce((sum, a) => sum + a.balance, 0);
    // Total Expenses is accounts with statement "Expense"
    const totalExpenses = accounts
      .filter((a) => a.statement.name === "Expense")
      .reduce((sum, a) => sum + a.balance, 0);

    // Calculate ratios
    const currentRatio =
      currentLiabilities !== 0 ? currentAssets / currentLiabilities : null;
    const debtToEquity =
      totalEquity !== 0 ? totalLiabilities / totalEquity : null;
    const netProfitMargin =
      totalRevenue !== 0 ? (totalRevenue - totalExpenses) / totalRevenue : null;

    const ratios = [
      {
        name: "Current Ratio",
        value: currentRatio,
        status: getRatioStatusColor(currentRatio),
        numerator: currentAssets,
        denominator: currentLiabilities,
        formula: "Current Assets / Current Liabilities",
      },
      {
        name: "Debt to Equity",
        value: debtToEquity,
        status: getRatioStatusColor(debtToEquity),
        numerator: totalLiabilities,
        denominator: totalEquity,
        formula: "Total Liabilities / Total Equity",
      },
      {
        name: "Net Profit Margin",
        value: netProfitMargin,
        status: getRatioStatusColor(netProfitMargin),
        numerator: totalRevenue - totalExpenses,
        denominator: totalRevenue,
        formula: "(Total Revenue - Total Expenses) / Total Revenue",
      },
    ];

    console.log(ratios);

    return NextResponse.json(ratios);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch ratios" },
      { status: 500 }
    );
  }
}
