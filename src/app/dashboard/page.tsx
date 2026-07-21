"use client";

import { Card } from "@/components/Card";

export default function DashboardPage() {
  return (
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
  );
}
