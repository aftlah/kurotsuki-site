import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isSiteAdmin } from "@/lib/organization/constants";
import { toOrgProfile } from "@/lib/organization/permissions";

export default async function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const profile = toOrgProfile(session.user);

  if (!isSiteAdmin(profile.role)) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
