// lib/account-utils.ts
import { BalanceSheet } from "@/components/balance-sheet-columns";
import { IncomeStatement } from "@/components/income-statement-columns";
import prisma from "@/lib/prisma";

export type AccountCategory =
  | "Asset"
  | "Liability"
  | "Equity"
  | "Revenue"
  | "Expenses";

export const generateAccountNumber = async (subcategory: AccountCategory) => {
  const subcategoryToCategoryMap: Record<string, AccountCategory> = {
    "Current Asset": "Asset",
    "Non-Current Asset": "Asset",
    "Current Liability": "Liability",
    "Non-Current Liability": "Liability",
    "Owner's Equity": "Equity",
    "Operating Revenue": "Revenue",
    "Operating Expense": "Expenses",
  };

  const category = subcategoryToCategoryMap[subcategory];

  const prefixes = {
    Asset: "1000000000",
    Liability: "2000000000",
    Equity: "3000000000",
    Revenue: "4000000000",
    Expenses: "5000000000",
  };

  const prefix = prefixes[category];

  const lastAccountNumber = await prisma.account.findFirst({
    orderBy: { number: "desc" },
    where: { number: { startsWith: prefix[0] } },
  });

  if (!lastAccountNumber) {
    return prefix;
  }

  const lastNumberValue = parseInt(lastAccountNumber.number);
  const nextNumberValue = lastNumberValue + 50;

  return nextNumberValue.toString();
};

export const generatePrNumber = async () => {
  const lastEntry = await prisma.journalEntry.findFirst({
    orderBy: { pr: "desc" },
    where: {
      pr: { startsWith: "PR-" },
    },
  });

  const baseNumber = 1000000000;

  if (!lastEntry) {
    return `PR-${baseNumber}`;
  }

  const lastPr = lastEntry.pr;
  const lastNumber = parseInt(lastPr.replace("PR-", ""), 10);
  const nextNumber = lastNumber + 50;

  return `PR-${nextNumber}`;
};

// Add this to your page.tsx or create a separate utility file
export function transformBalanceSheet(data: any): BalanceSheet[] {
  if (!data) return [];

  const result: BalanceSheet[] = [];

  // Assets Section
  result.push({
    name: "ASSETS",
    balance: 0,
    statementType: "Asset",
    isSectionHeader: true,
    showAmount: false,
  });

  [
    ...data.assets.currentAssets.accounts,
    ...data.assets.nonCurrentAssets.accounts,
  ].forEach((account: any) => {
    result.push({
      id: account.id,
      name: account.name,
      number: account.number,
      balance: account.balance,
      normalSide: account.normalSide,
      order: account.order,
      subcategory: account.subcategory,
      statementType: "Asset",
      showAmount: true,
    });
  });

  result.push({
    name: "TOTAL ASSETS",
    balance: data.assets.total,
    statementType: "Asset",
    isTotal: true,
    showAmount: true,
  });

  // Liabilities Section
  result.push({
    name: "LIABILITIES",
    balance: 0,
    statementType: "Liability",
    isSectionHeader: true,
    showAmount: false,
  });

  [
    ...data.liabilities.currentLiabilities.accounts,
    ...data.liabilities.nonCurrentLiabilities.accounts,
  ].forEach((account: any) => {
    result.push({
      id: account.id,
      name: account.name,
      number: account.number,
      balance: account.balance,
      normalSide: account.normalSide,
      order: account.order,
      subcategory: account.subcategory,
      statementType: "Liability",
      showAmount: true,
    });
  });

  result.push({
    name: "TOTAL LIABILITIES",
    balance: data.liabilities.total,
    statementType: "Liability",
    isTotal: true,
    showAmount: true,
  });

  // Equity Section
  result.push({
    name: "EQUITY",
    balance: 0,
    statementType: "Equity",
    isSectionHeader: true,
    showAmount: false,
  });

  data.equity.accounts.forEach((account: any) => {
    result.push({
      id: account.id,
      name: account.name,
      number: account.number,
      balance: account.balance,
      normalSide: account.normalSide,
      order: account.order,
      subcategory: account.subcategory,
      statementType: "Equity",
      showAmount: true,
    });
  });

  result.push({
    name: "TOTAL EQUITY",
    balance: data.equity.total,
    statementType: "Equity",
    isTotal: true,
    showAmount: true,
  });

  // Grand Total
  result.push({
    name: "TOTAL LIABILITIES AND EQUITY",
    balance: data.liabilities.total + data.equity.total,
    statementType: "Equity",
    isTotal: true,
    showAmount: true,
  });

  return result;
}

export function transformIncomeStatement(apiData: any): IncomeStatement[] {
  const revenues = apiData.revenues.map((item: any) => ({
    name: item.names || item.name, // Handle the typo in the API ('names' vs 'name')
    balance: item.balance,
    type: "revenue",
    category: item.category,
  }));

  const expenses = apiData.expenses
    .filter((item: any) => item.name !== undefined) // Filter out the netIncome if it's in the array
    .map((item: any) => ({
      name: item.name,
      balance: item.balance,
      type: "expense",
      category: item.category,
    }));

  const totalRevenue = {
    name: "Total Revenue",
    balance: apiData.totalRevenue,
    type: "total",
  };

  const totalExpenses = {
    name: "Total Expenses",
    balance: apiData.totalExpenses,
    type: "total",
  };

  const netIncome = {
    name: "Net Income",
    balance: apiData.netIncome,
    type: "net",
  };

  console.log("Net income", netIncome);
  console.log("Total expenses", totalExpenses);

  return [...revenues, totalRevenue, ...expenses, totalExpenses, netIncome];
}

export function getRatioStatusColor(
  value: number | null
): "green" | "yellow" | "red" | undefined {
  if (value === null) return;
  if (value >= 2.0) return "green";
  else if (value >= 1.0) return "yellow";
  else return "red";
}
