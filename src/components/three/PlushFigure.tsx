import { useEffect, useRef, useState, type ReactNode } from "react";

type Figure = "writer" | "builder";

const loaders: Record<Figure, () => Promise<(canvas: HTMLCanvasElement) => () => void>> = {
  writer: () => import("./plushWriter").then((m) => m.mountPlushWriter),
  builder: () => import("./plushBuilder").then((m) => m.mountPlushBuilder),
};

/**
 * A cute plush 3D figure. three.js is loaded lazily after hydration so it
 * never blocks the first paint; until then (and if WebGL is unavailable)
 * `fallback` is shown.
 */
export function PlushFigure({
  figure,
  className,
  fallback,
}: {
  figure: Figure;
  className?: string;
  fallback: ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    loaders[figure]()
      .then((mount) => {
        const canvas = canvasRef.current;
        if (cancelled || !canvas) return;
        cleanup = mount(canvas);
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("failed");
      });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [figure]);

  if (state === "failed") return fallback;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`transition-opacity duration-700 ${state === "ready" ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
    />
  );
}
