import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  // const username = url.searchParams.get("username");

  const username = request.cookies.has("username");

  if (!username && !url.pathname.startsWith("/join")) {
    url.pathname = "/join";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/authorize")) {
    const username = url.searchParams.get("username");
    if (!username) {
      url.pathname = "/join";
      return NextResponse.redirect(url);
    }
    const response = NextResponse.next();
    response.cookies.set("username", username, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    });
    return response
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|images).*)"],
};
