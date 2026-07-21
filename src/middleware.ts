import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isSiteAdminFromRequest } from "@/lib/auth-middleware";

const ADMIN_ONLY_PREFIXES = ["/dashboard/admin", "/dashboard/members"];

export default withAuth(
  async function middleware(request) {
    const { pathname } = request.nextUrl;

    if (ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      const allowed = await isSiteAdminFromRequest(request);
      if (!allowed) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
