"use client";

import Image from "next/image";
import { Card } from "@/components/Card";

// Logo element justification: Dashboard uses Circular Crest (stat rings, avatars), Seigaiha waves (bg),
// and Crossed Katana (section separators). Uses brand tokens only, no neon/gaming UI, gold only for VIP/Owner.
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left Rail: Icon-only vertical nav */}
      <aside className="w-20 bg-bg-secondary flex flex-col items-center py-6 border-r border-border">
        {/* Kurotsuki-Kai Logo at top */}
        <div className="mb-10 w-12 h-12 rounded-full overflow-hidden">
          <Image
            src="/logo_kurot.png"
            alt="Kurotsuki-Kai Logo"
            fill
            className="object-cover"
          />
        </div>
        <nav className="flex-1 flex flex-col gap-6">
          <button className="w-12 h-12 rounded-2xl flex items-center justify-center bg-surface-glass text-crimson shadow-[0_0_20px_var(--color-glow)]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-muted hover:text-white-soft transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-muted hover:text-white-soft transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </nav>
        <button className="mt-auto w-12 h-12 rounded-2xl flex items-center justify-center bg-surface-glass border border-crimson text-crimson">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </aside>

      <main className="flex-1 p-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gray-muted">Selamat malam,</p>
            <h1 className="text-2xl font-bold text-white-soft">
              <span className="font-bold">User</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-glass border border-border">
              <svg className="w-5 h-5 text-gray-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search..." className="bg-transparent border-none text-white-soft placeholder-gray-muted focus:outline-none text-sm w-40" />
            </div>
            <button className="w-10 h-10 rounded-full bg-surface-glass border border-border flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Banner */}
            <Card className="p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04]">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <pattern id="seigaiha-dash" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="8" fill="none" stroke="var(--color-crimson)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#seigaiha-dash)" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-crimson text-white-soft">Featured</span>
                </div>
                <h2 className="text-2xl font-bold text-white-soft mb-2">Welcome to Kurotsuki-Kai</h2>
                <p className="text-gray-muted mb-6 max-w-xl">Your journey within the society begins here. Honor, discipline, and tradition guide us.</p>
              </div>
            </Card>

            {/* Stat Ring Widget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8">
                <h3 className="text-lg font-semibold text-white-soft mb-6">Your Statistics</h3>
                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border)" strokeWidth="8" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-crimson)" strokeWidth="8" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="75.36" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white-soft">70</div>
                        <div className="text-xs text-gray-muted">Points</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-gray-muted mb-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="text-xs text-gray-muted">12</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-gray-muted mb-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-xs text-gray-muted">5h</div>
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                <Card className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-bg-secondary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white-soft">Announcement</p>
                    <p className="text-xs text-gray-muted">New event coming soon</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-bg-secondary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white-soft">Resource</p>
                    <p className="text-xs text-gray-muted">Guide to discipline</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Card>
              </div>
            </div>

            {/* Katana separator */}
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="flex-1 h-px bg-border" />
              <svg className="w-6 h-6 text-crimson" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Feed Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="h-32 bg-bg-secondary rounded-xl mb-4" />
                <h4 className="text-sm font-medium text-white-soft mb-1">Tradition</h4>
                <p className="text-xs text-gray-muted">The way of the sword</p>
              </Card>
              <Card className="p-4">
                <div className="h-32 bg-bg-secondary rounded-xl mb-4" />
                <h4 className="text-sm font-medium text-white-soft mb-1">Discipline</h4>
                <p className="text-xs text-gray-muted">Daily practice routine</p>
              </Card>
              <Card className="p-4">
                <div className="h-32 bg-bg-secondary rounded-xl mb-4" />
                <h4 className="text-sm font-medium text-white-soft mb-1">Honor</h4>
                <p className="text-xs text-gray-muted">Core values of the society</p>
              </Card>
            </div>
          </div>

          {/* Far Right Rail */}
          <div className="space-y-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white-soft mb-6">Members</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-2 border-gold bg-bg-secondary" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-bg-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white-soft">Owner</p>
                    <p className="text-xs text-gold">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-2 border-border bg-bg-secondary" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-gray-muted border-2 border-bg-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white-soft">Member 1</p>
                    <p className="text-xs text-gray-muted">Offline</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-2 border-gold bg-bg-secondary" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-bg-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white-soft">VIP</p>
                    <p className="text-xs text-gold">Online</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
