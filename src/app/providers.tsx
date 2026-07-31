"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/Toast";
import { SessionGuard } from "@/components/SessionGuard";
import { I18nProvider } from "@/i18n/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={30} refetchOnWindowFocus>
      <I18nProvider>
        <ToastProvider>
          <SessionGuard>{children}</SessionGuard>
        </ToastProvider>
      </I18nProvider>
    </SessionProvider>
  );
}
