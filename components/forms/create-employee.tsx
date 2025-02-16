"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRef } from "react";

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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Roles } from "@/types/index";
import { useState, useEffect } from "react";
import { SecurityQuestion } from "@/types";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.string(),
  email: z.string().min(1, "Email is Required").email("Invalid email"),
  address: z.string().min(1, "Address is required"),
  suspendedUntil: z.string().optional(),
  isActive: z.boolean(),
  hiredBy: z.string().optional(),
  dateOfHire: z.string().optional(),
  profilePictureUrl: z.union([z.string(), z.instanceof(File)]).optional(),
  securityQuestions: z
    .array(
      z.object({
        questionId: z.string(),
        answer: z.string(),
      })
    )
    .optional(),
  dateOfBirth: z.string().optional(),
});

const EditEmployeeForm = ({ employee }) => {
  const [securityQuestions, setSecurityQuestions] = useState<
    SecurityQuestion[]
  >([]);
  const [roles, setRoles] = useState<Roles[]>([
    { id: 1, role: "USER" },
    { id: 2, role: "MANAGER" },
    { id: 3, role: "ADMIN" },
  ]);

  useEffect(() => {
    const fetchSecurityQuestions = async () => {
      try {
        const response = await fetch("/api/security-questions");

        if (!response.ok) {
          const error = await response.json();
          console.error(error);
          return;
        }

        const data = await response.json();
        setSecurityQuestions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSecurityQuestions();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      role: "",
      email: "",
      address: "",
      suspendedUntil: "",
      isActive: false,
      hiredBy: "",
      dateOfHire: "",
      profilePictureUrl: "",
      username: "",
      securityQuestions: [
        { questionId: "", answer: "" },
        { questionId: "", answer: "" },
        { questionId: "", answer: "" },
      ],
      dateOfBirth: "",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
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

        <FormField
          control={form.control}
          name="profilePictureUrl"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem className="grid gap-2">
              <FormLabel className="-mb-2">
                Profile picture URL (optional)
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {[0, 1, 2].map((index) => (
          <div key={index}>
            <FormField
              control={form.control}
              name={`securityQuestions.${index}.questionId`}
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel className="text-xs font-medium -mb-2">
                    {`Security Question ${index + 1}`}
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a security question" />
                      </SelectTrigger>
                      <SelectContent>
                        {securityQuestions.map((question) => (
                          <SelectItem
                            key={question.id}
                            value={String(question.id)}
                          >
                            {question.question}
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
              name={`securityQuestions.${index}.answer`}
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel className="text-xs font-medium -mb-2 mt-4">
                    {`Answer for Question ${index + 1}`}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <AlertDialog>
          <AlertDialogTrigger className="bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2">
            Submit
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm changes?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to confirm the changes?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => formRef.current?.requestSubmit()}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
};

export default EditEmployeeForm;
