import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { isSiteAdmin } from "@/lib/organization/constants";
import {
  can,
  isSomukanriAdministrator,
  toOrgProfile,
} from "@/lib/organization/permissions";

export async function getOrgProfileFromRequest(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return null;
  }

  return toOrgProfile({
    role: token.role as string,
    rank: token.rank as string,
    jobTitle: token.jobTitle as string | null,
    division: token.division as string | null,
  });
}

export async function isSiteAdminFromRequest(
  request: NextRequest
): Promise<boolean> {
  const profile = await getOrgProfileFromRequest(request);
  if (!profile) {
    return false;
  }
  return isSiteAdmin(profile.role);
}

export async function hasPermissionFromRequest(
  request: NextRequest,
  permission: Parameters<typeof can>[1]
): Promise<boolean> {
  const profile = await getOrgProfileFromRequest(request);
  if (!profile) {
    return false;
  }
  return can(profile, permission);
}

export async function isSomukanriAdministratorFromRequest(
  request: NextRequest
): Promise<boolean> {
  const profile = await getOrgProfileFromRequest(request);
  if (!profile) {
    return false;
  }
  return isSomukanriAdministrator(profile);
}
