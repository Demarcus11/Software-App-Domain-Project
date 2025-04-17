// components/income-statement-table.tsx
"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { DownloadIcon, MailIcon, PrinterIcon } from "lucide-react";
import { IncomeStatement } from "./income-statement-columns";

interface IncomeStatementTableProps {
  data: IncomeStatement[];
  columns: ColumnDef<IncomeStatement>[];
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  onExport: () => void;
  onEmail: () => void;
  onPrint: () => void;
}

export function IncomeStatementTable({
  data,
  columns,
  globalFilter,
  onGlobalFilterChange,
  onExport,
  onEmail,
  onPrint,
}: IncomeStatementTableProps) {
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: onGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Report Preview</h2>
        <div className="flex gap-3">
          <Button variant="outline" size="icon" onClick={onExport}>
            <DownloadIcon className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={onEmail}>
            <MailIcon className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={onPrint}>
            <PrinterIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter reports..."
          value={globalFilter ?? ""}
          onChange={(event) => onGlobalFilterChange(String(event.target.value))}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
