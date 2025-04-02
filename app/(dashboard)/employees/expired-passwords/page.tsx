"use client";

import ExpiredPasswordsTable from "@/components/tables/expired-passwords-table";
import { ExpiredPasswords } from "@/types";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";

const ExpiredPasswordsPage = () => {
  const [expiredPasswords, setExpiredPasswords] = useState<ExpiredPasswords[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees/expired-passwords");
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        console.log(data);
        setExpiredPasswords(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        // setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        // setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <Loader className="animate-spin" />
        <span>Loading passwords...</span>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-medium">Employees with expired passwords</h1>
      <ExpiredPasswordsTable data={expiredPasswords} type="password" />
    </div>
  );
};

export default ExpiredPasswordsPage;
