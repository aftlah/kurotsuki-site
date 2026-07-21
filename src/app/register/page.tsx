"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { AuthLayout } from "@/components/AuthLayout";
import { useToast } from "@/components/Toast";
import { useTranslation } from "@/i18n/provider";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { success, error: toastError, info } = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      const msg = t("auth.passwordMismatch");
      setError(msg);
      toastError(msg);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      let data: { error?: string; message?: string } = {};
      try {
        data = await response.json();
      } catch {
        const msg = t("auth.invalidServerResponse");
        setError(msg);
        toastError(msg);
        return;
      }

      if (!response.ok) {
        const msg = data.error ?? t("auth.registerFailed");
        setError(msg);
        toastError(msg);
        return;
      }

      success(t("auth.registerSuccess"));

      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        info(t("auth.registerLoginPrompt"));
        window.location.href = "/login";
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      const msg = t("auth.genericError");
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth.joinSociety")}
      subtitle={t("auth.registerSubtitle")}
      footer={
        <p className="text-center text-sm text-gray-muted">
          {t("auth.hasAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-crimson transition-colors hover:text-dragon-red"
          >
            {t("auth.login")}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl border border-danger bg-danger/20 p-3 text-center text-sm text-white-soft">
            {error}
          </div>
        )}

        <Input
          label={t("auth.icName")}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="namapengguna"
          required
          disabled={loading}
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9_]+"
          title={t("auth.usernameHint")}
        />

        <Input
          label={t("common.email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={loading}
        />

        <Input
          label={t("common.password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={loading}
          minLength={8}
        />

        <Input
          label={t("auth.confirmPassword")}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={loading}
          minLength={8}
        />

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? t("common.processing") : t("auth.createAccount")}
        </Button>
      </form>
    </AuthLayout>
  );
}
