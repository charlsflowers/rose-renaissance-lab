import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "@/i18n/LocalizedRouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, itemListSchema } from "@/components/JsonLd";
import CollectionFAQ, { useBouquetFAQs } from "@/components/CollectionFAQ";
import { bouquetProducts, bouquetSizeOptions } from "@/lib/catalogData";
import { slugForHandle } from "@/lib/bouquetSlugs";
import { getPrice } from "@/lib/productData";
import ShopifyPrice from "@/components/ShopifyPrice";
import BouquetCardImage from "@/components/BouquetCardImage";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";
import WaveDivider from "@/components/WaveDivider";
import { isMothersDayPromoActive } from "@/lib/mothersDayPromo";
import {
  COLOR_COLLECTIONS,
  collectionFromSegment,
  isBicolorProduct,
  productsForColor,
  type RoseColor,
} from "@/lib/colorCollections";
import { LongTailIntro, LongTailBody } from "@/components/LongTailSeoBlock";
import DynamicClusters from "@/components/DynamicClusters";

type FilterType = "all" | "un-color" | "mezclas" | "zodiac" | "bicolor";

const COLLECTION_PATHS: Record<FilterType, string> = {
  all: "/bouquets",
  "un-color": "/bouquets/single-color",
  mezclas: "/bouquets/mixed-color",
  zodiac: "/bouquets/zodiac",
  bicolor: "/bouquets/bicolor",
};

const isZodiac = (id: string) => id.startsWith('bq-zodiac-');

// Manual display orders by profitability, requested by store owner.
// Handles not listed appear after, in catalog order.
const ORDER_ALL: string[] = [
  'aries-bouquet', 'pisces-bouquet', 'cancer-bouquet', 'taurus-bouquet',
  'blue-sky', 'deep-night', 'green-fresh',
  'aquarius-bouquet', 'capricorn-bouquet', 'sagittarius-bouquet',
  'total-passion',
  'night-day', 'white-ocean', 'dark-pink-elegance',
  'dark-romance', 'bicolor-passion', 'passionate-love', 'elegant-passion', 'classic-tricolor', 'iberian-passion',
  'elegant-contrast', 'imperial-bee',
  'pink-symphony', 'fire-sun', 'tricolor-love', 'intense-romance',
  'scorpio-bouquet', 'libra-bouquet', 'virgo-bouquet', 'leo-bouquet', 'gemini-bouquet',
  'pure-white', 'hot-pink-blush', 'soft-pink', 'purple-charm', 'orange-sunset', 'radiant-sun',
  'red-sweetness', 'orange-citrus', 'infinite-tenderness', 'light-citrus', 'spring-garden',
  'pink-white-dawn', 'warm-sunset', 'magic-pastel', 'soft-spring', 'citrus-refresh',
];

const ORDER_ZODIAC: string[] = [
  'aries-bouquet', 'pisces-bouquet', 'cancer-bouquet', 'taurus-bouquet',
  'aquarius-bouquet', 'capricorn-bouquet', 'sagittarius-bouquet',
  'scorpio-bouquet', 'libra-bouquet', 'virgo-bouquet', 'leo-bouquet', 'gemini-bouquet',
];

const ORDER_SINGLE: string[] = [
  'blue-sky', 'deep-night', 'green-fresh', 'total-passion', 'iberian-passion',
  'pure-white', 'hot-pink-blush', 'soft-pink', 'purple-charm', 'orange-sunset',
  'radiant-sun', 'red-sweetness', 'orange-citrus', 'infinite-tenderness',
  'light-citrus', 'spring-garden',
];

const ORDER_MIXED: string[] = [
  'night-day', 'white-ocean', 'dark-pink-elegance', 'dark-romance',
  'bicolor-passion', 'passionate-love', 'elegant-passion', 'classic-tricolor',
  'elegant-contrast', 'imperial-bee', 'pink-symphony', 'fire-sun',
  'tricolor-love', 'intense-romance', 'pink-white-dawn', 'warm-sunset',
  'magic-pastel', 'soft-spring', 'citrus-refresh',
];

