import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    { path: "/admin", roles: ["ADMIN"] },
    { path: "/manager", roles: ["MANAGER"] },
    { path: "/user", roles: ["USER"] },
    { path: "/employees", roles: ["ADMIN"] },
    { path: "/employees/new", roles: ["ADMIN"] },
    { path: "/employees/expired-passwords", roles: ["ADMIN"] },
  ];

  // check if current route is protected
  const route = protectedRoutes.find((route) =>
    pathname.startsWith(route.path)
  );

  if (route) {
    // if route is protected, check if user is authenticated
    if (!token) {
      console.log("No token found");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // if user is authenticated, check if user has the correct role
    console.log(role);
    console.log(route.roles);
    if (!role || !route.roles.includes(role)) {
      console.log("User doesn't have the correct role");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/manager/:path*",
    "/user/:path*",
    "/employees/:path*",
  ],
};
