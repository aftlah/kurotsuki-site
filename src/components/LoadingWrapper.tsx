"use client";

import { useState } from "react";
import { AppLoadingScreen } from "@/components/AppLoadingScreen";

export function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <AppLoadingScreen onComplete={() => setLoaded(true)} />}
      <div
        className={
          loaded ? "opacity-100" : "pointer-events-none opacity-0"
        }
      >
        {children}
      </div>
    </>
  );
}
