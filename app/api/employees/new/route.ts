import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import sendEmail from "@/lib/send-email";

// Validation schema
const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["ADMIN", "MANAGER", "USER"]),
  email: z.string().email("Invalid email"),
  address: z.string().min(1, "Address is required"),
  dateOfBirth: z.string().transform((str) => new Date(str)),
  securityQuestions: z.array(
    z.object({
      answer: z.string(),
      questionId: z.string(),
    })
  ),
});

export async function POST(request: Request) {
  try {
    let {
      firstName,
      lastName,
      role,
      email,
      address,
      securityQuestions,
      dateOfBirth,
    } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email has already been used, please try another" },
        { status: 400 }
      );
    }

    const defaultPassword = await bcrypt.hash("defaultPassword123!", 10);

    const passwordExpirationDate = new Date();
    passwordExpirationDate.setDate(passwordExpirationDate.getDate() + 3);

    const username = `${firstName.slice(0, 1)}${lastName.toLowerCase()}${(
      new Date().getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}${new Date().getFullYear().toString().slice(-2)}`;

    const hiredByEmail = "ksuappdomainmanager@gmail.com";
    const hiredByUser = await prisma.user.findUnique({
      where: { email: hiredByEmail },
    });

    if (!hiredByUser) {
      return NextResponse.json(
        { message: "HiredBy user not found" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        role,
        email,
        address,
        dateOfBirth,
        username,
        isActive: true,
        password: defaultPassword,
        passwordExpiresAt: passwordExpirationDate,
        hiredById: hiredByUser.id,
      },
    });

    await prisma.passwordHistory.create({
      data: {
        userId: user.id,
        oldPassword: defaultPassword,
      },
    });

    await Promise.all(
      securityQuestions.map(
        async (question: { answer: string; questionId: string }) => {
          const hashedAnswer = await bcrypt.hash(
            question.answer.toLowerCase(),
            10
          );
          return prisma.userSecurityQuestion.create({
            data: {
              questionId: parseInt(question.questionId),
              answerHash: hashedAnswer,
              userId: user.id,
            },
          });
        }
      )
    );

    await sendEmail({
      to: user.email,
      subject: "Account Details",
      text: `Your username is ${user.username} and your password is: defaultPassword123!. Please reset your password within 3 days.`,
    });

    return NextResponse.json(
      {
        message: `Employee created, email sent to ${user.email} with their username and password`,
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
