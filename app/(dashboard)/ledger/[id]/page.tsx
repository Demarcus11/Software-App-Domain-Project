"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { LedgerDataTable } from "@/components/ledger-data-table";
import { columns } from "@/components/ledger-columns";
import { Transaction } from "@prisma/client";
import BackButton from "@/components/back-button";

export interface ExtendedTransaction extends Transaction {
  accountNumber: string;
  accountName: string;
  categoryName: string;
  statementName: string;
  debit: number;
  credit: number;
  balance: number;
}

const LedgerPage = () => {
  const { id } = useParams();
  const [transactions, setTransactions] = React.useState<ExtendedTransaction[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(true);

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
            const isDebit = accountData.normalSide === "Debit";
            const debit = isDebit ? transaction.amount : 0;
            const credit = isDebit ? 0 : transaction.amount;

            return {
              ...transaction,
              accountNumber: accountData.number,
              accountName: accountData.name,
              categoryName: category?.name || "Unknown",
              statementName: statement?.name || "Unknown",
              debit,
              credit,
              balance: transaction.balance, // Use the balance directly from the transaction
            };
          }
        );

        setTransactions(extendedTransactions);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, accountId]);

  return (
    <div className="grid gap-4">
      <BackButton link="/chart-of-accounts" text="Back to chart of accounts" />

      <h1 className="text-2xl font-medium">Ledger for account number: {id}</h1>
      <LedgerDataTable columns={columns} data={transactions} />
    </div>
  );
};

export default LedgerPage;
