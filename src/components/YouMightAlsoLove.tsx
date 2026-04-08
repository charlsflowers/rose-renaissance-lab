import { Link } from "react-router-dom";
import { bouquetProducts } from "@/lib/catalogData";
import { bouquetCrossLinks } from "@/lib/crossLinks";
import { getPrice } from "@/lib/productData";
import ShopifyPrice from "@/components/ShopifyPrice";
import { useTranslation } from "@/i18n/LanguageContext";

interface Props {
  currentProductId: string;
}

const YouMightAlsoLove = ({ currentProductId }: Props) => {
  const { t } = useTranslation();
  const relatedIds = bouquetCrossLinks[currentProductId];
  if (!relatedIds || relatedIds.length === 0) return null;

  const related = relatedIds
    .map(id => bouquetProducts.find(p => p.id === id))
    .filter(Boolean) as typeof bouquetProducts;

  if (related.length === 0) return null;

  return (
    <section className="py-12 border-t border-border">
      <h2 className="font-display text-xl font-semibold text-foreground text-center mb-8">{t("product.youMightAlsoLove")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {related.map(product => (
          <Link key={product.id} to={`/bouquets/all/${product.shopifyHandle}`} className="group block">
            <div className="relative overflow-hidden rounded-sm mb-3 aspect-square bg-muted">
              <img
                src={product.image}
                alt={`${product.name} Miami – Charls Flowers`}
                loading="lazy"
                width={400}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
            </div>
            <h3 className="font-display text-sm font-semibold text-foreground text-center">{product.name}</h3>
            <p className="text-primary font-body text-xs font-semibold text-center mt-1">
              {t("product.from")} ${product.customSizes ? product.customSizes[0].price : getPrice(product.pricingTier, (product.pricingTier === 'mix3red' || (product.color.includes(',') && product.pricingTier === 'standard')) ? 75 : 50)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default YouMightAlsoLove;
