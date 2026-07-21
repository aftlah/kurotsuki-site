"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { AuthLayout } from "@/components/AuthLayout";

export default function ForgotPasswordPage() {
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
      <form className="space-y-6">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
        />
        <Button className="w-full" size="lg">
          Kirim Tautan Reset
        </Button>
      </form>
    </AuthLayout>
  );
}
