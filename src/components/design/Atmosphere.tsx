import type { CSSProperties } from "react";

/**
 * Shared SVG definitions, rendered once in the layout: the paper-grain
 * filter and a soft glow for light-pens and neon.
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
