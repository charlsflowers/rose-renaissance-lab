/**
 * Dynamic cross-clusters — auto-updating internal-link blocks.
 *
 * Romuald — Armada SEO 2025, Módulo 29 Web Rango A (Decalaveras), clase 13
 * "Clusters dinámicos" + clase 10 "Optimización SEO de clusters orbital", y
 * Módulo 12 Creación de Contenidos clase 01 "Home Page Informacional":
 *
 *   "Publicas 1 y se te actualizan 70 páginas." El valor de un cluster DINÁMICO
 *   (a diferencia de la cola larga estática de longTailSeo.ts, que es texto fijo
 *   por página, y del índice estático del sitemap) es disparar FRESHNESS masivo
 *   y más crawl budget: un solo producto/blog nuevo reordena e inyecta los
 *   bloques de "novedades" y "por color" en home + colecciones + páginas afines,
 *   sin tocar nada a mano. Google tiene que rastrear toda la web y a más
 *   presupuesto de rastreo, mejores rankings.
 *
 * Cómo es "dinámico" sin backend: los bloques NO son listas escritas a mano;
 * se DERIVAN en tiempo de render de la fuente de verdad del catálogo
 * (`bouquetProducts` + `COLOR_COLLECTIONS`). Cuando se añade o re-etiqueta un
 * producto en `catalogData.ts`, todos los bloques de cluster de toda la web se
 * recalculan solos (newest = los últimos N del catálogo; cada colección de color
 * recuenta sus productos). Un cambio → decenas de páginas refrescadas.
 *
 * REGLAS:
 *  - SEO / navegación interna. Nada de precios, carrito, checkout ni tracking.
 *  - No inventa keywords ni copy: los anchors salen del propio catálogo
 *    (nombre del producto) y de COLOR_COLLECTIONS (traducciones nav.*Roses ya
 *    existentes). No duplica la cola larga (longTailSeo.ts) ni el sitemap.
 *  - Los nombres y handles de producto NUNCA se cambian.
 */

import { bouquetProducts, type BouquetProduct } from "@/lib/catalogData";
import { slugForHandle } from "@/lib/bouquetSlugs";
import {
  COLOR_COLLECTIONS,
  productsForColor,
  type ColorCollection,
} from "@/lib/colorCollections";

export interface ClusterProductLink {
  /** Stable id used as React key. */
  id: string;
  /** Anchor text = the product's real catalog name (never invented). */
  name: string;
  /** Internal route to the product detail page. */
  to: string;
}

export interface ClusterColorLink {
  /** Internal color key (stable React key). */
  color: ColorCollection["color"];
  /** EN URL slug. */
  slug: string;
  /** Native ES URL slug. */
  slugEs: string;
  /** Number of products currently in this color collection (auto-recounted). */
  count: number;
  /** Translation namespace for the human label (nav.<color>Roses). */
  ns: string;
}

/** Build the internal product-detail route for a bouquet. */
const productTo = (p: BouquetProduct): string =>
  `/bouquets/${slugForHandle(p.shopifyHandle)}`;

/**
 * "Newest" cluster — the last N products in catalog order.
 *
 * `bouquetProducts` is appended-to when a product is published, so the tail of
 * the array IS the freshness signal. Adding one product at the end re-injects
 * this block (shifted by one) into every page that renders it → FRESHNESS on
 * home + all collections at once, from a single edit.
 *
 * `excludeId` lets a product page drop itself from its own "newest" block.
 */
export const newestBouquets = (
  limit = 8,
  excludeId?: string,
): ClusterProductLink[] =>
  [...bouquetProducts]
    .reverse() // last published first
    .filter((p) => p.id !== excludeId)
    .slice(0, limit)
    .map((p) => ({ id: p.id, name: p.name, to: productTo(p) }));

/**
 * "By color" cluster — every color collection that currently has ≥1 product,
 * with its live product count. Re-tagging a product's `color` field moves it
 * between collections and these counts update automatically.
 *
 * Ordered by real search volume (COLOR_COLLECTIONS is already volume-ordered),
 * then only collections that actually have products are kept.
 */
export const colorClusters = (): ClusterColorLink[] =>
  COLOR_COLLECTIONS.map((c) => ({
    color: c.color,
    slug: c.slug,
    slugEs: c.slugEs,
    count: productsForColor(bouquetProducts, c).length,
    ns: `nav.${c.color}Roses`,
  })).filter((c) => c.count > 0);
