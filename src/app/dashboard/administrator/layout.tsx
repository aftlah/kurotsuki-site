import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  isSomukanriAdministrator,
  toOrgProfile,
} from "@/lib/organization/permissions";

export default async function AdministratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const profile = toOrgProfile(session.user);

  if (!isSomukanriAdministrator(profile)) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
