"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { BrandBackground } from "@/components/BrandBackground";
import {
  formatDivisionLabel,
  formatRankLabel,
  isSiteAdmin,
} from "@/lib/organization/constants";
import { toOrgProfile } from "@/lib/organization/permissions";
import { useToast } from "@/components/Toast";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
  adminOnly?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Utama",
    items: [
      {
        href: "/dashboard",
        label: "Beranda",
        exact: true,
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        ),
      },
      {
        href: "/dashboard/profile",
        label: "Profil",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        ),
      },
    ],
  },
  {
    title: "Organisasi",
    items: [
      {
        href: "/dashboard/members",
        label: "Anggota",
        adminOnly: true,
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        ),
      },
      {
        href: "/dashboard/hierarchy",
        label: "Hirarki",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        ),
      },
    ],
  },
  {
    title: "Layanan",
    items: [
      {
        href: "/dashboard/shop",
        label: "Toko",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        ),
      },
    ],
  },
  {
    title: "Pengelolaan",
    items: [
      {
        href: "/dashboard/admin",
        label: "Admin",
        adminOnly: true,
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        ),
      },
    ],
  },
];

function NavIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { info } = useToast();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleSignOut = () => {
    info("Keluar dari sesi...");
    signOut();
  };

  const profile = useMemo(
    () => (session?.user ? toOrgProfile(session.user) : null),
    [session?.user]
  );

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const visibleNavGroups = useMemo(() => {
    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (item.adminOnly) {
            return profile ? isSiteAdmin(profile.role) : false;
          }
          return true;
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [profile]);

  const activeNavLabel = useMemo(() => {
    for (const group of visibleNavGroups) {
      for (const item of group.items) {
        if (isActive(item.href, item.exact)) {
          return item.label;
        }
      }
    }
    return "Dashboard";
  }, [visibleNavGroups, pathname]);

  const userName = session?.user?.name || "User";
  const rankLabel = profile
    ? formatRankLabel(profile.rank, profile.jobTitle)
    : null;
  const divisionLabel = profile ? formatDivisionLabel(profile.division ?? null) : null;

  const mobileSubtitle = [
    rankLabel,
    profile?.division ? divisionLabel : null,
    profile && isSiteAdmin(profile.role) ? "Admin" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const showLabels = sidebarExpanded || mobileOpen;
  const sidebarWidth = showLabels ? "w-60" : "w-20";
  const mainOffset = showLabels ? "lg:ml-60" : "lg:ml-20";
  const headerLeft = showLabels ? "lg:left-60" : "lg:left-20";

  return (
    <BrandBackground variant="default" patternId="seigaiha-dash" className="min-h-screen">
      <div className="relative flex min-h-screen">
        {/* Mobile overlay */}
        {mobileOpen && (
          <button
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-40 flex h-full flex-col border-r border-border bg-bg-secondary py-6 transition-all duration-300 lg:translate-x-0 ${sidebarWidth} ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          } ${showLabels ? "px-4" : "items-center px-0"}`}
        >
          <div
            className={`mb-6 flex items-center gap-3 ${showLabels ? "w-full justify-between px-1" : "flex-col"}`}
          >
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 ${showLabels ? "min-w-0 flex-1" : ""}`}
              aria-label="Kurotsuki-Kai"
              onClick={() => setMobileOpen(false)}
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-crimson/30 shadow-[0_0_15px_var(--color-glow)]">
                <Image
                  src="/logo_kurot.png"
                  alt="Kurotsuki"
                  fill
                  className="object-cover"
                />
              </div>
              {showLabels && (
                <div className="min-w-0">
                  <p className="font-brand truncate text-sm font-bold text-white-soft">
                    Kurotsuki-Kai
                  </p>
                  <p className="text-xs text-gray-muted">Dashboard</p>
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setSidebarExpanded((prev) => !prev)}
              className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-glass text-gray-muted transition-colors hover:text-white-soft lg:flex ${showLabels ? "" : "mt-2"}`}
              aria-label={sidebarExpanded ? "Tutup sidebar" : "Buka sidebar"}
              title={sidebarExpanded ? "Tutup sidebar" : "Buka sidebar"}
            >
              <svg
                className={`h-5 w-5 transition-transform ${sidebarExpanded ? "" : "rotate-180"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          <nav className={`flex flex-1 flex-col overflow-y-auto ${showLabels ? "w-full gap-4" : "items-center gap-2"}`}>
            {visibleNavGroups.map((group, groupIndex) => (
              <div
                key={group.title}
                className={`${showLabels ? "w-full" : "flex w-full flex-col items-center"} ${groupIndex > 0 ? (showLabels ? "border-t border-border/60 pt-4" : "mt-2 border-t border-border/40 pt-3") : ""}`}
              >
                {showLabels && (
                  <p className="font-accent mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-muted">
                    {group.title}
                  </p>
                )}
                <div className={`flex flex-col ${showLabels ? "gap-1" : "items-center gap-2"}`}>
                  {group.items.map((item) => {
                    const active = isActive(item.href, item.exact);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={item.label}
                        aria-label={item.label}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center rounded-2xl transition-all ${
                          showLabels
                            ? "h-11 w-full gap-3 px-3"
                            : "h-11 w-11 justify-center"
                        } ${
                          active
                            ? "bg-surface-glass text-crimson shadow-[0_0_20px_var(--color-glow)]"
                            : "text-gray-muted hover:bg-surface-glass hover:text-white-soft"
                        }`}
                      >
                        <span className="shrink-0">
                          <NavIcon>{item.icon}</NavIcon>
                        </span>
                        {showLabels && (
                          <span className="truncate text-sm font-medium">{item.label}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {showLabels && (
            <div className="mt-auto border-t border-border pt-4">
              <p className="px-2 text-xs text-gray-muted">{activeNavLabel}</p>
            </div>
          )}
        </aside>

        <main className={`flex-1 transition-all duration-300 ${mainOffset}`}>
          {/* Top Bar — fixed agar tetap terlihat saat scroll */}
          <header
            className={`fixed top-0 right-0 left-0 z-30 border-b border-border bg-bg-primary/95 backdrop-blur-md transition-[left] duration-300 ${headerLeft}`}
          >
            {/* Mobile & tablet — single compact row */}
            <div className="flex h-14 items-center gap-3 px-4 lg:hidden">
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-glass"
                onClick={() => setMobileOpen(true)}
                aria-label="Buka menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold leading-tight text-white-soft">
                  {userName}
                </p>
                {mobileSubtitle && (
                  <p className="truncate text-xs leading-tight text-gray-muted">
                    {mobileSubtitle}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-glass text-gray-muted transition-colors hover:text-white-soft"
                aria-label="Keluar"
                title="Keluar"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

            {/* Desktop */}
            <div className="hidden items-center justify-between gap-4 px-8 py-4 lg:flex">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-muted">Selamat malam,</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-white-soft">{userName}</h1>
                  {rankLabel && <Badge variant="gold">{rankLabel}</Badge>}
                  {divisionLabel && profile?.division && (
                    <Badge variant="black">{divisionLabel}</Badge>
                  )}
                  {profile && isSiteAdmin(profile.role) && (
                    <Badge variant="crimson">Admin</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full border border-border bg-surface-glass px-4 py-2">
                  <svg className="h-5 w-5 text-gray-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari anggota..."
                    className="w-40 border-none bg-transparent text-sm text-white-soft placeholder-gray-muted focus:outline-none"
                  />
                </div>
                <Link href="/dashboard/profile" aria-label="Profil saya">
                  <Avatar name={userName} size="sm" borderColor="crimson" />
                </Link>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  Keluar
                </Button>
              </div>
            </div>
          </header>

          {/* Spacer — tinggi sama dengan headbar fixed */}
          <div aria-hidden className="h-14 shrink-0 lg:h-24" />

          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </BrandBackground>
  );
}
