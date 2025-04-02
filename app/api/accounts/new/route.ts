import { z } from "zod";
import { Category } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { generateAccountNumber, AccountCategory } from "@/lib/account-utils";

// Validation schema
const formSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .regex(/^\d+$/, "Account number must be numeric"),
  accountDescription: z.string().optional(),
  normalSide: z.enum(["Debit", "Credit"]),
  category: z.enum(["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"]),
  subcategory: z.enum([
    "CURRENT_ASSETS",
    "FIXED_ASSETS",
    "CURRENT_LIABILITIES",
    "LONG_TERM_LIABILITIES",
    "RETAINED_EARNINGS",
    "OPERATING_REVENUE",
    "OPERATING_EXPENSE",
  ]),
  initialBalance: z
    .number()
    .min(0, "Initial balance must be a positive number"),
  debit: z.number().min(0, "Debit must be a positive number"),
  credit: z.number().min(0, "Credit must be a positive number"),
  order: z.number().min(1, "Order must be a positive number"),
  statement: z.enum(["IS", "BS", "RE"]),
  comment: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    let {
      name,
      description,
      normalSide,
      categoryId,
      subcategoryId,
      initialBalance,
      orderId,
      statementId,
      comment,
      userId,
    } = await request.json();

    // Check for existing account with the same name
    const existingAccount = await prisma.account.findFirst({
      where: {
        name,
      },
    });

    if (existingAccount) {
      return NextResponse.json(
        { message: "Accounts cannot have the same name" },
        { status: 409 }
      );
    }

    // Fetch the category to determine the account number prefix
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    console.log(category.name);

    // Generate the account number
    const accountNumber = await generateAccountNumber(
      category.name as AccountCategory
    );

    console.log(accountNumber);

    // Create the new account with the initial balance
    const newAccount = await prisma.account.create({
      data: {
        name,
        number: accountNumber,
        description,
        normalSide,
        categoryId,
        subcategoryId,
        initialBalance,
        balance: initialBalance, // Set the balance to the initial balance
        orderId,
        statementId,
        comment,
        userId,
        totalDebits: normalSide === "Debit" ? initialBalance : 0,
        totalCredits: normalSide === "Credit" ? initialBalance : 0,
      },
    });

    console.log(newAccount);

    await prisma.eventLog.create({
      data: {
        eventType: "CREATE",
        tableName: "Account",
        recordId: newAccount.id,
        beforeState: Prisma.JsonNull, // No before state for creation
        afterState: newAccount, // After state is the newly created account
        userId,
      },
    });

    // If there's an initial balance, create a transaction to reflect it
    if (initialBalance > 0) {
      const transactionDescription = `Initial balance for ${newAccount.name}`;
      const transactionAmount = initialBalance;

      await prisma.transaction.create({
        data: {
          date: new Date(),
          description: transactionDescription,
          amount: transactionAmount,
          balance: initialBalance,
          accountId: newAccount.id,
          userId,
          type: normalSide === "Debit" ? "DEBIT" : "CREDIT",
        },
      });
    }

    // Fetch all transactions (optional, for debugging or response)
    const updatedTransactions = await prisma.transaction.findMany();

    return NextResponse.json(
      {
        message: `Account created`,
        account: newAccount,
        transactions: updatedTransactions,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Handle unique constraint violation
        return NextResponse.json(
          { message: "Account number or name already exists" },
          { status: 409 }
        );
      } else {
        // Handle other Prisma errors
        return NextResponse.json(
          { message: "Database error", error: error.message },
          { status: 400 }
        );
      }
    } else {
      // Handle generic errors
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { message: "An unexpected error occurred", error: errorMessage },
        { status: 500 }
      );
    }
  }
}
