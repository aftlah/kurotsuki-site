import {
  getRankLevel,
  isSiteAdmin,
  type Division,
  type JobTitle,
  type Rank,
  type SiteRole,
} from "./constants";

/**
 * Keep in sync with public.current_user_has_permission() in
 * supabase/migrations/002_organization_ranks.sql
 */
export const PERMISSIONS = [
  "admin.access",
  "members.view_all",
  "members.view_division",
  "members.manage",
  "members.intake",
  "announcements.manage",
  "shop.manage",
  "attendance.manage",
  "attendance.manage_division",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export type OrgProfile = {
  role: SiteRole;
  rank: Rank;
  jobTitle?: JobTitle | null;
  division?: Division | null;
};

/** Taicho divisi Somukanri — akses panel administrator (pendataan, dll.) */
export function isSomukanriAdministrator(user: OrgProfile): boolean {
  if (isSiteAdmin(user.role)) {
    return true;
  }
  return user.rank === "taicho" && user.division === "somukanri";
}

export function can(user: OrgProfile, permission: Permission): boolean {
  if (isSiteAdmin(user.role)) {
    return true;
  }

  const rankLevel = getRankLevel(user.rank);

  switch (permission) {
    case "admin.access":
      return (
        ["kaicho", "onnakashira", "taicho"].includes(user.rank) &&
        user.division != null
      );

    case "members.view_all":
      return ["oyabun", "wakagashira", "kaicho", "onnakashira"].includes(
        user.rank
      );

    case "members.view_division":
      return user.division != null;

    case "members.manage":
      return false;

    case "members.intake":
      return isSomukanriAdministrator(user);

    case "announcements.manage":
      return (
        user.division === "somukanri" &&
        rankLevel >= getRankLevel("koseiin")
      );

    case "shop.manage":
      return false;

    case "attendance.manage":
      return (
        user.division === "somukanri" &&
        rankLevel >= getRankLevel("koseiin")
      );

    case "attendance.manage_division":
      return user.division != null && rankLevel >= getRankLevel("taicho");

    default:
      return false;
  }
}

export function canManageMember(actor: OrgProfile, _target: OrgProfile): boolean {
  if (isSiteAdmin(actor.role)) {
    return true;
  }
  return false;
}

export function canAssignAdmin(actor: OrgProfile): boolean {
  return isSiteAdmin(actor.role);
}

export function canAssignRank(actor: OrgProfile, targetRank: Rank): boolean {
  if (isSiteAdmin(actor.role)) {
    return true;
  }
  return getRankLevel(targetRank) <= getRankLevel(actor.rank);
}

export function toOrgProfile(user: {
  role?: string | null;
  rank?: string | null;
  jobTitle?: string | null;
  division?: string | null;
}): OrgProfile {
  return {
    role: (user.role === "admin" ? "admin" : "member") as SiteRole,
    rank: (user.rank ?? "shinjin") as Rank,
    jobTitle: (user.jobTitle ?? null) as JobTitle | null,
    division: (user.division ?? null) as Division | null,
  };
}
