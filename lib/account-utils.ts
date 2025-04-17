// lib/account-utils.ts
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
