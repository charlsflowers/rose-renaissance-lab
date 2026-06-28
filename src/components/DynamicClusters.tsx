import { Link } from "@/i18n/LocalizedRouter";
import { useTranslation } from "@/i18n/LanguageContext";
import { newestBouquets, colorClusters } from "@/lib/dynamicClusters";

/**
 * Dynamic cross-cluster block — auto-updating internal links.
 *
 * Romuald — Armada SEO 2025:
 *  - Módulo 29 Web Rango A (Decalaveras) clase 13 "Clusters dinámicos" +
 *    clase 10 "Optimización SEO de clusters orbital": un solo producto nuevo
 *    refresca los bloques de "novedades" y "por color" en TODAS las páginas que
 *    los renderizan → freshness masivo y más crawl budget ("publicas 1 y se te
 *    actualizan 70 páginas").
 *  - Módulo 12 "Prepara tu web para monetizar" clase 01: en MÓVIL los enlaces de
 *    cluster van DENTRO del body (un sidebar se cae al fondo en móvil y nadie
 *    clica), para maximizar páginas-vistas-por-sesión.
 *
 * Los datos los DERIVA `dynamicClusters.ts` del catálogo en vivo; este componente
 * solo pinta. Nada de precios, carrito, checkout ni tracking aquí.
 */

interface Props {
  /** Product id to exclude from the "newest" block (used on product pages). */
  excludeId?: string;
  /** How many newest products to surface. */
  limit?: number;
}

const DynamicClusters = ({ excludeId, limit = 8 }: Props) => {
  const { t, language } = useTranslation();
  const newest = newestBouquets(limit, excludeId);
  const colors = colorClusters();
  if (newest.length === 0 && colors.length === 0) return null;

  const colorTo = (slug: string, slugEs: string) =>
    language === "es" ? `/es/bouquets/${slugEs}` : `/bouquets/${slug}`;

  return (
    // In-body cluster (NOT a sidebar) so it stays visible/clickable on mobile.
    <section className="container mx-auto px-6 max-w-5xl py-10 md:py-14 border-t border-border">
      {newest.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-4">
            {t("clusters.newest")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {newest.map((p) => (
              <Link
                key={p.id}
                to={p.to}
                className="px-3 md:px-4 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-accent font-body text-xs md:text-sm transition-all"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <h2 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-4">
            {t("clusters.byColor")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <Link
                key={c.color}
                to={colorTo(c.slug, c.slugEs)}
                noLocalize
                className="px-3 md:px-4 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-accent font-body text-xs md:text-sm transition-all"
              >
                {t(c.ns)}{" "}
                <span className="text-foreground/50">({c.count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default DynamicClusters;
