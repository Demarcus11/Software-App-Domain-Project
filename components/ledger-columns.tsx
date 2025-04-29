"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { ExtendedTransaction } from "@/app/(dashboard)/ledger/[id]/page";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { useState, useEffect } from "react";
import React from "react";

const DateFilter: React.FC<{ column: any }> = ({ column }) => {
  const [date, setDate] = React.useState<DateRange | undefined>();

  React.useEffect(() => {
    // Reset filter when date selection is cleared
    if (!date?.from && !date?.to) {
      column.setFilterValue(undefined);
      return;
    }

    // Only apply filter when both dates are selected or when only "from" is selected
    if (date?.from) {
      column.setFilterValue({
        from: date.from,
        to: date.to || undefined, // Explicitly set to undefined if not present
      });
    }
  }, [date, column]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="w-[240px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "MMM dd, yyyy")} -{" "}
                {format(date.to, "MMM dd, yyyy")}
              </>
            ) : (
              `From ${format(date.from, "MMM dd, yyyy")}`
            )
          ) : (
            <span>Filter by date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export const columns: ColumnDef<ExtendedTransaction>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <div className="flex flex-col space-y-2">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        <DateFilter column={column} />
      </div>
    ),
    cell: ({ row }) => format(new Date(row.getValue("date")), "MMM dd, yyyy"),
    filterFn: (row, id, value) => {
      const date = new Date(row.getValue(id));
      const { from, to } = value || {};

      // If no filter is set, show all rows
      if (!from && !to) return true;

      // Convert dates to start/end of day for accurate comparison
      const rowDate = new Date(date);
      rowDate.setHours(0, 0, 0, 0);

      if (from && !to) {
        const filterFrom = new Date(from);
        filterFrom.setHours(0, 0, 0, 0);
        return rowDate >= filterFrom;
      }

      if (!from && to) {
        const filterTo = new Date(to);
        filterTo.setHours(23, 59, 59, 999);
        return rowDate <= filterTo;
      }

      if (from && to) {
        const filterFrom = new Date(from);
        filterFrom.setHours(0, 0, 0, 0);
        const filterTo = new Date(to);
        filterTo.setHours(23, 59, 59, 999);
        return rowDate >= filterFrom && rowDate <= filterTo;
      }

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
