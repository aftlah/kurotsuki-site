interface AvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg";
  borderColor?: "gold" | "crimson" | "gray";
  status?: "online" | "offline" | "away";
  className?: string;
}

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-lg",
};

const borderClasses = {
  gold: "border-gold",
  crimson: "border-crimson",
  gray: "border-border",
};

const statusClasses = {
  online: "bg-success",
  offline: "bg-gray-muted",
  away: "bg-warning",
};

export function Avatar({
  name = "?",
  size = "md",
  borderColor = "gray",
  status,
  className = "",
}: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-full border-2 bg-gradient-to-br from-white/10 to-bg-secondary font-bold text-white-soft ${sizeClasses[size]} ${borderClasses[borderColor]}`}
      >
        {initial}
      </div>
      {status && (
        <div
          className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-bg-primary ${statusClasses[status]}`}
        />
      )}
    </div>
  );
}
