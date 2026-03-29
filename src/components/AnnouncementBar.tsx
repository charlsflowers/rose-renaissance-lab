import { useMemo } from "react";
import { getMiamiTime } from "@/lib/miamiTime";
import { useTranslation } from "@/i18n/LanguageContext";

const AnnouncementBar = () => {
  const { language } = useTranslation();

  const message = useMemo(() => {
    const { hours } = getMiamiTime();
    if (hours < 15) {
      return language === "es"
        ? "⏰ Pide antes de las 3PM para envío hoy mismo"
        : "⏰ Order before 3PM for same-day delivery today";
    }
    return language === "es"
      ? "⏰ Pide ahora para entrega mañana"
      : "⏰ Order now for next-day delivery";
  }, [language]);

  return (
    <div className="bg-primary text-primary-foreground text-center py-1.5 font-body text-[11px] md:text-xs tracking-wider">
      {message}
    </div>
  );
};

export default AnnouncementBar;
