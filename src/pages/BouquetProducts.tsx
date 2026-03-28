import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";
import { bouquetProducts, bouquetSizeOptions } from "@/lib/catalogData";
import { getPrice } from "@/lib/productData";
import { ArrowLeft, ArrowRight, Sparkles, Lock } from "lucide-react";

type FilterType = "all" | "un-color" | "mezclas" | "zodiac";

const isZodiac = (id: string) => id.startsWith('bq-zodiac-');

const BouquetProducts = () => {
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filteredProducts = bouquetProducts.filter((product) => {
    if (filter === "zodiac") return isZodiac(product.id);
    if (filter === "all") return true;
    // Exclude zodiac from Single Color and Mixes
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
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Bouquets" }]} />

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
             <p className="font-subtitle-script text-gold text-lg md:text-2xl mb-2">Handcrafted bouquets</p>
            </div>
            <h1 className="font-title-retro text-4xl md:text-5xl text-foreground">Bouquets</h1>
          </div>

          <div className="flex justify-center gap-3 mb-12">
            {([
              { key: "all", label: "See All", locked: false },
              { key: "un-color", label: "Single color", locked: false },
              { key: "mezclas", label: "Mixes", locked: false },
              { key: "zodiac", label: "Zodiac Signs", locked: false },
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
                <Link to={`/bouquets/all/${product.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-sm mb-4 aspect-square bg-muted">
                    {product.image ? (
                      <>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${product.image2 ? 'md:group-hover:opacity-0' : ''}`} 
                        />
                        {product.image2 && (
                          <img 
                            src={product.image2} 
                            alt={`${product.name} - alternate view`} 
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
                  
                  <p className="text-primary font-body text-sm font-semibold text-center mt-2">From ${product.customSizes ? product.customSizes[0].price : getPrice(product.pricingTier, (product.pricingTier === 'mix3red' || (product.color.includes(',') && product.pricingTier === 'standard')) ? 75 : 50)}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-title-retro text-3xl md:text-4xl text-primary-foreground mb-4">Can't find what you're looking for?</h2>
          <p className="text-primary-foreground/80 font-body mb-8 max-w-md mx-auto">Customize every detail: color, size, accessories, and more. From $76 USD.</p>
          <Link to="/bouquets/personalizar"
            className="inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-background/90 transition-colors rounded-sm">
            Customize now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground">
        <div className="container mx-auto px-6 text-center">
          <Flower2 className="w-6 h-6 text-primary mx-auto mb-3 fill-primary" />
          <p className="font-display text-lg text-primary-foreground mb-2">Charl's Flowers</p>
          <p className="text-primary-foreground/50 font-body text-xs tracking-widest uppercase">Handmade bouquets with fresh flowers</p>
        </div>
      </footer>
    </div>
  );
};

export default BouquetProducts;
