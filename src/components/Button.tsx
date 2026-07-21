import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-surface-glass border-crimson text-white-soft hover:shadow-[0_0_20px_var(--color-glow)] hover:border-dragon-red focus:ring-crimson",
    outline:
      "bg-transparent border-border text-white-soft hover:border-crimson hover:text-white-soft focus:ring-crimson",
    ghost:
      "bg-transparent border-transparent text-gray-muted hover:text-white-soft focus:ring-crimson",
    gold: "bg-gold/10 border-gold text-gold hover:shadow-[0_0_20px_rgba(198,161,91,0.25)] hover:border-gold focus:ring-gold",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
