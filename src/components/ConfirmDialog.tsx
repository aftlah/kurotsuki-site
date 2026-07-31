"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  confirming?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirming = false,
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !confirming) {
        onCancel();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, confirming, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label={cancelLabel}
        disabled={confirming}
        onClick={() => {
          if (!confirming) onCancel();
        }}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-bg-secondary shadow-[0_0_40px_rgba(183,28,28,0.2)]"
      >
        <div className="absolute left-0 top-0 h-8 w-8 rounded-tl-3xl border-l-4 border-t-4 border-crimson/40" />
        <div className="absolute right-0 top-0 h-8 w-8 rounded-tr-3xl border-r-4 border-t-4 border-crimson/40" />
        <div className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-3xl border-b-4 border-l-4 border-crimson/40" />
        <div className="absolute bottom-0 right-0 h-8 w-8 rounded-br-3xl border-b-4 border-r-4 border-crimson/40" />

        <div className="relative p-6 md:p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-crimson/30 bg-crimson/15 text-crimson">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>

          <h3
            id="confirm-dialog-title"
            className="text-xl font-bold text-white-soft"
          >
            {title}
          </h3>
          <p
            id="confirm-dialog-desc"
            className="mt-2 text-sm leading-relaxed text-gray-muted"
          >
            {message}
          </p>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={confirming}
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={danger ? "primary" : "gold"}
              disabled={confirming}
              onClick={onConfirm}
              className={
                danger
                  ? "border-dragon-red bg-crimson/20 text-white-soft hover:border-dragon-red hover:shadow-[0_0_20px_var(--color-glow)]"
                  : undefined
              }
            >
              {confirming ? "..." : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
