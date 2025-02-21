"use client";

import { DataTable } from "@/components/tables/data-table";
// import { expiredPasswordsColumns } from "@/components/tables/expired-passwords-columns";
import { ExpiredPasswords } from "@/types";
import { useEffect, useState } from "react";
import { ExpiredPasswordsColumns } from "@/components/tables/expired-passwords-columns";

interface ExpiredPasswordsTableProps {
  data: ExpiredPasswords[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
  passwordExpiresAt: string;
}

const ExpiredPasswordsTable = ({ data }: ExpiredPasswordsTableProps) => {
  const columns = ExpiredPasswordsColumns();

  return <DataTable columns={columns} data={data} filterBy="email" />;
};

export default ExpiredPasswordsTable;
