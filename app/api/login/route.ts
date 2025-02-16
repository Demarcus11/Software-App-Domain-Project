import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { getUserByUsername } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user = await getUserByUsername(username);

    console.log(user);

    if (!user) {
      return NextResponse.json(
        { message: "Couldn't find your account, please try again" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // handle password limit logic
      return NextResponse.json(
        { message: "The password you entered is incorrect" },
        { status: 401 }
      );
    }

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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An unexpected error occurred, please try again later" },
      { status: 500 }
    );
  }
}
