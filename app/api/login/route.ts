import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import {
  expirePassword,
  getUserByUsername,
  handleFailedLoginAttempt,
  resetFailedLoginAttempts,
  suspendUser,
  unsuspendUser,
} from "@/lib/db";
import { NextResponse } from "next/server";
import getSuspensionMessage from "@/lib/get-suspension-message";

const MAX_FAILED_LOGIN_ATTEMPTS = 3;

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

    if (user.isSuspended && user.suspendedUntil) {
      const now = new Date();
      if (now < user.suspendedUntil) {
        return NextResponse.json(
          { message: getSuspensionMessage(user.suspendedUntil) },
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

      const jwt_secret = process.env.JWT_SECRET;
      if (!jwt_secret) {
        console.error("JWT_SECRET is not defined in the environment variables");
        return NextResponse.json(
          { message: "An unexpected error occurred, please try again later" },
          { status: 500 }
        );
      }

      const token = sign({ userId: user.id, role: user.role }, jwt_secret, {
        expiresIn: "1d",
      });

      return NextResponse.json({ token, role: user.role }, { status: 200 });
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
    console.error(error);
    return NextResponse.json(
      { message: "An unexpected error occurred, please try again later" },
      { status: 500 }
    );
  }
}
