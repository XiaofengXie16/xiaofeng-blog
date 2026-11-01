import type { ReactNode } from "react";

/**
 * Illustrated makers standing along the ribbon as part of the scenery. They
 * idle gently and start working when hovered or focused (styles in
 * tailwind.css under "Makers"). Purely ornamental, but real buttons so
 * keyboard users can wake them too.
 */
const MAKERS: Array<{ label: string; action: string; lift: string; Figure: () => ReactNode }> = [
  { label: "the painter", action: "watch them paint", lift: "sm:mb-2", Figure: Painter },
  { label: "the cook", action: "watch them flip a pancake", lift: "sm:mb-10", Figure: Cook },
  { label: "the coder", action: "watch them type", lift: "sm:mb-5", Figure: Coder },
  { label: "the gardener", action: "watch them water a plant", lift: "sm:mb-14", Figure: Gardener },
  { label: "the musician", action: "hear them strum", lift: "sm:mb-6", Figure: Musician },
  {
    label: "the photographer",
    action: "watch them take a photo",
    lift: "sm:mb-12",
    Figure: Photographer,
  },
];

export function Makers() {
  return (
    <div className="grid grid-cols-2 items-end gap-x-2 gap-y-4 sm:grid-cols-3 lg:flex lg:justify-between">
      {MAKERS.map(({ label, action, lift, Figure }) => (
        <button
          key={label}
          type="button"
          aria-label={`${label}: hover or focus to ${action}`}
          className={`maker flex cursor-pointer flex-col items-center gap-0.5 rounded-[28px] border-0 bg-transparent p-2 font-sans ${lift}`}
        >
          <svg
            viewBox="0 0 160 200"
            className="decor h-auto w-full max-w-[150px]"
            aria-hidden="true"
            focusable="false"
          >
            <Figure />
          </svg>
          <span className="font-hand text-xl text-rust/75">{label}</span>
        </button>
      ))}
    </div>
  );
}

const Shadow = () => <ellipse cx="80" cy="193" rx="62" ry="5" fill="#3A2F7A" opacity=".16" />;

function Painter() {
  return (
    <>
      <Shadow />
      <path
        d="M112 192 L126 74 M150 192 L136 74 M131 74 L131 192"
        stroke="#8A6A4A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="102" y="66" width="56" height="64" rx="3" fill="#FFF8EE" stroke="#E5D7C0" />
      <path
        className="m-stroke"
        d="M108 120 C 118 98, 130 126, 152 90"
        fill="none"
        stroke="#E88A4F"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        className="m-stroke m-d2"
        d="M110 82 Q 128 74 150 108"
        fill="none"
        stroke="#5B7FE0"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        className="m-stroke m-d3"
        d="M124 104 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0"
        fill="none"
        stroke="#7DA453"
        strokeWidth="3.5"
      />
      <g className="m-body">
        <path d="M46 120 L42 186 L56 186 L58 142 L60 186 L74 186 L70 120 Z" fill="#3C3384" />
        <ellipse cx="49" cy="188" rx="9" ry="4" fill="#26224C" />
        <ellipse cx="68" cy="188" rx="9" ry="4" fill="#26224C" />
        <path
          d="M44 80 Q36 100 44 112"
          fill="none"
          stroke="#2F5BD3"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <ellipse cx="44" cy="115" rx="11" ry="6" fill="#E8D2B0" />
        <circle cx="40" cy="113" r="2" fill="#E88A4F" />
        <circle cx="45" cy="112" r="2" fill="#5B7FE0" />
        <circle cx="49" cy="115" r="2" fill="#7DA453" />
        <path d="M42 74 Q58 66 74 74 L76 124 Q58 130 40 124 Z" fill="#2F5BD3" />
        <path d="M48 80 L68 80 L70 124 Q58 128 46 124 Z" fill="#F4EBDD" />
        <circle cx="58" cy="52" r="15" fill="#F1C7A8" />
        <circle cx="58" cy="33" r="7" fill="#3A2A2A" />
        <path d="M43 52 Q42 36 58 36 Q74 36 73 51 Q68 44 58 44 Q48 44 43 52 Z" fill="#3A2A2A" />
        <circle cx="63" cy="53" r="1.6" fill="#2B2F55" />
        <path
          d="M61 59 Q64 61 67 59"
          fill="none"
          stroke="#9A4B3A"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <g className="m-paint-arm" style={{ transformOrigin: "72px 80px" }}>
          <path
            d="M72 80 Q88 86 98 98"
            fill="none"
            stroke="#2F5BD3"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <circle cx="99" cy="99" r="4.5" fill="#F1C7A8" />
          <path d="M99 99 L110 90" stroke="#6A4A2A" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="110.5" cy="89.5" r="2.4" fill="#E88A4F" />
        </g>
      </g>
    </>
  );
}

