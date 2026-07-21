"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { AuthLayout } from "@/components/AuthLayout";

export default function RegisterPage() {
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
      <form className="space-y-6">
        <Input label="Nama Pengguna" type="text" placeholder="namapengguna" />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
        />
        <Input
          label="Kata Sandi"
          type="password"
          placeholder="••••••••"
          required
        />
        <Button className="w-full" size="lg">
          Buat Akun
        </Button>
      </form>
    </AuthLayout>
  );
}
