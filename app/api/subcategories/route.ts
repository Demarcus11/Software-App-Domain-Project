import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const subcategories = await prisma.subcategory.findMany();

    if (!subcategories) {
      return NextResponse.json(
        { error: "No subcategories found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subcategories);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch subcategories" },
      { status: 500 }
    );
  }
}
