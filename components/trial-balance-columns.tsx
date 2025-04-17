// components/trial-balance-columns.tsx
import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { ColumnDef } from "@tanstack/react-table";

export interface TrialBalance {
  account: string;
  debit: number;
  credit: number;
  balance: number;
}

export const trialBalanceColumns: ColumnDef<TrialBalance>[] = [
  {
    accessorKey: "account",
    header: "Account",
    cell: ({ row }) => {
      const isTotal = row.original.account === "TOTAL";
      return (
        <div className={isTotal ? "font-bold" : ""}>
          {row.getValue("account")}
        </div>
      );
    },
  },
  {
    accessorKey: "debit",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Debit
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("debit"));
      const isTotal = row.original.account === "TOTAL";

      return (
        <div className={`text-right ${isTotal ? "font-bold" : ""}`}>
          {amount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "credit",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Credit
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("credit"));
      const isTotal = row.original.account === "TOTAL";

      return (
        <div className={`text-right ${isTotal ? "font-bold" : ""}`}>
          {amount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Balance
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"));
      const isTotal = row.original.account === "TOTAL";

      return (
        <div
          className={`text-right font-medium ${isTotal ? "font-bold" : ""} ${
            amount >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {Math.abs(amount).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </div>
      );
    },
  },
];
