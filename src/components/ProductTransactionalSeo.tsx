import { Link } from "@/i18n/LocalizedRouter";
import { useTranslation } from "@/i18n/LanguageContext";
import type { BouquetProduct } from "@/lib/catalogData";
import { dominantColorForProduct } from "@/lib/colorCollections";
import { getProductTsr, type TsrContent } from "@/lib/productTransactionalSeo";

/**
 * Transactional SEO block for a PRODUCT page (TSR layer).
 *
 * Renders one short H2 block keyed by the product's dominant color, capturing
 * the commercial "buy / price / same-day delivery / send" intent that the
 * collection-level long-tail layer doesn't cover. Placed at the END of the
 * product page (above the FAQ). Never an H1; no prices / cart / checkout /
 * tracking here.
 */

interface Props {
  product: BouquetProduct;
}

/** Split `closing` on {{n}} and inject the matching internal link (exact anchor). */
const renderClosing = (c: TsrContent) => {
  const parts = c.closing.split(/(\{\{\d+\}\})/g);
  return parts.map((part, i) => {
    const m = /^\{\{(\d+)\}\}$/.exec(part);
    if (!m) return <span key={i}>{part}</span>;
    const link = c.links[Number(m[1])];
    if (!link) return null;
    return (
      <Link key={i} to={link.to} className="text-primary hover:underline" noLocalize>
        {link.anchor}
      </Link>
    );
  });
};

const ProductTransactionalSeo = ({ product }: Props) => {
  const { language } = useTranslation();
  const color = dominantColorForProduct(product);
  const c = getProductTsr(color, language === "es" ? "es" : "en");
  if (!c) return null;
  return (
    <section className="container mx-auto px-6 max-w-3xl py-8 md:py-10">
      <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-3">{c.h2}</h2>
      <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
        {c.body}
      </p>
      <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
        {renderClosing(c)}
      </p>
    </section>
  );
};

export default ProductTransactionalSeo;
