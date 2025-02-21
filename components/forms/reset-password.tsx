"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/password-input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^[A-Za-z]/, {
      message: "Password must start with a letter",
    })
    .regex(/[A-Za-z]/, {
      message: "Password must contain at least one letter",
    })
    .regex(/\d/, {
      message: "Password must contain at least one number",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

const ResetPasswordForm = () => {
  const params = useParams();
  const token = params.token;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const resetPassword = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch(`/api/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        form.setError("root", {
          type: "server",
          message: error.message,
        });
        return;
      }

      form.reset();
      const result = await res.json();
      return result;
    } catch (err) {
      form.setError("root", {
        type: "server",
        message: "An unexpected error occurred, please try again",
      });
      return;
    }
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const result = await resetPassword(data);
      setIsLoading(false);
      if (!result.error) {
        toast.success("Password reset successfully");
        router.push("/login");
      }
    } catch (error) {}
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardContent className="pt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid"
              encType="multipart/form-data"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>New password</Label>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="mt-2 text-destructive">
                  <FormMessage>
                    {form.formState.errors.root.message}
                  </FormMessage>
                </div>
              )}

              <div className="text-center grid gap-4">
                <Button
                  className="w-full mt-6"
                  onClick={() => form.formState.errors}
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>

                <Link
                  href="/login"
                  className="text-center underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                >
                  Go to login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default ResetPasswordForm;
