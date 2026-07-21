import { createSupabaseAdmin } from "@/lib/supabase";
import {
  DEFAULT_RANK,
  DEFAULT_SITE_ROLE,
  isValidDivision,
  isValidJobTitle,
  isValidRank,
  isValidSiteRole,
  type Division,
  type JobTitle,
  type Rank,
  type SiteRole,
} from "@/lib/organization/constants";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mapCreateError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("already") || lower.includes("registered")) {
    return "Email sudah digunakan.";
  }
  if (lower.includes("duplicate") && lower.includes("username")) {
    return "Nama IC sudah digunakan.";
  }
  if (lower.includes("password")) {
    return "Kata sandi minimal 8 karakter.";
  }
  return message;
}

export type CreateMemberInput = {
  username: string;
  email: string;
  password: string;
  rank?: Rank;
  jobTitle?: JobTitle | null;
  division?: Division | null;
  role?: SiteRole;
};

export async function createMemberByAdmin(input: CreateMemberInput) {
  const username = input.username.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const rank = input.rank ?? DEFAULT_RANK;
  const role = input.role ?? DEFAULT_SITE_ROLE;
  const division = input.division ?? null;
  const jobTitle =
    rank === "kaicho" && input.jobTitle ? input.jobTitle : null;

  if (!USERNAME_REGEX.test(username)) {
    return { member: null, error: "Nama IC harus 3-20 karakter (huruf, angka, underscore)." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { member: null, error: "Format email tidak valid." };
  }
  if (password.length < 8) {
    return { member: null, error: "Kata sandi minimal 8 karakter." };
  }
  if (!isValidRank(rank)) {
    return { member: null, error: "Rank tidak valid." };
  }
  if (!isValidSiteRole(role)) {
    return { member: null, error: "Role tidak valid." };
  }
  if (division && !isValidDivision(division)) {
    return { member: null, error: "Divisi tidak valid." };
  }
  if (jobTitle && !isValidJobTitle(jobTitle)) {
    return { member: null, error: "Job title tidak valid." };
  }

  const admin = createSupabaseAdmin();

  const { data: existingUsername } = await admin
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existingUsername) {
    return { member: null, error: "Nama IC sudah digunakan." };
  }

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
  });

  if (authError || !authData.user) {
    return {
      member: null,
      error: mapCreateError(authError?.message ?? "Gagal membuat akun."),
    };
  }

  const userId = authData.user.id;

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .update({
      username,
      display_name: username,
      rank,
      role,
      division,
      job_title: jobTitle,
    })
    .eq("id", userId)
    .select("id, username, display_name, rank, job_title, division, role")
    .single();

  if (profileError) {
    await admin.auth.admin.deleteUser(userId);
    return {
      member: null,
      error: profileError.message ?? "Gagal menyimpan profil anggota.",
    };
  }

  return { member: profile, error: null };
}
