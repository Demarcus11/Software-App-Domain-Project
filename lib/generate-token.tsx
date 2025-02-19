import { SignJWT } from "jose";
import { NextResponse } from "next/server";

async function generateToken(userId: number) {
  const jwt_secret = process.env.JWT_SECRET;

  if (!jwt_secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(new TextEncoder().encode(jwt_secret));

  const response = NextResponse.json("Token generated");

  response.cookies.set("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 1 day
  });

  return response;
}

export default generateToken;
