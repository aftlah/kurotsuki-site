"use client";

import { useState } from "react";
import { BrandLoadingScreen } from "@/components/BrandLoadingScreen";

export function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <BrandLoadingScreen onComplete={() => setLoaded(true)} />}
      <div className={loaded ? "opacity-100 transition-opacity duration-500" : "opacity-0"}>
        {children}
      </div>
    </>
  );
}
