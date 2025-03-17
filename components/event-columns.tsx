"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";

import { EventLog } from "@prisma/client";

export const columns: ColumnDef<EventLog>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Event Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "eventType",
    header: "Event Type",
  },

  {
    accessorKey: "tableName",
    header: "Table Name",
  },
  {
    accessorKey: "beforeState",
    header: "Before State",
    cell: ({ row }) => {
      return (
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(row.getValue("beforeState"), null, 2)}
        </pre>
      );
    },
  },
  {
    accessorKey: "afterState",
    header: "After State",
    cell: ({ row }) => {
      return (
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(row.getValue("afterState"), null, 2)}
        </pre>
      );
    },
  },
  {
    accessorKey: "recordId",
    header: "Record Id",
  },
  {
    accessorKey: "userId",
    header: "User Id",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return format(new Date(row.getValue("createdAt")), "MMM dd, yyyy h:mm a");
    },
  },
];
