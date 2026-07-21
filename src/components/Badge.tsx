interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "crimson" | "black" | "success" | "warning";
  className?: string;
}

const variantStyles = {
  gold: "bg-gold/20 text-gold border-gold/30",
  crimson: "bg-crimson/20 text-crimson border-crimson/30",
  black: "bg-bg-secondary text-gray-muted border-border",
  success: "bg-success/20 text-success border-success/30",
  warning: "bg-warning/20 text-warning border-warning/30",
};

export function Badge({
  children,
  variant = "crimson",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wider ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
