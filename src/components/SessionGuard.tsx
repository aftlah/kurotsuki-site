"use client";

import { useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { ACCOUNT_DELETED_ERROR } from "@/lib/auth-errors";
import { useToast } from "@/components/Toast";
import { useTranslation } from "@/i18n/provider";

/** Forces logout when the account was deleted while the session is still open. */
export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();
  const { info } = useToast();
  const { t } = useTranslation();
  const signingOutRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated") return;

    const id = window.setInterval(() => {
      void update();
    }, 30_000);

    const onFocus = () => {
      void update();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [status, update]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.error !== ACCOUNT_DELETED_ERROR) return;
    if (signingOutRef.current) return;

    signingOutRef.current = true;
    info(t("auth.accountDeleted"));
    void signOut({ callbackUrl: "/login?error=account_deleted" });
  }, [session?.error, status, info, t]);

  return <>{children}</>;
}
