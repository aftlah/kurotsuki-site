import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import { getSessionOrgProfile } from "@/lib/session";
import {
  DIVISIONS,
  RANKS,
  formatDivisionLabel,
  formatRankLabel,
  getRankLevel,
  type Division,
  type Rank,
} from "@/lib/organization/constants";

export async function GET() {
  const auth = await getSessionOrgProfile();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = createSupabaseAdmin();
    const { data, error } = await admin
      .from("profiles")
      .select("id, username, display_name, rank, job_title, division, is_online")
      .order("username", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const members = (data ?? [])
      .map((row) => ({
        id: row.id,
        username: row.username,
        displayName: row.display_name || row.username,
        rank: row.rank as Rank,
        rankLabel: formatRankLabel(row.rank, row.job_title),
        jobTitle: row.job_title,
        division: row.division as Division | null,
        divisionLabel: formatDivisionLabel(row.division),
        isOnline: row.is_online,
      }))
      .sort((a, b) => getRankLevel(b.rank) - getRankLevel(a.rank));

    const byRank = Object.fromEntries(
      RANKS.map((rank) => [
        rank.slug,
        members.filter((m) => m.rank === rank.slug),
      ])
    ) as Record<Rank, typeof members>;

    const byDivision = Object.fromEntries(
      DIVISIONS.map((division) => [
        division.slug,
        members.filter((m) => m.division === division.slug),
      ])
    ) as Record<Division, typeof members>;

    const unassigned = members.filter((m) => !m.division);

    return NextResponse.json({
      members,
      byRank,
      byDivision,
      unassigned,
      total: members.length,
    });
  } catch (err) {
    console.error("Hierarchy API error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil hirarki anggota." },
      { status: 500 }
    );
  }
}
