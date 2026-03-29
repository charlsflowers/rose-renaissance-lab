import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";
import CollectionFAQ, { useBouquetFAQs } from "@/components/CollectionFAQ";
import { bouquetProducts, bouquetSizeOptions } from "@/lib/catalogData";
import { getPrice } from "@/lib/productData";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

type FilterType = "all" | "un-color" | "mezclas" | "zodiac";

const isZodiac = (id: string) => id.startsWith('bq-zodiac-');

const BouquetProducts = () => {
  const { t } = useTranslation();
  const translatedBouquetFAQs = useBouquetFAQs();
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get("filter") as FilterType) || "all";
  const [filter, setFilter] = useState<FilterType>(initialFilter);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const urlFilter = (searchParams.get("filter") as FilterType) || "all";
    setFilter(urlFilter);
  }, [searchParams]);

  const filteredProducts = bouquetProducts.filter((product) => {
    if (filter === "zodiac") return isZodiac(product.id);
    if (filter === "all") return true;
    if (isZodiac(product.id)) return false;
    const isMix = product.color.includes(" y ") || product.color.includes(", ") || product.color.includes(" y");
    return filter === "mezclas" ? isMix : !isMix;
  });

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title="Fresh Bouquets Miami | Single Color & Mixed – Charls Flowers" description="Handcrafted bouquets in Miami. 50 to 200 roses, same-day delivery available. Order now." path="/bouquets" />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://www.charlsflowers.com" }, { name: "Bouquets", url: "https://www.charlsflowers.com/bouquets" }])} />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: t("nav.home"), to: "/" }, { label: t("nav.bouquets") }]} />

          <div className="text-center mb-8">
             <p className="font-subtitle-script text-primary text-lg md:text-2xl mb-2">{t("bouquetProducts.subtitle")}</p>
            <h1 className="font-title-retro text-4xl md:text-5xl text-foreground">{t("bouquetProducts.title")}</h1>
            <p className="text-muted-foreground font-body text-sm mt-3 max-w-2xl mx-auto">
              {t("bouquetProducts.description")}{' '}
              <Link to="/bouquets/all/pure-white" className="text-primary hover:underline">Pure White</Link>,{' '}
              <Link to="/bouquets/all/total-passion" className="text-primary hover:underline">Total Passion</Link>,{' '}
              <Link to="/bouquets/all/hot-pink-blush" className="text-primary hover:underline">Hot Pink Blush</Link>,{' '}
              <Link to="/bouquets/all/blue-sky" className="text-primary hover:underline">Blue Sky</Link>.
            </p>
            <p className="text-primary font-body text-xs font-semibold mt-2">{t("common.orderBefore3PM")}</p>
          </div>

          <div className="flex justify-center gap-3 mb-12">
            {([
              { key: "all", label: t("bouquetProducts.seeAll"), locked: false },
              { key: "un-color", label: t("bouquetProducts.singleColor"), locked: false },
              { key: "mezclas", label: t("bouquetProducts.mixes"), locked: false },
              { key: "zodiac", label: t("bouquetProducts.zodiacSigns"), locked: false },
            ] as { key: FilterType; label: string; locked: boolean }[]).map(({ key, label, locked }) => (
              <button
                key={key}
                onClick={() => !locked && setFilter(key)}
                disabled={locked}
                className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full font-body text-xs md:text-sm transition-all inline-flex items-center gap-1 md:gap-1.5 ${
                  locked
                    ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
                    : filter === key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
            {filteredProducts.map((product) => (
              <div key={product.id}>
                <Link to={`/bouquets/all/${product.shopifyHandle}`} className="group block">
                  <div className="relative overflow-hidden rounded-sm mb-4 aspect-square bg-muted">
                    {product.image ? (
                      <>
                        <img 
                          src={product.image} 
                          alt={`${product.name} Miami – Charls Flowers`} 
                          loading="lazy"
                          width={400}
                          height={400}
                          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${product.image2 ? 'md:group-hover:opacity-0' : ''}`} 
                        />
                        {product.image2 && (
                          <img 
                            src={product.image2} 
                            alt={`${product.name} Miami alternate view – Charls Flowers`} 
                            loading="lazy"
                            width={400}
                            height={400}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 md:group-hover:opacity-100 transition-all duration-700 md:group-hover:scale-105 hidden md:block" 
                          />
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-4xl text-muted-foreground/30">🌹</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground text-center">{product.name}</h3>
                  
                  <p className="text-primary font-body text-sm font-semibold text-center mt-2">{t("product.from")} ${product.customSizes ? product.customSizes[0].price : getPrice(product.pricingTier, (product.pricingTier === 'mix3red' || (product.color.includes(',') && product.pricingTier === 'standard')) ? 75 : 50)}</p>
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

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-title-retro text-3xl md:text-4xl text-primary-foreground mb-4">{t("bouquetProducts.cantFind")}</h2>
          <p className="text-primary-foreground/80 font-body mb-8 max-w-md mx-auto">{t("bouquetProducts.cantFindDesc")}</p>
          <Link to="/bouquets/personalizar"
            className="inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-background/90 transition-colors rounded-sm">
            {t("bouquetProducts.customizeNow")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BouquetProducts;
