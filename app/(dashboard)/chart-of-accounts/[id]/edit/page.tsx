"use client";

import EditEmployeeForm from "@/components/forms/edit-employee";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import BackButton from "@/components/back-button";
import { Account } from "@prisma/client";
import { useParams } from "next/navigation";
import { EditAccountForm } from "@/components/forms/edit-account-form";

interface EditAccountPageProps {
  params: Promise<{ id: string }>;
}

const EditAccountPage = ({ params }: EditAccountPageProps) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch(`/api/accounts/${id}`);
        if (!response.ok) throw new Error("Failed to fetch account");
        const data = await response.json();
        setAccount(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAccount();
  }, []);

  return (
    <div className="grid gap-4">
      <BackButton
        link={`/chart-of-accounts`}
        text="Back to chart of accounts"
      />
      <h1 className="text-xl font-medium">Edit Account</h1>

      <EditAccountForm account={account} />
    </div>
  );
};

export default EditAccountPage;
