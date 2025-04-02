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
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "./ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function JournalDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [amountFilter, setAmountFilter] = React.useState<string>("");
  const [accountNameFilter, setAccountNameFilter] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<string>("");

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
  });

  // Apply filters
  React.useEffect(() => {
    const filters = [];

    // Status filter
    if (statusFilter) {
      filters.push({
        id: "status",
        value: statusFilter,
      });
    }

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

    // Amount filter
    if (amountFilter) {
      filters.push({
        id: "transactions",
        value: {
          amount: parseFloat(amountFilter),
        },
      });
    }

    // Account name filter
    if (accountNameFilter) {
      filters.push({
        id: "transactions",
        value: {
          accountName: accountNameFilter,
        },
      });
    }

    table.setColumnFilters(filters);
  }, [statusFilter, dateRange, amountFilter, accountNameFilter, table]);

  return (
    <>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Input
              placeholder="Filter by PR # or description..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-md"
            />
            <Input
              placeholder="Filter by amount..."
              value={amountFilter}
              onChange={(event) => setAmountFilter(event.target.value)}
              type="number"
              className="max-w-[200px]"
            />
            <Input
              placeholder="Filter by account name..."
              value={accountNameFilter}
              onChange={(event) => setAccountNameFilter(event.target.value)}
              className="max-w-[200px]"
            />
            <Select
              value={statusFilter || "all"} // Use "all" when statusFilter is empty
              onValueChange={(value) => {
                // Set to empty string only for filtering, but keep "all" in the Select value
                setStatusFilter(value === "all" ? "" : value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => router.push("/journal/new")}>
            New Journal Entry
          </Button>
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
                    <TableCell key={cell.id}>
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
                  No journal entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
