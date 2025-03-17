import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();

    if (!categories) {
      return NextResponse.json(
        { error: "No categories found" },
        { status: 404 }
      );
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
