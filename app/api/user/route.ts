import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("jwt")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized, no token" },
      { status: 401 }
    );
  }

  const jwt_secret = process.env.JWT_SECRET;
  if (!jwt_secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(jwt_secret)
  );

  const userId = (payload as { userId: string }).userId;

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(userId),
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
