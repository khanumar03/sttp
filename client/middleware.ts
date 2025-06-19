import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  const username = request.cookies.get('username')
  
  if(!username) {
    url.pathname = '/join'
    return NextResponse.redirect(url)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|images|join).*)"],
};
