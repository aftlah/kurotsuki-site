import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import {
  isSiteAdminFromRequest,
  isSomukanriAdministratorFromRequest,
} from "@/lib/auth-middleware";

const ADMIN_ONLY_PREFIXES = ["/dashboard/admin", "/dashboard/members"];
const ADMINISTRATOR_ONLY_PREFIXES = ["/dashboard/administrator"];

function matchesPathPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export default withAuth(
  async function middleware(request) {
    const { pathname } = request.nextUrl;

    if (ADMIN_ONLY_PREFIXES.some((prefix) => matchesPathPrefix(pathname, prefix))) {
      const allowed = await isSiteAdminFromRequest(request);
      if (!allowed) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    if (
      ADMINISTRATOR_ONLY_PREFIXES.some((prefix) => matchesPathPrefix(pathname, prefix))
    ) {
      const allowed = await isSomukanriAdministratorFromRequest(request);
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
