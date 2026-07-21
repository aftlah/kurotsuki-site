"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BrandBackground } from "./BrandBackground";
import { CrescentMoonGlow } from "./CrescentMoonGlow";
import { Card } from "./Card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footer?: React.ReactNode;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  footer,
}: AuthLayoutProps) {
  return (
    <BrandBackground variant="auth" patternId="seigaiha-auth" className="min-h-screen">
      <div className="relative flex min-h-screen items-center justify-center">
        <CrescentMoonGlow
          size="lg"
          className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md px-6"
        >
          <Card className="p-8">
            <div className="mb-6 flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 rounded-full bg-crimson/20 blur-xl" />
                <div className="relative rounded-full border border-crimson/30 p-2">
                  <Image
                    src="/logo_kurot.png"
                    alt="Kurotsuki-Kai Logo"
                    width={112}
                    height={112}
                    priority
                  />
                </div>
              </div>
              <p className="font-serif-jp text-lg tracking-widest text-gold">
                黒月会
              </p>
            </div>

            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold text-white-soft">
                {title}
              </h1>
              <p className="text-gray-muted">{subtitle}</p>
            </div>

            {children}

            {footer && <div className="mt-8">{footer}</div>}
          </Card>
        </motion.div>
      </div>
    </BrandBackground>
  );
}
