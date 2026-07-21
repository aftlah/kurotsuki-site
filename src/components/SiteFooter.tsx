"use client";

import { SeigaihaPattern } from "./SeigaihaPattern";
import { useTranslation } from "@/i18n/provider";

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="relative z-10 border-t border-border bg-bg-primary/80 py-8 backdrop-blur-sm">
      <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
        <SeigaihaPattern id="seigaiha-footer" />
      </div>
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 text-center">
        <p className="font-brand text-xl tracking-widest text-gold">黒月会</p>
        <p className="font-accent text-sm tracking-widest text-gold/80">
          KUROTSUKI-KAI
        </p>
        <p className="text-xs italic text-gray-muted/80">
          {t("home.tagline1")} {t("home.tagline2")}
        </p>
        <p className="mt-2 text-xs text-gray-muted/60">
          {t("home.footerRights", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
