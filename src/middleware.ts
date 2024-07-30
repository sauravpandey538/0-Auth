import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Running");

  const session =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token");
  console.log("Session:", session);

  // unauthorized user
  if (
    pathname &&
    pathname !== "/signin" &&
    pathname !== "/signup" &&
    !session
  ) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  //authorized user
  if (
    (pathname === "/signin" ||
      pathname === "/signup" ||
      pathname.startsWith("/verify")) &&
    session
  ) {
    return NextResponse.redirect(new URL("/authorizedPage", request.url));
  }

  // exception case
  return NextResponse.next();
}
export const config = {
  matcher: ["/verify/:path*", "/signup", "/signin", "/authorizedPage", "/"],
};
