import { Link } from "@/i18n/LocalizedRouter";
import { bouquetProducts } from "@/lib/catalogData";
import { slugForHandle } from "@/lib/bouquetSlugs";
import { getPrice } from "@/lib/productData";
import ShopifyPrice from "@/components/ShopifyPrice";
import BouquetCardImage from "@/components/BouquetCardImage";
import { useTranslation } from "@/i18n/LanguageContext";

interface Props {
  currentProductId: string;
}

/** Normalize a color string into individual color tokens (ES + EN) for matching. */
function tokenizeColors(raw: string): string[] {
  if (!raw) return [];
  const normalized = raw
    .toLowerCase()
    .replace(/\s+y\s+/g, ",")
    .replace(/\s+and\s+/g, ",")
    .replace(/&/g, ",");
  return normalized
    .split(/[,/]/)
    .map(t => t.trim())
    .filter(Boolean);
}

const YouMightAlsoLove = ({ currentProductId }: Props) => {
  const { t } = useTranslation();
  const currentProduct = bouquetProducts.find(p => p.id === currentProductId);
  if (!currentProduct) return null;

  const currentColors = tokenizeColors(currentProduct.color);
  if (currentColors.length === 0) return null;

  // Score every other product by number of shared color tokens, then prefer
  // products that share MORE colors with the current one.
  const scored = bouquetProducts
    .filter(p => p.id !== currentProductId)
    .map(p => {
      const tokens = tokenizeColors(p.color);
      const shared = tokens.filter(t => currentColors.includes(t)).length;
      return { product: p, shared };
    })
    .filter(x => x.shared > 0)
    .sort((a, b) => b.shared - a.shared);

  const related = scored.slice(0, 6).map(x => x.product);
  if (related.length === 0) return null;

  return (
    <section className="pt-10 pb-5 border-t border-border">
      <h2 className="font-display text-xl font-semibold text-foreground text-center mb-8">{t("product.youMightAlsoLove")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {related.map(product => (
          <Link key={product.id} to={`/bouquets/${slugForHandle(product.shopifyHandle)}`} className="group block">
            <div className="relative overflow-hidden rounded-lg mb-3 aspect-square bg-muted">
              <BouquetCardImage
                handle={product.shopifyHandle}
                name={product.name}
                fallback={product.image}
                fallback2={product.image2}
                enableHoverSwap={false}
              />
              <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
            </div>
            <h3 className="font-display text-sm font-semibold text-foreground text-center">{product.name}</h3>
            <p className="text-primary font-body text-xs font-semibold text-center mt-1">
              {t("product.from")}{" "}
              <ShopifyPrice
                handle={product.shopifyHandle}
                fallbackPrice={product.customSizes ? product.customSizes[0].price : getPrice(product.pricingTier, (product.pricingTier === 'mix3red' || (product.color.includes(',') && product.pricingTier === 'standard')) ? 75 : 50)}
              />
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default YouMightAlsoLove;
