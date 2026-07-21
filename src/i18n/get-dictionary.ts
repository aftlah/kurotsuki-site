import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/id";
import { dictionary as id } from "./dictionaries/id";
import { dictionary as en } from "./dictionaries/en";
import { dictionary as ja } from "./dictionaries/ja";

const dictionaries: Record<Locale, Dictionary> = {
  id,
  en,
  ja,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.id;
}

export type { Dictionary };
