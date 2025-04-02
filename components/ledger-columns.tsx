"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ExtendedTransaction } from "@/app/(dashboard)/ledger/[id]/page";
import Link from "next/link";

export const columns: ColumnDef<ExtendedTransaction>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return format(new Date(row.getValue("date")), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "JournalEntry.description",
    header: "Description",
  },
  {
    accessorKey: "debit",
    header: "Debit",
    cell: ({ row }) => {
      return Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.getValue("debit"));
    },
  },
  {
    accessorKey: "credit",
    header: "Credit",
    cell: ({ row }) => {
      return Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.getValue("credit"));
    },
  },
  {
    accessorKey: "JournalEntry.pr",
    header: "PR#",
    cell: ({ row }) => {
      const pr = row.original.JournalEntry.pr;
      console.log(pr);
      return (
        <Link href={`/journal/${row.original.JournalEntry.id}`} passHref>
          <Button variant="link" className="p-0">
            {pr}
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Balance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.getValue("balance"));
    },
  },
];
