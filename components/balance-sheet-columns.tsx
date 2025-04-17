import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";

export type BalanceSheet = {
  name: string;
  balance: number;
  category: string;
  subcategory: string;
  description: string;
  statementType: "Asset" | "Liability" | "Equity";
};
export const balanceSheetColumns: ColumnDef<BalanceSheet>[] = [
  {
    accessorKey: "name",
    header: "Account Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "subcategory",
    header: "Subcategory",
  },
  {
    accessorKey: "statementType",
    header: "Statement Type",
    cell: ({ row }: any) => {
      const name = row.original.name;
      const isTotal = name.startsWith("Total");
      return isTotal ? "" : row.getValue("statementType");
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }: any) => {
      const balance = row.getValue("balance");
      return `$${balance.toFixed(2)}`;
    },
    footer: (info) => {
      const rows = info.table.getFilteredRowModel().rows;

      const total = rows.reduce((sum, row) => {
        const val = row.getValue("balance");
        return sum + (typeof val === "number" ? val : 0);
      }, 0);

      return `Total: $${total.toFixed(2)}`;
    },
  },
];
