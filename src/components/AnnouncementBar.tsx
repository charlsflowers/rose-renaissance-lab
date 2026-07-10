import { useEffect, useMemo, useState } from "react";
import { getMiamiTime } from "@/lib/miamiTime";
import { useTranslation } from "@/i18n/LanguageContext";

const AnnouncementBar = () => {
  const { language } = useTranslation();
  // The message depends on the CURRENT Miami time, which differs between the
  // build-time prerender and the client's load time → React hydration mismatch
  // (#418/#423). Render a deterministic default first (identical in prerender
  // and hydration), then switch to the time-accurate message after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const message = useMemo(() => {
    // First paint (server prerender + client hydration) must be identical, so
    // emit a fixed default until mounted on the client. During prerender the
    // effect fires too, so also gate on the prerender flag to keep the static
    // HTML on the default (otherwise it would freeze the build-time message).
    const isPrerender =
      typeof window !== "undefined" &&
      (window as Window & { __CF_PRERENDER__?: boolean }).__CF_PRERENDER__;
    if (!mounted || isPrerender) {
      return language === "es"
        ? "Entrega en el mismo día disponible - Pide antes de las 3PM"
        : "Same-day delivery available - Order before 3PM";
    }
    const { hours, day: dayOfWeek } = getMiamiTime();
    // Closing hours: Sun=closed, Sat=17, Mon-Fri=19
    const closeHour = dayOfWeek === 6 ? 17 : 19;
    const cutoff = 15; // 3PM

    // Sunday closed
    if (dayOfWeek === 0) {
      return language === "es"
        ? "Entrega al día siguiente - Pide ahora"
        : "Next-day delivery - Order now";
    }
    if (hours < cutoff) {
      return language === "es"
        ? "Entrega en el mismo día disponible - Pide antes de las 3PM"
        : "Same-day delivery available - Order before 3PM";
    }
    if (hours < closeHour) {
      return language === "es"
        ? "Entrega al día siguiente - Pide ahora"
        : "Next-day delivery - Order now";
    }
    return language === "es"
      ? "Entrega al día siguiente - Pide ahora"
      : "Next-day delivery - Order now";
  }, [language, mounted]);

  return (
    <div className="bg-primary text-primary-foreground text-center py-1.5 font-body text-[11px] md:text-xs tracking-wider">
      {message}
    </div>
  );
};

export default AnnouncementBar;
