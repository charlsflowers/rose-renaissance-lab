import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Link } from "@/i18n/LocalizedRouter";
import { Mail, Heart, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, itemListSchema } from "@/components/JsonLd";
import { findOccasionBySlug } from "@/lib/occasionPagesData";
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
  const occ = slug ? findOccasionBySlug(slug) : undefined;
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!occ) return <NotFound />;

  const isEs = language === "es";
  const path = `/collections/${occ.slug}`;
  const pathEs = `/collections/${occ.slugEs}`;
  const enUrl = `https://www.charlsflowers.com${path}`;
  const esUrl = `https://www.charlsflowers.com/es${pathEs}`;
  const selfUrl = isEs ? esUrl : enUrl;

  const h1 = isEs ? occ.h1.es : occ.h1.en;
  const title = isEs ? occ.title.es : occ.title.en;
  const description = isEs ? occ.description.es : occ.description.en;
  const intro = isEs ? occ.intro.es : occ.intro.en;

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
    isPartOf: { "@type": "WebSite", name: "Charls Flowers", url: "https://www.charlsflowers.com" },
    about: isEs ? occ.keyword.es : occ.keyword.en,
  };

  const itemList = itemListSchema(
    cluster.map((c) => ({
      name: c.label,
      url: `https://www.charlsflowers.com${language === "es" && !c.to.startsWith("/es") ? `/es${c.to}` : c.to}`,
    })),
    isEs ? `Recomendaciones para ${occ.keyword.es}` : `Recommendations for ${occ.keyword.en}`,
  );

  const breadcrumbs = breadcrumbSchema([
    { name: isEs ? "Inicio" : "Home", url: isEs ? "https://www.charlsflowers.com/es" : "https://www.charlsflowers.com" },
    {
      name: isEs ? "Ocasiones" : "Occasions",
      url: isEs ? "https://www.charlsflowers.com/es/collections/ocasiones" : "https://www.charlsflowers.com/collections/occasions",
    },
    { name: h1, url: selfUrl },
  ]);

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
              { label: isEs ? "Ocasiones" : "Occasions", to: isEs ? "/collections/ocasiones" : "/collections/occasions" },
              { label: h1 },
            ]}
          />

          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">{h1}</h1>
          <p className="font-body text-base md:text-lg text-foreground leading-relaxed mb-8">{intro}</p>

          {/* Body sections — H2 + body for each */}
          <div className="space-y-10 mb-14">
            {occ.sections.map((s, i) => (
              <section key={i}>
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
          <section className="bg-cream rounded-lg p-6 md:p-8 mb-12">
            <h2 className="font-title-retro text-2xl md:text-3xl text-primary mb-2">
              {isEs ? "Mientras tanto, esto sí lo enviamos hoy" : "In the meantime, here's what we deliver today"}
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

          {/* Cul-de-sac: email capture for "notify me when this collection launches" */}
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

          {/* Back to occasions index */}
          <div className="mt-10 text-center">
            <Link
              to={isEs ? "/collections/ocasiones" : "/collections/occasions"}
              className="font-body text-sm text-primary hover:underline"
            >
              {isEs ? "← Ver todas las ocasiones" : "← See all occasions"}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OccasionPage;
