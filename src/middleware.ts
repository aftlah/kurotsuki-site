import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isSiteAdminFromRequest,
  isSomukanriAdministratorFromRequest,
} from "@/lib/auth-middleware";
import { ACCOUNT_DELETED_ERROR } from "@/lib/auth-errors";

const ADMIN_ONLY_PREFIXES = [
  "/dashboard/admin",
  "/dashboard/members",
  "/dashboard/acc",
];
const ADMINISTRATOR_ONLY_PREFIXES = ["/dashboard/administrator"];
const PENDING_PATH = "/dashboard/pending";

function matchesPathPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function clearAuthCookies(response: NextResponse, request: NextRequest) {
  for (const cookie of request.cookies.getAll()) {
    const name = cookie.name;
    if (
      name.includes("next-auth") ||
      name.includes("authjs") ||
      name.startsWith("__Secure-next-auth") ||
      name.startsWith("__Host-next-auth")
    ) {
      response.cookies.set(name, "", {
        expires: new Date(0),
        path: "/",
      });
    }
  }
  return response;
}

export default withAuth(
  async function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.nextauth.token;

    if (token?.error === ACCOUNT_DELETED_ERROR) {
      const response = NextResponse.redirect(
        new URL("/login?error=account_deleted", request.url)
      );
      return clearAuthCookies(response, request);
    }

    const membershipStatus =
      (token?.membershipStatus as string | undefined) ?? "approved";
    const isPending = membershipStatus === "pending";

    if (isPending) {
      if (!matchesPathPrefix(pathname, PENDING_PATH)) {
        return NextResponse.redirect(new URL(PENDING_PATH, request.url));
      }
      return NextResponse.next();
    }

    if (matchesPathPrefix(pathname, PENDING_PATH)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

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
