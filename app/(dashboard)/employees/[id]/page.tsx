"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { SquarePen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Employee } from "@/types";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import BackButton from "@/components/back-button";

const ViewEmployeePage = () => {
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="grid gap-4">
      <BackButton link="/employees" text="Back to employees" />
      <h1 className="text-xl font-bold">View Employee</h1>

      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center p-4 rounded max-w-max">
          {isLoading ? (
            <Skeleton className="w-16 h-16 rounded-full" />
          ) : (
            <>
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee?.firstName}%${employee?.lastName}`}
                />
                <AvatarFallback className="bg-red-400 text-white">
                  N/A
                </AvatarFallback>
              </Avatar>
            </>
          )}

          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <p className="text-lg font-medium">
                  {employee?.firstName} {employee?.lastName}
                </p>
                <p className="text-sm">{employee?.role}</p>
              </>
            )}
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-10 w-24" />
        ) : (
          <Link
            href={`/employees/1/edit`}
            className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded flex items-center gap-2 rounded"
          >
            <SquarePen size={15} />
            Edit
          </Link>
        )}
      </div>

      <div className="grid gap-2">
        {[
          { label: "First Name", value: employee?.firstName },
          { label: "Last Name", value: employee?.lastName },
          { label: "Role", value: employee?.role },
          { label: "Email", value: employee?.email },
          { label: "Address", value: employee?.address },
          {
            label: "Suspended until",
            value: employee?.suspendedUntil
              ? formatDate(new Date(employee.suspendedUntil))
              : "N/A",
          },
          { label: "Is Active?", value: employee?.isActive ? "Yes" : "No" },
          {
            label: "Hired By",
            value: employee?.hiredBy ? employee?.hiredBy?.email : "N/A",
          },
          {
            label: "Date of Hire",
            value: employee?.dateOfHire
              ? new Date(employee.dateOfHire).toLocaleDateString()
              : "N/A",
          },
        ].map((field, index) => (
          <div key={index} className="grid gap-2 bg-primary/5 p-4 rounded">
            {isLoading ? (
              <Skeleton className="h-16 w-full bg-transparent" />
            ) : (
              <>
                <Label htmlFor={field.label.toLowerCase().replace(" ", "-")}>
                  {field.label}
                </Label>
                <p>{field.value}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewEmployeePage;
