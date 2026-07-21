import { SeigaihaPattern } from "./SeigaihaPattern";

interface BrandBackgroundProps {
  variant?: "default" | "hero" | "auth";
  patternId?: string;
  children?: React.ReactNode;
  className?: string;
}

function RainLayer() {
  const drops = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${(i * 4.2) % 100}%`,
    delay: `${(i * 0.15) % 2}s`,
    duration: `${0.8 + (i % 5) * 0.2}s`,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20" aria-hidden>
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute h-8 w-px bg-gradient-to-b from-transparent via-white-soft/30 to-transparent"
          style={{
            left: drop.left,
            animation: `rain-fall ${drop.duration} linear infinite`,
            animationDelay: drop.delay,
          }}
        />
      ))}
    </div>
  );
}

function TempleSilhouettes() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 opacity-30"
      aria-hidden
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 200"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="templeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#111111" stopOpacity="0" />
            <stop offset="100%" stopColor="#111111" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d="M0 200 L0 120 L80 80 L160 120 L160 200 Z M200 200 L200 100 L280 60 L360 100 L360 200 Z M400 200 L400 110 L500 50 L600 110 L600 200 Z M650 200 L650 90 L750 40 L850 90 L850 200 Z M900 200 L900 115 L980 75 L1060 115 L1060 200 Z M1100 200 L1100 130 L1150 100 L1200 130 L1200 200 Z"
          fill="url(#templeGrad)"
        />
      </svg>
    </div>
  );
}

function LanternGlows() {
  const lanterns = [
    { left: "12%", top: "35%" },
    { left: "78%", top: "40%" },
    { left: "45%", top: "55%" },
  ];

  return (
    <>
      {lanterns.map((lantern, i) => (
        <div
          key={i}
          className="pointer-events-none absolute h-16 w-16 rounded-full bg-amber-500/10 blur-2xl"
          style={{ left: lantern.left, top: lantern.top }}
          aria-hidden
        />
      ))}
    </>
  );
}

function RedMoon() {
  return (
    <div
      className="pointer-events-none absolute right-[15%] top-[12%] animate-moon-pulse"
      aria-hidden
    >
      <svg width="80" height="80" viewBox="0 0 80 80">
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-dragon-red)" stopOpacity="0.8" />
            <stop offset="70%" stopColor="var(--color-crimson)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="40" cy="40" r="35" fill="url(#moonGlow)" />
        <path
          d="M40 10 A30 30 0 1 1 25 55 A22 22 0 1 0 40 10"
          fill="var(--color-dragon-red)"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

function FogLayer() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent opacity-80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-crimson/5 to-transparent blur-2xl"
        aria-hidden
      />
    </>
  );
}

export function BrandBackground({
  variant = "default",
  patternId = "seigaiha",
  children,
  className = "",
}: BrandBackgroundProps) {
  const isHero = variant === "hero";

  return (
    <div className={`relative min-h-full overflow-hidden bg-bg-primary ${className}`}>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(177,18,38,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(198,161,91,0.1) 0%, transparent 50%)`,
        }}
      >
        <SeigaihaPattern id={patternId} />
      </div>

      {isHero && (
        <>
          <TempleSilhouettes />
          <FogLayer />
          <RedMoon />
          <RainLayer />
          <LanternGlows />
        </>
      )}

      {children}
    </div>
  );
}
