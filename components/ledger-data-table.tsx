"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  FilterFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "./ui/date-range-picker";
import React from "react";
import { useRouter } from "next/navigation";
import { ExtendedTransaction } from "@/app/(dashboard)/ledger/[id]/page";

interface DataTableProps {
  columns: ColumnDef<ExtendedTransaction>[];
  data: ExtendedTransaction[];
}

export function LedgerDataTable({ columns, data }: DataTableProps) {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [debitFilter, setDebitFilter] = React.useState<string>("");
  const [creditFilter, setCreditFilter] = React.useState<string>("");
  const [descriptionFilter, setDescriptionFilter] = React.useState<string>("");

  const globalFilterFn: FilterFn<ExtendedTransaction> = (
    row,
    columnId,
    filterValue
  ) => {
    const searchStr = filterValue.toLowerCase();
    const transaction = row.original;

    return (
      transaction.description.toLowerCase().includes(searchStr) ||
      transaction.JournalEntry.description.toLowerCase().includes(searchStr) ||
      transaction.JournalEntry.pr.toLowerCase().includes(searchStr) ||
      String(transaction.debit).includes(searchStr) ||
      String(transaction.credit).includes(searchStr) ||
      String(transaction.balance).includes(searchStr)
    );
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      globalFilter,
      sorting,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: globalFilterFn,
  });

  React.useEffect(() => {
    const filters = [];

    // Date range filter
    if (dateRange?.from || dateRange?.to) {
      filters.push({
        id: "date",
        value: {
          from: dateRange.from,
          to: dateRange.to,
        },
      });
    }

    // Debit filter
    if (debitFilter) {
      filters.push({
        id: "debit",
        value: parseFloat(debitFilter),
      });
    }

    // Credit filter
    if (creditFilter) {
      filters.push({
        id: "credit",
        value: parseFloat(creditFilter),
      });
    }

    // Description filter
    if (descriptionFilter) {
      filters.push({
        id: "description",
        value: descriptionFilter,
      });
    }

    table.setColumnFilters(filters);
  }, [dateRange, debitFilter, creditFilter, descriptionFilter, table]);

  return (
    <>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Input
              placeholder="Search across all fields..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-md"
            />
            <Input
              placeholder="Filter by debit amount..."
              value={debitFilter}
              onChange={(event) => setDebitFilter(event.target.value)}
              type="number"
              className="max-w-[200px]"
            />
            <Input
              placeholder="Filter by credit amount..."
              value={creditFilter}
              onChange={(event) => setCreditFilter(event.target.value)}
              type="number"
              className="max-w-[200px]"
            />
            <Input
              placeholder="Filter by description..."
              value={descriptionFilter}
              onChange={(event) => setDescriptionFilter(event.target.value)}
              className="max-w-[200px]"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => {
                        router.push(`/journal/${row.original.JournalEntry.id}`);
                      }}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
