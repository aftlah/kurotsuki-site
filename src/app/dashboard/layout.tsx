"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { BrandBackground } from "@/components/BrandBackground";

const navItems = [
  {
    href: "/dashboard",
    label: "Beranda",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    ),
    exact: true,
  },
  {
    href: "/dashboard/members",
    label: "Anggota",
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
  {
    href: "/dashboard/admin",
    label: "Admin",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    ),
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
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const userName = session?.user?.name || "User";

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
          className={`fixed left-0 top-0 z-40 flex h-full w-20 flex-col items-center border-r border-border bg-bg-secondary py-6 transition-transform lg:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Link href="/dashboard" className="mb-8" aria-label="Kurotsuki-Kai">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-crimson/30 shadow-[0_0_15px_var(--color-glow)]">
              <Image
                src="/logo_kurot.png"
                alt="Kurotsuki"
                fill
                className="object-cover"
              />
            </div>
          </Link>

          <nav className="flex flex-1 flex-col gap-4">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  aria-label={item.label}
                  onClick={() => setMobileOpen(false)}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${
                    active
                      ? "bg-surface-glass text-crimson shadow-[0_0_20px_var(--color-glow)]"
                      : "text-gray-muted hover:bg-surface-glass hover:text-white-soft"
                  }`}
                >
                  <NavIcon>{item.icon}</NavIcon>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 lg:ml-20">
          {/* Top Bar */}
          <div className="sticky top-0 z-20 border-b border-border bg-bg-primary/90 px-4 py-4 backdrop-blur-md md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-glass lg:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Buka menu"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div>
                  <p className="text-sm text-gray-muted">Selamat malam,</p>
                  <h1 className="text-xl font-bold text-white-soft md:text-2xl">
                    {userName}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                <div className="hidden items-center gap-2 rounded-full border border-border bg-surface-glass px-4 py-2 sm:flex">
                  <svg
                    className="h-5 w-5 text-gray-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari anggota..."
                    className="w-32 border-none bg-transparent text-sm text-white-soft placeholder-gray-muted focus:outline-none md:w-40"
                  />
                </div>

                <Avatar name={userName} size="sm" borderColor="crimson" />

                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Keluar
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </BrandBackground>
  );
}
