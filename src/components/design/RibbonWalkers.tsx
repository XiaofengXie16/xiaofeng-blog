import { useEffect, useRef, useState } from "react";
import { easeInOut, nextStroll } from "~/utils/stroll";

type Walker = {
  /** Starting point, 0–1 along the path. */
  at: number;
  /** Stretch of the path (0–1) this walker strolls within; the whole ribbon by default. */
  range?: readonly [number, number];
  color: string;
  /** Width in viewBox units (height is 2.5×). */
  size?: number;
  opacity?: number;
};

type Point = { x: number; y: number };

const STROLL_DISTANCE = 0.16;
const STROLL_MS = 2600;

/**
 * Tiny people standing on a ribbon path. Hovering one sends them strolling
 * along the path for a stretch, turning around at the ends. Render over the
 * ribbon with the same viewBox and stretching so they stay on it. Purely
 * decorative: hidden from assistive tech, and only the walkers take pointer
 * events.
 */
export function RibbonWalkers({
  d,
  viewBox,
  walkers,
  className,
}: {
  d: string;
  viewBox: string;
  walkers: readonly Walker[];
  className?: string;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const fractions = useRef(walkers.map((w) => w.at));
  const dirs = useRef<(1 | -1)[]>(walkers.map(() => 1));
  const frames = useRef<number[]>([]);
  const busy = useRef(walkers.map(() => false));
  const [points, setPoints] = useState<Point[] | null>(null);
  const [walking, setWalking] = useState<boolean[]>(() => walkers.map(() => false));

  const pointAt = (fraction: number): Point => {
    const path = pathRef.current;
    if (!path) return { x: 0, y: 0 };
    const p = path.getPointAtLength(fraction * path.getTotalLength());
    return { x: p.x, y: p.y };
  };

  useEffect(() => {
    setPoints(fractions.current.map(pointAt));
    const pending = frames.current;
    return () => pending.forEach((f) => cancelAnimationFrame(f));
    // Positions only need measuring once the path is in the DOM.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [d]);

  const stroll = (i: number) => {
    if (busy.current[i]) return;
    busy.current[i] = true;
    const from = fractions.current[i];
    const [min, max] = walkers[i].range ?? [];
    // In a short range, stroll a shorter distance so they don't just bounce in place.
    const distance =
      min === undefined || max === undefined
        ? STROLL_DISTANCE
        : Math.min(STROLL_DISTANCE, (max - min) * 0.7);
    const { target, dir } = nextStroll(from, dirs.current[i], distance, min, max);
    dirs.current[i] = dir;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduceMotion ? 1 : STROLL_MS;
    setWalking((prev) => prev.map((v, j) => (j === i ? true : v)));

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const f = from + (target - from) * easeInOut(t);
      fractions.current[i] = f;
      setPoints((prev) => prev && prev.map((p, j) => (j === i ? pointAt(f) : p)));
      if (t < 1) {
        frames.current[i] = requestAnimationFrame(tick);
      } else {
        busy.current[i] = false;
        setWalking((prev) => prev.map((v, j) => (j === i ? false : v)));
      }
    };
    frames.current[i] = requestAnimationFrame(tick);
  };

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={`pointer-events-none ${className ?? ""}`}
      aria-hidden="true"
      focusable="false"
    >
      <path ref={pathRef} d={d} fill="none" stroke="none" />
      {points?.map((p, i) => {
        const w = walkers[i];
        const size = w.size ?? 22;
        const height = size * 2.5;
        return (
          <g
            key={i}
            className={`ribbon-walker ${walking[i] ? "is-walking" : ""}`}
            transform={`translate(${p.x - size / 2} ${p.y - height * 0.96})`}
            opacity={w.opacity ?? 0.75}
            onPointerEnter={() => stroll(i)}
          >
            {/* Generous invisible hit area around the tiny figure */}
            <rect
              x={-size * 0.6}
              y={-size * 0.4}
              width={size * 2.2}
              height={height + size * 0.6}
              fill="transparent"
            />
            <g className="walker-body">
              <use href="#walker" width={size} height={height} style={{ color: w.color }} />
            </g>
          </g>
        );
      })}
    </svg>
  );
}
