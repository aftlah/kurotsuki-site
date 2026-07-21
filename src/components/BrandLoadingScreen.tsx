"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface BrandLoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

export function BrandLoadingScreen({
  onComplete,
  minDuration = 2500,
}: BrandLoadingScreenProps) {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, minDuration),
    ];

    return () => timers.forEach(clearTimeout);
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-primary"
        >
          <div
            className="absolute inset-0 animate-ink-spread opacity-20"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--color-crimson) 0%, transparent 70%)",
            }}
          />

          {phase >= 1 && (
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 0.8 }}
              className="absolute h-full w-full"
              viewBox="0 0 400 200"
              aria-hidden
            >
              <motion.path
                d="M0 100 Q200 50 400 100"
                fill="none"
                stroke="var(--color-crimson)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
              />
            </motion.svg>
          )}

          <div className="relative flex flex-col items-center">
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-16 h-24 w-24 animate-moon-pulse rounded-full bg-gradient-to-br from-crimson/40 to-transparent blur-2xl"
              />
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <Image
                src="/logo_kurot.png"
                alt="Kurotsuki-Kai"
                width={160}
                height={160}
                priority
              />
            </motion.div>

            {phase >= 3 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 font-serif-jp text-lg tracking-widest text-gold"
              >
                黒月会
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
