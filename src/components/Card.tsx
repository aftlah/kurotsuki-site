import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  variant?: "default" | "premium";
}

export function Card({
  children,
  className = "",
  hoverEffect = false,
  variant = "default",
}: CardProps) {
  const cornerColor =
    variant === "premium" ? "border-gold/40" : "border-crimson/30";

  return (
    <div
      className={`relative rounded-3xl border border-border bg-surface-glass shadow-xl backdrop-blur-xl ${
        hoverEffect
          ? "transition-all duration-300 hover:-translate-y-1 hover:border-crimson/30 hover:shadow-[0_0_30px_var(--color-glow)]"
          : ""
      } ${className}`}
    >
      <div
        className={`absolute left-0 top-0 h-8 w-8 rounded-tl-3xl border-l-4 border-t-4 ${cornerColor}`}
      />
      <div
        className={`absolute right-0 top-0 h-8 w-8 rounded-tr-3xl border-r-4 border-t-4 ${cornerColor}`}
      />
      <div
        className={`absolute bottom-0 left-0 h-8 w-8 rounded-bl-3xl border-b-4 border-l-4 ${cornerColor}`}
      />
      <div
        className={`absolute bottom-0 right-0 h-8 w-8 rounded-br-3xl border-b-4 border-r-4 ${cornerColor}`}
      />
      {children}
    </div>
  );
}
