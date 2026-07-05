import { useEffect } from "react";
import { Link } from "@/i18n/LocalizedRouter";
import { motion } from "framer-motion";
import { ArrowRight, Flower2, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, itemListSchema, faqSchema } from "@/components/JsonLd";
import MothersDayCountdown from "@/components/MothersDayCountdown";
import { useMothersDayBouquets } from "@/lib/mothersDayProducts";
import { getMothersDayWindow, isMothersDayPurchasable } from "@/lib/mothersDayPromo";
import { useTranslation } from "@/i18n/LanguageContext";
import { LongTailIntro, LongTailBody } from "@/components/LongTailSeoBlock";

/**
 * /mothers-day — landing for the Mother's Day Flowers collection.
 *
 * Lives all year round for SEO. Outside the purchase window it renders "locked"
 * (a coming-soon gate with a countdown), but the full content — the 7 products,
 * copy and FAQ — stays in the DOM so Google indexes a real, non-thin page.
 * Products schema uses OutOfStock while locked (we never tell Google a blocked
 * product is buyable). Purchase opens automatically 1 week before → 1 week after
 * Mother's Day, then re-locks.
 */
const MothersDayCollection = () => {
  const { language, t } = useTranslation();
  const isEs = language === "es";
  const { products, raw } = useMothersDayBouquets();
  const purchasable = isMothersDayPurchasable();
  const window = getMothersDayWindow();

  useEffect(() => {
    globalThis.scrollTo?.(0, 0);
  }, []);

  const fmt = (d: Date, withYear = true) =>
    d.toLocaleDateString(isEs ? "es-ES" : "en-US", {
      day: "numeric",
      month: "long",
      ...(withYear ? { year: "numeric" } : {}),
    });

  const mdDate = fmt(window.mothersDay);
  const openDate = fmt(window.open);
  const closeDate = fmt(window.close);

  const faqs = isEs
    ? [
        { question: "¿Cuándo es el Día de la Madre?", answer: `El Día de la Madre en Estados Unidos es el ${mdDate} (el segundo domingo de mayo).` },
        { question: "¿Cuándo puedo comprar la colección del Día de la Madre?", answer: `La colección se abre para pedidos del ${openDate} al ${closeDate} — una semana antes y una semana después del Día de la Madre. Hasta entonces puedes ver aquí todos los diseños.` },
        { question: "¿Entregáis flores del Día de la Madre el mismo día en Miami?", answer: "Sí. Charls Flowers entrega flores frescas el mismo día en todo Miami. Pide antes de las 3 PM (hora de Miami) para entrega el mismo día durante la ventana del Día de la Madre." },
        { question: "¿De cuántas rosas son los ramos?", answer: "Cada diseño del Día de la Madre está disponible de 50 hasta 200 rosas, desde $163." },
      ]
    : [
        { question: "When is Mother's Day?", answer: `Mother's Day in the United States is ${mdDate} (the second Sunday of May).` },
        { question: "When can I order the Mother's Day collection?", answer: `The collection opens for orders from ${openDate} to ${closeDate} — one week before and one week after Mother's Day. Until then you can preview every design here.` },
        { question: "Do you deliver Mother's Day flowers same-day in Miami?", answer: "Yes. Charls Flowers delivers fresh flowers the same day across Miami. Order before 3 PM (Miami time) for same-day delivery during the Mother's Day window." },
        { question: "How many roses do the bouquets come with?", answer: "Each Mother's Day design is available from 50 up to 200 roses, starting at $163." },
      ];

  const schemaItems = products.map((product) => {
    const rawData = raw.find((r) => r.handle === product.shopifyHandle);
    return {
      name: `${product.name} Miami`,
      url: `https://charlsflowers.com/bouquets/mothers-day/${product.shopifyHandle}`,
      image: product.image || undefined,
      price: rawData?.minPrice ?? 163,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={t("seo.mothersDay.title")}
        description={t("seo.mothersDay.description")}
        path="/mothers-day"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://charlsflowers.com" },
          { name: "Mother's Day", url: "https://charlsflowers.com/mothers-day" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          schemaItems,
          "Mother's Day Flowers",
          purchasable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        )}
      />
      <JsonLd data={faqSchema(faqs)} />
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs
            items={[
              { label: isEs ? "Inicio" : "Home", to: "/" },
              { label: isEs ? "Flores para el Día de la Madre" : "Mother's Day Flowers" },
            ]}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-12"
          >
            <p className="font-subtitle-script text-primary text-lg md:text-2xl mb-2 flex items-center justify-center gap-2">
              <Flower2 className="w-4 h-4" />
              {isEs ? "Edición Limitada" : "Limited Edition"}
            </p>
            <h1 className="font-title-retro text-4xl md:text-5xl text-foreground mb-3">
              {isEs ? "Flores para el Día de la Madre" : "Mother's Day Flowers"}
            </h1>
            {/* Mirror-effect long-tail intro under the existing H1. */}
            <LongTailIntro seoKey="mothers-day" />
            <p className="text-muted-foreground font-body text-sm md:text-base max-w-2xl mx-auto">
              {isEs
                ? "Los ramos más especiales para la mujer más importante de tu vida. Rosas de un solo color hechas a mano en Miami, con entrega el mismo día durante la temporada."
                : "The most special bouquets for the most important woman in your life. Single-color roses handcrafted in Miami, with same-day delivery in season."}
            </p>
            <div className="mt-6 flex justify-center">
              <MothersDayCountdown />
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
            {products.map((product) => {
              const rawData = raw.find((r) => r.handle === product.shopifyHandle);
              const card = (
                <>
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
                    {!purchasable && (
                      <div className="absolute top-2 right-2 bg-background/90 text-primary rounded-full p-1.5">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-base md:text-lg font-semibold text-foreground text-center">
                    {product.name}
                  </h3>
                  <p className="text-primary font-body text-sm font-semibold text-center mt-2">
                    {isEs ? "Desde" : "From"} ${rawData?.minPrice.toFixed(2) ?? "163.00"}
                  </p>
                </>
              );
              // Locked → not a link (no purchase). Open → link to the product page.
              return purchasable ? (
                <motion.div
                  key={product.shopifyHandle}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <Link to={`/bouquets/mothers-day/${product.shopifyHandle}`} className="group block">
                    {card}
                  </Link>
                </motion.div>
              ) : (
                <div key={product.shopifyHandle} className="group block cursor-default">
                  {card}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/bouquets"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-body text-sm tracking-wider uppercase transition-colors"
            >
              {isEs ? "Ver todos los bouquets" : "View all bouquets"}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* FAQ — real content so the page is never "thin" while locked. */}
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="font-title-retro text-2xl md:text-3xl text-foreground text-center mb-6">
              {isEs ? "Preguntas frecuentes" : "Frequently asked questions"}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="border border-border rounded-xl p-5">
                  <h3 className="font-display text-base md:text-lg font-semibold text-foreground mb-1.5">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Long-tail body block — H2/H3 + copy + internal-link cluster. */}
      <LongTailBody seoKey="mothers-day" />

      <Footer />
    </div>
  );
};

export default MothersDayCollection;
