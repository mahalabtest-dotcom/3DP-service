import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = request.cookies.get("admin-session")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  const authenticated = Boolean(adminPassword && session === adminPassword);

  // Authenticated admin visiting login → send to dashboard
  if (authenticated && pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Unauthenticated visitor on any protected admin route → send to login
  if (!authenticated && pathname.startsWith("/admin") && pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/admin/:path*"],
};
