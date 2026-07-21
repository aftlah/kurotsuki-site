"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Division, JobTitle, Rank } from "@/lib/organization/constants";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "./config";
import { getDictionary, type Dictionary } from "./get-dictionary";
import {
  divisionDescriptionFromDict,
  divisionLabelFromDict,
  rankDescriptionFromDict,
  rankLabelFromDict,
} from "./labels";
import { translate } from "./translate";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dictionary: Dictionary;
  t: (key: string, params?: Record<string, string | number>) => string;
  rankLabel: (rank: Rank, jobTitle?: JobTitle | null) => string;
  divisionLabel: (division: Division | null | undefined) => string;
  rankDescription: (rank: Rank) => string;
  divisionDescription: (division: Division) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored && isLocale(stored) ? stored : DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(readStoredLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale, ready]);

  const dictionary = useMemo(() => getDictionary(locale), [locale]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) =>
      translate(dictionary, key, params),
    [dictionary]
  );

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      dictionary,
      t,
      rankLabel: (rank, jobTitle) =>
        rankLabelFromDict(dictionary, rank, jobTitle),
      divisionLabel: (division) => divisionLabelFromDict(dictionary, division),
      rankDescription: (rank) => rankDescriptionFromDict(dictionary, rank),
      divisionDescription: (division) =>
        divisionDescriptionFromDict(dictionary, division),
    }),
    [dictionary, locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within I18nProvider");
  }
  return context;
}
