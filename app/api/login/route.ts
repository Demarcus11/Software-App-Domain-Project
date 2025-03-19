import bcrypt from "bcryptjs";
import {
  expirePassword,
  getUserByUsername,
  handleFailedLoginAttempt,
  resetFailedLoginAttempts,
  suspendUser,
  unsuspendUser,
  createNotification,
} from "@/lib/db";
import { NextResponse } from "next/server";
import getSuspensionMessage from "@/lib/get-suspension-message";
import generateToken from "@/lib/generate-token";

const MAX_FAILED_LOGIN_ATTEMPTS = 3;

const getRedirectionPath = (role: string): string => {
  switch (role.toLowerCase()) {
    case "admin":
      return "/admin";
    case "manager":
      return "/manager";
    case "user":
      return "/user";
    default:
      return "/";
  }
};

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user = await getUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        { message: "Couldn't find your account, please try again" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: "Your account is inactive" },
        { status: 401 }
      );
    }

    if (user.lastPasswordChangeAt > new Date()) {
      await expirePassword(user.id);
      return NextResponse.json(
        { message: "Your password has expired, please reset it" },
        { status: 401 }
      );
    }

    if (user.isSuspended && user.suspensionEnd) {
      const now = new Date();
      if (now < user.suspensionEnd) {
        return NextResponse.json(
          { message: getSuspensionMessage(user.suspensionEnd) },
          { status: 401 }
        );
      } else {
        await unsuspendUser(user.id);
        await resetFailedLoginAttempts(user.id);
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      await resetFailedLoginAttempts(user.id);

      // Check if the password is about to expire (within 3 days)
      const passwordExpiresAt = new Date(user.passwordExpiresAt);
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      if (
        passwordExpiresAt <= threeDaysFromNow &&
        passwordExpiresAt >= new Date()
      ) {
        // Create a notification for the user
        await createNotification({
          userId: user.id,
          message: `Your password will expire in 3 days. Please reset your password.`,
        });
      }

      const jwt_secret = process.env.JWT_SECRET;
      if (!jwt_secret) {
        throw new Error("JWT_SECRET is not defined");
      }

      const tokenResponse = await generateToken(user.id);

      return NextResponse.json(
        { message: "Login successful", role: user.role },
        { status: 200, headers: tokenResponse.headers }
      );
    } else {
      const updatedUser = await handleFailedLoginAttempt(user.id);

      if (updatedUser.failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
        const suspensionEnd = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
        await suspendUser(user.id, suspensionEnd);
        return NextResponse.json(
          { message: getSuspensionMessage(suspensionEnd) },
          { status: 401 }
        );
      }

      const remainingAttempts =
        MAX_FAILED_LOGIN_ATTEMPTS - updatedUser.failedLoginAttempts;
      return NextResponse.json(
        {
          message: `Incorrect password, you have ${remainingAttempts} attempt${
            remainingAttempts === 1 ? "" : "s"
          } remaining`,
        },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred, please try again later" },
      { status: 500 }
    );
  }
}
