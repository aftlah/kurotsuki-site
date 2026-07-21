"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/Button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left Rail: Icon-only vertical nav (fixed) */}
      <aside className="w-20 bg-bg-secondary flex flex-col items-center py-6 border-r border-border fixed left-0 top-0 h-full z-20">
        <nav className="flex-1 flex flex-col gap-6 mt-10">
          {/* Home/Dashboard */}
          <Link
            href="/dashboard"
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-surface-glass text-crimson shadow-[0_0_20px_var(--color-glow)]"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Link>
          {/* Members List */}
          <Link
            href="/dashboard/members"
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-muted hover:text-white-soft transition-colors hover:bg-surface-glass"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </Link>
          {/* Shop */}
          <Link
            href="/dashboard/shop"
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-muted hover:text-white-soft transition-colors hover:bg-surface-glass"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </Link>
          {/* Admin */}
          <Link
            href="/dashboard/admin"
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-muted hover:text-white-soft transition-colors hover:bg-surface-glass"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </Link>
        </nav>
        <button className="mb-10 w-12 h-12 rounded-2xl flex items-center justify-center bg-surface-glass border border-crimson text-crimson">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </aside>

      <main className="flex-1 p-8 ml-20">
        {/* Top Bar (sticky) */}
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-bg-primary z-10 py-4">
          <div>
            <p className="text-gray-muted">Selamat malam,</p>
            <h1 className="text-2xl font-bold text-white-soft">
              <span className="font-bold">{session?.user?.name || "User"}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-glass border border-border">
              <svg
                className="w-5 h-5 text-gray-muted"
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
                placeholder="Search..."
                className="bg-transparent border-none text-white-soft placeholder-gray-muted focus:outline-none text-sm w-40"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-surface-glass border border-border flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <Button onClick={() => signOut()} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
