import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

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

type AccountCategory = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";

const generateAccountNumber = async (category: AccountCategory) => {
  const prefixes = {
    ASSET: "1000",
    LIABILITY: "2000",
    EQUITY: "3000",
    REVENUE: "4000",
    EXPENSE: "5000",
  };

  const prefix = prefixes[category] || "0000";
  const lastAccountNumber = await prisma.account.findFirst({
    orderBy: { accountNumber: "desc" },
    where: { accountNumber: { startsWith: prefix } },
  });

  // If no accounts exist for this category, start with the prefix + "0001"
  const nextNumber = lastAccountNumber
    ? String(Number(lastAccountNumber.accountNumber) + 1).padStart(4, "0")
    : `${prefix}0001`;

  return nextNumber;
};

export async function POST(request: Request) {
  try {
    let {
      accountName,
      accountDescription,
      normalSide,
      category,
      subcategory,
      initialBalance,
      debit,
      credit,
      order,
      statement,
      comment,
      userId,
    } = await request.json();

    const generatedAccountNumber = await generateAccountNumber(category);
    console.log("Generated Account Number:", generatedAccountNumber);

    const existingAccount = await prisma.account.findUnique({
      where: { accountNumber: generatedAccountNumber },
    });

    if (existingAccount) {
      return NextResponse.json(
        { message: "Account number already exists" },
        { status: 409 }
      );
    }

    const account = await prisma.account.create({
      data: {
        accountName,
        accountDescription,
        accountNumber: generatedAccountNumber,
        normalSide,
        category,
        subcategory,
        initialBalance,
        debit,
        credit,
        order,
        statement,
        comment,
        balance: initialBalance,
        userId,
        createdAt: new Date(),
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        message: `Account created`,
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
