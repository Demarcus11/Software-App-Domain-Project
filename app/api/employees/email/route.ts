import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import sendEmail from "@/lib/send-email";

const formSchema = z.object({
  to: z.array(z.string()).min(1, "Please enter at least one employee email"),
  subject: z.string().min(1, "Subject is required").optional(),
  body: z.string().min(1, "Body is required"),
});

export async function POST(request: Request) {
  try {
    let { to, subject, body } = await request.json();

    const validatedData = formSchema.parse({
      to,
      subject,
      body,
    });

    await sendEmail({
      to: validatedData.to,
      subject: validatedData.subject,
      text: validatedData.body,
    });

    return NextResponse.json(
      {
        message: "Email sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred, please try again later" },
      { status: 500 }
    );
  }
}
