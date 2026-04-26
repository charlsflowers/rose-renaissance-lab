/**
 * Decorative animated wave divider — reuses the same wave SVG used by the homepage ticker.
 * - position="top": waves point upward (flat edge at bottom). Place ABOVE the section.
 * - position="bottom": waves point downward (flat edge at top). Place BELOW the section.
 * - color: CSS color string for the wave fill (defaults to primary).
 */
const WaveDivider = ({
  position = "top",
  color = "hsl(var(--primary))",
  className = "",
}: {
  position?: "top" | "bottom";
  color?: string;
  className?: string;
}) => {
  const isTop = position === "top";
  return (
    <div
      className={`relative w-full h-[55px] overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className={`h-full ${isTop ? "animate-wave" : "animate-wave-reverse"}`}
        style={{ width: "200%", minWidth: "3840px" }}
        viewBox="0 0 2880 60"
        preserveAspectRatio="none"
      >
        {isTop ? (
          <>
            <path d="M0,60 C360,20 720,50 1080,30 C1440,10 1800,50 2160,25 C2520,5 2880,40 2880,40 L2880,60 Z" fill={color} opacity="0.3" />
            <path d="M0,60 C480,35 960,55 1440,40 C1920,25 2400,50 2880,35 L2880,60 Z" fill={color} opacity="0.55" />
            <path d="M0,60 C320,48 640,56 960,50 C1280,44 1600,54 1920,48 C2240,42 2560,52 2880,46 L2880,60 Z" fill={color} opacity="0.8" />
          </>
        ) : (
          <>
            <path d="M0,0 C360,40 720,10 1080,30 C1440,50 1800,10 2160,35 C2520,55 2880,20 2880,20 L2880,0 Z" fill={color} opacity="0.3" />
            <path d="M0,0 C480,25 960,5 1440,20 C1920,35 2400,10 2880,25 L2880,0 Z" fill={color} opacity="0.55" />
            <path d="M0,0 C320,12 640,4 960,10 C1280,16 1600,6 1920,12 C2240,18 2560,8 2880,14 L2880,0 Z" fill={color} opacity="0.8" />
          </>
        )}
      </svg>
    </div>
  );
};

export default WaveDivider;