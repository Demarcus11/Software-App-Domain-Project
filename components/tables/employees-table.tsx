"use client";

import { useState, useEffect } from "react";
import { Employee } from "@/types";
import { employeeColumns } from "./employee-columns";
import { DataTable } from "@/components/tables/data-table";
import useWindowSize from "@/hooks/use-window-size";
import { Loader } from "lucide-react";

export const EmployeesTable = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const windowSize = useWindowSize();
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <Loader className="animate-spin" />
        <span>Loading employees...</span>
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={employeeColumns(fetchEmployees, windowSize)}
        data={employees}
        filterBy="firstName"
        type="employee"
      />
    </>
  );
};
