import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const editEmployeeSchema = z.object({
  username: z.string().min(1, "Username is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.string(),
  email: z.string().min(1, "Email is Required").email("Invalid email"),
  address: z.string().min(1, "Address is required"),
  suspendedUntil: z.string().optional().nullable(),
  isActive: z.boolean(),
  hiredBy: z.string().optional().nullable(),
  dateOfHire: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const validatedData = editEmployeeSchema.parse(data);

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        username: validatedData.username,
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role as any,
        address: validatedData.address,
        dateOfBirth: validatedData.dateOfBirth,
        isActive: validatedData.isActive,
        isSuspended: !!validatedData.suspendedUntil,
        suspendedUntil: validatedData.suspendedUntil,
        dateOfHire: validatedData.dateOfHire,
      },
    });

    if (user.suspendedUntil && user.suspendedUntil > new Date()) {
      await prisma.user.update({
        where: { id: parseInt(id) },
        data: { isSuspended: true, isActive: false },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid data", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating employee:", error);
    return NextResponse.json(
      { message: "Error updating employee" },
      { status: 500 }
    );
  }
}
