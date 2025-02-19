import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized, no token" },
      { status: 401 }
    );
  }

  try {
    const jwt_secret = process.env.JWT_SECRET;
    if (!jwt_secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(jwt_secret)
    );

    const response = NextResponse.next();

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Unauthorized, invalid token" },
      { status: 401 }
    );
  }
}

// the middleware will only be applied to the routes that match the following configuration
export const config = {
  matcher: [
    "/admin/:path*",
    "/manager/:path*",
    "/user/:path*",
    "/employees/:path*",
  ],
};

// export const config = {
//   matcher: ["/admin/:path*", "/manager/:path*", "/user/:path*"],
// };
