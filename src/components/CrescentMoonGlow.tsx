interface CrescentMoonGlowProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-48 w-48",
  md: "h-64 w-64",
  lg: "h-96 w-96",
};

export function CrescentMoonGlow({
  className = "",
  size = "md",
}: CrescentMoonGlowProps) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full bg-gradient-to-br from-crimson/30 to-transparent blur-3xl animate-moon-pulse ${sizeClasses[size]} ${className}`}
      aria-hidden
    />
  );
}
