"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { ExtendedTransaction } from "@/app/(dashboard)/ledger/[id]/page";
import Link from "next/link";

export const columns: ColumnDef<ExtendedTransaction>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="pl-0"
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => format(new Date(row.getValue("date")), "MMM dd, yyyy"),
    filterFn: (row, id, value) => {
      const date = new Date(row.getValue(id));
      const from = value?.from ? new Date(value.from) : null;
      const to = value?.to ? new Date(value.to) : null;

      if (from && date < from) return false;
      if (to && date > to) return false;
      return true;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "debit",
    header: "Debit",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("debit"));
      return amount > 0
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)
        : "-";
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      const amount = parseFloat(row.getValue(id));
      return Math.abs(amount - value) < 0.01;
    },
  },
  {
    accessorKey: "credit",
    header: "Credit",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("credit"));
      return amount > 0
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)
        : "-";
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      const amount = parseFloat(row.getValue(id));
      return Math.abs(amount - value) < 0.01;
    },
  },
  {
    accessorKey: "JournalEntry.pr",
    header: "PR #",
    cell: ({ row }) => (
      <Link href={`/journal/${row.original.JournalEntry.id}`} passHref>
        <Button variant="link" className="p-0">
          {row.original.JournalEntry.pr}
        </Button>
      </Link>
    ),
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="pl-0"
      >
        Balance
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    },
  },
];
