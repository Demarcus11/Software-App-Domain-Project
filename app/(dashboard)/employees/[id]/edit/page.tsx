"use client";

import EditEmployeeForm from "@/components/forms/edit-employee";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Employee } from "@/types";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const EditEmployeePage = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`/api/employees/${id}`);
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        setEmployee(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmployee();
  }, []);

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-medium">Edit Employee</h1>

      <div className="flex gap-4 items-center p-4 rounded max-w-max">
        {isLoading ? (
          <Skeleton className="w-16 h-16 rounded-full" />
        ) : (
          <Avatar className="w-16 h-16">
            <AvatarImage src={employee?.profilePictureUrl || undefined} />
            <AvatarFallback className="bg-red-400 text-white">
              N/A
            </AvatarFallback>
          </Avatar>
        )}

        <div className="grid gap-2">
          {isLoading ? (
            <Skeleton className="w-32 h-4" />
          ) : (
            <p className="text-md font-medium">
              {employee?.firstName} {employee?.lastName}
            </p>
          )}

          {isLoading ? (
            <Skeleton className="w-16 h-4" />
          ) : (
            <p className="text-sm">{employee?.role}</p>
          )}
        </div>
      </div>

      <EditEmployeeForm />
    </div>
  );
};

export default EditEmployeePage;
