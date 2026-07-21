import { createSupabaseAdmin, createSupabaseClient } from "@/lib/supabase";
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

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: SiteRole;
  rank: Rank;
  jobTitle: JobTitle | null;
  division: Division | null;
};

type ProfileRow = {
  username: string | null;
  display_name: string | null;
  role: string | null;
  rank: string | null;
  job_title: string | null;
  division: string | null;
};

function mapProfileToAuthUser(
  user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> },
  profile: ProfileRow | null
): AuthUser {
  const metadata = user.user_metadata ?? {};
  const fallbackName =
    (typeof metadata.username === "string" && metadata.username) ||
    user.email?.split("@")[0] ||
    "User";

  const role: SiteRole =
    profile?.role && isValidSiteRole(profile.role)
      ? profile.role
      : DEFAULT_SITE_ROLE;

  const rank: Rank =
    profile?.rank && isValidRank(profile.rank) ? profile.rank : DEFAULT_RANK;

  const jobTitle: JobTitle | null =
    profile?.job_title && isValidJobTitle(profile.job_title)
      ? profile.job_title
      : null;

  const division: Division | null =
    profile?.division && isValidDivision(profile.division)
      ? profile.division
      : null;

  return {
    id: user.id,
    email: user.email ?? "",
    name: profile?.display_name || profile?.username || fallbackName,
    role,
    rank,
    jobTitle,
    division,
  };
}

async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  try {
    const admin = createSupabaseAdmin();
    const { data, error } = await admin
      .from("profiles")
      .select("username, display_name, role, rank, job_title, division")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as ProfileRow;
  } catch {
    return null;
  }
}

function mapAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("fetch failed") || lower.includes("network")) {
    return "Tidak dapat terhubung ke Supabase. Pastikan project aktif di dashboard Supabase.";
  }
  if (lower.includes("already") || lower.includes("registered")) {
    return "Email sudah digunakan.";
  }
  if (lower.includes("password")) {
    return "Kata sandi tidak memenuhi syarat Supabase (minimal 8 karakter).";
  }
  if (lower.includes("invalid") && lower.includes("email")) {
    return "Format email tidak valid.";
  }

  return message;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return {
        user: null,
        error: mapAuthError(
          error?.message ?? "Email atau kata sandi tidak valid"
        ),
      };
    }

    const profile = await fetchProfile(data.user.id);
    return { user: mapProfileToAuthUser(data.user, profile), error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login gagal.";
    return { user: null, error: mapAuthError(message) };
  }
}

export async function registerWithEmail(input: {
  username: string;
  email: string;
  password: string;
}): Promise<{ user: AuthUser | null; error: string | null }> {
  const metadata = { username: input.username };

  try {
    const admin = createSupabaseAdmin();

    const { data, error } = await admin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: metadata,
    });

    if (!error && data.user) {
      const profile = await fetchProfile(data.user.id);
      return { user: mapProfileToAuthUser(data.user, profile), error: null };
    }

    if (error && !error.message.toLowerCase().includes("fetch failed")) {
      return { user: null, error: mapAuthError(error.message) };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (!message.toLowerCase().includes("fetch failed")) {
      return { user: null, error: mapAuthError(message || "Pendaftaran gagal.") };
    }
  }

  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: { data: metadata },
    });

    if (error) {
      return { user: null, error: mapAuthError(error.message) };
    }

    if (!data.user) {
      return {
        user: null,
        error: "Akun dibuat. Cek email untuk konfirmasi, lalu login.",
      };
    }

    const profile = await fetchProfile(data.user.id);
    return { user: mapProfileToAuthUser(data.user, profile), error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Pendaftaran gagal.";
    return { user: null, error: mapAuthError(message) };
  }
}

export async function getAuthUserById(userId: string): Promise<AuthUser | null> {
  try {
    const admin = createSupabaseAdmin();
    const { data, error } = await admin.auth.admin.getUserById(userId);

    if (error || !data.user) {
      return null;
    }

    const profile = await fetchProfile(userId);
    return mapProfileToAuthUser(data.user, profile);
  } catch {
    return null;
  }
}
