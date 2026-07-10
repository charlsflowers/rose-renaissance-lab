import { useEffect, useRef, useState, type CSSProperties } from "react";

interface LazyMapProps {
  /** The Google Maps embed URL. Only requested once the map scrolls into view. */
  src: string;
  title: string;
  /** Class applied to the <iframe> (and the matching-height placeholder). */
  className?: string;
  /** Inline styles applied to the wrapper (e.g. minHeight). */
  style?: CSSProperties;
}

/**
 * Renders a Google Maps embed that is NOT requested until the user scrolls it
 * near the viewport. This keeps the (heavy) Maps third-party off the critical
 * path — nothing is fetched at page load. A lightweight placeholder holds the
 * layout so there is no CLS when the iframe mounts.
 */
const LazyMap = ({ src, title, className, style }: LazyMapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    // Fallback for very old browsers: just show it.
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  return (
    <div ref={ref} style={style}>
      {show ? (
        <iframe
          src={src}
          className={className}
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
        />
      ) : (
        <div className={className} aria-hidden="true" style={{ background: "hsl(var(--muted))" }} />
      )}
    </div>
  );
};

export default LazyMap;
