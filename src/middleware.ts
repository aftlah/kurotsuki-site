import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { hasPermissionFromRequest } from "@/lib/auth-middleware";

export default withAuth(
  async function middleware(request) {
    if (request.nextUrl.pathname.startsWith("/dashboard/admin")) {
      const allowed = await hasPermissionFromRequest(request, "admin.access");
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
