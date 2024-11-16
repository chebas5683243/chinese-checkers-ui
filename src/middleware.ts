import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { v4 as uuidv4 } from "uuid";

const USER_ID_COOKIE = "user-id";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const userId = request.cookies.get(USER_ID_COOKIE);

  if (!userId) {
    response.cookies.set({
      name: "user-id",
      value: uuidv4(),
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
