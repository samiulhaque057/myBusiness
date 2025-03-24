import { NextResponse } from "next/server";

export function middleware(request) {
  const accessToken = request.cookies.get("accessToken");

  const { pathname } = request.nextUrl;

  if (pathname === "/login" && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (!accessToken && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Define which routes the middleware should apply to
export const config = {
  matcher: [
    "/((?!api|_next/static|favicon.ico).*)", // Apply to all routes except API routes, static files, and /login
  ],
};
