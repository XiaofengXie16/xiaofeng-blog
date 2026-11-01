import type { CSSProperties } from "react";

/**
 * Shared SVG definitions, rendered once in the layout: the paper-grain
 * filter, a soft glow for light-pens and neon, and the tiny "walker" figure
 * reused along ribbons.
 */
export function SvgDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <filter id="grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <filter id="softglow" x="-200%" y="-200%" width="500%" height="500%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <symbol id="walker" viewBox="0 0 20 50">
        <ellipse cx="10" cy="48" rx="8" ry="2" fill="#3A2F7A" opacity=".22" />
        <rect x="5.5" y="29" width="3.6" height="17" rx="1.8" fill="#2E2A5A" />
        <rect x="10.9" y="29" width="3.6" height="17" rx="1.8" fill="#2E2A5A" />
        <rect x="4" y="13" width="12" height="19" rx="6" fill="currentColor" />
        <circle cx="10" cy="7.5" r="5" fill="#F1C7A8" />
        <path d="M5 7 Q5 2 10 2 Q15 2 15 6.5 Q12 4.5 9 5 Q7 5.5 5 7 Z" fill="#3A2A2A" />
      </symbol>
    </svg>
  );
}

/** Paper grain over a painted area. The parent must be `relative`. */
export function Grain({ opacity = 0.2, screen = false }: { opacity?: number; screen?: boolean }) {
  return (
    <svg
      className="grain"
      style={{ opacity, mixBlendMode: screen ? "screen" : "multiply" }}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

/** A soft, drifting painted cloud. */
export function Cloud({ style }: { style: CSSProperties }) {
  return <div className="cloud" style={style} aria-hidden="true" />;
}
