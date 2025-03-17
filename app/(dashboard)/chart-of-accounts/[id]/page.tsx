"use client";

import { Label } from "@/components/ui/label";
import { SquarePen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import BackButton from "@/components/back-button";
import {
  Account,
  Category,
  Subcategory,
  Statement,
  Transaction,
  Order,
} from "@prisma/client";
import { useParams } from "next/navigation";
import { format } from "date-fns";

interface ViewAccountPageProps {
  params: Promise<{ id: string }>;
}

const ViewAccountPage = ({ params }: ViewAccountPageProps) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [statement, setStatement] = useState<Statement | null>(null);
  const [order, setOrder] = useState<Order | null>(null); // Replace 'any' with the actual type of order
  const [balance, setBalance] = useState<number>(0);
  const [totalDebits, setTotalDebits] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);

  //  Replace 'any' with the actual type of transactions

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
      } catch (error) {}
    };

    fetchAccount();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${account?.categoryId}`);
        if (!response.ok) throw new Error("Failed to fetch category");
        const data = await response.json();
        setCategory(data);
      } catch (error) {}
    };

    fetchCategory();
  }, [account]);

  useEffect(() => {
    const fetchSubcategory = async () => {
      try {
        const response = await fetch(
          `/api/subcategories/${account?.subcategoryId}`
        );
        if (!response.ok) throw new Error("Failed to fetch subcategory");
        const data = await response.json();
        console.log(data);
        setSubcategory(data);
      } catch (error) {}
    };

    fetchSubcategory();
  }, [account]);

  useEffect(() => {
    const fetchStatement = async () => {
      try {
        const response = await fetch(`/api/statements/${account?.statementId}`);
        if (!response.ok) throw new Error("Failed to fetch statement");
        const data = await response.json();
        setStatement(data);
      } catch (error) {}
    };

    fetchStatement();
  }, [account]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${account?.statementId}`);
        if (!response.ok) throw new Error("Failed to fetch order");
        const data = await response.json();
        setOrder(data);
      } catch (error) {}
    };

    fetchOrder();
  }, [account]);

  const AccountDetails = () => {
    const formattedDate = account?.createdAt
      ? format(new Date(account.createdAt), "MMM dd, yyyy")
      : "";

    const accounts = [
      { label: "Number", value: account?.number },
      { label: "Account Name", value: account?.name },
      { label: "Category", value: category?.name },
      {
        label: "Balance",
        value: Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(account?.balance as number),
      },
      { label: "Account Description", value: account?.description },
      { label: "Normal Side", value: account?.normalSide },
      { label: "Subcategory", value: subcategory?.name },
      {
        label: "Debit",
        value: Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(account?.totalDebits as number),
      },
      {
        label: "Credit",
        value: Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(account?.totalCredits as number),
      },
      {
        label: "Created At",
        value: formattedDate,
      },
      {
        label: "User ID",
        value: account?.userId,
      },
      {
        label: "Order",
        value: order?.name,
      },
      {
        label: "Statement",
        value: statement?.name,
      },
      {
        label: "Is Active?",
        value: account?.isActive ? "Yes" : "No",
      },
      {
        label: "Comment",
        value: account?.comment,
      },
    ];

    return (
      <div className="grid gap-2">
        {accounts.map(({ label, value }) => (
          <div key={label} className="grid gap-2 bg-primary/5 p-4 rounded">
            {isLoading ? (
              <Skeleton className="h-16 w-full bg-transparent" />
            ) : (
              <>
                <Label htmlFor={label.toLowerCase().replace(" ", "-")}>
                  {label}
                </Label>
                <p>{value}</p>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="grid gap-4">
        <BackButton
          link="/chart-of-accounts"
          text="Back to chart of accounts"
        />
        <h1 className="text-xl font-bold">View Account</h1>

        {isLoading ? (
          <Skeleton className="h-10 w-20 ml-auto mb-4 rounded" />
        ) : (
          <Link
            href={`/chart-of-accounts/${id}/edit`}
            className="bg-primary text-primary-foreground text-sm px-4 py-2 flex items-center gap-2 rounded ml-auto mb-4"
          >
            <SquarePen size={15} />
            Edit
          </Link>
        )}
      </div>

      <AccountDetails />
    </>
  );
};

export default ViewAccountPage;
