"use client";

import { DataTable } from "@/components/tables/data-table";
import { employeeColumns } from "@/components/tables/employee-columns";
import { Employee } from "@/types";

interface EmployeesTableProps {
  data: Employee[];
}

const EmployeesTable = ({ data }: EmployeesTableProps) => {
  return <DataTable columns={employeeColumns} data={data} filterBy="email" />;
};

export default EmployeesTable;
