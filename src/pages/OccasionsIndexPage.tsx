import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "@/i18n/LocalizedRouter";
import { Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, itemListSchema } from "@/components/JsonLd";
import { occasionPages } from "@/lib/occasionPagesData";
import { useTranslation } from "@/i18n/LanguageContext";
import NotFound from "@/pages/NotFound";

/**
 * Occasions index — /collections/occasions (EN) and /es/collections/ocasiones (ES).
 * Lists every occasion grouped by tier. Mother's Day is surfaced first as a
 * dedicated "live now" card pointing to the existing /bouquets/mothers-day page.
 *
 * Mounted under the dynamic /collections/:slug route — we early-return the index
 * page when the slug matches either the EN or ES index slug; otherwise we render
 * NotFound (the OccasionPage route handles real occasion slugs).
 */
const OccasionsIndexPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useTranslation();
  const isEs = language === "es";

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Allow either index slug regardless of active language (safety net for cross-lang URL visits).
  if (slug && slug !== "occasions" && slug !== "ocasiones") return <NotFound />;

  const title = isEs
    ? "Flores por Ocasión Miami | Bouquets para Cada Momento | Charls Flowers"
    : "Flowers by Occasion Miami | Bouquets for Every Moment | Charls Flowers";
  const description = isEs
    ? "Bouquets de rosa premium para cada ocasión: San Valentín, cumpleaños, aniversarios, funeral, boda, Día del Padre y más. Entrega el mismo día en Miami."
    : "Premium rose bouquets for every occasion: Valentine's, birthdays, anniversaries, sympathy, weddings, Father's Day and more. Same-day delivery in Miami.";

  const tiers = [
    { tier: 1 as const, title: isEs ? "Las grandes ocasiones" : "The big occasions" },
    { tier: 2 as const, title: isEs ? "Otras ocasiones" : "Other occasions" },
    { tier: 3 as const, title: isEs ? "Detalles y celebraciones pequeñas" : "Small celebrations & moments" },
  ];

  const itemList = itemListSchema(
    occasionPages.map((o) => ({
      name: isEs ? o.h1.es : o.h1.en,
      url: isEs
        ? `https://www.charlsflowers.com/es/collections/${o.slugEs}`
        : `https://www.charlsflowers.com/collections/${o.slug}`,
    })),
    isEs ? "Ocasiones" : "Occasions",
  );

  const breadcrumbs = breadcrumbSchema([
    { name: isEs ? "Inicio" : "Home", url: isEs ? "https://www.charlsflowers.com/es" : "https://www.charlsflowers.com" },
    {
      name: isEs ? "Ocasiones" : "Occasions",
      url: isEs ? "https://www.charlsflowers.com/es/collections/ocasiones" : "https://www.charlsflowers.com/collections/occasions",
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={title}
        description={description}
        path="/collections/occasions"
        pathEs="/collections/ocasiones"
      />
      <JsonLd data={[itemList, breadcrumbs]} />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <Breadcrumbs
            items={[
              { label: isEs ? "Inicio" : "Home", to: "/" },
              { label: isEs ? "Ocasiones" : "Occasions" },
            ]}
          />
          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">
            {isEs ? "Flores por Ocasión" : "Flowers by Occasion"}
          </h1>
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-3xl">
            {isEs
              ? "Cada momento pide un bouquet distinto. Aquí está la guía rápida — del aniversario a la condolencia, del cumpleaños a la boda — con la colección que mejor encaja con cada ocasión."
              : "Every moment calls for a different bouquet. Here's the quick guide — from anniversaries to sympathy, birthdays to weddings — with the collection that fits each occasion."}
          </p>

          {/* Mother's Day callout — live page, not duplicated here */}
          <Link
            to="/bouquets/mothers-day"
            className="block mb-10 bg-primary/5 border border-primary/20 rounded-lg p-5 hover:border-primary transition-colors"
          >
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <p className="font-body text-[10px] tracking-widest uppercase text-primary mb-1">
                  {isEs ? "Colección activa" : "Live collection"}
                </p>
                <p className="font-title-retro text-xl text-foreground">
                  {isEs ? "Día de la Madre" : "Mother's Day"}
                </p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  {isEs
                    ? "La colección dedicada del Día de la Madre con productos en stock."
                    : "The dedicated Mother's Day collection with in-stock products."}
                </p>
              </div>
            </div>
          </Link>

          {/* Tiered occasion lists */}
          {tiers.map(({ tier, title: tierTitle }) => {
            const list = occasionPages.filter((o) => o.tier === tier);
            return (
              <section key={tier} className="mb-12">
                <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-4">{tierTitle}</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map((o) => (
                    <li key={o.slug}>
                      <Link
                        to={isEs ? `/collections/${o.slugEs}` : `/collections/${o.slug}`}
                        className="block bg-cream/50 hover:bg-cream rounded-md px-4 py-3 transition-colors"
                      >
                        <p className="font-body text-sm text-foreground hover:text-primary transition-colors">
                          {isEs ? o.h1.es : o.h1.en}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OccasionsIndexPage;