const sortByOrder = <T extends { shopifyHandle: string }>(items: T[], order: string[]): T[] => {
  const idx = (h: string) => {
    const i = order.indexOf(h);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...items].sort((a, b) => idx(a.shopifyHandle) - idx(b.shopifyHandle));
};

// SEO metadata per subcategory: translation namespace + clean canonical path.
// `all` keeps the original /bouquets SEO/H1 and uses the page's own title/subtitle.
const SEO_BY_FILTER: Record<Exclude<FilterType, "all">, { ns: string; path: string }> = {
  "un-color": { ns: "seo.bouquetsSingleColor", path: "/bouquets/single-color" },
  "mezclas":  { ns: "seo.bouquetsMixed",       path: "/bouquets/mixed-color" },
  "zodiac":   { ns: "seo.bouquetsZodiac",      path: "/bouquets/zodiac" },
  // Bicolor reuses the Mixed copy/SEO (it's a subset of mixes) — kept simple,
  // no new translations needed and it stays canonical-friendly.
  "bicolor":  { ns: "seo.bouquetsMixed",       path: "/bouquets/bicolor" },
};

interface BouquetProductsProps {
  /** When mounted from a clean subcategory route, the filter is fixed via this prop. */
  initialFilter?: FilterType;
  /**
   * When mounted from an indexable color collection route (/bouquets/red-roses,
   * /es/bouquets/rosas-rojas, …) this fixes the page to that single rose color.
   * SEO/navigation only — it just filters which products are shown + the H1/meta.
   */
  colorCollection?: RoseColor;
}

