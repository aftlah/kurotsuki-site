"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/Badge";
import { useToast } from "@/components/Toast";
import { useTranslation } from "@/i18n/provider";
import {
  DIVISIONS,
  JOB_TITLES,
  RANKS,
  formatRankLabel,
} from "@/lib/organization/constants";
import {
  can,
  canAssignAdmin,
  canManageMember,
  toOrgProfile,
} from "@/lib/organization/permissions";
import type { Division, JobTitle, Rank, SiteRole } from "@/lib/organization/constants";

type MemberRow = {
  id: string;
  username: string;
  displayName: string;
  rank: Rank;
  rankLabel: string;
  jobTitle: JobTitle | null;
  division: Division | null;
  divisionLabel: string;
  role: SiteRole;
};

export default function AdminPage() {
  const { data: session } = useSession();
  const { t, rankLabel, divisionLabel } = useTranslation();
  const { success, error: toastError, info } = useToast();
  const profile = useMemo(
    () => (session?.user ? toOrgProfile(session.user) : null),
    [session?.user]
  );

  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    username: "",
    email: "",
    password: "",
    rank: "shinjin" as Rank,
    jobTitle: "" as JobTitle | "",
    division: "" as Division | "",
    role: "member" as SiteRole,
  });
  const [editForms, setEditForms] = useState<
    Record<
      string,
      {
        rank: Rank;
        jobTitle: JobTitle | "";
        division: Division | "";
        role: SiteRole;
      }
    >
  >({});

  const canManage = profile ? can(profile, "members.manage") : false;
  const canRecordAttendance =
    profile &&
    (can(profile, "attendance.manage") ||
      can(profile, "attendance.manage_division"));

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? t("admin.loadFailed"));
      }
      setMembers(data.members ?? []);
      const forms: typeof editForms = {};
      for (const member of data.members ?? []) {
        forms[member.id] = {
          rank: member.rank,
          jobTitle: member.jobTitle ?? "",
          division: member.division ?? "",
          role: member.role,
        };
      }
      setEditForms(forms);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("admin.loadFailed");
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  async function handleCreateMember(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !canManage) return;

    setCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newMember.username.trim(),
          email: newMember.email.trim().toLowerCase(),
          password: newMember.password,
          rank: newMember.rank,
          division: newMember.division || null,
          job_title:
            newMember.rank === "kaicho" && newMember.jobTitle
              ? newMember.jobTitle
              : null,
          role: newMember.role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? t("admin.addMemberFailed"));
      }

      success(`Anggota ${newMember.username} berhasil ditambahkan.`);
      setNewMember({
        username: "",
        email: "",
        password: "",
        rank: "shinjin",
        jobTitle: "",
        division: "",
        role: "member",
      });
      setShowAddForm(false);
      await loadMembers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("admin.addMemberFailed");
      setError(msg);
      toastError(msg);
    } finally {
      setCreating(false);
    }
  }

  async function handleSaveMember(memberId: string) {
    const form = editForms[memberId];
    const member = members.find((m) => m.id === memberId);
    if (!form || !member || !profile) {
      return;
    }

    if (!canManageMember(profile, toOrgProfile(member))) {
      const msg = t("admin.noPermissionMember");
      setError(msg);
      toastError(msg);
      return;
    }

    setSavingId(memberId);
    setError(null);

    try {
      const payload: Record<string, string | null> = {
        rank: form.rank,
        division: form.division || null,
        job_title:
          form.rank === "kaicho" && form.jobTitle ? form.jobTitle : null,
      };

      if (canAssignAdmin(profile) && form.role !== member.role) {
        payload.role = form.role;
      }

      const res = await fetch(`/api/admin/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? t("admin.updateFailed"));
      }

      await loadMembers();
      success(`Data ${member.displayName} berhasil disimpan.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("admin.saveFailedGeneric");
      setError(msg);
      toastError(msg);
    } finally {
      setSavingId(null);
    }
  }

  async function handleAttendance(action: "check_in" | "check_out") {
    if (!selectedMember) {
      toastError(t("admin.selectMemberFirst"));
      return;
    }
    const member = members.find((m) => m.id === selectedMember);
    info(
      `Check ${action === "check_in" ? "In" : "Out"} untuk ${member?.displayName ?? "anggota"} belum tersedia.`
    );
  }

  function updateForm(
    memberId: string,
    field: keyof (typeof editForms)[string],
    value: string
  ) {
    setEditForms((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value,
        ...(field === "rank" && value !== "kaicho" ? { jobTitle: "" } : {}),
      },
    }));
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white-soft">{t("admin.title")}</h2>

      {error && (
        <p className="rounded-xl border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson">
          {error}
        </p>
      )}

      {canManage && (
        <Card className="p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white-soft">
              {t("admin.addNewMember")}
            </h3>
            <Button
              type="button"
              size="sm"
              variant={showAddForm ? "outline" : "primary"}
              onClick={() => setShowAddForm((prev) => !prev)}
            >
              {showAddForm ? t("admin.closeForm") : `+ ${t("admin.addMember")}`}
            </Button>
          </div>

          {showAddForm && (
            <form onSubmit={handleCreateMember} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Nama IC"
                  value={newMember.username}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, username: e.target.value }))
                  }
                  placeholder="namapengguna"
                  required
                  disabled={creating}
                  minLength={3}
                  maxLength={20}
                  pattern="[a-zA-Z0-9_]+"
                  title="3-20 karakter: huruf, angka, underscore"
                />
                <Input
                  label="Email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="anggota@email.com"
                  required
                  disabled={creating}
                />
                <Input
                  label="Kata Sandi"
                  type="password"
                  value={newMember.password}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Minimal 8 karakter"
                  required
                  disabled={creating}
                  minLength={8}
                />
                <label className="block text-sm">
                  <span className="mb-2 block font-medium text-gray-muted">Rank</span>
                  <select
                    value={newMember.rank}
                    onChange={(e) =>
                      setNewMember((prev) => ({
                        ...prev,
                        rank: e.target.value as Rank,
                        jobTitle: e.target.value === "kaicho" ? prev.jobTitle : "",
                      }))
                    }
                    disabled={creating}
                    className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-white-soft"
                  >
                    {RANKS.map((rank) => (
                      <option key={rank.slug} value={rank.slug}>
                        {rank.label}
                      </option>
                    ))}
                  </select>
                </label>
                {newMember.rank === "kaicho" && (
                  <label className="block text-sm">
                    <span className="mb-2 block font-medium text-gray-muted">Jabatan</span>
                    <select
                      value={newMember.jobTitle}
                      onChange={(e) =>
                        setNewMember((prev) => ({
                          ...prev,
                          jobTitle: e.target.value as JobTitle | "",
                        }))
                      }
                      disabled={creating}
                      className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-white-soft"
                    >
                      <option value="">—</option>
                      {JOB_TITLES.map((title) => (
                        <option key={title.slug} value={title.slug}>
                          {title.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="block text-sm">
                  <span className="mb-2 block font-medium text-gray-muted">Divisi</span>
                  <select
                    value={newMember.division}
                    onChange={(e) =>
                      setNewMember((prev) => ({
                        ...prev,
                        division: e.target.value as Division | "",
                      }))
                    }
                    disabled={creating}
                    className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-white-soft"
                  >
                    <option value="">Belum ditugaskan</option>
                    {DIVISIONS.map((division) => (
                      <option key={division.slug} value={division.slug}>
                        {division.label}
                      </option>
                    ))}
                  </select>
                </label>
                {profile && canAssignAdmin(profile) && (
                  <label className="block text-sm">
                    <span className="mb-2 block font-medium text-gray-muted">
                      Role Website
                    </span>
                    <select
                      value={newMember.role}
                      onChange={(e) =>
                        setNewMember((prev) => ({
                          ...prev,
                          role: e.target.value as SiteRole,
                        }))
                      }
                      disabled={creating}
                      className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-white-soft"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>
                )}
              </div>
              <Button type="submit" disabled={creating}>
                {creating ? "Menambahkan..." : "Tambah Anggota"}
              </Button>
            </form>
          )}
        </Card>
      )}

      {canManage && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-white-soft">
            {t("admin.manageMembers")}
          </h3>
          {loading ? (
            <p className="text-sm text-gray-muted">{t("dashboard.loadingMembers")}</p>
          ) : members.length === 0 ? (
            <EmptyState message={t("dashboard.noMembers")} />
          ) : (
            <div className="space-y-4">
              {members.map((member) => {
                const form = editForms[member.id];
                if (!form) return null;

                return (
                  <div
                    key={member.id}
                    className="rounded-xl border border-border bg-bg-secondary/50 p-4"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white-soft">
                        {member.displayName}
                      </span>
                      <Badge variant="gold">{member.rankLabel}</Badge>
                      <Badge variant="black">{member.divisionLabel}</Badge>
                      {member.role === "admin" && (
                        <Badge variant="crimson">Admin</Badge>
                      )}
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                      <label className="block text-sm">
                        <span className="mb-1 block text-gray-muted">Rank</span>
                        <select
                          value={form.rank}
                          onChange={(e) =>
                            updateForm(member.id, "rank", e.target.value)
                          }
                          className="w-full rounded-xl border border-border bg-bg-secondary px-3 py-2 text-white-soft"
                        >
                          {RANKS.map((rank) => (
                            <option key={rank.slug} value={rank.slug}>
                              {rank.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      {form.rank === "kaicho" && (
                        <label className="block text-sm">
                          <span className="mb-1 block text-gray-muted">
                            Jabatan
                          </span>
                          <select
                            value={form.jobTitle}
                            onChange={(e) =>
                              updateForm(member.id, "jobTitle", e.target.value)
                            }
                            className="w-full rounded-xl border border-border bg-bg-secondary px-3 py-2 text-white-soft"
                          >
                            <option value="">—</option>
                            {JOB_TITLES.map((title) => (
                              <option key={title.slug} value={title.slug}>
                                {title.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      <label className="block text-sm">
                        <span className="mb-1 block text-gray-muted">
                          Divisi
                        </span>
                        <select
                          value={form.division}
                          onChange={(e) =>
                            updateForm(member.id, "division", e.target.value)
                          }
                          className="w-full rounded-xl border border-border bg-bg-secondary px-3 py-2 text-white-soft"
                        >
                          <option value="">Belum ditugaskan</option>
                          {DIVISIONS.map((division) => (
                            <option key={division.slug} value={division.slug}>
                              {division.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      {profile && canAssignAdmin(profile) && (
                        <label className="block text-sm">
                          <span className="mb-1 block text-gray-muted">
                            Role Website
                          </span>
                          <select
                            value={form.role}
                            onChange={(e) =>
                              updateForm(member.id, "role", e.target.value)
                            }
                            className="w-full rounded-xl border border-border bg-bg-secondary px-3 py-2 text-white-soft"
                          >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                          </select>
                        </label>
                      )}
                    </div>
                    <div className="mt-3">
                      <Button
                        size="sm"
                        disabled={savingId === member.id}
                        onClick={() => handleSaveMember(member.id)}
                      >
                        {savingId === member.id ? "Menyimpan..." : "Simpan"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-white-soft">
          Catat Kehadiran Anggota
        </h3>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            disabled={!canRecordAttendance || members.length === 0}
            className="flex-1 rounded-xl border border-border bg-bg-secondary px-4 py-3 text-white-soft transition-colors focus:border-crimson focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Pilih Anggota</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.displayName} — {formatRankLabel(member.rank, member.jobTitle)}
              </option>
            ))}
          </select>
          <div className="flex gap-3">
            <Button
              disabled={!canRecordAttendance || !selectedMember}
              className="flex-1 sm:w-auto"
              onClick={() => handleAttendance("check_in")}
            >
              Check In
            </Button>
            <Button
              disabled={!canRecordAttendance || !selectedMember}
              variant="outline"
              className="flex-1 sm:w-auto"
              onClick={() => handleAttendance("check_out")}
            >
              Check Out
            </Button>
          </div>
        </div>

        <h4 className="text-md mb-4 font-semibold text-white-soft">
          Riwayat Kehadiran
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                  Anggota
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                  Aksi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                  Waktu
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="p-0">
                  <EmptyState message="Belum ada riwayat kehadiran. Data dari tabel attendance_logs." />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
