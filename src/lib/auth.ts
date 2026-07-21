import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import { signInWithEmail, getAuthUserById } from "@/lib/supabase-auth";
import { ensureDiscordUser, isDiscordAuthConfigured } from "@/lib/discord-auth";
import type { Division, JobTitle, Rank, SiteRole } from "@/lib/organization/constants";

const PROFILE_REFRESH_MS = 5 * 60 * 1000;

const providers: NextAuthOptions["providers"] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const { user, error } = await signInWithEmail(
        credentials.email.toLowerCase().trim(),
        credentials.password
      );

      if (error || !user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rank: user.rank,
        jobTitle: user.jobTitle,
        division: user.division,
      };
    },
  }),
];

if (isDiscordAuthConfigured()) {
  providers.unshift(
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify email" } },
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "discord") {
        return true;
      }

      const discordProfile = profile as {
        username?: string;
        global_name?: string | null;
      };

      const result = await ensureDiscordUser({
        discordId: account.providerAccountId,
        email: user.email,
        username: discordProfile.username ?? user.name ?? "discord_user",
        displayName: discordProfile.global_name ?? user.name,
        avatarUrl: user.image,
      });

      if (!result.userId) {
        console.error("Discord signIn failed:", result.error);
        return false;
      }

      user.id = result.userId;
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        const fresh = await getAuthUserById(user.id);
        if (fresh) {
          token.role = fresh.role;
          token.rank = fresh.rank;
          token.jobTitle = fresh.jobTitle;
          token.division = fresh.division;
          token.name = fresh.name;
        } else {
          token.role = user.role as SiteRole;
          token.rank = user.rank as Rank;
          token.jobTitle = (user.jobTitle as JobTitle | null) ?? null;
          token.division = (user.division as Division | null) ?? null;
          token.name = user.name;
        }
        token.profileFetchedAt = Date.now();
        return token;
      }

      const fetchedAt = token.profileFetchedAt ?? 0;
      const shouldRefreshProfile =
        trigger === "update" ||
        Date.now() - fetchedAt > PROFILE_REFRESH_MS;

      if (shouldRefreshProfile && token.id) {
        const fresh = await getAuthUserById(token.id);
        if (fresh) {
          token.role = fresh.role;
          token.rank = fresh.rank;
          token.jobTitle = fresh.jobTitle;
          token.division = fresh.division;
          token.name = fresh.name;
          token.profileFetchedAt = Date.now();
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name ?? session.user.name;
        session.user.role = token.role as SiteRole;
        session.user.rank = token.rank as Rank;
        session.user.jobTitle = (token.jobTitle as JobTitle | null) ?? null;
        session.user.division = (token.division as Division | null) ?? null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
