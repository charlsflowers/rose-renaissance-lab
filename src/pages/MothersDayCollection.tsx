import { useEffect } from "react";
import { Link } from "@/i18n/LocalizedRouter";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Flower2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";
import { useMothersDayBouquets } from "@/lib/mothersDayProducts";
import { isMothersDayPromoActive } from "@/lib/mothersDayPromo";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * /mothers-day — landing page for the Mother's Day Special Edition collection.
 *
 * Lives all year round (good for SEO). Purchase is enabled only during the
 * promo window. Outside the window the cards still link to product pages and
 * each product page shows its own "Available again on May 1" notice.
 */
const MothersDayCollection = () => {
  const { language, t } = useTranslation();
  const { products, raw, loading } = useMothersDayBouquets();
  const promoActive = isMothersDayPromoActive();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={t("seo.mothersDay.title")}
        description={t("seo.mothersDay.description")}
        path="/mothers-day"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://www.charlsflowers.com" },
          { name: "Mother's Day", url: "https://www.charlsflowers.com/mothers-day" },
        ])}
      />
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs
            items={[
              { label: t_label(language, "Home", "Inicio"), to: "/" },
              { label: t_label(language, "Mother's Day", "Día de la Madre") },
            ]}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-4">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-body text-[10px] md:text-xs tracking-widest uppercase font-semibold">
                {language === "es" ? "Disponible Mayo 1 – Mayo 12" : "Available May 1 – May 12"}
              </span>
            </div>
            <p className="font-subtitle-script text-primary text-lg md:text-2xl mb-2 flex items-center justify-center gap-2">
              <Flower2 className="w-4 h-4" />
              {language === "es" ? "Edición Limitada" : "Limited Edition"}
            </p>
            <h1 className="font-title-retro text-4xl md:text-5xl text-foreground mb-3">
              {language === "es" ? "Colección Día de la Madre" : "Mother's Day Collection"}
            </h1>
            <p className="text-muted-foreground font-body text-sm md:text-base max-w-2xl mx-auto">
              {language === "es"
                ? "Los bouquets más especiales para la mujer más importante de tu vida. Hechos a mano en Miami, entrega el mismo día disponible."
                : "The most special bouquets for the most important woman in your life. Handcrafted in Miami, same-day delivery available."}
            </p>
            {!promoActive && (
              <p className="text-primary font-body text-xs md:text-sm font-semibold mt-4">
                {language === "es"
                  ? "Disponible para compra del 1 al 12 de mayo de 2026."
                  : "Available for purchase May 1 – May 12, 2026."}
              </p>
            )}
          </motion.div>

          {loading && products.length === 0 ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground font-body py-10">
              {language === "es" ? "No se pudo cargar la colección." : "Could not load the collection."}
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
              {products.map((product) => {
                const rawData = raw.find((r) => r.handle === product.shopifyHandle);
                return (
                  <motion.div
                    key={product.shopifyHandle}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
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
          )}

          <div className="text-center mt-12">
            <Link
              to="/bouquets"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-body text-sm tracking-wider uppercase transition-colors"
            >
              {language === "es" ? "Ver todos los bouquets" : "View all bouquets"}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const t_label = (lang: string, en: string, es: string) => (lang === "es" ? es : en);

export default MothersDayCollection;
