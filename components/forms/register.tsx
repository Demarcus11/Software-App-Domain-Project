"use client";

import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PasswordInput from "@/components/password-input";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Roles } from "@/types/index";
import { SecurityQuestion } from "@/types";

interface SecurityQuestionsSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  securityQuestions: SecurityQuestion[];
  index: number;
}

interface RoleSelectProps {
  field: {
    value: string;
    onChange: (value: string) => void;
  };
}

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.string(),
  email: z
    .string()
    .min(1, "Email is Required")
    .email("Please enter a valid email"),
  address: z.string().min(1, "Address is required"),
  securityQuestions: z.array(
    z.object({
      questionId: z.string().min(1, "Security question is required"),
      answer: z.string().min(1, "Answer is required"),
    })
  ),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  profilePicture: z.instanceof(File),
});

const RegisterForm = () => {
  const [securityQuestions, setSecurityQuestions] = useState<
    SecurityQuestion[]
  >([]);
  const [roles, setRoles] = useState<Roles[]>([
    { id: 1, role: "USER" },
    { id: 2, role: "MANAGER" },
    { id: 3, role: "ADMIN" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

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
      role: "USER",
      email: "",
      address: "",
      securityQuestions: [
        { questionId: "", answer: "" },
        { questionId: "", answer: "" },
        { questionId: "", answer: "" },
      ],
      dateOfBirth: undefined,
      profilePicture: undefined,
    },
  });

  const registerAccount = async (
    data: z.infer<typeof formSchema> & { profilePictureUrl: string }
  ) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        form.setError("email", {
          type: "server",
          message: error.message,
        });
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      console.log(result);
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
      // Upload the profile picture to Cloudinary
      const formData = new FormData();
      formData.append("file", data.profilePicture);
      formData.append("upload_preset", "next_cloudinary_app");

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        const error = await cloudinaryResponse.json();
        console.error("Cloudinary Error:", error);
        throw new Error("Failed to upload profile picture");
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const profilePictureUrl = cloudinaryData.secure_url;

      // Add the profile picture URL to the form data
      const updatedData = {
        ...data,
        profilePictureUrl,
      };

      // Send the updated data to your backend
      toast.promise(registerAccount(updatedData), {
        loading: "Sending request to admin at ksuappdomainmanager@gmail.com...",
        success: (responseData) => responseData?.message,
        error: (err) => err.message,
        duration: 10000,
      });

      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload profile picture");
    }
  };

  const SecurityQuestionSection = ({
    form,
    securityQuestions,
    index,
  }: SecurityQuestionsSectionProps) => {
    return (
      <>
        <FormField
          control={form.control}
          name={`securityQuestions.${index}.questionId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`Security Question ${index + 1}`}</FormLabel>
              <FormControl>
                <Select
                  key={`security-question-${index}`}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a security question" />
                  </SelectTrigger>
                  <SelectContent>
                    {securityQuestions.map((question) => (
                      <SelectItem key={question.id} value={String(question.id)}>
                        {question.question}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`securityQuestions.${index}.answer`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`Answer for security question ${
                index + 1
              }`}</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </>
    );
  };

  const RoleSelect = ({ field }: RoleSelectProps) => {
    return (
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <SelectTrigger>
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.role}>
              {role.role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Register</CardTitle>
            <Button
              type="button"
              className="text-center text-sm underline text-primary hover:text-primary/90 hover:bg-transparent bg-transparent shadow-none"
              onClick={handleResetButtonClick}
            >
              Reset
            </Button>
          </div>
          <CardContent className="pt-4">
            <Form {...form}>
              <form
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
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={(date) => field.onChange(date)}
                            dateFormat="yyyy-MM-dd"
                            className="w-full px-3 py-1 text-base shadow-sm border-input border rounded-md bg-transparent"
                            showYearDropdown
                            yearDropdownItemNumber={100}
                            scrollableYearDropdown
                          />
                          <Calendar
                            className="absolute right-5 top-[7px]"
                            size={20}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`securityQuestions.0.questionId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{`Security Question 1`}</FormLabel>
                      <FormControl>
                        <Select
                          key={`security-question-1`}
                          onValueChange={field.onChange}
                          value={field.value}
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
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`securityQuestions.0.answer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{`Answer for security question 1`}</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`securityQuestions.1.questionId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{`Security Question 2`}</FormLabel>
                      <FormControl>
                        <Select
                          key={`security-question-2`}
                          onValueChange={field.onChange}
                          value={field.value}
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
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`securityQuestions.1.answer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{`Answer for security question 2`}</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`securityQuestions.2.questionId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{`Security Question 3`}</FormLabel>
                      <FormControl>
                        <Select
                          key={`security-question-3`}
                          onValueChange={field.onChange}
                          value={field.value}
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
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`securityQuestions.2.answer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{`Answer for security question 3`}</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* {[0, 1, 2].map((index) => (
                  <SecurityQuestionSection
                    key={`security-section-${index}`} // Stable key
                    form={form}
                    securityQuestions={securityQuestions}
                    index={index}
                  />
                ))} */}

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Select an account type</FormLabel>
                      <FormControl>
                        <RoleSelect field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
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

                {form.formState.errors.root && (
                  <div className="mt-2 text-destructive">
                    <FormMessage>
                      {form.formState.errors.root.message}
                    </FormMessage>
                  </div>
                )}

                <div className="grid gap-4">
                  <Button type="submit" className="w-full">
                    {isLoading
                      ? "Sending access request..."
                      : "Send access request"}
                  </Button>

                  <div className="flex items-center gap-2 justify-center">
                    <span>Already have an account? </span>
                    <Link
                      href="/login"
                      className="text-center underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
};

export default RegisterForm;
