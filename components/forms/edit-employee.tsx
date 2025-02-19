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

import { Switch } from "@/components/ui/switch";

import { Button } from "@/components/ui/button";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Employee } from "@/types";

import { toast } from "sonner";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.string(),
  email: z.string().min(1, "Email is Required").email("Invalid email"),
  address: z.string().min(1, "Address is required"),
  suspendedUntil: z.date().optional().nullable(),
  isActive: z.boolean(),
  hiredBy: z.string().optional().nullable(),
  dateOfHire: z.date().optional().nullable(),
  dateOfBirth: z.date().optional().nullable(),
});

const EditEmployeeForm = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      role: "",
      email: "",
      address: "",
      suspendedUntil: null,
      isActive: false,
      dateOfHire: null,
      username: "",
      dateOfBirth: null,
    },
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`/api/employees/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEmployee();
  }, []);

  useEffect(() => {
    if (employee) {
      form.reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        role: employee.role,
        email: employee.email,
        address: employee.address || "",
        suspendedUntil: employee.suspendedUntil
          ? new Date(employee.suspendedUntil)
          : null,
        isActive: employee.isActive,
        dateOfHire: employee.dateOfHire ? new Date(employee.dateOfHire) : null,
        username: employee.username,
        dateOfBirth: employee.dateOfBirth
          ? new Date(employee.dateOfBirth)
          : null,
      });
    }
  }, [employee]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    let formData = { ...data };

    const formattedData = {
      ...formData,
      dateOfBirth: data.dateOfBirth?.toISOString(),
      suspendedUntil: data.suspendedUntil?.toISOString(),
      dateOfHire: data.dateOfHire?.toISOString(),
    };

    toast.promise(
      fetch(`/api/employees/${id}/edit`, {
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
        loading: "Updating employee...",
        success: (result) => result?.message || "Employee updated",
        error: (err) => err.message || "An unexpected error occurred.",
        duration: 10000,
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel className="-mb-2">Date of Birth</FormLabel>
              <FormControl>
                <div className="relative">
                  <DatePicker
                    wrapperClassName="w-full"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      console.log("Selected date:", date); // Log the date
                      field.onChange(date);
                    }}
                    dateFormat="yyyy-MM-dd"
                    className="w-full px-3 py-1 text-base shadow-sm border-input border rounded-md"
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

        <FormField
          control={form.control}
          name="suspendedUntil"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel className="-mb-2">Suspensed Until</FormLabel>
              <FormControl>
                <div className="relative">
                  <DatePicker
                    wrapperClassName="w-full"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd h:mm aa"
                    className="w-full px-3 py-1 text-base shadow-sm border-input border rounded-md"
                    showYearDropdown
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                    showTimeSelect
                  />
                  <Calendar className="absolute right-5 top-[7px]" size={20} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex gap-4 items-center space-y-0">
              <FormLabel htmlFor="is-active">Is Active?</FormLabel>
              <FormControl>
                <Switch
                  id="is-active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="hiredBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hired By</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="dateOfHire"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel className="-mb-2">Date of Hire</FormLabel>
              <FormControl>
                <div className="relative">
                  <DatePicker
                    wrapperClassName="w-full"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd"
                    className="w-full px-3 py-1 text-base shadow-sm border-input border rounded-md"
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

        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
};

export default EditEmployeeForm;
