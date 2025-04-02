// lib/account-utils.ts
import prisma from "@/lib/prisma";

export type AccountCategory =
  | "Asset"
  | "Liability"
  | "Equity"
  | "Revenue"
  | "Expenses";

export const generateAccountNumber = async (category: AccountCategory) => {
  const prefixes = {
    Asset: "100",
    Liability: "200",
    Equity: "300",
    Revenue: "400",
    Expenses: "500",
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
  const nextNumberValue = lastNumberValue + 1;

  return nextNumberValue.toString();
};
