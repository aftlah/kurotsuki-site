"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="seigaiha-forgot" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="8" fill="none" stroke="var(--color-crimson)" strokeWidth="0.5" />
              <circle cx="10" cy="10" r="5" fill="none" stroke="var(--color-crimson)" strokeWidth="0.5" />
              <circle cx="10" cy="10" r="2" fill="none" stroke="var(--color-crimson)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#seigaiha-forgot)" />
        </svg>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-crimson/20 to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <Card className="p-8">
          <div className="flex items-center justify-center mb-8">
            <Image
              src="/logo_kurot.png"
              alt="Kurotsuki-Kai Logo"
              width={128}
              height={128}
            />
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white-soft mb-2">Reset Password</h1>
            <p className="text-gray-muted">Enter your email to receive a reset link</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-muted mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border text-white-soft placeholder-gray-muted focus:outline-none focus:border-crimson transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <Button className="w-full" size="lg">
              Send Reset Link
            </Button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-muted">
            Remember your password?{" "}
            <Link href="/login" className="text-crimson hover:text-dragon-red font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
