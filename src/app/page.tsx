"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { motion } from "framer-motion";

// Logo element justification: Homepage hero expresses the Red Dragon, Crescent Moon, Seigaiha waves,
// and Circular Crest from the logo. The design uses the brand tokens exclusively.
export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background: Seigaiha waves at 3-5% opacity */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 20% 80%, rgba(177,18,38,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(198,161,91,0.1) 0%, transparent 50%)`
      }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="seigaiha" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="8" fill="none" stroke="var(--color-crimson)" strokeWidth="0.5" />
              <circle cx="10" cy="10" r="5" fill="none" stroke="var(--color-crimson)" strokeWidth="0.5" />
              <circle cx="10" cy="10" r="2" fill="none" stroke="var(--color-crimson)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#seigaiha)" />
        </svg>
      </div>

      {/* Crescent Moon Glow */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-br from-crimson/30 to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-4xl px-6"
      >
        {/* Kurotsuki-Kai Logo */}
        <div className="flex items-center justify-center mb-8">
          <Image
            src="/logo_kurot.png"
            alt="Kurotsuki-Kai Logo"
            width={256}
            height={256}
            priority
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-widest mb-2 text-white-soft">
          KUROTSUKI-KAI
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold tracking-wider mb-6 text-gray-muted">
          黒月会
        </h2>
        <p className="text-lg md:text-xl text-white-soft/80 mb-10 max-w-2xl mx-auto">
          The Moon Watches. The Dragon Protects.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">
              Enter the Society
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

