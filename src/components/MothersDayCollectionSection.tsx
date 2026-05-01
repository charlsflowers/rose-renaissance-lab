import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useMothersDayBouquets } from "@/lib/mothersDayProducts";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * Featured "Mother's Day Special Edition" section shown on home above
 * the standard "Bouquets" section. Pulls 7 product cards live from
 * the Shopify "mothers-day" collection.
 */
const MothersDayCollectionSection = () => {
  const { language } = useTranslation();
  const { products, raw, loading } = useMothersDayBouquets();

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="font-subtitle-script text-primary text-lg md:text-2xl mb-2">
            {language === "es" ? "Edición Limitada" : "Limited Edition"}
          </p>
          <h2 className="font-title-retro text-4xl md:text-5xl text-primary mb-3">
            {language === "es" ? "Edición Especial Día de la Madre" : "Mother's Day Special Edition"}
          </h2>
          <p className="text-muted-foreground font-body text-sm md:text-base max-w-xl mx-auto">
            {language === "es"
              ? "Disponible solo del 1 al 12 de mayo. Hecho con cariño para celebrar a Mamá."
              : "Available May 1 – May 12 only. Crafted with love to celebrate Mom."}
          </p>
        </motion.div>

        {loading && products.length === 0 ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground font-body">
            {language === "es" ? "No se pudo cargar la colección." : "Could not load the collection."}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
              {products.map((product) => {
                const rawData = raw.find((r) => r.handle === product.shopifyHandle);
                return (
                  <motion.div
                    key={product.shopifyHandle}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <Link
                      to={`/bouquets/mothers-day/${product.shopifyHandle}`}
                      className="group block"
                    >
                      <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-muted">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={`${product.name} Miami – Charls Flowers`}
                            loading="lazy"
                            width={400}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : null}
                        <div className="absolute -top-1 -right-1 z-10">
                          <div className="bg-primary text-primary-foreground px-2.5 md:px-4 py-1 md:py-1.5 rounded-bl-lg rounded-tr-sm font-body text-[9px] md:text-[10px] tracking-wider uppercase font-bold shadow-lg">
                            {language === "es" ? "Día de la Madre" : "Mother's Day"}
                          </div>
                        </div>
                      </div>
                      <h3 className="font-display text-base md:text-lg font-semibold text-foreground text-center">
                        {product.name}
                      </h3>
                      <p className="text-primary font-body text-sm font-semibold text-center mt-2">
                        {language === "es" ? "Desde" : "From"} ${rawData?.minPrice.toFixed(2) ?? "125.00"}
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/mothers-day"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg font-semibold"
              >
                {language === "es" ? "Ver toda la Colección" : "View Full Collection"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MothersDayCollectionSection;
