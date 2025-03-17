import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const account = await prisma.account.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;

  try {
    const account = await prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (account.balance !== 0) {
      return NextResponse.json(
        { error: "Account balance must be zero to deactivate" },
        { status: 400 }
      );
    }

    await prisma.account.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({ message: "Account deactivated", success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to deactivate account" },
      { status: 500 }
    );
  }
}
