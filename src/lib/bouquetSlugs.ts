/**
 * SEO slugs for bouquet product pages (keyword-first, EN + ES).
 *
 * IMPORTANT (do NOT change without an explicit SEO + redirect plan):
 *  - The KEY is the product `shopifyHandle` — it is NEVER changed and is the
 *    stable identifier used by the cart, Shopify variants, seoData, the manual
 *    order tool and tracking.
 *  - `slug`   = English web URL segment  -> /bouquets/<slug>
 *  - `slugEs` = Spanish web URL segment   -> /es/bouquets/<slugEs>
 *
 * The OLD URLs (/bouquets/all/<handle>, /bouquets/:type/<handle>) are kept alive
 * as 301 redirects to /bouquets/<slug> (see App.tsx BouquetSlugResolver).
 *
 * All 48 slugs (EN and ES) are unique. Collisions in the underlying `color`
 * field were resolved with a short differentiator taken from the internal name
 * (e.g. `-bicolor`, `-elegant`, `-dawn`, `-citrus`, `-tricolor`).
 */

export interface BouquetSlug {
  slug: string;
  slugEs: string;
}

/** handle -> { slug (EN), slugEs (ES) } */
export const BOUQUET_SLUGS: Record<string, BouquetSlug> = {
  "bicolor-passion": { slug: "white-red-roses-bouquet-bicolor", slugEs: "ramo-rosas-blancas-rojas-bicolor" },
  "soft-pink": { slug: "pink-roses-bouquet", slugEs: "ramo-de-rosas-pink" },
  "elegant-contrast": { slug: "white-hot-pink-black-roses-bouquet", slugEs: "ramo-rosas-blancas-hotpink-negras" },
  "radiant-sun": { slug: "yellow-roses-bouquet", slugEs: "ramo-de-rosas-amarillas" },
  "magic-pastel": { slug: "white-pink-purple-roses-bouquet", slugEs: "ramo-rosas-blancas-pink-moradas" },
  "blue-sky": { slug: "blue-roses-bouquet", slugEs: "ramo-de-rosas-azules" },
  "spring-garden": { slug: "white-yellow-roses-bouquet", slugEs: "ramo-rosas-blancas-amarillas" },
  "total-passion": { slug: "red-roses-bouquet", slugEs: "ramo-de-rosas-rojas" },
  "fire-sun": { slug: "yellow-red-purple-roses-bouquet", slugEs: "ramo-rosas-amarillas-rojas-moradas" },
  "green-fresh": { slug: "green-roses-bouquet", slugEs: "ramo-de-rosas-verdes" },
  "night-day": { slug: "white-black-roses-bouquet", slugEs: "ramo-rosas-blancas-negras" },
  "orange-citrus": { slug: "white-orange-roses-bouquet", slugEs: "ramo-rosas-blancas-naranjas" },
  "hot-pink-blush": { slug: "hot-pink-roses-bouquet", slugEs: "ramo-de-rosas-hot-pink" },
  "classic-tricolor": { slug: "red-white-pink-roses-bouquet", slugEs: "ramo-rosas-rojas-blancas-pink" },
  "red-sweetness": { slug: "light-pink-hot-pink-roses-bouquet", slugEs: "ramo-rosas-rosa-claro-hotpink" },
  "deep-night": { slug: "black-roses-bouquet", slugEs: "ramo-de-rosas-negras" },
  "warm-sunset": { slug: "white-orange-hot-pink-roses-bouquet", slugEs: "ramo-rosas-blancas-naranjas-hotpink" },
  "sunflowers-passion": { slug: "sunflowers-red-roses-bouquet", slugEs: "ramo-girasoles-rosas-rojas" },
  "orange-sunset": { slug: "orange-roses-bouquet", slugEs: "ramo-de-rosas-naranjas" },
  "dark-romance": { slug: "red-hot-pink-roses-bouquet", slugEs: "ramo-rosas-rojas-hot-pink" },
  "soft-spring": { slug: "white-light-pink-yellow-roses-bouquet", slugEs: "ramo-rosas-blancas-rosa-claro-amarillas" },
  "pure-white": { slug: "white-roses-bouquet", slugEs: "ramo-de-rosas-blancas" },
  "white-ocean": { slug: "blue-white-roses-bouquet", slugEs: "ramo-rosas-azules-blancas" },
  "iberian-passion": { slug: "yellow-red-roses-bouquet", slugEs: "ramo-rosas-amarillas-rojas" },
  "purple-charm": { slug: "purple-roses-bouquet", slugEs: "ramo-de-rosas-moradas" },
  "imperial-bee": { slug: "white-yellow-black-roses-bouquet", slugEs: "ramo-rosas-blancas-amarillas-negras" },
  "pink-white-dawn": { slug: "hot-pink-white-roses-bouquet-dawn", slugEs: "ramo-rosas-hotpink-blancas-dawn" },
  "intense-romance": { slug: "red-white-purple-roses-bouquet", slugEs: "ramo-rosas-rojas-blancas-moradas" },
  "dark-pink-elegance": { slug: "pink-black-roses-bouquet", slugEs: "ramo-rosas-pink-negras" },
  "citrus-refresh": { slug: "orange-yellow-roses-bouquet-citrus", slugEs: "ramo-rosas-naranjas-amarillas-citrus" },
  "light-citrus": { slug: "orange-yellow-white-roses-bouquet", slugEs: "ramo-rosas-naranjas-amarillas-blancas" },
  "passionate-love": { slug: "red-pink-roses-bouquet", slugEs: "ramo-rosas-rojas-pink" },
  "infinite-tenderness": { slug: "pink-white-roses-bouquet", slugEs: "ramo-rosas-pink-blancas" },
  "tricolor-love": { slug: "red-pink-white-roses-bouquet-tricolor", slugEs: "ramo-rosas-rojas-pink-blancas-tricolor" },
  "pink-symphony": { slug: "hot-pink-light-pink-white-red-roses-bouquet", slugEs: "ramo-rosas-hotpink-rosa-claro-blancas-rojas" },
  "elegant-passion": { slug: "white-red-roses-bouquet-elegant", slugEs: "ramo-rosas-blancas-rojas-elegant" },
  "aries-bouquet": { slug: "aries-zodiac-bouquet", slugEs: "ramo-zodiaco-aries" },
  "taurus-bouquet": { slug: "taurus-zodiac-bouquet", slugEs: "ramo-zodiaco-tauro" },
  "gemini-bouquet": { slug: "gemini-zodiac-bouquet", slugEs: "ramo-zodiaco-geminis" },
  "cancer-bouquet": { slug: "cancer-zodiac-bouquet", slugEs: "ramo-zodiaco-cancer" },
  "leo-bouquet": { slug: "leo-zodiac-bouquet", slugEs: "ramo-zodiaco-leo" },
  "virgo-bouquet": { slug: "virgo-zodiac-bouquet", slugEs: "ramo-zodiaco-virgo" },
  "libra-bouquet": { slug: "libra-zodiac-bouquet", slugEs: "ramo-zodiaco-libra" },
  "scorpio-bouquet": { slug: "scorpio-zodiac-bouquet", slugEs: "ramo-zodiaco-escorpio" },
  "sagittarius-bouquet": { slug: "sagittarius-zodiac-bouquet", slugEs: "ramo-zodiaco-sagitario" },
  "capricorn-bouquet": { slug: "capricorn-zodiac-bouquet", slugEs: "ramo-zodiaco-capricornio" },
  "aquarius-bouquet": { slug: "aquarius-zodiac-bouquet", slugEs: "ramo-zodiaco-acuario" },
  "pisces-bouquet": { slug: "pisces-zodiac-bouquet", slugEs: "ramo-zodiaco-piscis" },
};

