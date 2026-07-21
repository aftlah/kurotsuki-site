import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import { can } from "@/lib/organization/permissions";
import { getSessionOrgProfile } from "@/lib/session";
import {
  formatDivisionLabel,
  formatRankLabel,
} from "@/lib/organization/constants";

export async function GET() {
  const auth = await getSessionOrgProfile();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { profile } = auth;
  const viewAll = can(profile, "members.view_all");
  const viewDivision = can(profile, "members.view_division");

  if (!viewAll && !viewDivision) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const admin = createSupabaseAdmin();
    let query = admin
      .from("profiles")
      .select(
        "id, username, display_name, rank, job_title, division, role, is_online, created_at"
      )
      .order("rank", { ascending: false })
      .order("username", { ascending: true });

    if (!viewAll && viewDivision && profile.division) {
      query = query.eq("division", profile.division);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const members = (data ?? []).map((row) => ({
      id: row.id,
      username: row.username,
      displayName: row.display_name || row.username,
      rank: row.rank,
      rankLabel: formatRankLabel(row.rank, row.job_title),
      jobTitle: row.job_title,
      division: row.division,
      divisionLabel: formatDivisionLabel(row.division),
      role: row.role,
      isOnline: row.is_online,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ members });
  } catch (err) {
    console.error("Members API error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data anggota." },
      { status: 500 }
    );
  }
}
