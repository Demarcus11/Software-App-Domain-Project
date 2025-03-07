import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Account } from "@prisma/client";

import { ChartOfAccountsRow } from "./chart-of-accounts-row";

interface ChartOfAccountsTableProps {
  accounts: Account[];
}

export const ChartOfAccountsTable = ({
  accounts,
}: ChartOfAccountsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-none hover:bg-transparent">
          <TableHead>Account Number</TableHead>
          <TableHead className="hidden md:table-cell">Account Type</TableHead>
          <TableHead className="hidden md:table-cell">Account Name</TableHead>
          <TableHead className="hidden md:table-cell">
            Account Description
          </TableHead>
          <TableHead className="hidden md:table-cell">
            Account Balance
          </TableHead>
          <TableHead className="hidden md:table-cell">Date Created</TableHead>
          <TableHead className="hidden md:table-cell">Active?</TableHead>
          <TableHead className="hidden md:table-cell">Actions</TableHead>
        </TableRow>
      </TableHeader>
      {accounts.length === 0 ? (
        <TableBody>
          <TableRow className="border-none hover:bg-transparent">
            <TableCell
              colSpan={4}
              className="h-24 text-center text-muted-foreground"
            >
              No accounts
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        <TableBody>
          {accounts.map((account) => (
            <ChartOfAccountsRow key={account.id} account={account} />
          ))}
        </TableBody>
      )}
    </Table>
  );
};
