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
import { Category, Subcategory, Statement, Order } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  description: z.string().min(1, "Description is required"),
  normalSide: z.enum(["Debit", "Credit"], {
    required_error: "Normal side is required",
  }),
  initialBalance: z
    .number()
    .min(0, "Initial balance must be a positive number"),
  orderId: z.number().min(1, "Order is required"),
  comment: z.string().optional(),
  categoryId: z.number().min(1, "Category is required"),
  subcategoryId: z.number().min(1, "Subcategory is required"),
  statementId: z.number().min(1, "Statement is required"),
});

interface UserId {
  id: string;
}

const CreateAccountForm = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
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
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await fetch("/api/subcategories");
        if (!response.ok) {
          throw new Error("Failed to fetch subcategories");
        }
        const data = await response.json();
        setSubcategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchStatements = async () => {
      try {
        const response = await fetch("/api/statements");
        if (!response.ok) {
          throw new Error("Failed to fetch statements");
        }
        const data = await response.json();
        setStatements(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
    fetchSubcategories();
    fetchStatements();
    fetchOrders();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      normalSide: "Debit",
      initialBalance: 0,
      orderId: 0,
      comment: "",
      categoryId: 0,
      subcategoryId: 0,
      statementId: 0,
    },
  });

  const createAccount = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const updatedData = {
      ...data,
      userId: userId,
    };

    const response = await fetch("/api/accounts/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const result = await response.json();

    if (!response.ok) {
      form.setError("root", {
        type: "server",
        message: result.message,
      });
      setIsLoading(false);
      throw new Error(result.message); // This will be caught by toast.promise
    }

    setIsLoading(false);
    return result;
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!userId) {
      toast.error("User ID is not available. Please try again.");
      return;
    }

    try {
      await createAccount(data);
      toast.success("Account created");
    } catch (error) {
      // Error already handled in the promise chain, no need to do anything here
    }
  };

  const CategoriesSelect = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (value: number) => void;
  }) => {
    return (
      <Select
        value={String(value)}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={String(category.id)}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const SubcategoriesSelect = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (value: number) => void;
  }) => {
    return (
      <Select
        value={String(value)}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select subcategory" />
        </SelectTrigger>
        <SelectContent>
          {subcategories.map((subcategory) => (
            <SelectItem key={subcategory.id} value={String(subcategory.id)}>
              {subcategory.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const StatementsSelect = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (value: number) => void;
  }) => {
    return (
      <Select
        value={String(value)}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select statement" />
        </SelectTrigger>
        <SelectContent>
          {statements.map((statement) => (
            <SelectItem key={statement.id} value={String(statement.id)}>
              {statement.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const OrdersSelect = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (value: number) => void;
  }) => {
    return (
      <Select
        value={String(value)}
        onValueChange={(val) => onChange(Number(val))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select order" />
        </SelectTrigger>
        <SelectContent>
          {orders.map((order) => (
            <SelectItem key={order.id} value={String(order.id)}>
              {order.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create New Account</h1>
        <p className="text-muted-foreground">
          Add a new account to your chart of accounts
        </p>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Account Details</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Cash, Accounts Payable"
                            {...field}
                          />
                        </FormControl>
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
                        <FormControl>
                          <Input
                            placeholder="Brief description of the account"
                            {...field}
                          />
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
                            <SelectTrigger className="w-full">
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
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Financial Settings</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="initialBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Balance</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                              $
                            </span>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              className="pl-8"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Classification</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select
                            value={String(field.value)}
                            onValueChange={(val) => field.onChange(Number(val))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={String(category.id)}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subcategoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <FormControl>
                          <Select
                            value={String(field.value)}
                            onValueChange={(val) => field.onChange(Number(val))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                              {subcategories.map((subcategory) => (
                                <SelectItem
                                  key={subcategory.id}
                                  value={String(subcategory.id)}
                                >
                                  {subcategory.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="statementId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Financial Statement</FormLabel>
                        <FormControl>
                          <Select
                            value={String(field.value)}
                            onValueChange={(val) => field.onChange(Number(val))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select statement" />
                            </SelectTrigger>
                            <SelectContent>
                              {statements.map((statement) => (
                                <SelectItem
                                  key={statement.id}
                                  value={String(statement.id)}
                                >
                                  {statement.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="orderId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Order</FormLabel>
                        <FormControl>
                          <Select
                            value={String(field.value)}
                            onValueChange={(val) => field.onChange(Number(val))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select order" />
                            </SelectTrigger>
                            <SelectContent>
                              {orders.map((order) => (
                                <SelectItem
                                  key={order.id}
                                  value={String(order.id)}
                                >
                                  {order.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">
                  Additional Information
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comment</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Optional comment about this account"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateAccountForm;
