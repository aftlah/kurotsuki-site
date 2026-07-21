import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { can, toOrgProfile } from "@/lib/organization/permissions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const profile = toOrgProfile(session.user);

  if (!can(profile, "admin.access")) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
