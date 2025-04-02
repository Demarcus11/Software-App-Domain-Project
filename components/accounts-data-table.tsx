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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import EmailEmployeesForm from "./forms/email-employees";
import Link from "next/link";

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
  const [selectedEmails, setSelectedEmails] = React.useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

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

  const updateSelectedEmails = async () => {
    try {
      const userIds = table
        .getSelectedRowModel()
        .rows.map((row) => (row.original as any).userId);

      // Fetch all employees
      const response = await fetch("/api/employees");
      const allEmployees = await response.json();

      // Filter client-side
      const selectedEmails = allEmployees
        .filter((user: { id: string; email: string }) =>
          userIds.includes(user.id)
        )
        .map((user: { id: string; email: string }) => user.email);

      setSelectedEmails(selectedEmails);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSubmit = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter by account number, name, category, statement, or balance..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-md"
        />
        <div className="flex items-center gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogDescription className="sr-only"></DialogDescription>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={updateSelectedEmails}>
                Email selected account owners
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Email</DialogTitle>
              </DialogHeader>
              <EmailEmployeesForm
                selectedEmails={selectedEmails}
                onFormSubmit={handleFormSubmit}
              />
            </DialogContent>
          </Dialog>
          <Button asChild>
            <Link href="/chart-of-accounts/new">New Account</Link>
          </Button>
        </div>
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
