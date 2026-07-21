import { NextResponse } from "next/server";
import { registerWithEmail } from "@/lib/supabase-auth";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!USERNAME_REGEX.test(username)) {
      return NextResponse.json(
        {
          error:
            "Nama pengguna harus 3-20 karakter (huruf, angka, underscore).",
        },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi minimal 8 karakter." },
        { status: 400 }
      );
    }

    const { user, error } = await registerWithEmail({
      username,
      email,
      password,
    });

    if (error || !user) {
      const status = error?.includes("sudah digunakan") ? 409 : 400;
      return NextResponse.json(
        { error: error ?? "Pendaftaran gagal." },
        { status }
      );
    }

    return NextResponse.json(
      {
        message: "Akun berhasil dibuat.",
        user: {
          id: user.id,
          username: user.name,
          email: user.email,
          role: user.role,
          rank: user.rank,
          division: user.division,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error && err.message.toLowerCase().includes("fetch")
            ? "Tidak dapat terhubung ke Supabase. Pastikan project aktif."
            : "Terjadi kesalahan saat mendaftar.",
      },
      { status: 500 }
    );
  }
}
