"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { AuthLayout } from "@/components/AuthLayout";
import { useToast } from "@/components/Toast";
import { useTranslation } from "@/i18n/provider";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { info, error: toastError } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      info(t("auth.resetNotAvailable"));
    } catch {
      toastError(t("auth.resetSendFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title={t("auth.resetPassword")}
      subtitle={t("auth.forgotSubtitle")}
      footer={
        <p className="text-center text-sm text-gray-muted">
          {t("auth.rememberPassword")}{" "}
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
        <Input
          label={t("common.email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={loading}
        />
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? t("common.processing") : t("auth.sendResetLink")}
        </Button>
      </form>
    </AuthLayout>
  );
}
