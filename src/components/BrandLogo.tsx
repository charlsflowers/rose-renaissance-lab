const BrandLogo = ({ className = "w-8 h-8", color }: { className?: string; color?: string }) => {
  const c = color || "hsl(var(--primary))";
  const gold = color || "hsl(var(--gold))";
  const secondary = color || "hsl(var(--secondary))";
  const mono = !!color;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Cart basket */}
      <path
        d="M10 28h44l-4 20H14L10 28Z"
        fill={c}
        opacity={mono ? 0.25 : 0.12}
        stroke={c}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Cart wheel left */}
      <circle cx="20" cy="52" r="3" stroke={c} strokeWidth="2" fill={c} opacity={mono ? 0.7 : 0.3} />
      {/* Cart wheel right */}
      <circle cx="44" cy="52" r="3" stroke={c} strokeWidth="2" fill={c} opacity={mono ? 0.7 : 0.3} />
      {/* Cart handle */}
      <path
        d="M10 28L6 20H2"
        stroke={c}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Stems */}
      <line x1="24" y1="28" x2="22" y2="18" stroke={secondary} strokeWidth="1.5" strokeLinecap="round" opacity={mono ? 0.8 : 1} />
      <line x1="32" y1="28" x2="32" y2="14" stroke={secondary} strokeWidth="1.5" strokeLinecap="round" opacity={mono ? 0.8 : 1} />
      <line x1="40" y1="28" x2="42" y2="18" stroke={secondary} strokeWidth="1.5" strokeLinecap="round" opacity={mono ? 0.8 : 1} />
      {/* Rose left */}
      <circle cx="22" cy="15" r="5" fill={c} opacity={mono ? 1 : 0.85} />
      <circle cx="22" cy="15" r="2.5" fill={c} />
      <circle cx="22" cy="15" r="1" fill={gold} />
      {/* Rose center (taller) */}
      <circle cx="32" cy="11" r="6" fill={c} opacity={mono ? 1 : 0.9} />
      <circle cx="32" cy="11" r="3" fill={c} />
      <circle cx="32" cy="11" r="1.2" fill={gold} />
      {/* Rose right */}
      <circle cx="42" cy="15" r="5" fill={c} opacity={mono ? 1 : 0.85} />
      <circle cx="42" cy="15" r="2.5" fill={c} />
      <circle cx="42" cy="15" r="1" fill={gold} />
      {/* Small leaves */}
      <path d="M18 22c-2-1-4 0-4 2 1 1 3 0 4-2Z" fill={secondary} opacity={mono ? 0.8 : 0.5} />
      <path d="M46 22c2-1 4 0 4 2-1 1-3 0-4-2Z" fill={secondary} opacity={mono ? 0.8 : 0.5} />
    </svg>
  );
};

export default BrandLogo;
