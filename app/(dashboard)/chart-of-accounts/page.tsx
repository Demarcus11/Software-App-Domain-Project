"use client";

import { useEffect, useState } from "react";
import { AccountsDataTable } from "@/components/accounts-data-table";
import { useColumns } from "@/components/accounts-columns";
import { Account, Transaction } from "@prisma/client";
import { Loader } from "lucide-react";

export interface ExtendedAccount extends Account {
  categoryName: string;
  subcategoryName: string;
  statementName: string;
}

const ChartOfAccountsPage = () => {
  // Always call hooks unconditionally at the top
  const columns = useColumns();

  // Original accounts data without any processing
  const [rawAccounts, setRawAccounts] = useState<ExtendedAccount[]>([]);
  // Processed accounts with all the additional data
  const [processedAccounts, setProcessedAccounts] = useState<ExtendedAccount[]>(
    []
  );
  // Data needed for processing
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [subcategories, setSubcategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [statements, setStatements] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Track loading states
  const [dataLoaded, setDataLoaded] = useState({
    accounts: false,
    categories: false,
    subcategories: false,
    statements: false,
    transactions: false,
  });

  // Combined loading state
  const allDataLoaded = Object.values(dataLoaded).every((status) => status);

  // Fetch accounts only once
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/accounts", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch accounts");
        const data = await response.json();
        setRawAccounts(data);
        setDataLoaded((prev) => ({ ...prev, accounts: true }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccounts();
  }, []);

  // Fetch categories only once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
        setDataLoaded((prev) => ({ ...prev, categories: true }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories only once
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch("/api/subcategories", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch subcategories");
        const data = await response.json();
        setSubcategories(data);
        setDataLoaded((prev) => ({ ...prev, subcategories: true }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchSubcategories();
  }, []);

  // Fetch statements only once
  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const response = await fetch("/api/statements", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch statements");
        const data = await response.json();
        setStatements(data);
        setDataLoaded((prev) => ({ ...prev, statements: true }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchStatements();
  }, []);

  // Fetch transactions only once
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        setTransactions(data);
        setDataLoaded((prev) => ({ ...prev, transactions: true }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchTransactions();
  }, []);

  // Process all data once all fetches are complete
  useEffect(() => {
    if (!allDataLoaded) return;

    const updatedAccounts = rawAccounts.map((account) => {
      const categoryName =
        categories.find((c) => c.id === account.categoryId)?.name || "";
      const subcategoryName =
        subcategories.find((s) => s.id === account.subcategoryId)?.name || "";
      const statementName =
        statements.find((s) => s.id === account.statementId)?.name || "";

      return {
        ...account,
        categoryName,
        subcategoryName,
        statementName,
        balance: account.balance,
      };
    });

    setProcessedAccounts(updatedAccounts);
    setLoading(false);
  }, [allDataLoaded, rawAccounts, categories, subcategories, statements]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <Loader className="animate-spin" />
        <span>Loading accounts...</span>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4">
      <h1 className="text-2xl font-medium">Chart of accounts</h1>
      <AccountsDataTable columns={columns} data={processedAccounts} />
    </div>
  );
};

export default ChartOfAccountsPage;
