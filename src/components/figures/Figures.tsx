/**
 * Original illustrated people in the site's painterly style. Each is an
 * inline SVG labelled for screen readers; decorative placement is up to the
 * caller.
 */

/**
 * Stands on a ribbon of light with a light-pen. Hovering him (the
 * `.sky-writer` styles in tailwind.css) sets his arm writing and draws
 * glowing letters in the air above the pen.
 */
export function SkyWriter({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-10 -50 140 310"
      className={`sky-writer ${className ?? ""}`}
      role="img"
      aria-label="Illustrated man standing on a ribbon of light, writing glowing words into the sky"
    >
      <defs>
        <linearGradient id="sw-sweater" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "#5FA08A" }} />
          <stop offset="1" style={{ stopColor: "#33705E" }} />
        </linearGradient>
        <linearGradient id="sw-pants" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "#4A4F86" }} />
          <stop offset="1" style={{ stopColor: "#2A2E5C" }} />
        </linearGradient>
        <radialGradient id="sw-skin" cx=".7" cy=".35" r=".8">
          <stop offset="0" style={{ stopColor: "#F3CFB2" }} />
          <stop offset="1" style={{ stopColor: "#D9A07E" }} />
        </radialGradient>
      </defs>

      {/* Letters he writes on hover */}
      <path
        className="sw-letters"
        d="M94 -10 C 96 -24, 98 -38, 100 -44 C 99 -32, 97 -20, 96 -10 C 98 -18, 102 -22, 104 -18 C 105 -15, 104 -12, 104 -10 C 106 -14, 108 -18, 109 -18 C 109 -15, 108 -12, 109 -10 C 111 -12, 113 -16, 114 -18 M110.2 -25.5 L110.6 -25.5 M119 -40 C 119 -32, 118.5 -24, 118 -18 M117.8 -11.5 L118.2 -11.5"
        fill="none"
        stroke="#F6F8FF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#softglow)"
      />
      <path
        className="sw-letters"
        d="M94 -10 C 96 -24, 98 -38, 100 -44 C 99 -32, 97 -20, 96 -10 C 98 -18, 102 -22, 104 -18 C 105 -15, 104 -12, 104 -10 C 106 -14, 108 -18, 109 -18 C 109 -15, 108 -12, 109 -10 C 111 -12, 113 -16, 114 -18 M110.2 -25.5 L110.6 -25.5 M119 -40 C 119 -32, 118.5 -24, 118 -18 M117.8 -11.5 L118.2 -11.5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <ellipse cx="60" cy="249" rx="40" ry="6" fill="#3A2F7A" opacity=".22" />
      {/* Legs and shoes */}
      <path d="M41 134 L36 238 L57 238 L60 160 L63 238 L84 238 L80 134 Z" fill="url(#sw-pants)" />
      <path
        d="M71 150 L75 234"
        stroke="#fff"
        strokeOpacity=".18"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M33 238 Q35 232 46 233 L58 236 L58 243 L33 243 Z" fill="#4A3428" />
      <path d="M62 236 L74 233 Q86 232 88 238 L88 243 L62 243 Z" fill="#4A3428" />
      {/* Back arm, hand in pocket */}
      <path
        d="M43 76 Q34 102 42 124"
        fill="none"
        stroke="#3E806C"
        strokeWidth="13"
        strokeLinecap="round"
      />
      {/* Torso: broad-shouldered crewneck sweater */}
      <path d="M37 72 Q60 60 83 72 L85 138 Q60 147 37 138 Z" fill="url(#sw-sweater)" />
      <path
        d="M52 66 Q60 72 69 66"
        fill="none"
        stroke="#2C5E50"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M50 76 Q57 104 54 136"
        fill="none"
        stroke="#fff"
        strokeOpacity=".14"
        strokeWidth="3"
      />
      {/* Neck and head */}
      <rect x="55" y="52" width="11" height="14" rx="4" fill="url(#sw-skin)" />
      <ellipse cx="45.5" cy="41" rx="3" ry="4.5" fill="#D9A07E" />
      <circle cx="61" cy="39" r="16" fill="url(#sw-skin)" />
      {/* Short hair with a small quiff, and stubble */}
      <path
        d="M45 38 Q43 20 59 18 Q74 15 78 30 Q75 26 68 26 Q57 25 51 30 Q48 33 47 41 Z"
        fill="#2B211C"
      />
      <path d="M47 41 L46 33 L49 32 L49.5 41 Z" fill="#2B211C" />
      <path
        d="M49 45 Q51 56 61 57.5 Q71 56 76 45 Q72 52.5 61 53.5 Q52 52.5 49 45 Z"
        fill="#2B211C"
        opacity=".32"
      />
      {/* Glasses, brows, smile */}
      <rect
        x="54.5"
        y="35.5"
        width="9"
        height="7"
        rx="2.2"
        fill="none"
        stroke="#2B2F55"
        strokeWidth="1.5"
      />
      <rect
        x="66.5"
        y="35.5"
        width="9"
        height="7"
        rx="2.2"
        fill="none"
        stroke="#2B2F55"
        strokeWidth="1.5"
      />
      <path d="M63.5 38.5 L66.5 38.5 M54.5 38 L48 37" stroke="#2B2F55" strokeWidth="1.5" />
      <path
        d="M55 32.5 L62 31.8 M67.5 31.8 L74.5 32.5"
        stroke="#2B211C"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M63 48.5 Q67 51 71 48.5"
        fill="none"
        stroke="#8A4433"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Writing arm: rotates from the shoulder on hover */}
      <g className="sw-arm">
        <path
          d="M78 76 Q96 84 100 64"
          fill="none"
          stroke="#3B7C68"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M100 64 L108 43"
          fill="none"
          stroke="#4A8E78"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <circle cx="109" cy="40" r="5.5" fill="url(#sw-skin)" />
        <path
          d="M109 40 L118 25"
          stroke="#BFD0FF"
          strokeWidth="6"
          strokeLinecap="round"
          opacity=".6"
          filter="url(#softglow)"
        />
        <path d="M109 40 L118 25" stroke="#F4F7FF" strokeWidth="2.4" strokeLinecap="round" />
        <circle className="sw-tip" cx="118" cy="25" r="5" fill="#DCE6FF" filter="url(#softglow)" />
      </g>
    </svg>
  );
}

