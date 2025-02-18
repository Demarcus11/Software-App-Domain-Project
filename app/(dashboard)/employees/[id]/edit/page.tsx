"use client";

// import EditEmployeeForm from "@/components/forms/edit-employee";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Employee } from "@/types";
import { useParams } from "next/navigation";

const EditEmployeePage = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const { id } = useParams();

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
          <p className="text-sm">{employee?.role}</p>
        </div>
      </div>

      {/* <EditEmployeeForm /> */}
    </div>
  );
};

export default EditEmployeePage;
