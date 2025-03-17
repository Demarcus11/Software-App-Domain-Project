"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import PasswordInput from "@/components/password-input";

import { Button } from "@/components/ui/button";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { Transaction } from "@/types/transaction";

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  debit: z.string().min(0, "Debit must be a positive number"),
  credit: z.string().min(0, "Credit must be a positive number"),
  date: z.date({ required_error: "Date of birth is required." }),
  accountId: z.string().min(1, "Account is required"),
  userId: z.string().min(1, "UserId is required"),
});

const CreateTransactionForm = () => {
  const params = useSearchParams();
  const id = params.get("id");

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      debit: "",
      credit: "",
      date: new Date(),
      accountId: id || undefined,
      userId: "",
    },
  });

  const createTransaction = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/transaction/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
      form.setError("root", {
        type: "server",
        message: "An unexpected error occurred, please try again later",
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetButtonClick = () => {
    form.reset();
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      toast.promise(createTransaction(data), {
        loading: "Creating transaction...",
        success: (responseData) => responseData?.message,
        error: (err) => err.message,
        duration: 10000,
      });

      form.reset();
    } catch (error) {
      console.error(error);
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
              <div className="flex items-center justify-between">
                <FormLabel>Description</FormLabel>
                <Button
                  type="button"
                  className="text-center text-sm underline text-primary hover:text-primary/90 hover:bg-transparent bg-transparent shadow-none"
                  onClick={handleResetButtonClick}
                >
                  Reset
                </Button>
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
          name="debit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Debit</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="credit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credit</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel className="-mb-2">Date</FormLabel>
              <FormControl>
                <div className="relative">
                  <DatePicker
                    wrapperClassName="w-full"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd"
                    className="w-full px-3 py-1 text-base shadow-sm border-input border rounded-md bg-transparent"
                    showYearDropdown
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                  />
                  <Calendar className="absolute right-5 top-[7px]" size={20} />
                </div>
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

        <Button type="submit">Create Employee</Button>
      </form>
    </Form>
  );
};

export default CreateTransactionForm;
