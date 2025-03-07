"use client";

import { useEffect, useState } from "react";

import { ChartOfAccountsTable } from "./chart-of-accounts-table";

import { Account } from "@prisma/client";

const ChartOfAccountsPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const fetchChartOfAccounts = async () => {
    try {
      const response = await fetch("/api/accounts", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChartOfAccounts();
  }, []);

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-medium">Chart of accounts</h1>
      <ChartOfAccountsTable accounts={accounts} />
    </div>
  );
};

export default ChartOfAccountsPage;
