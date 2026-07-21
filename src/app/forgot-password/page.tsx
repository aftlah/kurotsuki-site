"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { AuthLayout } from "@/components/AuthLayout";
import { useToast } from "@/components/Toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { info, error: toastError } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend reset password belum diimplementasi
      await new Promise((resolve) => setTimeout(resolve, 600));
      info("Fitur reset password belum tersedia. Hubungi admin.");
    } catch {
      toastError("Gagal mengirim tautan reset.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Masukkan email untuk menerima tautan reset"
      footer={
        <p className="text-center text-sm text-gray-muted">
          Ingat kata sandi?{" "}
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
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={loading}
        />
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Memproses..." : "Kirim Tautan Reset"}
        </Button>
      </form>
    </AuthLayout>
  );
}
