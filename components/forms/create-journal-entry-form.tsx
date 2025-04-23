"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { useState, useEffect } from "react";
import { Account } from "@prisma/client";
import { Checkbox } from "../ui/checkbox";

const formSchema = z.object({
  date: z.date(),
  description: z.string().min(1, "Description is required"),
  isAdjusting: z.boolean().optional(),
  transactions: z
    .array(
      z.object({
        accountId: z.string().min(1, "Account is required"),
        type: z.enum(["DEBIT", "CREDIT"]),
        amount: z
          .number({
            invalid_type_error: "Amount must be a number",
          })
          .positive("Amount must be positive")
          .min(0.01, "Amount must be at least 0.01"),
        description: z.string().optional(),
      })
    )
    .refine((transactions) => {
      const debitTotal = transactions
        .filter((t) => t.type === "DEBIT")
        .reduce((sum, t) => sum + t.amount, 0);
      const creditTotal = transactions
        .filter((t) => t.type === "CREDIT")
        .reduce((sum, t) => sum + t.amount, 0);
      return debitTotal === creditTotal;
    }, "Debits must equal credits"),
  document: z.instanceof(File).optional(),
});

export default function JournalEntryForm() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      description: "",
      transactions: [
        { accountId: "", type: "DEBIT", amount: 0, description: "" },
        { accountId: "", type: "CREDIT", amount: 0, description: "" },
      ],
      document: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "transactions",
  });

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        if (!response.ok) {
          const error = await response.json();
          console.log(error.message);
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

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await fetch("/api/accounts");
      const data = await res.json();
      setAccounts(data);
    };
    fetchAccounts();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      let documentUrl = null;

      if (data.document) {
        // Upload the document to Cloudinary
        const formData = new FormData();
        formData.append("file", data.document);
        formData.append("upload_preset", "next_cloudinary_app");

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!cloudinaryResponse.ok) {
          const error = await cloudinaryResponse.json();
          console.error("Cloudinary Error:", error);
          throw new Error("Failed to upload document");
        }

        const cloudinaryData = await cloudinaryResponse.json();
        documentUrl = cloudinaryData.secure_url;
      }

      const updatedData = {
        ...data,
        userId,
        date: data.date.toISOString(),
        transactions: data.transactions.map((t) => ({
          ...t,
          amount: Number(t.amount),
        })),
        documentUrl,
      };

      const response = await fetch("/api/journal-entries/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create journal entry");
      }

      toast.success("Journal entry created successfully");
      form.reset();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = () => {
    append({ accountId: "", type: "DEBIT", amount: 0, description: "" });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <div className="relative">
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isAdjusting"
            render={({ field }) => (
              <FormItem className="flex items-end gap-2">
                <FormLabel>Adjusting Entry?</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Transactions</h3>
            <Button type="button" variant="outline" onClick={addTransaction}>
              Add Line
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
            >
              <FormField
                control={form.control}
                name={`transactions.${index}.accountId`}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Account</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem
                            key={account.id}
                            value={String(account.id)}
                          >
                            {account.number} - {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`transactions.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DEBIT">Debit</SelectItem>
                        <SelectItem value="CREDIT">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`transactions.${index}.amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Convert empty string to 0 for validation
                        field.onChange(value === "" ? 0 : parseFloat(value));
                      }}
                      onBlur={(e) => {
                        // If empty after blur, set to 0
                        if (e.target.value === "") {
                          field.onChange(0);
                        }
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
                disabled={fields.length <= 2}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        {form.formState.errors.transactions?.root?.message && (
          <div className="text-destructive">
            {form.formState.errors.transactions?.root?.message}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Journal Entry"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
