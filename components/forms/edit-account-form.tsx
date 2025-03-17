import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Category, Subcategory, Statement, Order } from "@prisma/client";
import { Loader2 } from "lucide-react"; // Import the loading icon

// Define your form schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  normalSide: z.enum(["Debit", "Credit"]),
  categoryId: z.number().min(1, "Category is required"),
  subcategoryId: z.number().min(1, "Subcategory is required"),
  statementId: z.number().min(1, "Statement is required"),
  orderId: z.number().min(1, "Order is required"),
  comment: z.string().optional(),
  balance: z.number().min(0, "Balance must be a positive number"),
  isActive: z.boolean(),
});

interface EditAccountFormProps {
  account: any; // Replace with your Account type
}

export const EditAccountForm = ({ account }: EditAccountFormProps) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      normalSide: "Debit",
      orderId: 0,
      comment: "",
      categoryId: 0,
      subcategoryId: 0,
      statementId: 0,
      balance: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user ID
        const userResponse = await fetch("/api/user", {
          credentials: "include",
        });
        if (!userResponse.ok) throw new Error("Failed to fetch user details");
        const user = await userResponse.json();
        setUserId(user.id);

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        if (!categoriesResponse.ok)
          throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch subcategories
        const subcategoriesResponse = await fetch("/api/subcategories");
        if (!subcategoriesResponse.ok)
          throw new Error("Failed to fetch subcategories");
        const subcategoriesData = await subcategoriesResponse.json();
        setSubcategories(subcategoriesData);

        // Fetch statements
        const statementsResponse = await fetch("/api/statements");
        if (!statementsResponse.ok)
          throw new Error("Failed to fetch statements");
        const statementsData = await statementsResponse.json();
        setStatements(statementsData);

        // Fetch orders
        const ordersResponse = await fetch("/api/orders");
        if (!ordersResponse.ok) throw new Error("Failed to fetch orders");
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);

        // Reset form with account data
        if (account) {
          form.reset({
            categoryId: account.categoryId,
            name: account.name,
            description: account.description,
            balance: account.balance,
            isActive: account.isActive,
            normalSide: account.normalSide || undefined,
            subcategoryId: account.subcategoryId,
            orderId: account.orderId,
            statementId: account.statementId,
            comment: account.comment || "",
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // Set loading to false after all data is fetched
      }
    };

    fetchData();
  }, [account, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (account && userId) {
      const formattedData = {
        ...data,
        id: account.id,
        userId: userId,
      };

      toast.promise(
        fetch(`/api/accounts/${account?.id}/edit`, {
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
          loading: "Updating account...",
          success: (result) => result?.message || "Account updated",
          error: (err) => err.message || "An unexpected error occurred.",
          duration: 10000,
        }
      );
    }
  };

  // Render loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" /> {/* Loading spinner */}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
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
          name="description"
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
                  {...field}
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
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Category</FormLabel>
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
                      <SelectItem key={category.id} value={String(category.id)}>
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
              <FormLabel>Account Subcategory</FormLabel>
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
              <FormLabel>Statement</FormLabel>
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
                      <SelectItem key={order.id} value={String(order.id)}>
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

        <Button type="submit">Update Account</Button>
      </form>
    </Form>
  );
};
