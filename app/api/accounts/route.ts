import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const accounts = await prisma.account.findMany();

    if (!accounts) {
      return NextResponse.json({ error: "No accounts found" }, { status: 404 });
    }

    return NextResponse.json(accounts);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}
