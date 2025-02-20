import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken")?.value;
  const dataUser = request.cookies.get("dataUser")?.value;
  const parsedData = dataUser ? JSON.parse(dataUser) : null;

  // Restrict access to /dashboard if token is empty
  if (!token && (pathname.includes("/health-care") || pathname.includes("/facility") || pathname.includes("/jobs") || pathname.includes("/dashboard"))) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect to login page
  }

  // Prevent logged-in users from accessing auth pages or root
  if (token && (pathname.startsWith("/auth") || pathname === "/")) {
    return NextResponse.redirect(
      new URL(
       "/dashboard",
        request.url
      )
    );
  }

  // Allow other requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/facility", 
    "/health-care",
    "/dashboard",
  ],
};
