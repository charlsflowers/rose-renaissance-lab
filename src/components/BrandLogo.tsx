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
        d="M12 30h40l-3.5 18H15.5L12 30Z"
        fill={c}
        opacity={mono ? 0.2 : 0.1}
        stroke={c}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Cart handle */}
      <path
        d="M12 30L8 22H4"
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

      {/* Bouquet wrapping / cone */}
      <path
        d="M22 30 L26 12 h12 L42 30"
        fill={secondary}
        opacity={mono ? 0.25 : 0.15}
        stroke={secondary}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Wrapping ribbon */}
      <path
        d="M25 24 Q32 21 39 24"
        stroke={gold}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity={mono ? 0.7 : 0.6}
      />

      {/* Stems */}
      <line x1="28" y1="22" x2="26" y2="14" stroke={secondary} strokeWidth="1.2" strokeLinecap="round" opacity={mono ? 0.7 : 0.5} />
      <line x1="32" y1="22" x2="32" y2="10" stroke={secondary} strokeWidth="1.2" strokeLinecap="round" opacity={mono ? 0.7 : 0.5} />
      <line x1="36" y1="22" x2="38" y2="14" stroke={secondary} strokeWidth="1.2" strokeLinecap="round" opacity={mono ? 0.7 : 0.5} />

      {/* Rose left — layered petals */}
      <circle cx="25" cy="12" r="4.5" fill={c} opacity={mono ? 0.9 : 0.75} />
      <circle cx="25" cy="12" r="2.8" fill={c} opacity={mono ? 1 : 0.9} />
      <circle cx="25" cy="12" r="1.2" fill={gold} opacity={0.7} />

      {/* Rose center — larger */}
      <circle cx="32" cy="7" r="5.5" fill={c} opacity={mono ? 0.95 : 0.8} />
      <circle cx="32" cy="7" r="3.5" fill={c} opacity={mono ? 1 : 0.95} />
      <circle cx="32" cy="7" r="1.5" fill={gold} opacity={0.7} />

      {/* Rose right */}
      <circle cx="39" cy="12" r="4.5" fill={c} opacity={mono ? 0.9 : 0.75} />
      <circle cx="39" cy="12" r="2.8" fill={c} opacity={mono ? 1 : 0.9} />
      <circle cx="39" cy="12" r="1.2" fill={gold} opacity={0.7} />

      {/* Small bud top-left */}
      <circle cx="23" cy="7" r="2.5" fill={c} opacity={mono ? 0.7 : 0.55} />
      <circle cx="23" cy="7" r="1" fill={c} opacity={mono ? 0.9 : 0.75} />

      {/* Small bud top-right */}
      <circle cx="41" cy="7" r="2.5" fill={c} opacity={mono ? 0.7 : 0.55} />
      <circle cx="41" cy="7" r="1" fill={c} opacity={mono ? 0.9 : 0.75} />

      {/* Leaves */}
      <path d="M20 18c-3-1-5 1-4 3 1.5 0.5 3.5-1 4-3Z" fill={secondary} opacity={mono ? 0.6 : 0.4} />
      <path d="M44 18c3-1 5 1 4 3-1.5 0.5-3.5-1-4-3Z" fill={secondary} opacity={mono ? 0.6 : 0.4} />
    </svg>
  );
};

export default BrandLogo;
