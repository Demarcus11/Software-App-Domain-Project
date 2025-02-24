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

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  to: z.array(z.string()).min(1, "Please enter at least one employee email"),
  subject: z.string().min(1, "Subject is required").optional(),
  body: z.string().min(1, "Body is required"),
});

interface EmailEmployeesFormProps {
  selectedEmails: string[];
  onFormSubmit: () => void;
}

const EmailEmployeesForm = ({
  selectedEmails,
  onFormSubmit,
}: EmailEmployeesFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: selectedEmails,
      subject: "",
      body: "",
    },
  });

  useEffect(() => {
    form.setValue("to", selectedEmails);
  }, [selectedEmails]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast.promise(
      fetch("/api/employees/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
        loading: "Sending email...",
        success: (result) => {
          form.reset(); // reset form
          onFormSubmit(); // close dialog
          return result?.message || "Email sent";
        },
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
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value?.join("\n") || ""}
                  onChange={(e) => {
                    const emails = e.target.value
                      .split("\n")
                      .filter((email) => email.trim() !== "");
                    field.onChange(emails);
                  }}
                  className="w-full border p-2"
                  rows={selectedEmails.length || 3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Enter subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <textarea className="w-full border p-2" rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Send</Button>
      </form>
    </Form>
  );
};

export default EmailEmployeesForm;
