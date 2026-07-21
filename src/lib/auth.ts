import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInWithEmail, getAuthUserById } from "@/lib/supabase-auth";
import type { Division, JobTitle, Rank, SiteRole } from "@/lib/organization/constants";

const PROFILE_REFRESH_MS = 5 * 60 * 1000;

export const authOptions: NextAuthOptions = {
  providers: [
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
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.rank = user.rank;
        token.jobTitle = user.jobTitle ?? null;
        token.division = user.division ?? null;
        token.profileFetchedAt = Date.now();
        return token;
      }

      const fetchedAt = token.profileFetchedAt ?? 0;
      if (Date.now() - fetchedAt > PROFILE_REFRESH_MS && token.id) {
        const fresh = await getAuthUserById(token.id);
        if (fresh) {
          token.role = fresh.role;
          token.rank = fresh.rank;
          token.jobTitle = fresh.jobTitle;
          token.division = fresh.division;
          token.profileFetchedAt = Date.now();
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
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
