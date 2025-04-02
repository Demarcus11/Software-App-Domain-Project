"use client";

import { useState, useEffect } from "react";
import { Employee } from "@/types";
import { DataTable } from "@/components/tables/data-table";
import useWindowSize from "@/hooks/use-window-size";
import { chartOfAccountsColumns } from "@/components/tables/chart-of-accounts-columns";

export const ChartOfAccountsTable = () => {
  const [accounts, setAccounts] = useState<Employee[]>([]);
  const windowSize = useWindowSize();

  // Fetch employees data
  const fetchChartOfAccounts = async () => {
    try {
      const response = await fetch("/api/employees", {
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
    <>
      <DataTable
        columns={chartOfAccountsColumns(fetchChartOfAccounts, windowSize)}
        data={accounts}
        type="accounts"
        filterBy="account number"
      />
    </>
  );
};
