import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const employees = await prisma.user.findMany({
      include: {
        hiredBy: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!employees) {
      return NextResponse.json(
        { error: "No employees found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employees);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}
