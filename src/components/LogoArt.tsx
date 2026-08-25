import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/*  WordmarkDraw — "U K D" Unified SVG Stroke & Fill Flow Animation   */
/*  All letters have identical font style, case, baseline, and fx     */
/* ------------------------------------------------------------------ */

export function WordmarkDraw({
  stroke = "currentColor",
  className = "",
  delay = 60,
}: {
  stroke?: string;
  className?: string;
  delay?: number;
  animate?: boolean;
}) {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOn(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <svg
      viewBox="0 0 600 200"
      className={`nb-draw ${isOn ? "is-on" : ""} ${className}`}
      style={{ "--nb-dash": 820, color: "currentColor" } as React.CSSProperties}
      role="img"
      aria-label="U K D"
    >
      {/* U — Step 1 flow */}
      <text
        className="nb-d1"
        x="135"
        y="138"
        textAnchor="middle"
        fontSize="132"
        fontWeight="500"
        fill="currentColor"
        stroke={stroke}
        strokeWidth="1.2"
        style={{
          fontFamily: 'var(--font-display, "Fraunces", "Georgia", serif)',
          textTransform: "uppercase",
        }}
      >
        U
      </text>

      {/* K — Step 2 flow (exact same font, weight, size, baseline & case) */}
      <text
        className="nb-d2"
        x="300"
        y="138"
        textAnchor="middle"
        fontSize="132"
        fontWeight="500"
        fill="currentColor"
        stroke={stroke}
        strokeWidth="1.2"
        style={{
          fontFamily: 'var(--font-display, "Fraunces", "Georgia", serif)',
          textTransform: "uppercase",
        }}
      >
        K
      </text>

      {/* D — Step 3 flow (exact same font, weight, size, baseline & case) */}
      <text
        className="nb-d3"
        x="465"
        y="138"
        textAnchor="middle"
        fontSize="132"
        fontWeight="500"
        fill="currentColor"
        stroke={stroke}
        strokeWidth="1.2"
        style={{
          fontFamily: 'var(--font-display, "Fraunces", "Georgia", serif)',
          textTransform: "uppercase",
        }}
      >
        D
      </text>
    </svg>
  );
}

export function BrandBadge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true" focusable="false" fill="none">
      <circle cx="40" cy="40" r="38.2" stroke="currentColor" strokeWidth="0.9" opacity="0.28" />
      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="0.45" opacity="0.14" strokeDasharray="1.2 2.4" />
      <circle cx="40" cy="40" r="1.3" fill="currentColor" opacity="0.9" />
      <text
        x="40"
        y="45.8"
        textAnchor="middle"
        fontFamily="Fraunces, Georgia, serif"
        fontWeight={300}
        fontStyle="italic"
        fontSize="15"
        letterSpacing="0.08em"
        fill="currentColor"
      >
        UKD
      </text>
      <defs>
        <path id="badge-circle" d="M 40 14 A 26 26 0 1 1 39.9 14" />
      </defs>
      <text fontFamily="IBM Plex Mono, monospace" fontSize="3.55" letterSpacing="0.22em" fill="currentColor" opacity="0.55">
        <textPath href="#badge-circle" startOffset="0%">
          PORTFOLIO • CHENNAI • INDIA • 2026 • PORTFOLIO • CHENNAI •
        </textPath>
      </text>
    </svg>
  );
}
