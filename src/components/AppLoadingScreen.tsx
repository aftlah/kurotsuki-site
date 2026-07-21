"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AppLoadingScreenProps {
  onComplete?: () => void;
}

export function AppLoadingScreen({ onComplete }: AppLoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const finish = () => {
      setVisible(false);
      onComplete?.();
    };

    if (document.readyState === "complete") {
      finish();
      return;
    }

    window.addEventListener("load", finish, { once: true });
    return () => window.removeEventListener("load", finish);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-primary"
          aria-live="polite"
          aria-busy="true"
          aria-label="Loading"
        >
          <div
            className="h-9 w-9 animate-spin rounded-full border-2 border-border border-t-crimson"
            role="status"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
