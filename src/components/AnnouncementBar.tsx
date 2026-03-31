import { useMemo } from "react";
import { getMiamiTime } from "@/lib/miamiTime";
import { useTranslation } from "@/i18n/LanguageContext";

const AnnouncementBar = () => {
  const { language } = useTranslation();

  const message = useMemo(() => {
    const { hours, day: dayOfWeek } = getMiamiTime();
    // Closing hours: Sun=17, Sat=18, Mon-Fri=19
    const closeHour = dayOfWeek === 0 ? 17 : dayOfWeek === 6 ? 18 : 19;
    const cutoff = 15; // 3PM

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
  }, [language]);

  return (
    <div className="bg-primary text-primary-foreground text-center py-1.5 font-body text-[11px] md:text-xs tracking-wider">
      {message}
    </div>
  );
};

export default AnnouncementBar;
