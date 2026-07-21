interface SeigaihaPatternProps {
  id?: string;
  className?: string;
}

export function SeigaihaPattern({
  id = "seigaiha",
  className = "",
}: SeigaihaPatternProps) {
  return (
    <svg
      className={`absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern
          id={id}
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="var(--color-crimson)"
            strokeWidth="0.5"
          />
          <circle
            cx="10"
            cy="10"
            r="5"
            fill="none"
            stroke="var(--color-crimson)"
            strokeWidth="0.5"
          />
          <circle
            cx="10"
            cy="10"
            r="2"
            fill="none"
            stroke="var(--color-crimson)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100" height="100" fill={`url(#${id})`} />
    </svg>
  );
}
