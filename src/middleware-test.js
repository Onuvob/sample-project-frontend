// try this when in production

import { NextResponse } from "next/server";

export function middleware(req) {
  // You can use cookies instead of localStorage (better for SSR)
  const token = req.cookies.get("accessToken")?.value;
  console.log("Middleware check, token:", token);

  // List of protected routes
  const protectedPaths = ["/dashboard", "/profile", "/organizations"];

  if (!token && protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/dashboard/:path*", "/profile/:path*", "/organizations/:path*"], // protect these routes
// };
