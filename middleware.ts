import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Routes that do NOT require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/apply", // /apply/[token] — public candidate form
];

// API routes that do NOT require authentication
const PUBLIC_API_ROUTES = [
  "/api/apply", // /api/apply/[token] — public form submission
  "/api/auth",  // Auth.js internal routes
];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow public pages
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow public API routes
  if (PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Not authenticated → redirect to login
  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);
    // Preserve the original destination so we can redirect back after sign-in
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Run middleware on all routes except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
