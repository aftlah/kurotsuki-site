"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";
import { useTranslation } from "@/i18n/provider";

export default function PendingApprovalPage() {
  const { t } = useTranslation();
  const { info } = useToast();
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.membershipStatus === "approved") {
      router.replace("/dashboard");
    }
  }, [session?.user?.membershipStatus, router]);

  useEffect(() => {
    const id = window.setInterval(() => {
      void updateSession();
    }, 15_000);
    return () => window.clearInterval(id);
  }, [updateSession]);

  const handleSignOut = () => {
    info(t("nav.signingOut"));
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center">
      <Card className="w-full p-8 text-center" variant="premium">
        <p className="font-accent text-xs font-semibold uppercase tracking-widest text-crimson">
          {t("pending.badge")}
        </p>
        <h2 className="mt-3 text-2xl font-bold text-white-soft">
          {t("pending.title")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-muted">
          {t("pending.body")}
        </p>
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={handleSignOut}>
            {t("common.signOut")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
