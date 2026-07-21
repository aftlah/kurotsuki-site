import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import { signInWithEmail } from "@/lib/supabase-auth";
import { getSessionOrgProfile } from "@/lib/session";
import {
  formatDivisionLabel,
  formatRankLabel,
  type Division,
  type JobTitle,
  type Rank,
} from "@/lib/organization/constants";
import {
  validateAvatarUrl,
  validateDisplayName,
  validatePasswordChange,
  validateUsername,
  type ProfileRecord,
} from "@/lib/profile";

function mapProfileRow(
  row: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    rank: string;
    job_title: string | null;
    division: string | null;
    role: string;
    discord_id: string | null;
    vitality_points: number;
    streak: number;
    focus_hours: number;
    created_at: string;
    updated_at: string;
  },
  email: string
): ProfileRecord {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    email,
    avatarUrl: row.avatar_url,
    rank: row.rank,
    jobTitle: row.job_title,
    division: row.division,
    role: row.role,
    discordId: row.discord_id,
    vitalityPoints: row.vitality_points,
    streak: row.streak,
    focusHours: Number(row.focus_hours),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET() {
  const auth = await getSessionOrgProfile();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = createSupabaseAdmin();
    const userId = auth.session.user.id;

    const [{ data: row, error }, { data: authUser }] = await Promise.all([
      admin
        .from("profiles")
        .select(
          "id, username, display_name, avatar_url, rank, job_title, division, role, discord_id, vitality_points, streak, focus_hours, created_at, updated_at"
        )
        .eq("id", userId)
        .maybeSingle(),
      admin.auth.admin.getUserById(userId),
    ]);

    if (error || !row) {
      return NextResponse.json(
        { error: "Profil tidak ditemukan." },
        { status: 404 }
      );
    }

    const profile = mapProfileRow(row, authUser.user?.email ?? auth.session.user.email ?? "");

    return NextResponse.json({
      profile,
      rankLabel: formatRankLabel(profile.rank as Rank, profile.jobTitle as JobTitle | null),
      divisionLabel: profile.division
        ? formatDivisionLabel(profile.division as Division)
        : null,
    });
  } catch (err) {
    console.error("Profile GET error:", err);
    return NextResponse.json(
      { error: "Gagal memuat profil." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const auth = await getSessionOrgProfile();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const userId = auth.session.user.id;
    const email = auth.session.user.email ?? "";

    const profileUpdates: Record<string, string | null> = {};

    if (body.username !== undefined) {
      const usernameError = validateUsername(String(body.username));
      if (usernameError) {
        return NextResponse.json({ error: usernameError }, { status: 400 });
      }
      profileUpdates.username = String(body.username).trim();
    }

    if (body.display_name !== undefined) {
      const displayError = validateDisplayName(String(body.display_name));
      if (displayError) {
        return NextResponse.json({ error: displayError }, { status: 400 });
      }
      profileUpdates.display_name = String(body.display_name).trim();
    }

    if (body.avatar_url !== undefined) {
      const avatarValue =
        body.avatar_url === null || body.avatar_url === ""
          ? null
          : String(body.avatar_url).trim();
      if (avatarValue) {
        const avatarError = validateAvatarUrl(avatarValue);
        if (avatarError) {
          return NextResponse.json({ error: avatarError }, { status: 400 });
        }
      }
      profileUpdates.avatar_url = avatarValue;
    }

    const passwordError = validatePasswordChange({
      currentPassword: String(body.current_password ?? ""),
      newPassword: String(body.new_password ?? ""),
      confirmPassword: String(body.confirm_password ?? ""),
    });
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const wantsPasswordChange = Boolean(String(body.new_password ?? "").length);

    if (Object.keys(profileUpdates).length === 0 && !wantsPasswordChange) {
      return NextResponse.json(
        { error: "Tidak ada perubahan untuk disimpan." },
        { status: 400 }
      );
    }

    const admin = createSupabaseAdmin();

    if (wantsPasswordChange) {
      if (!email) {
        return NextResponse.json(
          { error: "Akun tidak memiliki email untuk verifikasi kata sandi." },
          { status: 400 }
        );
      }

      const { user: verified, error: verifyError } = await signInWithEmail(
        email,
        String(body.current_password)
      );
      if (verifyError || !verified) {
        return NextResponse.json(
          { error: "Kata sandi saat ini salah." },
          { status: 400 }
        );
      }

      const { error: passwordUpdateError } = await admin.auth.admin.updateUserById(
        userId,
        { password: String(body.new_password) }
      );

      if (passwordUpdateError) {
        return NextResponse.json(
          { error: passwordUpdateError.message },
          { status: 500 }
        );
      }
    }

    if (Object.keys(profileUpdates).length > 0) {
      const { data, error } = await admin
        .from("profiles")
        .update(profileUpdates)
        .eq("id", userId)
        .select(
          "id, username, display_name, avatar_url, rank, job_title, division, role, discord_id, vitality_points, streak, focus_hours, created_at, updated_at"
        )
        .single();

      if (error) {
        const status = error.code === "23505" ? 409 : 500;
        const message =
          error.code === "23505"
            ? "Nama IC sudah digunakan."
            : error.message;
        return NextResponse.json({ error: message }, { status });
      }

      if (profileUpdates.username) {
        await admin.auth.admin.updateUserById(userId, {
          user_metadata: { username: profileUpdates.username },
        });
      }

      const profile = mapProfileRow(data, email);

      return NextResponse.json({
        profile,
        rankLabel: formatRankLabel(profile.rank as Rank, profile.jobTitle as JobTitle | null),
        divisionLabel: profile.division
          ? formatDivisionLabel(profile.division as Division)
          : null,
        message: wantsPasswordChange
          ? "Profil dan kata sandi berhasil diperbarui."
          : "Profil berhasil diperbarui.",
      });
    }

    return NextResponse.json({ message: "Kata sandi berhasil diperbarui." });
  } catch (err) {
    console.error("Profile PATCH error:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui profil." },
      { status: 500 }
    );
  }
}
