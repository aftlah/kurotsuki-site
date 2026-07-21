import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toOrgProfile } from "@/lib/organization/permissions";

export async function getSessionOrgProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }
  return {
    session,
    profile: toOrgProfile(session.user),
  };
}
