const petals = [
  { left: "8%", top: "15%", delay: "0s", size: 12 },
  { left: "92%", top: "20%", delay: "2s", size: 10 },
  { left: "5%", top: "75%", delay: "4s", size: 11 },
  { left: "88%", top: "80%", delay: "1s", size: 9 },
  { left: "15%", top: "45%", delay: "3s", size: 8 },
  { left: "85%", top: "50%", delay: "5s", size: 10 },
  { left: "50%", top: "8%", delay: "2.5s", size: 9 },
  { left: "70%", top: "90%", delay: "1.5s", size: 11 },
];

function SakuraPetal({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2c-1 3-3 5-6 5 3 1 5 3 6 6 1-3 3-5 6-6-3 0-5-2-6-5z"
        fill="none"
        stroke="var(--color-crimson)"
        strokeWidth="0.8"
        opacity="0.4"
      />
    </svg>
  );
}

export function SakuraParticles({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {petals.map((petal, i) => (
        <div
          key={i}
          className="absolute animate-sakura-float"
          style={{
            left: petal.left,
            top: petal.top,
            animationDelay: petal.delay,
          }}
        >
          <SakuraPetal size={petal.size} />
        </div>
      ))}
    </div>
  );
}
