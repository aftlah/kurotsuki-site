"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/Badge";
import { useToast } from "@/components/Toast";
import { useTranslation } from "@/i18n/provider";
import { can, toOrgProfile } from "@/lib/organization/permissions";

type PendingMember = {
  id: string;
  username: string;
  displayName: string;
  membershipStatus: "pending" | "approved";
  discordId?: string | null;
  createdAt?: string;
};

export default function AccPage() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const { success, error: toastError } = useToast();
  const profile = useMemo(
    () => (session?.user ? toOrgProfile(session.user) : null),
    [session?.user]
  );

  const canManage = profile ? can(profile, "members.manage") : false;
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadPending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? t("acc.loadFailed"));
      }
      const pending = ((data.members ?? []) as PendingMember[]).filter(
        (m) => m.membershipStatus === "pending"
      );
      setPendingMembers(pending);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("acc.loadFailed");
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  }, [toastError, t]);

  useEffect(() => {
    void loadPending();
  }, [loadPending]);

  async function handleApprove(memberId: string) {
    const member = pendingMembers.find((m) => m.id === memberId);
    if (!member || !canManage) return;

    setBusyId(memberId);
    setError(null);

    try {
      const res = await fetch(`/api/admin/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membership_status: "approved" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? t("acc.approveFailed"));
      }

      success(t("acc.approveSuccess", { name: member.displayName }));
      await loadPending();
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("acc.approveFailed");
      setError(msg);
      toastError(msg);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(memberId: string) {
    const member = pendingMembers.find((m) => m.id === memberId);
    if (!member || !canManage) return;

    const confirmed = window.confirm(
      t("acc.deleteConfirm", { name: member.displayName })
    );
    if (!confirmed) return;

    setBusyId(memberId);
    setError(null);

    try {
      const res = await fetch(`/api/admin/members/${memberId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? t("acc.deleteFailed"));
      }

      success(t("acc.deleteSuccess", { name: member.displayName }));
      await loadPending();
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("acc.deleteFailed");
      setError(msg);
      toastError(msg);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white-soft">{t("acc.title")}</h2>
        <p className="mt-1 text-sm text-gray-muted">{t("acc.subtitle")}</p>
      </div>

      {error && (
        <p className="rounded-xl border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-crimson">
          {error}
        </p>
      )}

      <Card className="p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-white-soft">
            {t("acc.queueTitle")}
          </h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void loadPending()}
            disabled={loading}
          >
            {t("acc.refresh")}
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-muted">{t("dashboard.loadingMembers")}</p>
        ) : !canManage ? (
          <EmptyState message={t("admin.noManagePermission")} />
        ) : pendingMembers.length === 0 ? (
          <EmptyState message={t("acc.empty")} />
        ) : (
          <div className="space-y-3">
            {pendingMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-bg-secondary/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white-soft">
                      {member.displayName}
                    </span>
                    <Badge variant="crimson">{t("acc.pendingBadge")}</Badge>
                    {member.discordId ? (
                      <Badge variant="black">{t("common.discord")}</Badge>
                    ) : (
                      <Badge variant="black">{t("common.email")}</Badge>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-muted">
                    @{member.username}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    disabled={busyId === member.id}
                    onClick={() => void handleApprove(member.id)}
                  >
                    {busyId === member.id
                      ? t("acc.approving")
                      : t("acc.approve")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyId === member.id}
                    onClick={() => void handleDelete(member.id)}
                  >
                    {t("acc.delete")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
