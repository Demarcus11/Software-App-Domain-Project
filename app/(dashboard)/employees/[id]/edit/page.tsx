"use client";

import EditEmployeeForm from "@/components/forms/edit-employee";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Employee } from "@/types";
import { useParams } from "next/navigation";

const EditEmployeePage = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`/api/employees/${id}`);
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error(error);
        // setError(err instanceof Error ? err.message : "An error occurred");
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-bold">Edit Employee</h1>

      <div className="flex gap-4 items-center p-4 rounded max-w-max">
        <Avatar className="w-16 h-16">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div>
          <p className="text-lg font-medium">
            {employee?.firstName} {employee?.lastName}
          </p>
          <p className="text-sm">{employee?.userType}</p>
        </div>
      </div>

      <EditEmployeeForm employee={employee} />
    </div>
  );
};

export default EditEmployeePage;
