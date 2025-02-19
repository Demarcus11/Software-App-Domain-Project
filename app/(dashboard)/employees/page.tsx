"use client";

import { EmployeesTable } from "@/components/tables/employees-table";

const EmployeesPage = () => {
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-medium">All Employees</h1>
      <EmployeesTable />
    </div>
  );
};

export default EmployeesPage;
