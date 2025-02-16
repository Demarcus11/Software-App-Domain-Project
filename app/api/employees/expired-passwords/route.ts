import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();

    const usersWithExpiredPasswords = await prisma.user.findMany({
      where: {
        passwordExpiresAt: {
          lte: now,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        passwordExpiresAt: true,
      },
    });

    if (!usersWithExpiredPasswords) {
      return NextResponse.json(
        { error: "No users with expired passwords" },
        { status: 404 }
      );
    }

    return NextResponse.json(usersWithExpiredPasswords, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch expired passwords" },
      { status: 500 }
    );
  }
}
