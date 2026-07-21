import { createSupabaseAdmin } from "@/lib/supabase";
import { DEFAULT_RANK, DEFAULT_SITE_ROLE } from "@/lib/organization/constants";
import { randomBytes } from "crypto";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

function sanitizeUsername(raw: string, discordId: string): string {
  let username = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 20);

  if (username.length < 3) {
    username = `dk_${discordId.slice(-8)}`;
  }

  return username;
}

async function findUniqueUsername(base: string): Promise<string> {
  const admin = createSupabaseAdmin();
  let candidate = base.slice(0, 20);
  let suffix = 0;

  while (suffix < 100) {
    const { data } = await admin
      .from("profiles")
      .select("id")
      .eq("username", candidate)
      .maybeSingle();

    if (!data) {
      return candidate;
    }

    suffix += 1;
    const suffixStr = String(suffix);
    candidate = `${base.slice(0, Math.max(3, 20 - suffixStr.length))}${suffixStr}`;
  }

  return `user_${randomBytes(4).toString("hex")}`;
}

async function findAuthUserIdByEmail(email: string): Promise<string | null> {
  const admin = createSupabaseAdmin();
  let page = 1;

  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data.users.length) {
      return null;
    }

    const match = data.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    );
    if (match) {
      return match.id;
    }

    if (data.users.length < 200) {
      break;
    }
    page += 1;
  }

  return null;
}

export async function ensureDiscordUser(input: {
  discordId: string;
  email?: string | null;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
}): Promise<{ userId: string | null; error: string | null }> {
  const admin = createSupabaseAdmin();
  const discordId = input.discordId;
  const email = input.email?.trim().toLowerCase() || null;

  const { data: byDiscord } = await admin
    .from("profiles")
    .select("id")
    .eq("discord_id", discordId)
    .maybeSingle();

  if (byDiscord) {
    await admin
      .from("profiles")
      .update({
        display_name: input.displayName ?? undefined,
        avatar_url: input.avatarUrl ?? undefined,
      })
      .eq("id", byDiscord.id);

    return { userId: byDiscord.id, error: null };
  }

  if (!email) {
    return {
      userId: null,
      error: "Discord tidak memberikan email. Centang scope identify + email di Discord OAuth.",
    };
  }

  let userId = await findAuthUserIdByEmail(email);
  let isNewUser = false;

  if (!userId) {
    const baseUsername = sanitizeUsername(input.username, discordId);
    const username = await findUniqueUsername(
      USERNAME_REGEX.test(baseUsername) ? baseUsername : sanitizeUsername("discord_user", discordId)
    );
    const password = randomBytes(32).toString("hex");

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username },
    });

    if (error || !data.user) {
      if (error?.message.toLowerCase().includes("already")) {
        userId = await findAuthUserIdByEmail(email);
      }
      if (!userId) {
        return {
          userId: null,
          error: error?.message ?? "Gagal membuat akun dari Discord.",
        };
      }
    } else {
      userId = data.user.id;
      isNewUser = true;
    }
  }

  const profileUpdate: Record<string, string | null> = {
    discord_id: discordId,
    avatar_url: input.avatarUrl ?? null,
  };

  if (input.displayName) {
    profileUpdate.display_name = input.displayName;
  }

  if (isNewUser) {
    const username = await findUniqueUsername(
      sanitizeUsername(input.username, discordId)
    );
    profileUpdate.username = username;
    profileUpdate.display_name = input.displayName ?? username;
    profileUpdate.role = DEFAULT_SITE_ROLE;
    profileUpdate.rank = DEFAULT_RANK;
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update(profileUpdate)
    .eq("id", userId);

  if (profileError) {
    return { userId: null, error: profileError.message };
  }

  return { userId, error: null };
}

export function isDiscordAuthConfigured(): boolean {
  return Boolean(
    process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
  );
}
