import {
  DIVISIONS,
  JOB_TITLES,
  RANKS,
  type Division,
  type Rank,
} from "./constants";

export const RANK_DESCRIPTIONS: Record<Rank, string> = {
  oyabun: "Pemimpin tertinggi Kurotsuki-Kai.",
  wakagashira: "Wakil pemimpin, mengawasi seluruh operasi organisasi.",
  kaicho: "Kepala divisi — memimpin unit kerja masing-masing.",
  onnakashira: "Pemimpin wanita dalam struktur organisasi.",
  taicho: "Kapten unit, memimpin tim di bawah divisi.",
  koseiin: "Anggota senior yang telah terbukti loyalitasnya.",
  shinjin: "Anggota baru yang sedang dalam masa perkenalan.",
};

export const DIVISION_DESCRIPTIONS: Record<Division, string> = {
  kitsune_unit: "Unit operasional utama — garis depan Kurotsuki-Kai.",
  mitsugyo: "Divisi bisnis dan pengembangan ekonomi organisasi.",
  somukanri: "Urusan umum, administrasi, dan koordinasi internal.",
  ryutsutosei: "Distribusi, logistik, dan alur operasional.",
  geenbakodo: "Pelatihan, disiplin, dan pengembangan kemampuan anggota.",
  kodosakusenbu: "Perencanaan aksi dan strategi operasional.",
};

export const HIERARCHY_INTRO =
  "Struktur pangkat dan divisi Kurotsuki-Kai. Setiap anggota memiliki peran dalam hierarki yang menjaga honor, disiplin, dan tradisi persekutuan.";

export { RANKS, DIVISIONS, JOB_TITLES };
