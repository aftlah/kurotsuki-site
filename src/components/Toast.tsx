"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  exiting?: boolean;
};

type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 4500;
const TOAST_EXIT_MS = 320;

const typeConfig: Record<
  ToastType,
  {
    label: string;
    corner: string;
    accent: string;
    iconBg: string;
    iconColor: string;
    glow: string;
    progress: string;
  }
> = {
  success: {
    label: "Berhasil",
    corner: "border-gold/50",
    accent: "text-gold",
    iconBg: "bg-gold/15 border-gold/30",
    iconColor: "text-gold",
    glow: "shadow-[0_0_24px_rgba(198,161,91,0.15)]",
    progress: "bg-gold",
  },
  error: {
    label: "Gagal",
    corner: "border-crimson/50",
    accent: "text-crimson",
    iconBg: "bg-crimson/15 border-crimson/30",
    iconColor: "text-dragon-red",
    glow: "shadow-[0_0_24px_var(--color-glow)]",
    progress: "bg-dragon-red",
  },
  info: {
    label: "Informasi",
    corner: "border-gold/35",
    accent: "text-gold/90",
    iconBg: "bg-surface-glass-light border-border",
    iconColor: "text-white-soft",
    glow: "shadow-[0_0_20px_rgba(183,28,28,0.12)]",
    progress: "bg-gold/70",
  },
};

const typeIcons: Record<ToastType, React.ReactNode> = {
  success: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  ),
  error: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
    />
  ),
  info: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 12a8 8 0 11-16 0 8 8 0 0116 0zm-8-3v4m0 4h.01"
    />
  ),
};

function ToastItemView({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const config = typeConfig[item.type];

  return (
    <div
      role="alert"
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border border-border bg-surface-glass backdrop-blur-xl ${
        item.exiting
          ? "animate-[toast-slide-out_0.32s_ease-in_forwards]"
          : "animate-[toast-slide-in_0.4s_ease-out_forwards]"
      } ${config.glow}`}
    >
      <div
        className={`absolute left-0 top-0 h-5 w-5 rounded-tl-2xl border-l-2 border-t-2 ${config.corner}`}
      />
      <div
        className={`absolute right-0 top-0 h-5 w-5 rounded-tr-2xl border-r-2 border-t-2 ${config.corner}`}
      />
      <div
        className={`absolute bottom-0 left-0 h-5 w-5 rounded-bl-2xl border-b-2 border-l-2 ${config.corner}`}
      />
      <div
        className={`absolute bottom-0 right-0 h-5 w-5 rounded-br-2xl border-b-2 border-r-2 ${config.corner}`}
      />

      <div className="relative flex items-start gap-3 px-4 py-3.5">
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${config.iconBg}`}
        >
          <svg
            className={`h-5 w-5 ${config.iconColor}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {typeIcons[item.type]}
          </svg>
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="mb-1 flex items-center gap-2">
            <span
              className={`font-accent text-[10px] font-bold uppercase tracking-[0.2em] ${config.accent}`}
            >
              {config.label}
            </span>
            <span className="h-px flex-1 bg-linear-to-r from-border to-transparent" />
          </div>
          <p className="text-sm leading-snug text-white-soft">{item.message}</p>
        </div>

        <button
          type="button"
          onClick={() => onDismiss(item.id)}
          className="shrink-0 rounded-lg p-1.5 text-gray-muted transition-colors hover:bg-surface-glass-light hover:text-white-soft"
          aria-label="Tutup notifikasi"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {!item.exiting && (
        <div className="h-0.5 w-full bg-bg-secondary/80">
          <div
            className={`h-full origin-left animate-[toast-progress_${TOAST_DURATION_MS}ms_linear_forwards] ${config.progress}`}
          />
        </div>
      )}
    </div>
  );
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-100 flex w-[min(100vw-2rem,400px)] flex-col gap-3 sm:right-6 sm:top-6"
      aria-live="polite"
      aria-label="Notifikasi Kurotsuki"
    >
      {toasts.map((item) => (
        <ToastItemView key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      setToasts((prev) => {
        const target = prev.find((t) => t.id === id);
        if (!target || target.exiting) return prev;
        return prev.map((t) => (t.id === id ? { ...t, exiting: true } : t));
      });

      const timer = timersRef.current.get(id);
      if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }

      window.setTimeout(() => removeToast(id), TOAST_EXIT_MS);
    },
    [removeToast]
  );

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);

      const autoTimer = window.setTimeout(() => dismiss(id), TOAST_DURATION_MS);
      timersRef.current.set(id, autoTimer);
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (message) => toast(message, "success"),
      error: (message) => toast(message, "error"),
      info: (message) => toast(message, "info"),
    }),
    [toast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
