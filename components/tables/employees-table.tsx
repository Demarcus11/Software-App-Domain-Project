"use client";

import { useState, useEffect } from "react";
import { Employee } from "@/types";
import { employeeColumns } from "./employee-columns";
import { DataTable } from "@/components/tables/data-table";

export const EmployeesTable = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Fetch employees data
  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <DataTable
      columns={employeeColumns(fetchEmployees)} // Pass fetchEmployees as a prop
      data={employees}
      filterBy="email"
    />
  );
};
