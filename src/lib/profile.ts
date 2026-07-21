export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
export const DISPLAY_NAME_MAX = 50;
export const AVATAR_URL_MAX = 500;

export function validateUsername(username: string): string | null {
  const value = username.trim();
  if (!USERNAME_REGEX.test(value)) {
    return "Nama IC harus 3-20 karakter (huruf, angka, underscore).";
  }
  return null;
}

export function validateDisplayName(displayName: string): string | null {
  const value = displayName.trim();
  if (value.length === 0) {
    return "Nama tampilan tidak boleh kosong.";
  }
  if (value.length > DISPLAY_NAME_MAX) {
    return `Nama tampilan maksimal ${DISPLAY_NAME_MAX} karakter.`;
  }
  return null;
}

export function validateAvatarUrl(avatarUrl: string): string | null {
  const value = avatarUrl.trim();
  if (!value) {
    return null;
  }
  if (value.length > AVATAR_URL_MAX) {
    return "URL avatar terlalu panjang.";
  }
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "URL avatar harus http atau https.";
    }
  } catch {
    return "URL avatar tidak valid.";
  }
  return null;
}

export function validatePasswordChange(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): string | null {
  if (!input.currentPassword && !input.newPassword && !input.confirmPassword) {
    return null;
  }

  if (!input.currentPassword) {
    return "Masukkan kata sandi saat ini.";
  }
  if (input.newPassword.length < 8) {
    return "Kata sandi baru minimal 8 karakter.";
  }
  if (input.newPassword !== input.confirmPassword) {
    return "Konfirmasi kata sandi baru tidak cocok.";
  }
  if (input.currentPassword === input.newPassword) {
    return "Kata sandi baru harus berbeda dari yang lama.";
  }
  return null;
}

export type ProfileRecord = {
  id: string;
  username: string;
  displayName: string | null;
  email: string;
  avatarUrl: string | null;
  rank: string;
  jobTitle: string | null;
  division: string | null;
  role: string;
  discordId: string | null;
  vitalityPoints: number;
  streak: number;
  focusHours: number;
  createdAt: string;
  updatedAt: string;
};
