"use client";

import ExpiredPasswordsTable from "@/components/tables/expired-passwords-table";
import { ExpiredPasswords } from "@/types";
import { useState, useEffect } from "react";

const ExpiredPasswordsPage = () => {
  const [expiredPasswords, setExpiredPasswords] = useState<ExpiredPasswords[]>(
    []
  );

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees/expired-passwords");
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        console.log(data);
        setExpiredPasswords(data);
      } catch (err) {
        console.error(err);
        // setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        // setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-medium">Employees with expired passwords</h1>
      <ExpiredPasswordsTable data={expiredPasswords} />
    </div>
  );
};

export default ExpiredPasswordsPage;
