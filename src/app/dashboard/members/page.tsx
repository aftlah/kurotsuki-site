"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/Badge";

type MemberRow = {
  id: string;
  displayName: string;
  rankLabel: string;
  divisionLabel: string;
  role: string;
  isOnline: boolean;
};

export default function MembersPage() {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMembers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/members");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Gagal memuat anggota.");
        }
        setMembers(data.members ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat anggota.");
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white-soft">Daftar Anggota</h2>

      {error && (
        <p className="rounded-xl border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson">
          {error}
        </p>
      )}

      <Card className="overflow-x-auto p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                Nama
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                Pangkat
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                Divisi
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                Peran
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-muted">
                  Memuat anggota...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-0">
                  <EmptyState message="Belum ada anggota terdaftar." />
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id} className="border-b border-border/50">
                  <td className="px-4 py-3 text-white-soft">{member.displayName}</td>
                  <td className="px-4 py-3">
                    <Badge variant="gold">{member.rankLabel}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="black">{member.divisionLabel}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={member.isOnline ? "success" : "black"}>
                      {member.isOnline ? "Online" : "Offline"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={member.role === "admin" ? "crimson" : "black"}>
                      {member.role === "admin" ? "Admin" : "Member"}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
