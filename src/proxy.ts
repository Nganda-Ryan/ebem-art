import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/**
 * Proxy (formerly middleware) that protects /admin/* and /artiste/* routes.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/admin") &&
    !pathname.includes("/admin/login")
  ) {
    const session = await getSession();

    if (!session || session.user.role !== "admin") {
      const loginUrl = new URL("/connexion", request.url);
      loginUrl.searchParams.set("espace", "admin");
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/artiste")) {
    const session = await getSession();

    if (!session) {
      const loginUrl = new URL("/connexion", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/artiste/:path*"],
};
