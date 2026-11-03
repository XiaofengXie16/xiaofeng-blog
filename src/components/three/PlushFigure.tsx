import { useEffect, useRef, useState, type ReactNode } from "react";
import { whenNearViewport } from "./viewport";

type Figure = "writer" | "builder" | "reader";

const loaders: Record<Figure, () => Promise<(canvas: HTMLCanvasElement) => () => void>> = {
  writer: () => import("./plushWriter").then((m) => m.mountPlushWriter),
  builder: () => import("./plushBuilder").then((m) => m.mountPlushBuilder),
  reader: () => import("./plushReader").then((m) => m.mountPlushReader),
};

/**
 * Load three.js only when the figure approaches the viewport. If WebGL
 * is unavailable, show the static fallback.
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const stopObserving = whenNearViewport(canvas, () => {
      void loaders[figure]()
        .then((mount) => {
          const canvas = canvasRef.current;
          if (cancelled || !canvas) return;
          cleanup = mount(canvas);
          setState("ready");
        })
        .catch(() => {
          if (!cancelled) setState("failed");
        });
    });
    return () => {
      cancelled = true;
      stopObserving();
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
