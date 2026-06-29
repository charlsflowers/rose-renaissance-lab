/**
 * Indexable color collections for bouquets (SEO/navigation only).
 *
 * Keyword research (Charls-Keyword-Research.md → "SUBCATEGORÍAS (rosas por color)"):
 * each rose color is its own high-volume search. We expose one indexable
 * collection per color that has at least one matching product, filtering
 * `bouquetProducts` by their Spanish `color` field.
 *
 * IMPORTANT:
 *  - SEO / navigation only. No prices, cart, checkout or tracking logic here.
 *  - Product names and handles are NEVER changed.
 *  - `slug`   = English URL segment   -> /bouquets/<slug>
 *  - `slugEs` = native Spanish slug    -> /es/bouquets/<slugEs>
 *  - All slugs are unique and do NOT collide with product slugs in bouquetSlugs.ts.
 */

import type { BouquetProduct } from "@/lib/catalogData";

/** Stable color key used internally to pick the collection + filter products. */
export type RoseColor =
  | "red"
  | "white"
  | "pink"
  | "yellow"
  | "black"
  | "blue"
  | "purple"
  | "orange"
  | "green";

export interface ColorCollection {
  /** Internal color key. */
  color: RoseColor;
  /** EN URL slug -> /bouquets/<slug> */
  slug: string;
  /** Native ES URL slug -> /es/bouquets/<slugEs> */
  slugEs: string;
  /**
   * Monthly search volume from the keyword research. 0 = the research lists the
   * color subcollection but gives no isolated EN volume (purple/orange/green);
   * still indexable, just ordered after the volume-backed colors.
   */
  volume: number;
  /** i18n translation namespace under `seo.` for title / description / h1. */
  ns: string;
  /**
   * The Spanish single-color tokens that map a product `color` field to this
   * collection. A product belongs here when it is single-color (no mix) and its
   * color matches one of these tokens.
   */
  colorTokens: string[];
}

/**
 * Ordered by real search volume (research): red/white/pink/yellow/black 60.5k,
 * blue 49.5k, then purple / orange / green (single-color color searches).
 */
export const COLOR_COLLECTIONS: ColorCollection[] = [
  { color: "red",    slug: "red-roses",    slugEs: "rosas-rojas",     volume: 60500, ns: "seo.bouquetsRedRoses",    colorTokens: ["rojo"] },
  { color: "white",  slug: "white-roses",  slugEs: "rosas-blancas",   volume: 60500, ns: "seo.bouquetsWhiteRoses",  colorTokens: ["blanco"] },
  { color: "pink",   slug: "pink-roses",   slugEs: "rosas-rosadas",   volume: 60500, ns: "seo.bouquetsPinkRoses",   colorTokens: ["pink", "hot pink", "light pink"] },
  { color: "yellow", slug: "yellow-roses", slugEs: "rosas-amarillas", volume: 60500, ns: "seo.bouquetsYellowRoses", colorTokens: ["amarillo"] },
  { color: "black",  slug: "black-roses",  slugEs: "rosas-negras",    volume: 60500, ns: "seo.bouquetsBlackRoses",  colorTokens: ["negro"] },
  { color: "blue",   slug: "blue-roses",   slugEs: "rosas-azules",    volume: 49500, ns: "seo.bouquetsBlueRoses",   colorTokens: ["azul"] },
  { color: "purple", slug: "purple-roses", slugEs: "rosas-moradas",   volume: 0,     ns: "seo.bouquetsPurpleRoses", colorTokens: ["morado"] },
  { color: "orange", slug: "orange-roses", slugEs: "rosas-naranjas",  volume: 0,     ns: "seo.bouquetsOrangeRoses", colorTokens: ["naranja"] },
  { color: "green",  slug: "green-roses",  slugEs: "rosas-verdes",    volume: 0,     ns: "seo.bouquetsGreenRoses",  colorTokens: ["verde"] },
];

/** Lookup by EN slug, ES slug or color key. */
export const collectionFromSegment = (segment?: string): ColorCollection | undefined => {
  if (!segment) return undefined;
  const s = segment.toLowerCase();
  return COLOR_COLLECTIONS.find(
    (c) => c.slug === s || c.slugEs === s || c.color === s,
  );
};

/**
 * Split a product `color` string ("Rojo y Blanco", "Negro, Hot Pink y Blanco",
 * "Pink") into individual lowercase color tokens. Multi-color bouquets expose
 * every color they prominently feature so they can appear in each matching
 * color collection (e.g. White Roses AND Blue Roses).
 */
const tokenizeProductColors = (raw: string): string[] =>
  raw
    .toLowerCase()
    .split(/\s+y\s+|,/)
    .map((s) => s.trim())
    .filter(Boolean);

/** True when the product is single-color (no mix separator). */
const isSingleColor = (product: BouquetProduct): boolean =>
  tokenizeProductColors(product.color).length === 1;

/** True when the product is exactly bicolor (2 distinct color tokens). */
export const isBicolorProduct = (product: BouquetProduct): boolean =>
  tokenizeProductColors(product.color).length === 2;

/**
 * True when a product belongs to the given color collection. Single-color and
 * multi-color bouquets both qualify as long as one of their featured colors
 * matches one of the collection's tokens.
 */
export const productMatchesColor = (
  product: BouquetProduct,
  collection: ColorCollection,
): boolean => {
  const tokens = tokenizeProductColors(product.color);
  return tokens.some((t) => collection.colorTokens.includes(t));
};

/** All products in a color collection (preserves catalog order). */
export const productsForColor = (
  products: BouquetProduct[],
  collection: ColorCollection,
): BouquetProduct[] => products.filter((p) => productMatchesColor(p, collection));

/**
 * The color collection a product belongs to, used for the "same color"
 * cross-link on product pages. Only returns a collection for single-color
 * products to keep the cross-link unambiguous (multi-color bouquets appear in
 * several color collections at once and don't have a single "home" color).
 */
export const colorCollectionForProduct = (
  product: BouquetProduct,
): ColorCollection | undefined =>
  isSingleColor(product)
    ? COLOR_COLLECTIONS.find((c) => productMatchesColor(product, c))
    : undefined;

/**
 * The dominant color of ANY product (single OR multi-color), used by the
 * product-level transactional SEO block (productTransactionalSeo.ts) so even
 * bicolor / tricolor bouquets get a per-color transactional block. For
 * multi-color bouquets we return the FIRST matching color in
 * COLOR_COLLECTIONS order — which is real-search-volume order — so the strongest
 * color wins (e.g. a Red + White bouquet attaches to "red"). SEO only.
 */
export const dominantColorForProduct = (
  product: BouquetProduct,
): RoseColor | undefined =>
  COLOR_COLLECTIONS.find((c) => productMatchesColor(product, c))?.color;
