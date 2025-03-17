"use client";

import { useEffect, useState } from "react";

import { AccountsDataTable } from "@/components/accounts-data-table";
import { useColumns } from "@/components/accounts-columns";

import { Account, Transaction } from "@prisma/client";

export interface ExtendedAccount extends Account {
  categoryName: string;
  subcategoryName: string;
  statementName: string;
}

const ChartOfAccountsPage = () => {
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

  // Track loading states
  const [dataLoaded, setDataLoaded] = useState({
    accounts: false,
    categories: false,
    subcategories: false,
    statements: false,
    transactions: false,
  });

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
    // Check if all data is loaded
    const allDataLoaded = Object.values(dataLoaded).every((status) => status);

    if (!allDataLoaded) return; // Wait until all data is loaded

    // If we get here, all data is loaded and we can process it
    const updatedAccounts = rawAccounts.map((account) => {
      // Find category name
      const categoryName =
        categories.find((category) => category.id === account.categoryId)
          ?.name || "";

      // Find subcategory name
      const subcategoryName =
        subcategories.find(
          (subcategory) => subcategory.id === account.subcategoryId
        )?.name || "";

      // Find statement name
      const statementName =
        statements.find((statement) => statement.id === account.statementId)
          ?.name || "";

      // Use the balance directly from the account
      const balance = account.balance;

      console.log(rawAccounts);

      // Return the processed account
      return {
        ...account,
        categoryName,
        subcategoryName,
        statementName,
        balance: Math.abs(balance), // Ensure balance is always positive
      };
    });

    // Set the processed accounts
    setProcessedAccounts(updatedAccounts);
  }, [dataLoaded, rawAccounts, categories, subcategories, statements]);

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-medium">Chart of accounts</h1>
      <AccountsDataTable columns={useColumns()} data={processedAccounts} />
    </div>
  );
};

export default ChartOfAccountsPage;
