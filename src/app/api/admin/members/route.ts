import { NextResponse } from "next/server";
import { createMemberByAdmin } from "@/lib/admin-members";
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

export async function POST(request: Request) {
  const auth = await getSessionOrgProfile();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canManageMember(auth.profile, toOrgProfile({ role: "member", rank: "shinjin" }))) {
    return NextResponse.json(
      { error: "Hanya admin yang dapat menambah anggota." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const username = String(body.username ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const rank = (body.rank ?? "shinjin") as Rank;
    const role = (body.role ?? "member") as SiteRole;
    const division =
      body.division === null || body.division === ""
        ? null
        : (body.division as Division);
    const jobTitle =
      body.job_title === null || body.job_title === ""
        ? null
        : (body.job_title as JobTitle);

    if (!isValidRank(rank)) {
      return NextResponse.json({ error: "Rank tidak valid." }, { status: 400 });
    }
    if (!canAssignRank(auth.profile, rank)) {
      return NextResponse.json(
        { error: "Tidak dapat menetapkan rank di atas rank Anda." },
        { status: 403 }
      );
    }
    if (role === "admin" && !canAssignAdmin(auth.profile)) {
      return NextResponse.json(
        { error: "Hanya admin yang dapat membuat akun admin." },
        { status: 403 }
      );
    }
    if (!isValidSiteRole(role)) {
      return NextResponse.json({ error: "Role tidak valid." }, { status: 400 });
    }
    if (division && !isValidDivision(division)) {
      return NextResponse.json({ error: "Divisi tidak valid." }, { status: 400 });
    }
    if (jobTitle && !isValidJobTitle(jobTitle)) {
      return NextResponse.json({ error: "Job title tidak valid." }, { status: 400 });
    }
    if (rank !== "kaicho" && jobTitle) {
      return NextResponse.json(
        { error: "Job title hanya untuk rank Kaicho." },
        { status: 400 }
      );
    }

    const { member, error } = await createMemberByAdmin({
      username,
      email,
      password,
      rank,
      role,
      division,
      jobTitle: rank === "kaicho" ? jobTitle : null,
    });

    if (error || !member) {
      const status = error?.includes("sudah digunakan") ? 409 : 400;
      return NextResponse.json({ error: error ?? "Gagal menambah anggota." }, { status });
    }

    return NextResponse.json({ member }, { status: 201 });
  } catch (err) {
    console.error("Admin member POST error:", err);
    return NextResponse.json(
      { error: "Gagal menambah anggota." },
      { status: 500 }
    );
  }
}
