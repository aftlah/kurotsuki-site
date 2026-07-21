"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { BrandBackground } from "@/components/BrandBackground";
import { SakuraParticles } from "@/components/SakuraParticles";
import { SiteFooter } from "@/components/SiteFooter";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/i18n/provider";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

export default function Home() {
  const { t } = useTranslation();

  return (
    <BrandBackground variant="hero" patternId="seigaiha-home" className="min-h-screen">
      <SakuraParticles />

      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center px-6 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 max-w-4xl text-center"
          >
            <motion.div
              variants={itemVariants}
              className="mb-8 flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 animate-moon-pulse rounded-full bg-crimson/20 blur-2xl" />
                <div className="relative rounded-full border-2 border-crimson/30 p-3 shadow-[0_0_40px_var(--color-glow)]">
                  <Image
                    src="/logo_kurot.png"
                    alt="Kurotsuki-Kai Logo"
                    width={220}
                    height={220}
                    priority
                  />
                </div>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-brand mb-2 text-5xl font-black tracking-[0.2em] text-white-soft md:text-7xl"
            >
              KUROTSUKI-KAI
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="font-brand mb-6 text-3xl font-bold tracking-wider text-gold md:text-5xl"
            >
              黒月会
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mx-auto mb-10 max-w-2xl text-lg italic text-white-soft/80 md:text-xl"
            >
              {t("home.tagline1")}
              <br className="hidden sm:block" /> {t("home.tagline2")}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col justify-center gap-4 sm:flex-row"
            >
              <Link href="/login">
                <Button size="lg">{t("home.enterSociety")}</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg">
                  {t("home.registerNow")}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </main>

        <SiteFooter />
      </div>
    </BrandBackground>
  );
}
