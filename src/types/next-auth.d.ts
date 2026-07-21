import "next-auth";
import "next-auth/jwt";
import type { Division, JobTitle, Rank, SiteRole } from "@/lib/organization/constants";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: SiteRole;
      rank: Rank;
      jobTitle: JobTitle | null;
      division: Division | null;
    };
  }

  interface User {
    role: SiteRole;
    rank: Rank;
    jobTitle?: JobTitle | null;
    division?: Division | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    role: SiteRole;
    rank: Rank;
    jobTitle: JobTitle | null;
    division: Division | null;
    profileFetchedAt?: number;
  }
}
