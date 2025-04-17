import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";

export interface IncomeStatement {
  name: string;
  balance: number;
  category?: string;
  type: "revenue" | "expense" | "total" | "net";
}

export const incomeStatementColumns: ColumnDef<IncomeStatement>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.original.type;
      const isTotal = type === "total" || type === "net";

      return (
        <div className={isTotal ? "font-bold" : ""}>{row.getValue("name")}</div>
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
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"));
      const type = row.original.type;
      const isTotal = type === "total" || type === "net";

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return (
        <div className={`text-right ${isTotal ? "font-bold" : ""}`}>
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type");
      let displayType = "";

      switch (type) {
        case "revenue":
          displayType = "Revenue";
          break;
        case "expense":
          displayType = "Expense";
          break;
        case "total":
          displayType = "Total";
          break;
        case "net":
          displayType = "Net Income";
          break;
        default:
          displayType = "Unknown";
      }

      return <div>{displayType}</div>;
    },
  },
];
