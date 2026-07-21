import type { Dictionary } from "./dictionaries/id";

export function translate(
  dictionary: Dictionary,
  key: string,
  params?: Record<string, string | number>
): string {
  const keys = key.split(".");
  let current: unknown = dictionary;

  for (const part of keys) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return key;
    }
    current = (current as Record<string, unknown>)[part];
  }

  if (typeof current !== "string") {
    return key;
  }

  if (!params) {
    return current;
  }

  return current.replace(/\{(\w+)\}/g, (_, token: string) =>
    String(params[token] ?? `{${token}}`)
  );
}

export function getGreetingKey(hour: number): "morning" | "afternoon" | "evening" {
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
