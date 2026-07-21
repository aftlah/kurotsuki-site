"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { useTranslation } from "@/i18n/provider";

export default function ShopPage() {
  const { t } = useTranslation();
  const [cartCount] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white-soft">{t("shop.title")}</h2>
        <div className="flex items-center gap-3 rounded-full border border-border bg-surface-glass px-4 py-2">
          <svg
            className="h-5 w-5 text-gray-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="font-mono font-medium text-white-soft">{cartCount}</span>
        </div>
      </div>

      <EmptyState message={t("shop.empty")} />
    </div>
  );
}
