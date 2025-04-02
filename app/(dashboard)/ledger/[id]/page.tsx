"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { LedgerDataTable } from "@/components/ledger-data-table";
import { columns } from "@/components/ledger-columns";
import { EntryStatus, Transaction } from "@prisma/client";
import { BackButton } from "@/components/back-button";
import { Loader } from "lucide-react";

export type ExtendedTransaction = {
  id: number;
  date: Date;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  accountId: number;
  JournalEntry: {
    // Change from optional array to required single object
    id: number;
    pr: string;
    description: string;
    status: EntryStatus;
  };
};
const LedgerPage = () => {
  const { id } = useParams();
  const [transactions, setTransactions] = React.useState<ExtendedTransaction[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);

  const accountId = parseInt(typeof id === "string" ? id : "0");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions for the account
        const transactionsResponse = await fetch(`/api/transactions/${id}`);
        if (!transactionsResponse.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const transactionsData = await transactionsResponse.json();

        console.log(transactionsData);

        // Fetch accounts
        const accountsResponse = await fetch("/api/accounts");
        if (!accountsResponse.ok) {
          throw new Error("Failed to fetch accounts");
        }
        const accountsData = await accountsResponse.json();
        const accountData = accountsData.find(
          (account: any) => account.id === accountId
        );
        if (!accountData) {
          throw new Error("Account not found");
        }

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();

        // Fetch statements
        const statementsResponse = await fetch("/api/statements");
        if (!statementsResponse.ok) {
          throw new Error("Failed to fetch statements");
        }
        const statementsData = await statementsResponse.json();

        // Extend transactions with additional data
        const extendedTransactions = transactionsData.map(
          (transaction: any) => {
            // Find the category and statement for the account
            const category = categoriesData.find(
              (cat: any) => cat.id === accountData.categoryId
            );
            const statement = statementsData.find(
              (stmt: any) => stmt.id === accountData.statementId
            );

            // Determine if this transaction is a debit or credit for the account
            // const isDebit = accountData.normalSide === "Debit";
            // const debit = isDebit ? transaction.amount : 0;
            // const credit = isDebit ? 0 : -transaction.amount;

            return {
              ...transaction,
              accountNumber: accountData.number,
              accountName: accountData.name,
              categoryName: category?.name || "Unknown",
              statementName: statement?.name || "Unknown",
              debit: transaction.type === "DEBIT" ? transaction.amount : 0,
              credit: transaction.type === "CREDIT" ? transaction.amount : 0,
              balance: transaction.balance, // Use the balance directly from the transaction
            };
          }
        );

        setTransactions(extendedTransactions);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, accountId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <Loader className="animate-spin" />
        <span>Loading ledger...</span>
      </div>
    );
  }

  return (
    <>
      <BackButton>Back</BackButton>
      <div className="grid gap-4">
        <h1 className="text-2xl font-medium">Ledger for account id: {id}</h1>
        <LedgerDataTable columns={columns} data={transactions} />
      </div>
    </>
  );
};

export default LedgerPage;
