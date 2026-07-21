interface KatanaDividerProps {
  className?: string;
}

export function KatanaDivider({ className = "" }: KatanaDividerProps) {
  return (
    <div
      className={`flex items-center justify-center gap-4 py-2 opacity-70 ${className}`}
      aria-hidden
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      <svg
        className="h-5 w-5 text-crimson/50"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2L9 21l3 1 3-1z" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
