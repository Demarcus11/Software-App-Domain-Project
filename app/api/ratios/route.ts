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
    const totalAssets = accounts
      .filter((a) => a.statement.name === "Asset")
      .reduce((sum, a) => sum + a.balance, 0);
    const inventory = accounts
      .filter((a) => a.subcategory?.name === "Inventory")
      .reduce((sum, a) => sum + a.balance, 0);

    // Calculate ratios
    const currentRatio =
      currentLiabilities !== 0 ? currentAssets / currentLiabilities : null;
    const netProfitMargin =
      totalRevenue !== 0 ? (totalRevenue - totalExpenses) / totalRevenue : null;
    // Return on Assets = Net Profit / Total Assets
    const returnOnAssets =
      totalAssets !== 0 ? (totalRevenue - totalExpenses) / totalAssets : null;
    // Return on Equity = Net Profit / Total Equity
    const returnOnEquity =
      totalEquity !== 0 ? (totalRevenue - totalExpenses) / totalEquity : null;

    // Asset Turnover = Total Revenue (or Sales) / Total Assets
    const assetTurnover = totalAssets !== 0 ? totalRevenue / totalAssets : null;

    // Quick Ratio = (Current Assets - Inventory) / Current Liabilities
    const quickRatio =
      currentLiabilities !== 0
        ? (currentAssets - inventory) / currentLiabilities
        : null;

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
        name: "Net Profit Margin",
        value: netProfitMargin,
        status: getRatioStatusColor(netProfitMargin),
        numerator: totalRevenue - totalExpenses,
        denominator: totalRevenue,
        formula: "(Total Revenue - Total Expenses) / Total Revenue",
      },
      {
        name: "Return on Assets",
        value: returnOnAssets,
        status: getRatioStatusColor(returnOnAssets),
        numerator: totalRevenue - totalExpenses,
        denominator: totalAssets,
        formula: "Net Profit / Total Assets",
      },
      {
        name: "Quick Ratio",
        value: quickRatio,
        status: getRatioStatusColor(quickRatio),
        numerator: currentAssets - inventory,
        denominator: currentLiabilities,
        formula: "(Current Assets - Inventory) / Current Liabilities",
      },
      {
        name: "Return on Equity",
        value: returnOnEquity,
        status: getRatioStatusColor(returnOnEquity),
        numerator: totalRevenue - totalExpenses,
        denominator: totalEquity,
        formula: "Net Profit / Total Equity",
      },
      {
        name: "Asset Turnover",
        value: assetTurnover,
        status: getRatioStatusColor(assetTurnover),
        numerator: totalRevenue,
        denominator: totalAssets,
        formula: "Total Revenue / Total Assets",
      },
    ];

    return NextResponse.json(ratios);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch ratios" },
      { status: 500 }
    );
  }
}
