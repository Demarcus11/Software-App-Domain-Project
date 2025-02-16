"use client";

import { useEffect, useState } from "react";
import EmployeesTable from "@/components/tables/employees-table";
import { Employee } from "@/types";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees");
        if (!response.ok) {
          const error = await response.json();
          throw new Error("Failed to fetch employees");
        }
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-medium">All Employees</h1>
      <EmployeesTable data={employees} />
    </div>
  );
};

export default EmployeesPage;