/** Writes at a desk at night, lit by glowing paper. */
export function DeskWriter({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 200"
      className={className}
      role="img"
      aria-label="Illustrated person at a desk at night, writing on glowing paper"
    >
      <defs>
        <radialGradient id="dw-light" cx=".5" cy=".75" r=".6">
          <stop offset="0" style={{ stopColor: "#FFD9A8", stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: "#FFD9A8", stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id="dw-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "#C79C7A" }} />
          <stop offset="1" style={{ stopColor: "#5A4060" }} />
        </linearGradient>
        <radialGradient id="dw-skin" cx=".5" cy=".85" r=".9">
          <stop offset="0" style={{ stopColor: "#FFE0C4" }} />
          <stop offset="1" style={{ stopColor: "#B9876E" }} />
        </radialGradient>
      </defs>
      <ellipse cx="110" cy="130" rx="110" ry="80" fill="url(#dw-light)" />
      <path d="M70 152 Q70 102 110 97 Q150 102 150 152 Z" fill="#2B4AA8" />
      <path
        d="M92 104 Q110 116 128 104"
        fill="none"
        stroke="#7FA0F0"
        strokeWidth="3"
        opacity=".6"
      />
      <rect x="104" y="86" width="12" height="14" rx="5" fill="url(#dw-skin)" />
      <circle cx="110" cy="72" r="20" fill="url(#dw-skin)" />
      <circle cx="110" cy="46" r="9" fill="#3A2A2A" />
      <path d="M90 72 Q89 51 110 51 Q131 51 130 72 Q124 60 110 60 Q96 60 90 72 Z" fill="#3A2A2A" />
      <circle cx="102" cy="75" r="5.5" fill="none" stroke="#1E2240" strokeWidth="1.6" />
      <circle cx="118" cy="75" r="5.5" fill="none" stroke="#1E2240" strokeWidth="1.6" />
      <path d="M107.5 75 L112.5 75" stroke="#1E2240" strokeWidth="1.6" />
      <path
        d="M105 85 Q110 88 115 85"
        fill="none"
        stroke="#8A4B3A"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M142 114 Q154 138 130 143"
        fill="none"
        stroke="#2F52B8"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path d="M10 150 L210 150 L196 200 L24 200 Z" fill="#2A2550" />
      <path d="M10 150 L210 150 L208 156 L12 156 Z" fill="url(#dw-top)" />
      <path d="M72 141 L150 137 L156 150 L66 152 Z" fill="#FFF3DE" />
      <path
        d="M72 141 L150 137 L156 150 L66 152 Z"
        fill="#FFE6B8"
        opacity=".9"
        filter="url(#softglow)"
      />
      <circle cx="128" cy="143" r="5.5" fill="url(#dw-skin)" />
      <path
        d="M128 143 L119 130"
        stroke="#BFD0FF"
        strokeWidth="5"
        strokeLinecap="round"
        opacity=".6"
        filter="url(#softglow)"
      />
      <path d="M128 143 L119 130" stroke="#F4F7FF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Sits on a floating glass capsule, reading a glowing book. */
export function CapsuleReader({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      role="img"
      aria-label="Illustrated person sitting on a floating glass capsule, reading a glowing book"
    >
      <defs>
        <linearGradient id="cr-cap" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "#fff", stopOpacity: 0.75 }} />
          <stop offset="1" style={{ stopColor: "#C9C4EE", stopOpacity: 0.45 }} />
        </linearGradient>
        <linearGradient id="cr-sweater" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "#E8955C" }} />
          <stop offset="1" style={{ stopColor: "#B85A2E" }} />
        </linearGradient>
        <radialGradient id="cr-skin" cx=".6" cy=".4" r=".8">
          <stop offset="0" style={{ stopColor: "#F3CDB1" }} />
          <stop offset="1" style={{ stopColor: "#C98F6E" }} />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="212" rx="60" ry="6" fill="#3A2F7A" opacity=".18" />
      <rect
        x="30"
        y="140"
        width="140"
        height="56"
        rx="28"
        fill="url(#cr-cap)"
        stroke="#fff"
        strokeOpacity=".8"
      />
      <path
        d="M46 150 Q100 140 154 150"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".8"
      />
      <path d="M78 142 Q72 170 60 186 L74 190 Q90 172 98 146 Z" fill="#3C3384" />
      <path d="M104 142 Q104 170 96 190 L110 192 Q120 168 122 144 Z" fill="#4A3F9A" />
      <ellipse cx="66" cy="190" rx="10" ry="4.5" fill="#26224C" />
      <ellipse cx="104" cy="193" rx="10" ry="4.5" fill="#26224C" />
      <path d="M76 146 Q74 100 100 94 Q126 100 124 146 Z" fill="url(#cr-sweater)" />
      <rect x="94" y="80" width="12" height="16" rx="5" fill="url(#cr-skin)" />
      <circle cx="100" cy="66" r="19" fill="url(#cr-skin)" />
      <path d="M81 66 Q80 44 100 44 Q121 44 120 64 Q116 56 104 56 Q88 56 84 74 Z" fill="#1F1A2E" />
      <path d="M82 60 Q76 70 80 82 Q84 74 86 66 Z" fill="#1F1A2E" />
      <path
        d="M94 74 Q98 76 102 74"
        fill="none"
        stroke="#7A3D2E"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M80 112 Q86 130 100 128"
        fill="none"
        stroke="#C86A3A"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M120 112 Q116 130 104 128"
        fill="none"
        stroke="#C86A3A"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path d="M84 118 L100 124 L116 118 L116 134 L100 140 L84 134 Z" fill="#FFF3DE" />
      <path d="M100 124 L100 140" stroke="#D9C2A0" strokeWidth="1" />
      <ellipse
        cx="100"
        cy="122"
        rx="26"
        ry="14"
        fill="#FFE8BF"
        opacity=".55"
        filter="url(#softglow)"
      />
    </svg>
  );
}

