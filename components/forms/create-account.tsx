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

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  accountDescription: z.string().optional(),
  normalSide: z.enum(["Debit", "Credit"]),
  category: z.enum(["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"]),
  subcategory: z.enum([
    "CURRENT_ASSETS",
    "FIXED_ASSETS",
    "CURRENT_LIABILITIES",
    "LONG_TERM_LIABILITIES",
    "RETAINED_EARNINGS",
    "OPERATING_REVENUE",
    "OPERATING_EXPENSE",
  ]),
  initialBalance: z
    .number()
    .min(0, "Initial balance must be a positive number"),
  debit: z.number().min(0, "Debit must be a positive number"),
  credit: z.number().min(0, "Credit must be a positive number"),
  order: z.number().min(1, "Order must be a positive number"),
  statement: z.enum(["IS", "BS", "RE"]),
  comment: z.string().optional(),
});

interface UserId {
  id: string;
}

const CreateAccountForm = () => {
  const [userId, setUserId] = useState<UserId | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

        const userDetails = await response.json();
        setUserId(userDetails.id);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserId();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: "",
      accountDescription: "",
      normalSide: "Debit",
      category: "ASSET",
      subcategory: "CURRENT_ASSETS",
      initialBalance: 0.0,
      debit: 0.0,
      credit: 0.0,
      order: 1,
      statement: "BS",
      comment: "",
    },
  });

  const createAccount = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const updatedData = {
      ...data,
      userId: userId,
    };

    try {
      const response = await fetch("/api/accounts/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        form.setError("root", {
          type: "server",
          message: error.message,
        });
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
      toast.promise(createAccount(data), {
        loading: "Creating account...",
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
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter account name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter account description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="normalSide"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Normal Side</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select normal side" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Debit">Debit</SelectItem>
                    <SelectItem value="Credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASSET">Asset</SelectItem>
                    <SelectItem value="LIABILITY">Liability</SelectItem>
                    <SelectItem value="EQUITY">Equity</SelectItem>
                    <SelectItem value="REVENUE">Revenue</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subcategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Subcategory</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CURRENT_ASSETS">
                      Current Assets
                    </SelectItem>
                    <SelectItem value="FIXED_ASSETS">Fixed Assets</SelectItem>
                    <SelectItem value="CURRENT_LIABILITIES">
                      Current Liabilities
                    </SelectItem>
                    <SelectItem value="LONG_TERM_LIABILITIES">
                      Long-Term Liabilities
                    </SelectItem>
                    <SelectItem value="RETAINED_EARNINGS">
                      Retained Earnings
                    </SelectItem>
                    <SelectItem value="OPERATING_REVENUE">
                      Operating Revenue
                    </SelectItem>
                    <SelectItem value="OPERATING_EXPENSE">
                      Operating Expense
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="initialBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Balance</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
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
                <Input
                  type="number"
                  placeholder="Enter debit amount"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
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
                <Input
                  type="number"
                  placeholder="Enter credit amount"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter order"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="statement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statement Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select statement type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IS">Income Statement</SelectItem>
                    <SelectItem value="BS">Balance Sheet</SelectItem>
                    <SelectItem value="RE">Retained Earnings</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Input placeholder="Enter comment" {...field} />
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

        <Button type="submit">Create Account</Button>
      </form>
    </Form>
  );
};

export default CreateAccountForm;