function Cook() {
  return (
    <>
      <Shadow />
      <rect x="98" y="134" width="56" height="58" rx="8" fill="#D9D4EA" />
      <rect x="98" y="134" width="56" height="8" rx="4" fill="#BDB6D8" />
      <circle cx="112" cy="166" r="4" fill="#9A93C2" />
      <circle cx="126" cy="166" r="4" fill="#9A93C2" />
      <circle cx="140" cy="166" r="4" fill="#9A93C2" />
      <path
        className="m-flame"
        style={{ transformOrigin: "126px 134px" }}
        d="M116 134 Q120 124 124 134 Q126 120 130 134 Q133 126 136 134 Z"
        fill="#F28C3A"
      />
      <path
        className="m-steam"
        d="M118 98 q-4 -6 0 -12 q4 -6 0 -12"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        className="m-steam m-d2"
        d="M130 100 q-4 -6 0 -12 q4 -6 0 -12"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <g className="m-body">
        <path d="M42 120 L38 186 L52 186 L54 142 L56 186 L70 186 L66 120 Z" fill="#2E2A5A" />
        <ellipse cx="45" cy="188" rx="9" ry="4" fill="#1B1838" />
        <ellipse cx="64" cy="188" rx="9" ry="4" fill="#1B1838" />
        <path
          d="M40 80 Q32 100 40 114"
          fill="none"
          stroke="#fff"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path d="M38 74 Q54 66 70 74 L72 124 Q54 130 36 124 Z" fill="#fff" />
        <path d="M44 84 L64 84 L66 124 Q54 128 42 124 Z" fill="#E88A4F" opacity=".85" />
        <circle cx="54" cy="52" r="15" fill="#8D5A3B" />
        <rect x="42" y="28" width="24" height="14" rx="3" fill="#fff" />
        <circle cx="46" cy="26" r="7" fill="#fff" />
        <circle cx="56" cy="22" r="8" fill="#fff" />
        <circle cx="64" cy="27" r="6" fill="#fff" />
        <circle cx="59" cy="53" r="1.6" fill="#1E2240" />
        <path
          d="M57 59 Q60 61 63 59"
          fill="none"
          stroke="#3A1E14"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M68 80 Q82 94 84 110"
          fill="none"
          stroke="#fff"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <g className="m-pan" style={{ transformOrigin: "86px 112px" }}>
          <circle cx="85" cy="112" r="4.5" fill="#8D5A3B" />
          <path d="M86 112 L106 112" stroke="#2A2A3A" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="121" cy="113" rx="17" ry="4.5" fill="#2A2A3A" />
          <ellipse
            className="m-cake"
            style={{ transformOrigin: "121px 108px" }}
            cx="121"
            cy="108"
            rx="11"
            ry="3.2"
            fill="#E8B064"
          />
        </g>
      </g>
    </>
  );
}

