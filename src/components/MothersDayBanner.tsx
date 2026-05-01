import { Flower2 } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * Notice banner shown across the site during the Mother's Day promo.
 * Coexists with AnnouncementBar (does not replace it).
 */
const MothersDayBanner = () => {
  const { language } = useTranslation();
  return (
    <div className="bg-primary/10 border-y border-primary/20 py-3 px-4">
      <div className="container mx-auto flex items-start md:items-center justify-center gap-3 text-center">
        <Flower2 className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5 md:mt-0" />
        <p className="font-body text-xs md:text-sm text-foreground leading-relaxed">
          <span className="font-semibold text-primary">
            {language === "es" ? "Especial Día de la Madre" : "Mother's Day Special"}
          </span>{" "}
          —{" "}
          {language === "es"
            ? "Del 1 al 12 de mayo, solo nuestra Colección Día de la Madre está disponible para compra. Bouquets y Room Decor volverán a estar disponibles el 13 de mayo."
            : "From May 1st to 12th, only our Mother's Day Collection is available for purchase. Bouquets and Room Decor will be available again on May 13."}
        </p>
      </div>
    </div>
  );
};

export default MothersDayBanner;
