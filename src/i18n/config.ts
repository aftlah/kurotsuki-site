export const LOCALES = ["id", "en", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "id";

export const LOCALE_STORAGE_KEY = "kurotsuki-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  id: "ID",
  en: "EN",
  ja: "JA",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  id: "Indonesia",
  en: "English",
  ja: "日本語",
};

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
