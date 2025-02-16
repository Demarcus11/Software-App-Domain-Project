"use client";

import { DataTable } from "@/components/tables/data-table";
import { expiredPasswordsColumns } from "@/components/tables/expired-passwords-columns";
import { ExpiredPasswords } from "@/types";

interface ExpiredPasswordsTableProps {
  data: ExpiredPasswords[];
}

const ExpiredPasswordsTable = ({ data }: ExpiredPasswordsTableProps) => {
  return (
    <DataTable columns={expiredPasswordsColumns} data={data} filterBy="email" />
  );
};

export default ExpiredPasswordsTable;
