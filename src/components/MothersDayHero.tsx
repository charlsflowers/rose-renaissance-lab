import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Flower2 } from "lucide-react";
import { useMothersDayBouquets } from "@/lib/mothersDayProducts";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * Hero shown on the home page during the Mother's Day promo (May 1–12, 2026).
 * Renders ABOVE the standard hero. Background image is pulled live from the
 * first product of the Mother's Day Shopify collection.
 */
const MothersDayHero = () => {
  const { language } = useTranslation();
  const { products } = useMothersDayBouquets();

  // Prefer "Total Passion" for hero, otherwise first product.
  const featured =
    products.find((p) => p.shopifyHandle.startsWith("total-passion")) ??
    products.find((p) => p.shopifyHandle.startsWith("pure-white")) ??
    products[0];
  const bgImage = featured?.image;

  return (
    <section
      className="relative min-h-[70vh] md:min-h-[88vh] flex items-end md:items-center overflow-hidden"
      aria-label="Mother's Day Special Edition"
    >
      <div className="absolute inset-0">
        {bgImage ? (
          <img
            src={bgImage}
            alt="Mother's Day Special Edition Bouquets Miami – Charls Flowers"
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/40 via-primary/20 to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-foreground/85 via-foreground/55 to-foreground/10" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 pb-10 md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-full mb-4 md:mb-5">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-body text-[10px] md:text-xs tracking-widest uppercase font-semibold">
              {language === "es" ? "Disponible Mayo 1 – Mayo 12" : "Available May 1 – May 12"}
            </span>
          </div>

          <p className="font-subtitle-script text-primary-foreground/85 text-lg md:text-2xl mb-2 md:mb-3 flex items-center gap-2">
            <Flower2 className="w-4 h-4 md:w-5 md:h-5" />
            {language === "es" ? "Edición Especial" : "Special Edition"}
          </p>

          <h1 className="font-display text-4xl md:text-7xl font-bold text-primary-foreground leading-tight mb-3 md:mb-5">
            {language === "es" ? "Edición Especial Día de la Madre" : "Mother's Day Special Edition"}
          </h1>

          <p className="text-primary-foreground/85 font-body text-sm md:text-lg mb-6 md:mb-8 leading-relaxed">
            {language === "es"
              ? "Los bouquets más especiales para la mujer más importante de tu vida."
              : "The most special bouquets for the most important woman in your life."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link
              to="/mothers-day"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 md:px-9 py-4 md:py-5 font-body text-xs md:text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg font-semibold"
            >
              {language === "es" ? "Ver Colección Día de la Madre" : "Shop Mother's Day Collection"}
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MothersDayHero;
