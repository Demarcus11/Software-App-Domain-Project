"use client";

import CreateTransactionForm from "@/components/forms/create-transaction-form";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const CreateTransactionPage = () => {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.back()}
        className="text-primary hover:underline inline-flex items-center gap-1 font-bold mb-5"
      >
        <ChevronLeft size={18} />
        Back
      </button>
      <div className="grid gap-4">
        <h1 className="text-xl font-bold">Create Transaction</h1>

        <CreateTransactionForm />
      </div>
    </>
  );
};

export default CreateTransactionPage;
