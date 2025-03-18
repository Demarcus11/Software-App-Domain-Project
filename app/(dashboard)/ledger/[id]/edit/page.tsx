"use client";

import EditEmployeeForm from "@/components/forms/edit-employee";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Employee } from "@/types";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import BackButton from "@/components/back-button";
import { Transaction } from "@prisma/client";
import { EditTransactionForm } from "@/components/forms/edit-transaction-form";

const EditLedgerPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  return (
    <div className="grid gap-4">
      <BackButton link={`/ledger/${id}`} text="Back to ledger" />
      <h1 className="text-xl font-medium">Edit Transaction Id: {id}</h1>

      <EditTransactionForm />
    </div>
  );
};

export default EditLedgerPage;
