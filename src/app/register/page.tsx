"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { AuthLayout } from "@/components/AuthLayout";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      let data: { error?: string; message?: string } = {};
      try {
        data = await response.json();
      } catch {
        setError("Respons server tidak valid. Coba lagi.");
        return;
      }

      if (!response.ok) {
        setError(data.error ?? "Pendaftaran gagal.");
        return;
      }

      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        window.location.href = "/login";
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Join the Society"
      subtitle="Buat akun baru Anda"
      footer={
        <p className="text-center text-sm text-gray-muted">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-crimson transition-colors hover:text-dragon-red"
          >
            Masuk
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl border border-danger bg-danger/20 p-3 text-center text-sm text-white-soft">
            {error}
          </div>
        )}

        <Input
          label="Nama Pengguna"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="namapengguna"
          required
          disabled={loading}
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9_]+"
          title="3-20 karakter: huruf, angka, underscore"
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={loading}
        />

        <Input
          label="Kata Sandi"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={loading}
          minLength={8}
        />

        <Input
          label="Konfirmasi Kata Sandi"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={loading}
          minLength={8}
        />

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Memproses..." : "Buat Akun"}
        </Button>
      </form>
    </AuthLayout>
  );
}
