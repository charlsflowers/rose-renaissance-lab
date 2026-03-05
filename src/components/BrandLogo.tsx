const BrandLogo = ({ className = "w-8 h-8", color }: { className?: string; color?: string }) => {
  const c = color || "hsl(var(--primary))";
  const gold = color || "hsl(var(--gold))";
  const secondary = color || "hsl(var(--secondary))";
  const mono = !!color;
  const white = mono ? color : "#fff";
  const whiteStroke = mono ? color : "#e8d8d8";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cart basket */}
      <path
        d="M12 32h40l-3.5 16H15.5L12 32Z"
        fill={c}
        opacity={mono ? 0.2 : 0.1}
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Cart handle */}
      <path
        d="M12 32L8 24H4"
        stroke={c}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Cart wheel left */}
      <circle cx="20" cy="52" r="2.5" stroke={c} strokeWidth="1.8" fill={c} opacity={mono ? 0.6 : 0.25} />
      {/* Cart wheel right */}
      <circle cx="44" cy="52" r="2.5" stroke={c} strokeWidth="1.8" fill={c} opacity={mono ? 0.6 : 0.25} />

      {/* White wrapping paper — layered petals fanning out */}
      <path
        d="M16 28 Q14 20 18 14 L22 10 Q24 16 22 24Z"
        fill={white}
        stroke={whiteStroke}
        strokeWidth="0.6"
        opacity={mono ? 0.3 : 0.85}
      />
      <path
        d="M48 28 Q50 20 46 14 L42 10 Q40 16 42 24Z"
        fill={white}
        stroke={whiteStroke}
        strokeWidth="0.6"
        opacity={mono ? 0.3 : 0.85}
      />
      <path
        d="M14 26 Q10 18 16 10 L20 7 Q20 14 18 22Z"
        fill={white}
        stroke={whiteStroke}
        strokeWidth="0.5"
        opacity={mono ? 0.25 : 0.7}
      />
      <path
        d="M50 26 Q54 18 48 10 L44 7 Q44 14 46 22Z"
        fill={white}
        stroke={whiteStroke}
        strokeWidth="0.5"
        opacity={mono ? 0.25 : 0.7}
      />
      {/* Center wrapping cone */}
      <path
        d="M24 32 L28 14 h8 L40 32"
        fill={white}
        stroke={whiteStroke}
        strokeWidth="0.8"
        opacity={mono ? 0.3 : 0.8}
        strokeLinejoin="round"
      />

      {/* Ribbon bow */}
      <path
        d="M29 28 Q32 25 35 28"
        stroke={c}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        opacity={mono ? 0.8 : 1}
      />
      <path
        d="M30 28 Q28 31 27 33"
        stroke={c}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        opacity={mono ? 0.6 : 0.8}
      />
      <path
        d="M34 28 Q36 31 37 33"
        stroke={c}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        opacity={mono ? 0.6 : 0.8}
      />

      {/* Rose cluster — dense round dome */}
      {/* Row 1 — top */}
      <circle cx="32" cy="6" r="3.8" fill={c} opacity={mono ? 0.95 : 0.85} />
      <circle cx="32" cy="6" r="2" fill={c} opacity={mono ? 1 : 0.95} />
      {/* Row 2 */}
      <circle cx="26" cy="9" r="3.5" fill={c} opacity={mono ? 0.9 : 0.8} />
      <circle cx="26" cy="9" r="1.8" fill={c} opacity={mono ? 1 : 0.92} />
      <circle cx="38" cy="9" r="3.5" fill={c} opacity={mono ? 0.9 : 0.8} />
      <circle cx="38" cy="9" r="1.8" fill={c} opacity={mono ? 1 : 0.92} />
      {/* Row 3 — widest */}
      <circle cx="21" cy="14" r="3.8" fill={c} opacity={mono ? 0.85 : 0.75} />
      <circle cx="21" cy="14" r="2" fill={c} opacity={mono ? 0.95 : 0.88} />
      <circle cx="32" cy="13" r="4" fill={c} opacity={mono ? 0.95 : 0.85} />
      <circle cx="32" cy="13" r="2.2" fill={c} opacity={mono ? 1 : 0.95} />
      <circle cx="43" cy="14" r="3.8" fill={c} opacity={mono ? 0.85 : 0.75} />
      <circle cx="43" cy="14" r="2" fill={c} opacity={mono ? 0.95 : 0.88} />
      {/* Row 4 */}
      <circle cx="25" cy="18" r="3.2" fill={c} opacity={mono ? 0.85 : 0.7} />
      <circle cx="25" cy="18" r="1.6" fill={c} opacity={mono ? 0.95 : 0.85} />
      <circle cx="39" cy="18" r="3.2" fill={c} opacity={mono ? 0.85 : 0.7} />
      <circle cx="39" cy="18" r="1.6" fill={c} opacity={mono ? 0.95 : 0.85} />
      {/* Fill gaps */}
      <circle cx="29" cy="10" r="2.8" fill={c} opacity={mono ? 0.88 : 0.78} />
      <circle cx="35" cy="10" r="2.8" fill={c} opacity={mono ? 0.88 : 0.78} />
      <circle cx="27" cy="14" r="2.5" fill={c} opacity={mono ? 0.82 : 0.72} />
      <circle cx="37" cy="14" r="2.5" fill={c} opacity={mono ? 0.82 : 0.72} />
      <circle cx="32" cy="18" r="3" fill={c} opacity={mono ? 0.9 : 0.8} />
      <circle cx="32" cy="18" r="1.5" fill={c} opacity={mono ? 1 : 0.9} />

      {/* Rose centers — gold dots */}
      <circle cx="32" cy="6" r="0.9" fill={gold} opacity={0.5} />
      <circle cx="26" cy="9" r="0.8" fill={gold} opacity={0.5} />
      <circle cx="38" cy="9" r="0.8" fill={gold} opacity={0.5} />
      <circle cx="32" cy="13" r="0.9" fill={gold} opacity={0.5} />
    </svg>
  );
};

export default BrandLogo;
