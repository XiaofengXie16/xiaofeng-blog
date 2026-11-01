/**
 * Original illustrated people in the site's painterly style. Each is an
 * inline SVG labelled for screen readers; decorative placement is up to the
 * caller.
 */

/** Stands on a ribbon of light and writes glowing words into the sky. */
export function SkyWriter({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 260"
      className={className}
      role="img"
      aria-label="Illustrated person standing on a ribbon of light, writing glowing words into the sky"
    >
      <defs>
        <linearGradient id="sw-sweater" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "#5683EE" }} />
          <stop offset="1" style={{ stopColor: "#2346B0" }} />
        </linearGradient>
        <linearGradient id="sw-pants" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "#7464C6" }} />
          <stop offset="1" style={{ stopColor: "#3C3384" }} />
        </linearGradient>
        <radialGradient id="sw-skin" cx=".7" cy=".35" r=".8">
          <stop offset="0" style={{ stopColor: "#FAD9C0" }} />
          <stop offset="1" style={{ stopColor: "#E9B494" }} />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="249" rx="38" ry="6" fill="#3A2F7A" opacity=".22" />
      <path d="M42 134 L35 238 L56 238 L60 162 L64 238 L85 238 L80 134 Z" fill="url(#sw-pants)" />
      <path
        d="M72 150 L76 234"
        stroke="#fff"
        strokeOpacity=".28"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse cx="45" cy="241" rx="12" ry="5" fill="#26224C" />
      <ellipse cx="76" cy="241" rx="12" ry="5" fill="#26224C" />
      <path
        d="M45 76 Q33 106 39 132"
        fill="none"
        stroke="#2A4FB8"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <circle cx="39" cy="135" r="5.5" fill="url(#sw-skin)" />
      <path d="M41 70 Q60 61 80 70 L84 138 Q60 147 39 138 Z" fill="url(#sw-sweater)" />
      <path
        d="M52 72 Q60 92 56 136"
        fill="none"
        stroke="#fff"
        strokeOpacity=".18"
        strokeWidth="3"
      />
      <rect x="55" y="53" width="10" height="13" rx="4" fill="url(#sw-skin)" />
      <path d="M48 64 Q60 74 74 64 L76 70 Q60 82 46 70 Z" fill="#E7A63A" />
      <path d="M66 72 L70 96 L62 94 Z" fill="#D18F25" />
      <circle cx="61" cy="39" r="17" fill="url(#sw-skin)" />
      <path d="M44 40 Q43 20 61 20 Q79 20 78 37 Q72 29 62 29 Q51 30 47 45 Z" fill="#3A2A2A" />
      <path d="M45 42 Q33 54 38 72 Q45 61 49 48 Z" fill="#3A2A2A" />
      <circle cx="60" cy="40" r="5" fill="none" stroke="#2B2F55" strokeWidth="1.6" />
      <circle cx="72" cy="40" r="5" fill="none" stroke="#2B2F55" strokeWidth="1.6" />
      <path d="M65 40 L67 40" stroke="#2B2F55" strokeWidth="1.6" />
      <circle cx="70" cy="47" r="3" fill="#F09A87" opacity=".5" />
      <path
        d="M64 50 Q67 52 70 50"
        fill="none"
        stroke="#9A4B3A"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M78 76 Q96 84 100 64"
        fill="none"
        stroke="#2F59C8"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M100 64 L108 43"
        fill="none"
        stroke="#3D68D8"
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
      <circle cx="118" cy="25" r="5" fill="#DCE6FF" filter="url(#softglow)" />
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