function Coder() {
  return (
    <>
      <Shadow />
      <g className="m-body">
        <path d="M54 140 Q54 100 80 96 Q106 100 106 140 Z" fill="#7DA453" />
        <rect x="74" y="80" width="12" height="16" rx="5" fill="#E9B898" />
        <circle cx="80" cy="70" r="16" fill="#E9B898" />
        <path d="M64 70 Q63 52 80 52 Q97 52 96 68 Q92 60 80 60 Q70 60 64 70 Z" fill="#1F1A2E" />
        <circle cx="74" cy="72" r="4.5" fill="none" stroke="#1E2240" strokeWidth="1.4" />
        <circle cx="86" cy="72" r="4.5" fill="none" stroke="#1E2240" strokeWidth="1.4" />
        <path d="M78.5 72 L81.5 72" stroke="#1E2240" strokeWidth="1.4" />
      </g>
      <rect x="18" y="138" width="124" height="6" rx="3" fill="#8A6A4A" />
      <path
        d="M30 144 L26 192 M130 144 L134 192"
        stroke="#8A6A4A"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="50" y="92" width="60" height="42" rx="4" fill="#1E2240" />
      <rect className="m-code" x="58" y="100" width="30" height="3.5" rx="1.7" fill="#9FB4FF" />
      <rect
        className="m-code m-d2"
        x="62"
        y="108"
        width="36"
        height="3.5"
        rx="1.7"
        fill="#F3B98D"
      />
      <rect
        className="m-code m-d3"
        x="62"
        y="116"
        width="24"
        height="3.5"
        rx="1.7"
        fill="#B5D58C"
      />
      <rect
        className="m-code m-d4"
        x="58"
        y="124"
        width="40"
        height="3.5"
        rx="1.7"
        fill="#C7B5FF"
      />
      <path d="M44 134 L116 134 L122 140 L38 140 Z" fill="#C9CCE8" />
      <circle
        className="m-hand-l"
        style={{ transformOrigin: "66px 136px" }}
        cx="66"
        cy="136"
        r="5"
        fill="#E9B898"
      />
      <circle
        className="m-hand-r"
        style={{ transformOrigin: "94px 136px" }}
        cx="94"
        cy="136"
        r="5"
        fill="#E9B898"
      />
      <rect x="124" y="124" width="12" height="14" rx="3" fill="#E88A4F" />
      <path
        className="m-steam"
        d="M128 118 q-3 -5 0 -10 q3 -5 0 -10"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  );
}

function Gardener() {
  return (
    <>
      <Shadow />
      <path d="M112 166 L150 166 L145 192 L117 192 Z" fill="#D9784A" />
      <rect x="110" y="162" width="42" height="7" rx="3" fill="#C2653A" />
      <path
        d="M131 162 Q128 148 131 134"
        fill="none"
        stroke="#5E8A35"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="124" cy="150" rx="7" ry="3.5" fill="#7DA453" transform="rotate(-30 124 150)" />
      <ellipse cx="138" cy="146" rx="7" ry="3.5" fill="#7DA453" transform="rotate(30 138 146)" />
      <g className="m-bloom">
        <circle cx="126" cy="132" r="4.5" fill="#F3A6C0" />
        <circle cx="136" cy="132" r="4.5" fill="#F3A6C0" />
        <circle cx="131" cy="127" r="4.5" fill="#F3A6C0" />
        <circle cx="131" cy="137" r="4.5" fill="#F3A6C0" />
        <circle cx="131" cy="132" r="3.5" fill="#F6C94A" />
      </g>
      <circle className="m-drop" cx="128" cy="104" r="2.2" fill="#7DB4F0" />
      <circle className="m-drop m-d2" cx="132" cy="106" r="2.2" fill="#7DB4F0" />
      <circle className="m-drop m-d3" cx="125" cy="108" r="2.2" fill="#7DB4F0" />
      <g className="m-body">
        <path d="M40 120 L36 186 L50 186 L52 142 L54 186 L68 186 L64 120 Z" fill="#5B4FA8" />
        <ellipse cx="43" cy="188" rx="9" ry="4" fill="#26224C" />
        <ellipse cx="62" cy="188" rx="9" ry="4" fill="#26224C" />
        <path
          d="M38 80 Q30 100 38 114"
          fill="none"
          stroke="#E7A63A"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path d="M36 74 Q52 66 68 74 L70 124 Q52 130 34 124 Z" fill="#E7A63A" />
        <circle cx="52" cy="52" r="15" fill="#C68C66" />
        <ellipse cx="52" cy="40" rx="24" ry="5" fill="#D9C08A" />
        <path d="M40 40 Q40 26 52 26 Q64 26 64 40 Z" fill="#D9C08A" />
        <circle cx="57" cy="53" r="1.6" fill="#1E2240" />
        <path
          d="M55 59 Q58 61 61 59"
          fill="none"
          stroke="#5A2E1E"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M66 80 Q80 92 88 102"
          fill="none"
          stroke="#E7A63A"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <g className="m-can" style={{ transformOrigin: "90px 104px" }}>
          <circle cx="89" cy="103" r="4.5" fill="#C68C66" />
          <rect x="90" y="96" width="26" height="18" rx="5" fill="#7DA4D8" />
          <path d="M116 100 L128 94" stroke="#7DA4D8" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M96 96 Q103 86 110 96" fill="none" stroke="#5E86C2" strokeWidth="2.5" />
        </g>
      </g>
    </>
  );
}

