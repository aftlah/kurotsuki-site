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
import { isSiteAdmin } from "@/lib/organization/constants";
import type { ProfileRecord } from "@/lib/profile";

type ProfileResponse = {
  profile: ProfileRecord;
  rankLabel: string;
  divisionLabel: string | null;
};

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rankLabel, setRankLabel] = useState("");
  const [divisionLabel, setDivisionLabel] = useState<string | null>(null);

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
        toastError(data.error ?? "Gagal memuat profil.");
        return;
      }

      setUsername(data.profile.username);
      setDisplayName(data.profile.displayName ?? "");
      setAvatarUrl(data.profile.avatarUrl ?? "");
      setEmail(data.profile.email);
      setDiscordLinked(Boolean(data.profile.discordId));
      setRole(data.profile.role);
      setRankLabel(data.rankLabel);
      setDivisionLabel(data.divisionLabel);
    } catch {
      toastError("Gagal memuat profil.");
    } finally {
      setLoading(false);
    }
  }, [toastError]);

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
        toastError(data.error ?? "Gagal menyimpan profil.");
        return;
      }

      success(data.message ?? "Profil berhasil diperbarui.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      if (data.profile) {
        setUsername(data.profile.username);
        setDisplayName(data.profile.displayName ?? "");
        setAvatarUrl(data.profile.avatarUrl ?? "");
        setRankLabel(data.rankLabel ?? rankLabel);
        setDivisionLabel(data.divisionLabel ?? divisionLabel);
      }

      await updateSession();
    } catch {
      toastError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const previewName = displayName.trim() || username.trim() || session?.user?.name || "User";

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="p-8">
          <p className="text-center text-gray-muted">Memuat profil...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white-soft">Profil Saya</h2>
        <p className="mt-1 text-sm text-gray-muted">
          Perbarui informasi akun dan tampilan publik Anda.
        </p>
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
              {rankLabel && <Badge variant="gold">{rankLabel}</Badge>}
              {divisionLabel && <Badge variant="black">{divisionLabel}</Badge>}
              {isSiteAdmin(role as "member" | "admin") && (
                <Badge variant="crimson">Admin</Badge>
              )}
              {discordLinked && <Badge variant="black">Discord</Badge>}
            </div>
          </div>
        </div>

        <KatanaDivider />

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-muted">
              Informasi Publik
            </h3>

            <Input
              label="Nama IC"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              autoComplete="username"
              required
            />

            <Input
              label="Nama tampilan"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nama yang ditampilkan"
              autoComplete="name"
              required
            />

            <Input
              label="URL avatar"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              type="url"
            />
            <p className="text-xs text-gray-muted">
              Tempel URL gambar (Discord CDN, Imgur, dll). Kosongkan untuk inisial.
            </p>
          </section>

          <KatanaDivider />

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-muted">
              Akun
            </h3>

            <Input
              label="Email"
              value={email}
              readOnly
              disabled
              className="opacity-70"
            />
            <p className="text-xs text-gray-muted">
              Email tidak dapat diubah dari sini. Pangkat dan divisi dikelola admin.
            </p>
          </section>

          <KatanaDivider />

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-muted">
              Ubah Kata Sandi
            </h3>
            <p className="text-xs text-gray-muted">
              Kosongkan jika tidak ingin mengubah kata sandi.
              {discordLinked && " Akun Discord: gunakan forgot password jika belum pernah set sandi."}
            </p>

            <Input
              label="Kata sandi saat ini"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />

            <Input
              label="Kata sandi baru"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />

            <Input
              label="Konfirmasi kata sandi baru"
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
              Reset
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
