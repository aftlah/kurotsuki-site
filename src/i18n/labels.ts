import type { Division, JobTitle, Rank } from "@/lib/organization/constants";
import type { Dictionary } from "./dictionaries/id";
import { translate } from "./translate";

export function rankLabelFromDict(
  dictionary: Dictionary,
  rank: Rank,
  jobTitle?: JobTitle | null
): string {
  const base = translate(dictionary, `ranks.${rank}`);
  if (rank === "kaicho" && jobTitle) {
    return `${base} (${translate(dictionary, `jobTitles.${jobTitle}`)})`;
  }
  return base;
}

export function divisionLabelFromDict(
  dictionary: Dictionary,
  division: Division | null | undefined
): string {
  if (!division) {
    return translate(dictionary, "common.unassigned");
  }
  return translate(dictionary, `divisions.${division}`);
}

export function rankDescriptionFromDict(
  dictionary: Dictionary,
  rank: Rank
): string {
  return translate(dictionary, `rankDescriptions.${rank}`);
}

export function divisionDescriptionFromDict(
  dictionary: Dictionary,
  division: Division
): string {
  return translate(dictionary, `divisionDescriptions.${division}`);
}
