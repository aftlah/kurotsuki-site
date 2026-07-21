import { SeigaihaPattern } from "./SeigaihaPattern";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border bg-bg-primary/80 py-8 backdrop-blur-sm">
      <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
        <SeigaihaPattern id="seigaiha-footer" />
      </div>
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 text-center">
        <p className="font-serif-jp text-xl tracking-widest text-gold">黒月会</p>
        <p className="text-sm tracking-widest text-gray-muted">
          KUROTSUKI-KAI
        </p>
        <p className="text-xs italic text-gray-muted/80">
          The Moon Watches. The Dragon Protects.
        </p>
        <p className="mt-2 text-xs text-gray-muted/60">
          &copy; {new Date().getFullYear()} Kurotsuki-Kai. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
