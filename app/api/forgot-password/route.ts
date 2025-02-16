import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { z } from "zod";

// Validation schema
const registerSchema = z.object({});

export async function POST(request: Request) {
  try {
    let { username, email } = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        username,
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Couldn't find your account, please try again" },
        { status: 400 }
      );
    }

    // remove any existing password reset tokens
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
    });

    const passwordResetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetTokenExpiry = new Date(Date.now() + 1000 * 60 * 10); // expires in 10 mins

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordResetToken,
        passwordResetTokenExpiry,
      },
    });

    return NextResponse.json({ passwordResetToken });
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred, please try again later" },
      { status: 500 }
    );
  }
}
