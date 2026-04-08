import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/services/auth"

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const session = await auth();

  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
