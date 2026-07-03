import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Link } from "@/i18n/LocalizedRouter";
import { Mail, Heart, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import TableOfContents, { type TocItem } from "@/components/TableOfContents";
import JsonLd, { breadcrumbSchema, itemListSchema } from "@/components/JsonLd";
import { findOccasionBySlug } from "@/lib/occasionPagesData";
import { findFlowerTypeBySlug } from "@/lib/flowerTypePagesData";
import { useCollectionProducts, productLinkForHandle } from "@/lib/shopifyCollection";
import { BOUQUET_SLUGS } from "@/lib/bouquetSlugs";
import BouquetCardImage from "@/components/BouquetCardImage";
import { useTranslation } from "@/i18n/LanguageContext";
import NotFound from "@/pages/NotFound";

/**
 * Renders one occasion collection page (e.g. /collections/valentines-flowers,
 * /es/collections/flores-san-valentin). Indexable EN+ES with hreflang.
 *
 * Until the occasion has its own products in the catalog, the page funnels
 * users via a curated internal-link cluster ordered smaller-volume to bigger
 * (custom builder → Red Roses → White Roses → all bouquets → Love Bomb →
 * Overly Romantic → Deluxe Love Package), plus an email capture cul-de-sac
 * for "notify me when available".
 */
const OccasionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useTranslation();
  // Unified collection router: an /collections/<slug> URL can resolve to either
  // an occasion (Valentine's, Birthdays…) or a flower-type (Tulips, Peonies…).
  // Both datasets share the same OccasionPage shape so rendering is identical.
  const occ = slug
    ? findOccasionBySlug(slug) ?? findFlowerTypeBySlug(slug)
    : undefined;
  const isFlowerType = !!(slug && !findOccasionBySlug(slug) && findFlowerTypeBySlug(slug));
  // Shopify collection handle defaults to the EN slug (we created the collections
  // in Shopify with the same handle as our slug). Override via `shopifyHandle`.
  const handle = occ?.shopifyHandle ?? occ?.slug;
  const { products: liveProducts, loading: productsLoading } = useCollectionProducts(handle);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!occ) return <NotFound />;

  const isEs = language === "es";
  const path = `/collections/${occ.slug}`;
  const pathEs = `/collections/${occ.slugEs}`;
  const enUrl = `https://charlsflowers.com${path}`;
  const esUrl = `https://charlsflowers.com/es${pathEs}`;
  const selfUrl = isEs ? esUrl : enUrl;

  const h1 = isEs ? occ.h1.es : occ.h1.en;
  const title = isEs ? occ.title.es : occ.title.en;
  const description = isEs ? occ.description.es : occ.description.en;
  const intro = isEs ? occ.intro.es : occ.intro.en;

  // Parent index (Occasions vs Flowers) — used by breadcrumb + back link.
  const parentIndex = isFlowerType
    ? {
        path: isEs ? "/collections/flores" : "/collections/flowers",
        url: isEs
          ? "https://charlsflowers.com/es/collections/flores"
          : "https://charlsflowers.com/collections/flowers",
        label: isEs ? "Tipos de Flor" : "Flowers",
      }
    : {
        path: isEs ? "/collections/ocasiones" : "/collections/occasions",
        url: isEs
          ? "https://charlsflowers.com/es/collections/ocasiones"
          : "https://charlsflowers.com/collections/occasions",
        label: isEs ? "Ocasiones" : "Occasions",
      };

  // Internal link cluster: smaller-volume → bigger. Builder + the two big rose
  // colors first; then the all-bouquets hub; then the high-AOV packages.
  const cluster: Array<{ to: string; label: string; tag: string }> = [
    { to: "/bouquets/personalizar", label: isEs ? "Builder a medida (con IA)" : "Custom bouquet builder (AI preview)", tag: isEs ? "A medida" : "Custom" },
    { to: isEs ? "/bouquets/rosas-rojas" : "/bouquets/red-roses", label: isEs ? "Rosas Rojas" : "Red Roses", tag: isEs ? "Color" : "Color" },
    { to: isEs ? "/bouquets/rosas-blancas" : "/bouquets/white-roses", label: isEs ? "Rosas Blancas" : "White Roses", tag: isEs ? "Color" : "Color" },
    { to: "/bouquets", label: isEs ? "Todos los Bouquets" : "All Bouquets", tag: isEs ? "Catálogo" : "Catalog" },
    { to: "/room-decors/love-bomb", label: "Love Bomb", tag: isEs ? "Paquete" : "Package" },
    { to: "/room-decors/overly-romantic", label: "Overly Romantic", tag: isEs ? "Paquete" : "Package" },
    { to: "/room-decors/deluxe-love-package", label: "Deluxe Love Package", tag: isEs ? "Paquete" : "Package" },
  ];

  // JSON-LD: CollectionPage + ItemList of the internal-link cluster + breadcrumbs
  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: h1,
    description,
    url: selfUrl,
    inLanguage: isEs ? "es-US" : "en-US",
    isPartOf: { "@type": "WebSite", name: "Charls Flowers", url: "https://charlsflowers.com" },
    about: isEs ? occ.keyword.es : occ.keyword.en,
  };

  const itemList = itemListSchema(
    cluster.map((c) => ({
      name: c.label,
      url: `https://charlsflowers.com${language === "es" && !c.to.startsWith("/es") ? `/es${c.to}` : c.to}`,
    })),
    isEs ? `Recomendaciones para ${occ.keyword.es}` : `Recommendations for ${occ.keyword.en}`,
  );

  const breadcrumbs = breadcrumbSchema([
    { name: isEs ? "Inicio" : "Home", url: isEs ? "https://charlsflowers.com/es" : "https://charlsflowers.com" },
    { name: parentIndex.label, url: parentIndex.url },
    { name: h1, url: selfUrl },
  ]);

  // Navigable in-page index (jump-links). Products first so a user who already
  // knows what they want can go straight to them without scrolling the info
  // blocks; then each body section; then the recommendations cluster.
  const toc: TocItem[] = [
    ...(liveProducts.length > 0
      ? [{ id: "available-now", label: isEs ? "Disponibles ahora" : "Available now" }]
      : []),
    ...occ.sections.map((s, i) => ({
      id: `section-${i}`,
      label: isEs ? s.h2.es : s.h2.en,
    })),
    {
      id: "recommendations",
      label:
        liveProducts.length > 0
          ? isEs ? "También te puede gustar" : "You may also like"
          : isEs ? "Lo que enviamos hoy" : "What we deliver today",
    },
  ];

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    // Lightweight cul-de-sac capture. Stored locally for now; pipe to a real
    // notify list when one exists. Intentionally non-breaking.
    try {
      const key = "charls-occasion-waitlist";
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      list.push({ email, occasion: occ.slug, lang: language, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(list));
    } catch {
      // ignore storage errors
    }
    setSent(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={title} description={description} path={path} pathEs={pathEs} />
      <JsonLd data={[collectionPage, itemList, breadcrumbs]} />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Breadcrumbs
            items={[
              { label: isEs ? "Inicio" : "Home", to: "/" },
              { label: parentIndex.label, to: parentIndex.path },
              { label: h1 },
            ]}
          />

          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">{h1}</h1>
          <p className="font-body text-base md:text-lg text-foreground leading-relaxed mb-8">{intro}</p>

          {/* Navigable index (jump-links) — skip the info blocks, go to products. */}
          <TableOfContents items={toc} heading={isEs ? "En esta página" : "On this page"} />

          {/* Live Shopify collection grid — renders only when the linked Shopify
              collection has products. Empty collection → keeps the existing
              SEO + cluster + "notify me" fallback below, unchanged. */}
          {liveProducts.length > 0 && (
            <section id="available-now" className="scroll-mt-28 mb-14">
              <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-5">
                {isEs ? "Disponibles ahora" : "Available now"}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {liveProducts.map((p) => {
                  const to = productLinkForHandle(p.handle, BOUQUET_SLUGS, isEs ? "es" : "en");
                  return (
                    <Link key={p.id} to={to} className="group block" noLocalize>
                      <div className="relative overflow-hidden rounded-lg mb-3 aspect-square bg-muted">
                        <BouquetCardImage
                          handle={p.handle}
                          name={p.title}
                          fallback={p.primaryImage}
                          fallback2={p.secondaryImage}
                        />
                        <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
                      </div>
                      <h3 className="font-display text-base font-semibold text-foreground text-center">{p.title}</h3>
                      <p className="text-primary font-body text-xs font-semibold text-center mt-1">
                        {isEs ? "Desde" : "From"} ${p.minPrice.toFixed(2)}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Body sections — H2 + body for each */}
          <div className="space-y-10 mb-14">
            {occ.sections.map((s, i) => (
              <section key={i} id={`section-${i}`} className="scroll-mt-28">
                <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-3">
                  {isEs ? s.h2.es : s.h2.en}
                </h2>
                <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                  {isEs ? s.body.es : s.body.en}
                </p>
              </section>
            ))}
          </div>

          {/* Internal-link cluster: smaller-volume → bigger */}
          <section id="recommendations" className="scroll-mt-28 bg-cream rounded-lg p-6 md:p-8 mb-12">
            <h2 className="font-title-retro text-2xl md:text-3xl text-primary mb-2">
              {liveProducts.length > 0
                ? (isEs ? "También te puede gustar" : "You may also like")
                : (isEs ? "Mientras tanto, esto sí lo enviamos hoy" : "In the meantime, here's what we deliver today")}
            </h2>
            <p className="font-body text-sm md:text-base text-muted-foreground mb-6">
              {isEs
                ? `Las colecciones que más se piden para ${occ.keyword.es}. Todas con entrega el mismo día en Miami.`
                : `The collections most ordered for ${occ.keyword.en}. All with same-day Miami delivery.`}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cluster.map((c) => (
                <li key={c.to}>
                  <Link
                    to={c.to}
                    className="group flex items-center justify-between gap-3 bg-white border border-border rounded-md px-4 py-3 hover:border-primary transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-body text-[10px] tracking-widest uppercase text-muted-foreground bg-cream px-2 py-1 rounded">
                        {c.tag}
                      </span>
                      <span className="font-body text-sm text-foreground group-hover:text-primary transition-colors">
                        {c.label}
                      </span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Cul-de-sac: email capture for "notify me when this collection launches".
              Hidden once the collection actually has products live on Shopify. */}
          {liveProducts.length === 0 && !productsLoading && (
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8 text-center">
            <Heart className="w-6 h-6 text-primary mx-auto mb-3" />
            <h2 className="font-title-retro text-2xl md:text-3xl text-primary mb-3">
              {isEs ? `Avísame cuando lancen ${occ.keyword.es}` : `Notify me when ${occ.keyword.en} launches`}
            </h2>
            <p className="font-body text-sm md:text-base text-muted-foreground mb-5 max-w-lg mx-auto">
              {isEs
                ? "Cuando tengamos la colección dedicada, te avisamos primero y con acceso anticipado."
                : "When the dedicated collection drops, you'll get first access before anyone else."}
            </p>
            {sent ? (
              <p className="font-body text-sm text-primary inline-flex items-center gap-2 justify-center">
                <Sparkles className="w-4 h-4" />
                {isEs ? "Listo — te avisaremos." : "Got it — we'll let you know."}
              </p>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isEs ? "tu@email.com" : "you@email.com"}
                    className="w-full bg-white border border-border rounded-md pl-10 pr-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-body text-sm hover:bg-primary/90 transition-colors"
                >
                  {isEs ? "Avisarme" : "Notify me"}
                </button>
              </form>
            )}
          </section>
          )}

          {/* Back to occasions index */}
          <div className="mt-10 text-center">
            <Link
              to={parentIndex.path}
              noLocalize
              className="font-body text-sm text-primary hover:underline"
            >
              {isEs
                ? (isFlowerType ? "← Ver todos los tipos de flor" : "← Ver todas las ocasiones")
                : (isFlowerType ? "← See all flower types" : "← See all occasions")}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OccasionPage;
