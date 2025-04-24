import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";

export type BalanceSheet = {
  id?: string;
  name: string;
  number?: string;
  balance: number;
  normalSide?: string;
  order?: string;
  subcategory?: string;
  category?: string;
  statementType: "Asset" | "Liability" | "Equity";
  isTotal?: boolean;
  isSectionHeader?: boolean;
  showAmount?: boolean; // Add this new property
};

export const balanceSheetColumns: ColumnDef<BalanceSheet>[] = [
  {
    accessorKey: "name",
    header: "Account",
    cell: ({ row }) => {
      const isTotal = row.original.isTotal;
      const isSectionHeader = row.original.isSectionHeader;

      return (
        <div
          className={`${isTotal ? "font-bold" : ""} ${
            isSectionHeader ? "font-bold text-blue-600" : ""
          } pl-${row.depth * 4}`}
        >
          {row.getValue("name")}
        </div>
      );
    },
  },
  {
    accessorKey: "balance",
    header: "Amount ($)",
    cell: ({ row }) => {
      const shouldShowAmount = row.original.showAmount !== false;
      if (!shouldShowAmount) return null;

      const balance = parseFloat(row.getValue("balance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(balance);

      const isTotal = row.original.isTotal;
      const isSectionHeader = row.original.isSectionHeader;

      return (
        <div
          className={`text-right ${isTotal ? "font-bold" : ""} ${
            isSectionHeader ? "font-bold text-blue-600" : ""
          }`}
        >
          {formatted}
        </div>
      );
    },
  },
];