/** Holds a glowing code block over their head. */
export function BlockBuilder({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 240"
      className={className}
      role="img"
      aria-label="Illustrated person holding a glowing block above their head"
    >
      <defs>
        <linearGradient id="bb-sweater" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "#8CB060" }} />
          <stop offset="1" style={{ stopColor: "#557A30" }} />
        </linearGradient>
        <linearGradient id="bb-pants" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "#4B5BC0" }} />
          <stop offset="1" style={{ stopColor: "#2B3684" }} />
        </linearGradient>
        <radialGradient id="bb-skin" cx=".5" cy=".2" r=".9">
          <stop offset="0" style={{ stopColor: "#F6D3B8" }} />
          <stop offset="1" style={{ stopColor: "#D49E7E" }} />
        </radialGradient>
        <linearGradient id="bb-cube" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "#fff", stopOpacity: 0.95 }} />
          <stop offset="1" style={{ stopColor: "#B9C6FF", stopOpacity: 0.7 }} />
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="232" rx="40" ry="6" fill="#3A2F7A" opacity=".2" />
      <g className="animate-bob">
        <rect
          x="46"
          y="14"
          width="48"
          height="40"
          rx="10"
          fill="#C9D4FF"
          filter="url(#softglow)"
          opacity=".9"
        />
        <rect x="48" y="16" width="44" height="36" rx="9" fill="url(#bb-cube)" stroke="#fff" />
        <path
          d="m62 28-6 6 6 6M78 28l6 6-6 6"
          fill="none"
          stroke="#3B4AA8"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <path d="M52 122 L46 222 L66 222 L70 148 L74 222 L94 222 L88 122 Z" fill="url(#bb-pants)" />
      <ellipse cx="55" cy="225" rx="12" ry="5" fill="#26224C" />
      <ellipse cx="85" cy="225" rx="12" ry="5" fill="#26224C" />
      <path
        d="M54 92 Q40 76 50 58"
        fill="none"
        stroke="#6E9444"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M86 92 Q100 76 90 58"
        fill="none"
        stroke="#6E9444"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <circle cx="51" cy="56" r="5.5" fill="url(#bb-skin)" />
      <circle cx="89" cy="56" r="5.5" fill="url(#bb-skin)" />
      <path d="M50 88 Q70 80 90 88 L92 126 Q70 134 48 126 Z" fill="url(#bb-sweater)" />
      <rect x="64" y="72" width="12" height="12" rx="4" fill="url(#bb-skin)" />
      <circle cx="70" cy="66" r="15" fill="url(#bb-skin)" />
      <path d="M55 64 Q55 48 70 48 Q86 48 85 63 Q79 56 70 57 Q60 58 55 64 Z" fill="#5A3A2A" />
      <path
        d="M65 72 Q70 75 75 72"
        fill="none"
        stroke="#8A4B3A"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="64" cy="66" r="1.6" fill="#2B2F55" />
      <circle cx="76" cy="66" r="1.6" fill="#2B2F55" />
    </svg>
  );
}
