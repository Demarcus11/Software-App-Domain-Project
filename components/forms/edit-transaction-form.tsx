"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { date, z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Transaction } from "@prisma/client";
import { toast } from "sonner";

import { useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(1, "Amount is required"),
  balance: z.number().min(1, "Balance is required"),
});

interface EditTransactionFormProps {
  transaction: Transaction | null;
}

export const EditTransactionForm = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      balance: 0,
    },
  });

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Failed to fetch user details");
          return;
        }

        const user = await response.json();
        setUserId(user.id);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserId();
  }, []);

  const { id } = useParams();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`/api/transactions/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        setTransaction(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTransaction();
  }, []);

  useEffect(() => {
    if (transaction) {
      form.reset({
        description: transaction.description,
        amount: transaction.amount,
        balance: transaction.balance,
      });
    }
  }, [transaction]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (transaction && userId) {
      const formattedData = {
        ...data,
        userId,
      };

      toast.promise(
        fetch(`/api/transactions/${transaction.id}/edit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
          credentials: "include",
        }).then(async (response) => {
          if (!response.ok) {
            const error = await response.json();
            if (error.errors) {
              error.errors.forEach((err: any) => {
                form.setError(err.path[0], {
                  message: err.message,
                });
              });
              throw new Error("Validation errors occurred.");
            }
            form.setError("root", { message: error.message });
            throw new Error(error.message);
          }
          return response.json();
        }),
        {
          loading: "Updating transaction...",
          success: (result) => result?.message || "Transaction updated",
          error: (err) => err.message || "An unexpected error occurred.",
          duration: 10000,
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Balance</FormLabel>
              </div>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Amount</FormLabel>
              </div>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <div className="mt-2 text-destructive">
            <FormMessage>{form.formState.errors.root.message}</FormMessage>
          </div>
        )}

        <Button type="submit">Update Transaction</Button>
      </form>
    </Form>
  );
};
