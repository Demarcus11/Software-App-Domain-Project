import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Validation schema
const resetPasswordSchema = z.object({});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    let { password } = await request.json();

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const previousPasswords = await prisma.passwordHistory.findMany({
      where: { userId: user.id },
    });

    const passwordMatches = await Promise.all(
      previousPasswords.map((entry) =>
        bcrypt.compare(password, entry.oldPassword)
      )
    );

    if (passwordMatches.includes(true)) {
      return NextResponse.json(
        { message: "Previous passwords cannot be used again", error: true },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      // Update user's password and related fields
      await tx.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetTokenExpiry: null,
          lastPasswordChangeAt: new Date(),
          passwordExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          isActive: true,
        },
      });

      // Add the new password to the password history
      await tx.passwordHistory.create({
        data: {
          userId: user.id,
          oldPassword: hashedPassword,
        },
      });

      // Clear the password expiration notification
      await tx.notification.deleteMany({
        where: {
          userId: user.id,
          message: {
            contains: "Your password will expire in 3 days",
          },
        },
      });
    });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred, please try again later" },
      { status: 500 }
    );
  }
}
