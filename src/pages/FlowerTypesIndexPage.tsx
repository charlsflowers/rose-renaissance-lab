import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "@/i18n/LocalizedRouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, itemListSchema } from "@/components/JsonLd";
import { flowerTypePages } from "@/lib/flowerTypePagesData";
import { useTranslation } from "@/i18n/LanguageContext";
import NotFound from "@/pages/NotFound";

/**
 * Flower-type index — /collections/flowers (EN) and /es/collections/flores (ES).
 * Mirrors OccasionsIndexPage but lists the 16 flower-type collection pages.
 */
const FlowerTypesIndexPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useTranslation();
  const isEs = language === "es";

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (slug && slug !== "flowers" && slug !== "flores") return <NotFound />;

  const title = isEs
    ? "Flores por Tipo Miami | Ramos de Tulipanes, Peonías, Liliums y más | Charls Flowers"
    : "Flowers by Type Miami | Tulip, Peony, Lily Bouquets and more | Charls Flowers";
  const description = isEs
    ? "Ramos por tipo de flor en Miami: tulipanes, peonías, liliums, girasoles, orquídeas, hortensias, ramo buchón, rosas eternas y más. Entrega el mismo día."
    : "Bouquets by flower type in Miami: tulips, peonies, lilies, sunflowers, orchids, hydrangeas, ramo buchón, eternal roses and more. Same-day delivery.";

  const tiers = [
    { tier: 1 as const, title: isEs ? "Los más pedidos" : "Most popular" },
    { tier: 2 as const, title: isEs ? "Otros tipos de flor" : "Other flower types" },
    { tier: 3 as const, title: isEs ? "Especialidades" : "Specialty" },
  ];

  const itemList = itemListSchema(
    flowerTypePages.map((f) => ({
      name: isEs ? f.h1.es : f.h1.en,
      url: isEs
        ? `https://charlsflowers.com/es/collections/${f.slugEs}`
        : `https://charlsflowers.com/collections/${f.slug}`,
    })),
    isEs ? "Tipos de flor" : "Flower types",
  );

  const breadcrumbs = breadcrumbSchema([
    { name: isEs ? "Inicio" : "Home", url: isEs ? "https://charlsflowers.com/es" : "https://charlsflowers.com" },
    {
      name: isEs ? "Tipos de Flor" : "Flowers",
      url: isEs ? "https://charlsflowers.com/es/collections/flores" : "https://charlsflowers.com/collections/flowers",
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={title}
        description={description}
        path="/collections/flowers"
        pathEs="/collections/flores"
      />
      <JsonLd data={[itemList, breadcrumbs]} />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <Breadcrumbs
            items={[
              { label: isEs ? "Inicio" : "Home", to: "/" },
              { label: isEs ? "Tipos de Flor" : "Flowers" },
            ]}
          />
          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">
            {isEs ? "Flores por Tipo" : "Flowers by Type"}
          </h1>
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-3xl">
            {isEs
              ? "Cada flor habla un idioma distinto. Aquí están todas las que enviamos en Miami — desde tulipanes y peonías hasta el ramo buchón, las rosas eternas y la suscripción semanal."
              : "Every flower speaks a different language. Here's everything we deliver across Miami — from tulips and peonies to ramo buchón, eternal roses, and the weekly subscription."}
          </p>

          {tiers.map(({ tier, title: tierTitle }) => {
            const list = flowerTypePages.filter((f) => f.tier === tier);
            if (list.length === 0) return null;
            return (
              <section key={tier} className="mb-12">
                <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-4">{tierTitle}</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map((f) => (
                    <li key={f.slug}>
                      <Link
                        to={isEs ? `/collections/${f.slugEs}` : `/collections/${f.slug}`}
                        noLocalize
                        className="block bg-cream/50 hover:bg-cream rounded-md px-4 py-3 transition-colors"
                      >
                        <p className="font-body text-sm text-foreground hover:text-primary transition-colors">
                          {isEs ? f.h1.es : f.h1.en}
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

export default FlowerTypesIndexPage;