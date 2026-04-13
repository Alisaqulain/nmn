import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/jwt";
import { decodeJwtPayloadUnsafe } from "@/lib/jwt-edge";

const protectedMatchers = [
  /^\/dashboard(\/.*)?$/,
  /^\/profile$/,
  /^\/referrals$/,
  /^\/meetings$/,
  /^\/events$/,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedMatchers.some((re) => re.test(pathname));
  if (!isProtected) {
    return NextResponse.next();
  }
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  const payload = decodeJwtPayloadUnsafe(token);
  if (!payload?.sub) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }
  if (pathname.startsWith("/dashboard/admin") && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile", "/referrals", "/meetings", "/events"],
};
