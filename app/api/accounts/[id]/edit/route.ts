import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateAccountNumber, AccountCategory } from "@/lib/account-utils";

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
    const {
      id,
      name,
      description,
      normalSide,
      categoryId,
      subcategoryId,
      orderId,
      statementId,
      comment,
      isActive,
      balance,
      userId,
    } = await request.json();

    // Step 1: Check if the account exists
    const existingAccount = await prisma.account.findUnique({
      where: { id },
    });

    if (!existingAccount) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );
    }

    // Step 2: Validate balance before deactivation
    if (isActive === false && existingAccount.balance !== 0) {
      return NextResponse.json(
        { message: "Account balance must be zero to deactivate" },
        { status: 400 }
      );
    }

    // Step 3: Check for duplicate account names
    const existingAccountWithSameName = await prisma.account.findFirst({
      where: {
        name,
        NOT: { id }, // Exclude the current account from the check
      },
    });

    if (existingAccountWithSameName) {
      return NextResponse.json(
        { message: "Accounts cannot have the same name" },
        { status: 409 }
      );
    }

    // Step 4: Generate a new account number if the category changes
    let accountNumber = existingAccount.number;
    if (categoryId !== existingAccount.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        );
      }

      accountNumber = await generateAccountNumber(
        category.name as AccountCategory
      );
    }

    // Step 5: Update the account
    const updatedAccount = await prisma.account.update({
      where: { id },
      data: {
        name,
        number: accountNumber,
        description,
        normalSide,
        categoryId,
        subcategoryId,
        balance,
        orderId,
        statementId,
        comment,
        isActive,
      },
    });

    await prisma.eventLog.create({
      data: {
        eventType: "UPDATE",
        tableName: "Account",
        recordId: updatedAccount.id,
        beforeState: existingAccount, // Before state is the old account data
        afterState: updatedAccount, // After state is the updated account data
        userId,
      },
    });

    return NextResponse.json(
      { message: "Account updated", account: updatedAccount },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `An unexpected error occurred: ${error}` },
      { status: 500 }
    );
  }
}
