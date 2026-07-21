import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import {
  canAssignAdmin,
  canAssignRank,
  canManageMember,
  toOrgProfile,
} from "@/lib/organization/permissions";
import { getSessionOrgProfile } from "@/lib/session";
import {
  isValidDivision,
  isValidJobTitle,
  isValidRank,
  isValidSiteRole,
  type Division,
  type JobTitle,
  type Rank,
  type SiteRole,
} from "@/lib/organization/constants";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await getSessionOrgProfile();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "ID anggota tidak valid." }, { status: 400 });
  }

  try {
    const admin = createSupabaseAdmin();

    const { data: targetRow, error: fetchError } = await admin
      .from("profiles")
      .select("id, role, rank, job_title, division")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !targetRow) {
      return NextResponse.json(
        { error: "Anggota tidak ditemukan." },
        { status: 404 }
      );
    }

    const target = toOrgProfile({
      role: targetRow.role,
      rank: targetRow.rank,
      jobTitle: targetRow.job_title,
      division: targetRow.division,
    });

    if (!canManageMember(auth.profile, target)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const updates: Record<string, string | null> = {};

    if (body.rank !== undefined) {
      if (!isValidRank(String(body.rank))) {
        return NextResponse.json({ error: "Rank tidak valid." }, { status: 400 });
      }
      const nextRank = body.rank as Rank;
      if (!canAssignRank(auth.profile, nextRank)) {
        return NextResponse.json(
          { error: "Tidak dapat menetapkan rank di atas rank Anda." },
          { status: 403 }
        );
      }
      updates.rank = nextRank;
      if (nextRank !== "kaicho") {
        updates.job_title = null;
      }
    }

    if (body.job_title !== undefined) {
      const rank = (updates.rank ?? target.rank) as Rank;
      if (body.job_title === null || body.job_title === "") {
        updates.job_title = null;
      } else if (isValidJobTitle(String(body.job_title))) {
        if (rank !== "kaicho") {
          return NextResponse.json(
            { error: "Job title hanya untuk rank Kaicho." },
            { status: 400 }
          );
        }
        updates.job_title = body.job_title as JobTitle;
      } else {
        return NextResponse.json(
          { error: "Job title tidak valid." },
          { status: 400 }
        );
      }
    }

    if (body.division !== undefined) {
      if (body.division === null || body.division === "") {
        updates.division = null;
      } else if (isValidDivision(String(body.division))) {
        updates.division = body.division as Division;
      } else {
        return NextResponse.json(
          { error: "Divisi tidak valid." },
          { status: 400 }
        );
      }
    }

    if (body.role !== undefined) {
      if (!canAssignAdmin(auth.profile)) {
        return NextResponse.json(
          { error: "Hanya admin yang dapat mengubah role." },
          { status: 403 }
        );
      }
      if (!isValidSiteRole(String(body.role))) {
        return NextResponse.json({ error: "Role tidak valid." }, { status: 400 });
      }
      updates.role = body.role as SiteRole;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Tidak ada field yang diupdate." },
        { status: 400 }
      );
    }

    const { data, error } = await admin
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select(
        "id, username, display_name, rank, job_title, division, role"
      )
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ member: data });
  } catch (err) {
    console.error("Admin member PATCH error:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui anggota." },
      { status: 500 }
    );
  }
}