function Musician() {
  return (
    <>
      <Shadow />
      <g className="m-note">
        <circle cx="118" cy="74" r="3.5" fill="#3B4AA8" />
        <path d="M121.5 74 L121.5 60 L128 62" fill="none" stroke="#3B4AA8" strokeWidth="2" />
      </g>
      <g className="m-note m-d2">
        <circle cx="102" cy="64" r="3.5" fill="#B4562B" />
        <path d="M105.5 64 L105.5 50" fill="none" stroke="#B4562B" strokeWidth="2" />
      </g>
      <g className="m-body">
        <path d="M58 120 L54 186 L68 186 L70 142 L72 186 L86 186 L82 120 Z" fill="#2E2A5A" />
        <ellipse cx="61" cy="188" rx="9" ry="4" fill="#1B1838" />
        <ellipse cx="80" cy="188" rx="9" ry="4" fill="#1B1838" />
        <path d="M56 74 Q72 66 88 74 L90 124 Q72 130 54 124 Z" fill="#C94F6D" />
        <circle cx="72" cy="52" r="15" fill="#F1C7A8" />
        <path d="M56 54 Q54 34 72 34 Q90 34 88 54 Q86 44 72 44 Q60 44 56 54 Z" fill="#B5652E" />
        <path d="M56 54 Q54 66 58 72 L60 56 Z M88 54 Q90 66 86 72 L84 56 Z" fill="#B5652E" />
        <circle cx="77" cy="53" r="1.6" fill="#1E2240" />
        <path
          d="M74 59 Q77 62 80 59"
          fill="none"
          stroke="#9A4B3A"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path d="M98 114 L136 88" stroke="#6A4A2A" strokeWidth="5" strokeLinecap="round" />
        <rect
          x="132"
          y="82"
          width="10"
          height="7"
          rx="2"
          fill="#6A4A2A"
          transform="rotate(-34 137 85)"
        />
        <ellipse cx="88" cy="124" rx="19" ry="15" fill="#D9844A" />
        <ellipse cx="76" cy="130" rx="13" ry="11" fill="#D9844A" />
        <circle cx="88" cy="122" r="5" fill="#5A3A2A" />
        <path
          d="M86 80 Q108 90 124 98"
          fill="none"
          stroke="#C94F6D"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <circle cx="125" cy="98" r="4" fill="#F1C7A8" />
        <g className="m-strum" style={{ transformOrigin: "60px 82px" }}>
          <path
            d="M60 82 Q58 108 80 120"
            fill="none"
            stroke="#C94F6D"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <circle cx="82" cy="121" r="4.5" fill="#F1C7A8" />
        </g>
      </g>
    </>
  );
}

function Photographer() {
  return (
    <>
      <Shadow />
      <g className="m-flash">
        <circle cx="112" cy="40" r="22" fill="#fff" opacity=".55" />
        <path d="M112 22 L115 36 L130 40 L115 44 L112 58 L109 44 L94 40 L109 36 Z" fill="#fff" />
      </g>
      <g className="m-body">
        <path d="M58 120 L54 186 L68 186 L70 142 L72 186 L86 186 L82 120 Z" fill="#3C3384" />
        <ellipse cx="61" cy="188" rx="9" ry="4" fill="#26224C" />
        <ellipse cx="80" cy="188" rx="9" ry="4" fill="#26224C" />
        <path d="M56 74 Q72 66 88 74 L90 124 Q72 130 54 124 Z" fill="#4A78E8" />
        <path d="M60 76 L84 76" stroke="#26224C" strokeWidth="2" />
        <circle cx="72" cy="52" r="15" fill="#E9B898" />
        <path d="M57 50 Q56 36 72 36 Q88 36 87 50 Z" fill="#2B2F55" />
        <path d="M57 50 L92 50" stroke="#2B2F55" strokeWidth="3" strokeLinecap="round" />
        <g className="m-cam">
          <path
            d="M58 80 Q62 64 84 58"
            fill="none"
            stroke="#4A78E8"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M86 80 Q100 70 100 60"
            fill="none"
            stroke="#4A78E8"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <rect x="80" y="46" width="28" height="19" rx="4" fill="#2A2A3A" />
          <rect x="86" y="42" width="10" height="5" rx="1.5" fill="#2A2A3A" />
          <circle cx="96" cy="55.5" r="6.5" fill="#44486A" stroke="#8E94C4" strokeWidth="1.5" />
          <circle cx="96" cy="55.5" r="2.5" fill="#9FB4FF" />
        </g>
      </g>
    </>
  );
}
