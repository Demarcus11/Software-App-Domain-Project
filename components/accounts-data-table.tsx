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

import React from "react";

import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function AccountsDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Custom filter function that checks all relevant columns
  const multiColumnFilter: FilterFn<any> = (row, columnId, value) => {
    const accountNumber = String(row.getValue("number") || "");
    const accountName = String(row.getValue("name") || "");
    const categoryName = String(row.getValue("categoryName") || "");
    const statementName = String(row.getValue("statementName") || "");

    // For balance, we need to handle numeric values
    let balance = "";
    const balanceValue = row.getValue("balance");
    if (balanceValue !== null && balanceValue !== undefined) {
      balance = String(balanceValue);
    }

    const searchValue = value.toLowerCase();

    return (
      accountNumber.toLowerCase().includes(searchValue) ||
      accountName.toLowerCase().includes(searchValue) ||
      categoryName.toLowerCase().includes(searchValue) ||
      statementName.toLowerCase().includes(searchValue) ||
      balance.toLowerCase().includes(searchValue)
    );
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: multiColumnFilter,
  });

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by account number, name, category, statement, or balance..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                        router.push(`/ledger/${cell.row.original.id}`);
                      }}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
