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
      {/*
       * Paints grain into a figure's own pixels (not its bounding box) so
       * illustrated people read as part of the painting rather than stickers.
       * Used through the `.decor` class.
       */}
      <filter id="paint" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
          result="noise"
        />
        <feColorMatrix in="noise" type="saturate" values="0" result="gray" />
        <feComponentTransfer in="gray" result="speckle">
          <feFuncR type="linear" slope="0.4" intercept="0.66" />
          <feFuncG type="linear" slope="0.4" intercept="0.66" />
          <feFuncB type="linear" slope="0.4" intercept="0.66" />
          <feFuncA type="linear" slope="0" intercept="1" />
        </feComponentTransfer>
        <feBlend in="SourceGraphic" in2="speckle" mode="multiply" result="grained" />
        <feComposite in="grained" in2="SourceGraphic" operator="in" />
      </filter>
      {/*
       * Walker shading. Each overlay is white or navy at varying opacity, so
       * it lights any body colour (`currentColor`) the same way: a soft key
       * light from the upper left, with rounded, toy-like volume to match the
       * 3D bookshelf.
       */}
      <linearGradient id="walker-round" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" style={{ stopColor: "#1B1840", stopOpacity: 0.38 }} />
        <stop offset=".3" style={{ stopColor: "#fff", stopOpacity: 0.22 }} />
        <stop offset=".55" style={{ stopColor: "#fff", stopOpacity: 0 }} />
        <stop offset="1" style={{ stopColor: "#1B1840", stopOpacity: 0.5 }} />
      </linearGradient>
      <linearGradient id="walker-fall" x1="0" x2="0" y1="0" y2="1">
        <stop offset=".55" style={{ stopColor: "#1B1840", stopOpacity: 0 }} />
        <stop offset="1" style={{ stopColor: "#1B1840", stopOpacity: 0.3 }} />
      </linearGradient>
      <radialGradient id="walker-shine" cx=".32" cy=".26" r=".42">
        <stop offset="0" style={{ stopColor: "#fff", stopOpacity: 0.75 }} />
        <stop offset="1" style={{ stopColor: "#fff", stopOpacity: 0 }} />
      </radialGradient>
      <radialGradient id="walker-head" cx=".36" cy=".32" r=".75">
        <stop offset="0" style={{ stopColor: "#FFE6D3" }} />
        <stop offset=".55" style={{ stopColor: "#F1C7A8" }} />
        <stop offset="1" style={{ stopColor: "#C98F6E" }} />
      </radialGradient>
      <radialGradient id="walker-hair" cx=".35" cy=".25" r=".8">
        <stop offset="0" style={{ stopColor: "#6A5048" }} />
        <stop offset="1" style={{ stopColor: "#241A1A" }} />
      </radialGradient>
      <radialGradient id="walker-ground">
        <stop offset="0" style={{ stopColor: "#2A2160", stopOpacity: 0.42 }} />
        <stop offset="1" style={{ stopColor: "#2A2160", stopOpacity: 0 }} />
      </radialGradient>
      <symbol id="walker" viewBox="0 0 20 50" overflow="visible">
        {/* Soft contact shadow, offset away from the light */}
        <ellipse cx="11" cy="48" rx="9.5" ry="2.6" fill="url(#walker-ground)" />
        {/* Legs: rounded trousers with little shoes */}
        <rect x="5.4" y="29" width="3.8" height="17" rx="1.9" fill="#2E2A5A" />
        <rect x="10.8" y="29" width="3.8" height="17" rx="1.9" fill="#2E2A5A" />
        <rect x="5.4" y="29" width="3.8" height="17" rx="1.9" fill="url(#walker-round)" />
        <rect x="10.8" y="29" width="3.8" height="17" rx="1.9" fill="url(#walker-round)" />
        <ellipse cx="7.1" cy="46.2" rx="2.5" ry="1.4" fill="#1E1A3C" />
        <ellipse cx="12.9" cy="46.2" rx="2.5" ry="1.4" fill="#1E1A3C" />
        <ellipse cx="6.5" cy="45.7" rx="1" ry=".45" fill="#fff" opacity=".35" />
        {/* Far arm sits behind the body, in shade */}
        <rect x="14" y="14.5" width="3.4" height="14" rx="1.7" fill="currentColor" />
        <rect x="14" y="14.5" width="3.4" height="14" rx="1.7" fill="#1B1840" opacity=".32" />
        {/* Torso: a rounded capsule, lit from the upper left */}
        <rect x="4" y="13" width="12" height="19" rx="6" fill="currentColor" />
        <rect x="4" y="13" width="12" height="19" rx="6" fill="url(#walker-round)" />
        <rect x="4" y="13" width="12" height="19" rx="6" fill="url(#walker-fall)" />
        <rect x="4" y="13" width="12" height="19" rx="6" fill="url(#walker-shine)" />
        {/* Near arm in front, catching the light */}
        <rect x="2.6" y="14.5" width="3.4" height="14" rx="1.7" fill="currentColor" />
        <rect x="2.6" y="14.5" width="3.4" height="14" rx="1.7" fill="url(#walker-round)" />
        <circle cx="4.3" cy="28.4" r="1.6" fill="url(#walker-head)" />
        {/* Shadow the head casts on the shoulders */}
        <clipPath id="walker-torso">
          <rect x="4" y="13" width="12" height="19" rx="6" />
        </clipPath>
        <ellipse
          cx="10.6"
          cy="13.4"
          rx="4.8"
          ry="1.9"
          fill="#1B1840"
          opacity=".3"
          clipPath="url(#walker-torso)"
        />
        {/* Head: a shaded sphere with a highlight, cap of hair and tiny face */}
        <circle cx="10" cy="7.5" r="5.2" fill="url(#walker-head)" />
        <path
          d="M4.8 7.2 Q4.6 1.8 10 1.8 Q15.4 1.8 15.2 6.8 Q12.2 4.6 9 5 Q6.8 5.4 4.8 7.2 Z"
          fill="url(#walker-hair)"
        />
        <ellipse cx="8" cy="3.3" rx="2" ry=".8" fill="#fff" opacity=".28" />
        <circle cx="8.3" cy="8.4" r=".55" fill="#2A1E1E" />
        <circle cx="11.9" cy="8.4" r=".55" fill="#2A1E1E" />
        <ellipse cx="7.4" cy="10" rx="1" ry=".6" fill="#E88A8A" opacity=".45" />
        <ellipse cx="12.8" cy="10" rx="1" ry=".6" fill="#E88A8A" opacity=".45" />
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
