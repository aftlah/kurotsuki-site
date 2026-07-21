"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Badge } from "@/components/Badge";
import { Avatar } from "@/components/Avatar";
import { KatanaDivider } from "@/components/KatanaDivider";
import { useToast } from "@/components/Toast";
import { isSiteAdmin, type Division, type JobTitle, type Rank } from "@/lib/organization/constants";
import type { ProfileRecord } from "@/lib/profile";
import { useTranslation } from "@/i18n/provider";

type ProfileResponse = {
  profile: ProfileRecord;
  rankLabel: string;
  divisionLabel: string | null;
};

export default function ProfilePage() {
  const { t, rankLabel: rankLabelT, divisionLabel: divisionLabelT } = useTranslation();
  const { data: session, update: updateSession } = useSession();
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileRank, setProfileRank] = useState<Rank>("shinjin");
  const [profileJobTitle, setProfileJobTitle] = useState<JobTitle | null>(null);
  const [profileDivision, setProfileDivision] = useState<Division | null>(null);

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [discordLinked, setDiscordLinked] = useState(false);
  const [role, setRole] = useState("member");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/profile");
      const data: ProfileResponse & { error?: string } = await response.json();

      if (!response.ok) {
        toastError(data.error ?? t("profile.loadFailed"));
        return;
      }

      setUsername(data.profile.username);
      setDisplayName(data.profile.displayName ?? "");
      setAvatarUrl(data.profile.avatarUrl ?? "");
      setEmail(data.profile.email);
      setDiscordLinked(Boolean(data.profile.discordId));
      setRole(data.profile.role);
      setProfileRank(data.profile.rank as Rank);
      setProfileJobTitle((data.profile.jobTitle as JobTitle | null) ?? null);
      setProfileDivision((data.profile.division as Division | null) ?? null);
    } catch {
      toastError(t("profile.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [toastError, t]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          display_name: displayName.trim(),
          avatar_url: avatarUrl.trim() || null,
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toastError(data.error ?? t("profile.saveFailed"));
        return;
      }

      success(data.message ?? t("common.save"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      if (data.profile) {
        setUsername(data.profile.username);
        setDisplayName(data.profile.displayName ?? "");
        setAvatarUrl(data.profile.avatarUrl ?? "");
        setProfileRank(data.profile.rank as Rank);
        setProfileJobTitle((data.profile.jobTitle as JobTitle | null) ?? null);
        setProfileDivision((data.profile.division as Division | null) ?? null);
      }

      await updateSession();
    } catch {
      toastError(t("auth.genericError"));
    } finally {
      setSaving(false);
    }
  };

  const previewName =
    displayName.trim() || username.trim() || session?.user?.name || t("common.user");
  const rankLabel = rankLabelT(profileRank, profileJobTitle);
  const divisionLabel = divisionLabelT(profileDivision);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="p-8">
          <p className="text-center text-gray-muted">{t("profile.loading")}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white-soft">{t("profile.title")}</h2>
        <p className="mt-1 text-sm text-gray-muted">{t("profile.subtitle")}</p>
      </div>

      <Card className="p-6 md:p-8" variant="premium">
        <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Avatar
            name={previewName}
            src={avatarUrl.trim() || undefined}
            size="lg"
            borderColor="gold"
          />
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold text-white-soft">{previewName}</p>
            <p className="text-sm text-gray-muted">@{username}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge variant="gold">{rankLabel}</Badge>
              {profileDivision && (
                <Badge variant="black">{divisionLabel}</Badge>
              )}
              {isSiteAdmin(role as "member" | "admin") && (
                <Badge variant="crimson">{t("common.admin")}</Badge>
              )}
              {discordLinked && (
                <Badge variant="black">{t("common.discord")}</Badge>
              )}
            </div>
          </div>
        </div>

        <KatanaDivider />

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <section className="space-y-4">
            <h3 className="font-accent text-sm font-semibold uppercase tracking-wider text-gray-muted">
              {t("profile.publicInfo")}
            </h3>

            <Input
              label={t("common.username")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              autoComplete="username"
              required
            />

            <Input
              label={t("common.displayName")}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t("common.displayName")}
              autoComplete="name"
              required
            />

            <Input
              label={t("profile.avatarUrl")}
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              type="url"
            />
            <p className="text-xs text-gray-muted">{t("profile.avatarHint")}</p>
          </section>

          <KatanaDivider />

          <section className="space-y-4">
            <h3 className="font-accent text-sm font-semibold uppercase tracking-wider text-gray-muted">
              {t("profile.account")}
            </h3>

            <Input
              label={t("common.email")}
              value={email}
              readOnly
              disabled
              className="opacity-70"
            />
            <p className="text-xs text-gray-muted">{t("profile.emailReadonly")}</p>
          </section>

          <KatanaDivider />

          <section className="space-y-4">
            <h3 className="font-accent text-sm font-semibold uppercase tracking-wider text-gray-muted">
              {t("profile.changePassword")}
            </h3>
            <p className="text-xs text-gray-muted">
              {t("profile.passwordHint")}
              {discordLinked && t("profile.passwordDiscordHint")}
            </p>

            <Input
              label={t("profile.currentPassword")}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />

            <Input
              label={t("profile.newPassword")}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />

            <Input
              label={t("profile.confirmNewPassword")}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </section>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => void loadProfile()}
              disabled={saving}
            >
              {t("common.reset")}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