const BouquetProducts = ({ initialFilter: propFilter, colorCollection }: BouquetProductsProps = {}) => {
  const { t, language } = useTranslation();
  const translatedBouquetFAQs = useBouquetFAQs();
  const [searchParams] = useSearchParams();
  const storedFilter = (typeof window !== "undefined"
    ? (sessionStorage.getItem("bouquetsFilter") as FilterType | null)
    : null);
  // Priority: clean-route prop > ?filter= query > session > "all".
  const initialFilter =
    propFilter || (searchParams.get("filter") as FilterType) || storedFilter || "all";
  const [filter, setFilter] = useState<FilterType>(initialFilter);
  const promoActive = isMothersDayPromoActive();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Keep state in sync when the route prop changes (e.g. navigating between clean subcategory URLs).
  useEffect(() => {
    if (propFilter) setFilter(propFilter);
  }, [propFilter]);

  useEffect(() => {
    if (propFilter) return; // clean-route filter takes precedence over query
    const urlFilter = searchParams.get("filter") as FilterType | null;
    if (urlFilter) setFilter(urlFilter);
  }, [searchParams, propFilter]);

  useEffect(() => {
    try { sessionStorage.setItem("bouquetsFilter", filter); } catch {}
  }, [filter]);

  // Resolve the active color collection (if any) from the prop.
  const colorColl = colorCollection
    ? collectionFromSegment(colorCollection)
    : undefined;

  // Long-tail SEO key for this view. Color collections take precedence; then
  // the explicit subcategory; bicolor stays without a dedicated block.
  const longTailKey: string | undefined = colorColl
    ? `color:${colorColl.color}`
    : filter === "all"
    ? "bouquets"
    : filter === "un-color"
    ? "single-color"
    : filter === "mezclas"
    ? "mixed-color"
    : filter === "zodiac"
    ? "zodiac"
    : filter === "bicolor"
    ? "bicolor"
    : undefined;

  // Build the language-correct path to a color collection. ES uses the NATIVE
  // slug (not a simple /es prefix), so we resolve it explicitly per language.
  const colorLinkTo = (color: RoseColor): string => {
    const c = COLOR_COLLECTIONS.find((x) => x.color === color);
    if (!c) return "/bouquets";
    return language === "es" ? `/es/bouquets/${c.slugEs}` : `/bouquets/${c.slug}`;
  };

  const orderForFilter =
    filter === "zodiac" ? ORDER_ZODIAC :
    filter === "un-color" ? ORDER_SINGLE :
    filter === "mezclas" ? ORDER_MIXED :
    ORDER_ALL;

  const filteredProducts = colorColl
    ? sortByOrder(productsForColor(bouquetProducts, colorColl), ORDER_ALL)
    : sortByOrder(
        bouquetProducts.filter((product) => {
          if (filter === "zodiac") return isZodiac(product.id);
          if (filter === "all") return true;
          if (isZodiac(product.id)) return false;
          if (filter === "bicolor") return isBicolorProduct(product);
          const isMix = product.color.includes(" y ") || product.color.includes(", ") || product.color.includes(" y");
          return filter === "mezclas" ? isMix : !isMix;
        }),
        orderForFilter
      );

  // Per-subcategory SEO. When filter === "all", keep the original /bouquets metadata + H1.
  // Color collections take precedence and use their own ns + native ES slug.
  const subSeo = filter !== "all" ? SEO_BY_FILTER[filter] : null;
  const seoTitle = colorColl
    ? t(`${colorColl.ns}.title`)
    : subSeo ? t(`${subSeo.ns}.title`) : t("seo.bouquets.title");
  const seoDescription = colorColl
    ? t(`${colorColl.ns}.description`)
    : subSeo ? t(`${subSeo.ns}.description`) : t("seo.bouquets.description");
  const seoPath = colorColl
    ? `/bouquets/${colorColl.slug}`
    : subSeo ? subSeo.path : "/bouquets";
  // Native ES slug for the canonical/hreflang (only color collections differ EN↔ES).
  const seoPathEs = colorColl ? `/bouquets/${colorColl.slugEs}` : undefined;
  const heading = colorColl
    ? t(`${colorColl.ns}.h1`)
    : subSeo ? t(`${subSeo.ns}.h1`) : t("bouquetProducts.title");

  // Breadcrumb (visible + JSON-LD): add the subcategory level when filtered.
  const subBreadcrumbLabel = colorColl || subSeo ? heading : null;
  const crumbItems = subBreadcrumbLabel
    ? [{ label: t("nav.home"), to: "/" }, { label: t("nav.bouquets"), to: "/bouquets" }, { label: subBreadcrumbLabel }]
    : [{ label: t("nav.home"), to: "/" }, { label: t("nav.bouquets") }];
  const schemaCrumbs = subBreadcrumbLabel
    ? [
        { name: "Home", url: "https://charlsflowers.com" },
        { name: "Bouquets", url: "https://charlsflowers.com/bouquets" },
        { name: subBreadcrumbLabel, url: `https://charlsflowers.com${seoPath}` },
      ]
    : [
        { name: "Home", url: "https://charlsflowers.com" },
        { name: "Bouquets", url: "https://charlsflowers.com/bouquets" },
      ];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={seoTitle} description={seoDescription} path={seoPath} pathEs={seoPathEs} />
      <JsonLd data={[
        breadcrumbSchema(schemaCrumbs),
        itemListSchema(
          filteredProducts.map(p => ({
            name: p.name,
            url: `https://charlsflowers.com/bouquets/${slugForHandle(p.shopifyHandle)}`,
            image: p.image || undefined,
            // Real catalog price (same fallback the visible price uses) so each
            // Product in the ItemList carries a valid Offer for Google.
            price: p.customSizes ? p.customSizes[0].price : getPrice(p.pricingTier, (p.pricingTier === 'mix3red' || (p.color.includes(',') && p.pricingTier === 'standard')) ? 75 : 50),
          })),
          heading,
        ),
      ]} />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={crumbItems} />

          <div className="text-center mb-8">
             <p className="font-subtitle-script text-primary text-lg md:text-2xl mb-2">{t("bouquetProducts.subtitle")}</p>
            <h1 className="font-title-retro text-4xl md:text-5xl text-foreground">{heading}</h1>
            {/* Mirror-effect long-tail intro under the existing H1. */}
            <LongTailIntro seoKey={longTailKey} />
            <p className="text-muted-foreground font-body text-sm mt-3 max-w-2xl mx-auto">
              {t("bouquetProducts.description")}{' '}
              {/* Internal links → indexable color collections (anchor = color keyword). */}
              <Link to={colorLinkTo("white")} className="text-primary hover:underline">{t("nav.whiteRoses").toLowerCase()}</Link>,{' '}
              <Link to={colorLinkTo("red")} className="text-primary hover:underline">{t("nav.redRoses").toLowerCase()}</Link>,{' '}
              <Link to={colorLinkTo("pink")} className="text-primary hover:underline">{t("nav.pinkRoses").toLowerCase()}</Link>,{' '}
              <Link to={colorLinkTo("blue")} className="text-primary hover:underline">{t("nav.blueRoses").toLowerCase()}</Link>.
            </p>
            <p className="text-primary font-body text-xs font-semibold mt-2">{t("common.orderBefore3PM")}</p>
          </div>

          {/* Collections block */}
          <div className="text-center mb-8">
            <h2 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">
              {t("bouquetProducts.collectionsTitle")}
            </h2>
            <div className="flex justify-center gap-3">
              {([
                { key: "all", label: t("bouquetProducts.seeAll") },
                { key: "un-color", label: t("bouquetProducts.singleColor") },
                { key: "mezclas", label: t("bouquetProducts.mixes") },
                { key: "zodiac", label: t("bouquetProducts.zodiacSigns") },
              ] as { key: FilterType; label: string }[]).map(({ key, label }) => (
                <Link
                  key={key}
                  to={COLLECTION_PATHS[key]}
                  className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full font-body text-xs md:text-sm transition-all inline-flex items-center gap-1 md:gap-1.5 ${
                    !colorColl && filter === key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Colors block */}
          <div className="text-center mb-12">
            <h2 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">
              {t("bouquetProducts.colorsTitle")}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {COLOR_COLLECTIONS.map((c) => (
                <Link
                  key={c.color}
                  to={colorLinkTo(c.color)}
                  className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full font-body text-xs md:text-sm transition-all ${
                    colorColl?.color === c.color
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {t(`nav.${c.color}Roses`)}
                </Link>
              ))}
              {/* Bicolor sits next to the colors as its own quick filter. */}
              <Link
                to="/bouquets/bicolor"
                className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full font-body text-xs md:text-sm transition-all ${
                  !colorColl && filter === "bicolor"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {t("nav.bicolorBouquets")}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
            {filteredProducts.map((product) => (
              <div key={product.id}>
                <Link to={`/bouquets/${slugForHandle(product.shopifyHandle)}`} className="group block">
                  <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-muted">
                    <BouquetCardImage
                      handle={product.shopifyHandle}
                      name={product.name}
                      fallback={product.image}
                      fallback2={product.image2}
                    />
                    <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
                    {promoActive && (
                      <div className="absolute -top-1 -right-1 z-10">
                        <div className="bg-primary text-primary-foreground px-2 md:px-3 py-1 rounded-bl-lg rounded-tr-sm font-body text-[8px] md:text-[10px] tracking-wider uppercase font-bold shadow-lg">
                          Available May 13
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground text-center">{product.name}</h3>
                  
                  <p className="text-primary font-body text-sm font-semibold text-center mt-2">
                    {t("product.from")}{" "}
                    <ShopifyPrice
                      handle={product.shopifyHandle}
                      fallbackPrice={product.customSizes ? product.customSizes[0].price : getPrice(product.pricingTier, (product.pricingTier === 'mix3red' || (product.color.includes(',') && product.pricingTier === 'standard')) ? 75 : 50)}
                    />
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collection FAQ */}
      <div className="container mx-auto px-6">
        <CollectionFAQ faqs={translatedBouquetFAQs} />
      </div>

      {/* Long-tail body block — H2/H3 + copy + internal-link cluster. */}
      <LongTailBody seoKey={longTailKey} />

      {/* Dynamic cross-clusters — in-body, auto-updating internal links. Refreshes
          on every collection/color page whenever a product is published/re-tagged. */}
      <DynamicClusters />

      {/* CTA */}
      <WaveDivider position="top" color="hsl(var(--primary))" />
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-title-retro text-3xl md:text-4xl text-primary-foreground mb-4">{t("bouquetProducts.cantFind")}</h2>
          <p className="text-primary-foreground/80 font-body mb-8 max-w-md mx-auto">{t("bouquetProducts.cantFindDesc")}</p>
          <Link to="/bouquets/personalizar"
            className="inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-background/90 transition-colors rounded-lg">
            {t("bouquetProducts.customizeNow")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BouquetProducts;
