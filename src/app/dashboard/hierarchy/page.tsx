"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { KatanaDivider } from "@/components/KatanaDivider";
import {
  DIVISIONS,
  JOB_TITLES,
  RANKS,
  DIVISION_DESCRIPTIONS,
  RANK_DESCRIPTIONS,
  HIERARCHY_INTRO,
} from "@/lib/organization/hierarchy";
import type { Division, Rank } from "@/lib/organization/constants";

type HierarchyMember = {
  id: string;
  displayName: string;
  rank: Rank;
  rankLabel: string;
  division: Division | null;
  divisionLabel: string;
  isOnline: boolean;
};

type HierarchyData = {
  byRank: Record<Rank, HierarchyMember[]>;
  byDivision: Record<Division, HierarchyMember[]>;
  unassigned: HierarchyMember[];
  total: number;
};

function MemberChip({ member }: { member: HierarchyMember }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-bg-secondary/60 px-3 py-2">
      <Avatar
        name={member.displayName}
        size="sm"
        borderColor="crimson"
        status={member.isOnline ? "online" : "offline"}
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white-soft">
          {member.displayName}
        </p>
        {member.division && (
          <p className="truncate text-xs text-gray-muted">{member.divisionLabel}</p>
        )}
      </div>
    </div>
  );
}

export default function HierarchyPage() {
  const [data, setData] = useState<HierarchyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ranks" | "divisions">("ranks");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/hierarchy");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Gagal memuat hirarki.");
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat hirarki.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const sortedRanks = [...RANKS].sort((a, b) => b.level - a.level);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white-soft">Hirarki Kurotsuki-Kai</h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-muted">{HIERARCHY_INTRO}</p>
      </div>

      {error && (
        <p className="rounded-xl border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson">
          {error}
        </p>
      )}

      <Card className="p-4 sm:p-6" variant="premium">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("ranks")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "ranks"
                ? "bg-crimson/20 text-crimson"
                : "text-gray-muted hover:text-white-soft"
            }`}
          >
            Pangkat
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("divisions")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "divisions"
                ? "bg-crimson/20 text-crimson"
                : "text-gray-muted hover:text-white-soft"
            }`}
          >
            Divisi
          </button>
        </div>
      </Card>

      {loading ? (
        <Card className="p-8">
          <p className="text-center text-sm text-gray-muted">Memuat hirarki...</p>
        </Card>
      ) : !data ? (
        <EmptyState message="Data hirarki tidak tersedia." />
      ) : activeTab === "ranks" ? (
        <div className="space-y-4">
          {sortedRanks.map((rank, index) => {
            const members = data.byRank[rank.slug] ?? [];
            const isKaicho = rank.slug === "kaicho";

            return (
              <div key={rank.slug} className="relative">
                {index > 0 && (
                  <div className="mb-4 flex justify-center">
                    <div className="h-6 w-px bg-gradient-to-b from-crimson/40 to-transparent" />
                  </div>
                )}
                <Card className="p-4 sm:p-6" hoverEffect>
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="gold">{rank.label}</Badge>
                        <span className="text-xs text-gray-muted">
                          Level {rank.level}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-muted">
                        {RANK_DESCRIPTIONS[rank.slug]}
                      </p>
                      {isKaicho && (
                        <p className="mt-1 text-xs text-gray-muted">
                          Jabatan:{" "}
                          {JOB_TITLES.map((j) => j.label).join(" · ")}
                        </p>
                      )}
                    </div>
                    <Badge variant="black">
                      {members.length} anggota
                    </Badge>
                  </div>

                  {members.length === 0 ? (
                    <p className="text-sm italic text-gray-muted">Belum ada anggota.</p>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {members.map((member) => (
                        <MemberChip key={member.id} member={member} />
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {DIVISIONS.map((division) => {
            const members = data.byDivision[division.slug] ?? [];
            return (
              <Card key={division.slug} className="p-4 sm:p-6" hoverEffect>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white-soft">
                      {division.label}
                    </h3>
                    <p className="mt-1 text-sm text-gray-muted">
                      {DIVISION_DESCRIPTIONS[division.slug]}
                    </p>
                  </div>
                  <Badge variant="crimson">{members.length}</Badge>
                </div>
                <KatanaDivider className="py-3" />
                {members.length === 0 ? (
                  <p className="text-sm italic text-gray-muted">Belum ada anggota.</p>
                ) : (
                  <div className="space-y-2">
                    {members.map((member) => (
                      <MemberChip key={member.id} member={member} />
                    ))}
                  </div>
                )}
              </Card>
            );
          })}

          {data.unassigned.length > 0 && (
            <Card className="p-4 sm:p-6 md:col-span-2">
              <h3 className="mb-3 text-lg font-semibold text-white-soft">
                Belum Ditugaskan Divisi
              </h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {data.unassigned.map((member) => (
                  <MemberChip key={member.id} member={member} />
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {data && (
        <p className="text-center text-xs text-gray-muted">
          Total {data.total} anggota terdaftar
        </p>
      )}
    </div>
  );
}
