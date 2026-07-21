export const KTP_STORAGE_BUCKET = "member-intake-ktp";
export const MAX_KTP_FILE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_KTP_MIME = ["image/jpeg", "image/png", "image/webp"] as const;

export type MemberIntakeInput = {
  icName: string;
  japaneseName: string;
  citizenId: string;
  icPhone: string;
  vehiclePlates?: string | null;
};

export type MemberIntakeRecord = {
  id: string;
  icName: string;
  japaneseName: string;
  citizenId: string;
  icPhone: string;
  vehiclePlates: string | null;
  ktpPhotoPath: string;
  submittedBy: string | null;
  submittedByName: string | null;
  discordSentAt: string | null;
  discordError: string | null;
  createdAt: string;
};

export function validateMemberIntakeInput(input: MemberIntakeInput): string | null {
  if (!input.icName.trim()) {
    return "Nama IC wajib diisi.";
  }
  if (input.icName.trim().length > 50) {
    return "Nama IC maksimal 50 karakter.";
  }
  if (!input.japaneseName.trim()) {
    return "Nama Jepang wajib diisi.";
  }
  if (input.japaneseName.trim().length > 80) {
    return "Nama Jepang maksimal 80 karakter.";
  }
  if (!input.citizenId.trim()) {
    return "Citizen ID wajib diisi.";
  }
  if (input.citizenId.trim().length > 32) {
    return "Citizen ID maksimal 32 karakter.";
  }
  if (!input.icPhone.trim()) {
    return "Nomor HP IC wajib diisi.";
  }
  if (input.icPhone.trim().length > 20) {
    return "Nomor HP IC maksimal 20 karakter.";
  }
  if (input.vehiclePlates && input.vehiclePlates.length > 500) {
    return "Plat kendaraan terlalu panjang.";
  }
  return null;
}

export function validateKtpFile(file: File): string | null {
  if (!ALLOWED_KTP_MIME.includes(file.type as (typeof ALLOWED_KTP_MIME)[number])) {
    return "Foto KTP harus JPG, PNG, atau WebP.";
  }
  if (file.size > MAX_KTP_FILE_BYTES) {
    return "Foto KTP maksimal 5 MB.";
  }
  return null;
}

export function normalizeVehiclePlates(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  return value
    .split(/[\n,;]+/)
    .map((plate) => plate.trim())
    .filter(Boolean)
    .join(", ");
}

export function isDiscordIntakeWebhookConfigured(): boolean {
  return Boolean(process.env.DISCORD_MEMBER_INTAKE_WEBHOOK_URL);
}

type DiscordNotifyInput = MemberIntakeInput & {
  recordId: string;
  submittedByName: string;
  ktpFile: { buffer: Buffer; filename: string; contentType: string };
};

export async function sendMemberIntakeToDiscord(
  input: DiscordNotifyInput
): Promise<{ ok: boolean; error: string | null }> {
  const webhookUrl = process.env.DISCORD_MEMBER_INTAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    return { ok: false, error: "Discord webhook belum dikonfigurasi." };
  }

  const plates = normalizeVehiclePlates(input.vehiclePlates ?? "") ?? "—";
  const embed = {
    title: "📋 Pendataan Anggota Baru — Kurotsuki-Kai",
    color: 0xb11226,
    fields: [
      { name: "Nama IC", value: input.icName, inline: true },
      { name: "Nama Jepang", value: input.japaneseName, inline: true },
      { name: "Citizen ID", value: input.citizenId, inline: true },
      { name: "Nomor HP IC", value: input.icPhone, inline: true },
      { name: "Plat Kendaraan", value: plates, inline: false },
      { name: "Dicatat oleh", value: input.submittedByName, inline: true },
      { name: "ID Record", value: input.recordId, inline: true },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: "Kurotsuki-Kai Member Intake" },
  };

  const payload = {
    username: "Kurotsuki Intake",
    embeds: [embed],
  };

  const form = new FormData();
  form.append("payload_json", JSON.stringify(payload));
  form.append(
    "files[0]",
    new Blob([new Uint8Array(input.ktpFile.buffer)], {
      type: input.ktpFile.contentType,
    }),
    input.ktpFile.filename
  );

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return {
        ok: false,
        error: text || `Discord webhook gagal (${response.status}).`,
      };
    }

    return { ok: true, error: null };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Gagal mengirim ke Discord.",
    };
  }
}

export function buildKtpStoragePath(recordId: string, filename: string): string {
  const ext = filename.includes(".")
    ? filename.slice(filename.lastIndexOf("."))
    : ".jpg";
  return `${recordId}/ktp${ext.toLowerCase()}`;
}
