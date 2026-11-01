import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The hero writer as a cute plush 3D figure. three.js is loaded lazily after
 * hydration so it never blocks the first paint; until then (and if WebGL is
 * unavailable) `fallback` is shown.
 */
export function PlushWriter({ className, fallback }: { className?: string; fallback: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    import("./plushWriter")
      .then(({ mountPlushWriter }) => {
        const canvas = canvasRef.current;
        if (cancelled || !canvas) return;
        cleanup = mountPlushWriter(canvas);
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("failed");
      });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  if (state === "failed") return fallback;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`transition-opacity duration-700 ${state === "ready" ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
    />
  );
}
