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

export function transformBalanceSheet(apiData: any): BalanceSheet[] {
  return apiData.balanceSheet.flatMap((section: any) => {
    const accounts = section.accounts.map((account: any) => ({
      name: account.name,
      balance: account.balance,
      category: account.category,
      subcategory: account.subcategory,
      description: account.description,
      statementType: section.statementType,
    }));

    const totalRow: BalanceSheet = {
      name: `Total ${section.statementType}`,
      balance: section.totalBalance,
      category: "",
      subcategory: "",
      description: "",
      statementType: section.statementType,
    };

    return [...accounts, totalRow];
  });
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