/** Reverse maps for O(1) lookup from a URL slug back to the handle. */
const SLUG_TO_HANDLE: Record<string, string> = {};
const SLUG_ES_TO_HANDLE: Record<string, string> = {};
for (const [handle, { slug, slugEs }] of Object.entries(BOUQUET_SLUGS)) {
  SLUG_TO_HANDLE[slug] = handle;
  SLUG_ES_TO_HANDLE[slugEs] = handle;
}

/** EN web slug for a handle. Falls back to the handle itself if unmapped. */
export const slugForHandle = (handle?: string): string =>
  (handle && BOUQUET_SLUGS[handle]?.slug) || handle || "";

/** ES web slug for a handle. Falls back to the EN slug, then the handle. */
export const slugEsForHandle = (handle?: string): string =>
  (handle && BOUQUET_SLUGS[handle]?.slugEs) || slugForHandle(handle);

/**
 * Resolve a URL segment (EN slug, ES slug, or — for back-compat — a raw handle)
 * back to the canonical shopifyHandle. Returns undefined if unknown.
 */
export const handleFromSlug = (slug?: string): string | undefined => {
  if (!slug) return undefined;
  return SLUG_TO_HANDLE[slug] || SLUG_ES_TO_HANDLE[slug] || (BOUQUET_SLUGS[slug] ? slug : undefined);
};
