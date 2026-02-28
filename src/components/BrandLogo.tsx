const BrandLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Shopping bag body */}
    <path
      d="M14 24h36l-3 30H17L14 24Z"
      fill="hsl(var(--primary))"
      opacity="0.15"
      stroke="hsl(var(--primary))"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Bag handles */}
    <path
      d="M22 24c0-6 4-10 10-10s10 4 10 10"
      stroke="hsl(var(--primary))"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Flower center */}
    <circle cx="32" cy="34" r="3" fill="hsl(var(--gold))" />
    {/* Flower petals */}
    {[0, 60, 120, 180, 240, 300].map((angle) => (
      <ellipse
        key={angle}
        cx="32"
        cy="28"
        rx="4"
        ry="7"
        fill="hsl(var(--primary))"
        opacity="0.8"
        transform={`rotate(${angle} 32 34)`}
      />
    ))}
    {/* Leaf left */}
    <path
      d="M24 42c-3 2-5 5-4 7 2 0 5-1 7-4"
      stroke="hsl(var(--secondary))"
      strokeWidth="1.5"
      fill="hsl(var(--secondary))"
      opacity="0.5"
      strokeLinecap="round"
    />
    {/* Leaf right */}
    <path
      d="M40 42c3 2 5 5 4 7-2 0-5-1-7-4"
      stroke="hsl(var(--secondary))"
      strokeWidth="1.5"
      fill="hsl(var(--secondary))"
      opacity="0.5"
      strokeLinecap="round"
    />
  </svg>
);

export default BrandLogo;
