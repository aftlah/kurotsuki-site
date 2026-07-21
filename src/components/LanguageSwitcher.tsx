"use client";

import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";
import { useTranslation } from "@/i18n/provider";

type LanguageSwitcherProps = {
  compact?: boolean;
  className?: string;
};

export function LanguageSwitcher({
  compact = false,
  className = "",
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useTranslation();

  return (
    <div
      className={`inline-flex items-center rounded-xl border border-border bg-surface-glass p-1 ${className}`}
      role="group"
      aria-label={t("common.language")}
    >
      {LOCALES.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code as Locale)}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
              active
                ? "bg-crimson/20 text-crimson shadow-[0_0_12px_var(--color-glow)]"
                : "text-gray-muted hover:text-white-soft"
            } ${compact ? "min-w-[2rem]" : "min-w-[2.5rem]"}`}
            aria-pressed={active}
            title={code.toUpperCase()}
          >
            {LOCALE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
