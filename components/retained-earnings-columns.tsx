import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";

export interface RetainedEarnings {
  retainedEarnings: number;
  totalRevenue: number;
  totalExpenses: number;
}

export const retainedEarningsColumns: ColumnDef<RetainedEarnings>[] = [
  {
    accessorKey: "totalRevenue",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Revenue
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `$${Number(row.getValue("totalRevenue")).toFixed(2)}`,
  },
  {
    accessorKey: "totalExpenses",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Expenses
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `$${Number(row.getValue("totalExpenses")).toFixed(2)}`,
  },
  {
    accessorKey: "retainedEarnings",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Retained Earnings
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      `$${Number(row.getValue("retainedEarnings")).toFixed(2)}`,
  },
];
