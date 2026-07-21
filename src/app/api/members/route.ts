import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import { isSiteAdmin } from "@/lib/organization/constants";
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

  if (!isSiteAdmin(auth.profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const admin = createSupabaseAdmin();
    const { data, error } = await admin
      .from("profiles")
      .select(
        "id, username, display_name, rank, job_title, division, role, is_online, created_at"
      )
      .order("rank", { ascending: false })
      .order("username", { ascending: true });

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
