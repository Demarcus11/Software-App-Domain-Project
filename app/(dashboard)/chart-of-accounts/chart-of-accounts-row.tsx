import { TableCell, TableRow } from "@/components/ui/table";

import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { MoreHorizontal } from "lucide-react";

import { Account } from "@prisma/client";

import { format } from "date-fns";

interface ChartOfAccountsRowProps {
  account: Account;
}

export const ChartOfAccountsRow = ({ account }: ChartOfAccountsRowProps) => {
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const ActionSelect = () => {
    const actions = [
      {
        label: "View account",
        onClick: () => {
          router.push(`/chart-of-accounts/${account.id}`);
        },
      },
    ];
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {actions.map((action) => (
            <DropdownMenuItem onClick={action.onClick} key={action.label}>
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <TableRow className="cursor-pointer">
      <TableCell>{account.accountNumber}</TableCell>
      <TableCell>{account.category}</TableCell>
      <TableCell>{account.accountName}</TableCell>
      <TableCell>{account.accountDescription}</TableCell>
      <TableCell>{formatCurrency(account.balance)}</TableCell>
      <TableCell>
        {format(new Date(account.createdAt), "MMM dd, yyyy")}
      </TableCell>
      <TableCell>{account.isActive ? "Yes" : "No"}</TableCell>
      <TableCell>
        <ActionSelect />
      </TableCell>
    </TableRow>
  );
};
