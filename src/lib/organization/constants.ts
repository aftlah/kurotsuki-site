export const SITE_ROLES = ["member", "admin"] as const;
export type SiteRole = (typeof SITE_ROLES)[number];

export const RANKS = [
  { slug: "oyabun", label: "Oyabun", level: 7 },
  { slug: "wakagashira", label: "Wakagashira", level: 6 },
  { slug: "kaicho", label: "Kaicho", level: 5 },
  { slug: "onnakashira", label: "Onnakashira", level: 4 },
  { slug: "taicho", label: "Taicho", level: 3 },
  { slug: "koseiin", label: "Koseiin", level: 2 },
  { slug: "shinjin", label: "Shinjin", level: 1 },
] as const;

export type Rank = (typeof RANKS)[number]["slug"];

export const JOB_TITLES = [
  { slug: "komon", label: "Komon" },
  { slug: "sodan", label: "Sodan" },
] as const;

export type JobTitle = (typeof JOB_TITLES)[number]["slug"];

export const DIVISIONS = [
  { slug: "kitsune_unit", label: "Kitsune Unit" },
  { slug: "mitsugyo", label: "Mitsugyo" },
  { slug: "somukanri", label: "Somukanri" },
  { slug: "ryutsutosei", label: "Ryutsutosei" },
  { slug: "geenbakodo", label: "Geenbakodo" },
  { slug: "kodosakusenbu", label: "Kodosakusenbu" },
] as const;

export type Division = (typeof DIVISIONS)[number]["slug"];

const RANK_MAP = Object.fromEntries(RANKS.map((r) => [r.slug, r])) as Record<
  Rank,
  (typeof RANKS)[number]
>;

const DIVISION_MAP = Object.fromEntries(
  DIVISIONS.map((d) => [d.slug, d])
) as Record<Division, (typeof DIVISIONS)[number]>;

const JOB_TITLE_MAP = Object.fromEntries(
  JOB_TITLES.map((j) => [j.slug, j])
) as Record<JobTitle, (typeof JOB_TITLES)[number]>;

export function getRankLevel(rank: Rank): number {
  return RANK_MAP[rank]?.level ?? 0;
}

export function isSiteAdmin(role: SiteRole): boolean {
  return role === "admin";
}

export function formatRankLabel(
  rank: Rank,
  jobTitle?: JobTitle | null
): string {
  const base = RANK_MAP[rank]?.label ?? rank;
  if (rank === "kaicho" && jobTitle) {
    return `${base} · ${JOB_TITLE_MAP[jobTitle]?.label ?? jobTitle}`;
  }
  return base;
}

export function formatDivisionLabel(division: Division | null): string {
  if (!division) return "Belum ditugaskan";
  return DIVISION_MAP[division]?.label ?? division;
}

export function isValidRank(value: string): value is Rank {
  return RANKS.some((r) => r.slug === value);
}

export function isValidDivision(value: string): value is Division {
  return DIVISIONS.some((d) => d.slug === value);
}

export function isValidJobTitle(value: string): value is JobTitle {
  return JOB_TITLES.some((j) => j.slug === value);
}

export function isValidSiteRole(value: string): value is SiteRole {
  return SITE_ROLES.includes(value as SiteRole);
}

export const DEFAULT_RANK: Rank = "shinjin";
export const DEFAULT_SITE_ROLE: SiteRole = "member";
