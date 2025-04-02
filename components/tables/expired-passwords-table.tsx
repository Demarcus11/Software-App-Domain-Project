"use client";

import { DataTable } from "@/components/tables/data-table";
// import { expiredPasswordsColumns } from "@/components/tables/expired-passwords-columns";
import { ExpiredPasswords } from "@/types";
import { useEffect, useState } from "react";
import { ExpiredPasswordsColumns } from "@/components/tables/expired-passwords-columns";
import useWindowSize from "@/hooks/use-window-size";

interface ExpiredPasswordsTableProps {
  data: ExpiredPasswords[];
  type: string;
}

const ExpiredPasswordsTable = ({ data, type }: ExpiredPasswordsTableProps) => {
  const windowSize = useWindowSize();
  const columns = ExpiredPasswordsColumns(windowSize);

  return (
    <DataTable columns={columns} data={data} filterBy="firstName" type={type} />
  );
};

export default ExpiredPasswordsTable;
