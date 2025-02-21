"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
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

type SecurityQuestion = {
  securityQuestion: {
    id: number;
    question: string;
  };
};

const answerSchema = z.object({
  questionId: z.number(),
  answer: z.string().min(1, "Answer is required"),
});

const formSchema = z.object({
  answers: z.array(answerSchema),
});

const SecurityQuestionsForm = () => {
  const [securityQuestions, setSecurityQuestions] = useState<
    SecurityQuestion[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    const fetchSecurityQuestions = async () => {
      if (!token) return;

      try {
        const response = await fetch(`/api/security-questions-auth/${token}`);

        if (!response.ok) {
          const error = await response.json();
          form.setError("root", {
            type: "server",
            message: error.error,
          });
          return;
        }

        const data = await response.json();
        setSecurityQuestions(data);

        form.reset({
          answers: data.map((question: SecurityQuestion) => ({
            questionId: question.securityQuestion.id,
            answer: "",
          })),
        });
      } catch (error) {
        form.setError("root", {
          type: "server",
          message: "An unexpected error occurred, please try again",
        });
      }
    };

    fetchSecurityQuestions();
  }, []);

  const validateAnswers = async (
    answers: z.infer<typeof formSchema>["answers"]
  ) => {
    try {
      const response = await fetch("/api/validate-security-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, answers }),
      });

      if (!response.ok) {
        const error = await response.json();
        form.setError("root", {
          type: "server",
          message: error.message,
        });
        return;
      }

      const data = await response.json();
      setIsLoading(false);

      router.push(`/reset-password/${token}`);
    } catch (error) {
      form.setError("root", {
        type: "server",
        message: "An unexpected error occurred, please try again later",
      });
    }
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    validateAnswers(data.answers);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Answer security questions</CardTitle>
        <CardContent className="pt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid gap-6"
              encType="multipart/form-data"
            >
              {securityQuestions.map((question, index) => (
                <div className="grid gap-2" key={question.securityQuestion?.id}>
                  <p>{`${index + 1}. ${
                    question.securityQuestion?.question
                  }`}</p>
                  <div>
                    <FormField
                      control={form.control}
                      name={`answers.${index}.answer`}
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormControl>
                            <PasswordInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <input
                      type="hidden"
                      {...form.register(`answers.${index}.questionId`)}
                      value={question.securityQuestion?.id}
                    />
                  </div>
                </div>
              ))}

              {form.formState.errors.root && (
                <div className="mt-2 text-destructive">
                  <FormMessage>
                    {form.formState.errors.root.message}
                  </FormMessage>
                </div>
              )}

              <Button type="submit" className="w-full">
                {isLoading ? "Continue" : "Verifying answers..."}
              </Button>
            </form>
          </Form>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default SecurityQuestionsForm;
