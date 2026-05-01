// Publishable client-side API keys (restricted by HTTP referrer)
export const GOOGLE_MAPS_API_KEY = "AIzaSyAN5ltXtvRFMQp3vQio_kyDMXC9Lvmw1ug";

// Main hero cover image (shared between standard hero and Mother's Day hero
// to keep brand coherence). Hosted on Shopify CDN.
export const FOTO_DE_PORTADA_BASE =
  "https://cdn.shopify.com/s/files/1/0979/1671/5140/files/FOTO_DE_PORTADA.webp";
export const FOTO_DE_PORTADA_VERSION = "1777440449";

export const FOTO_DE_PORTADA = `${FOTO_DE_PORTADA_BASE}?width=1920&v=${FOTO_DE_PORTADA_VERSION}`;
export const FOTO_DE_PORTADA_SRCSET = [640, 1024, 1440, 1920]
  .map((w) => `${FOTO_DE_PORTADA_BASE}?width=${w}&v=${FOTO_DE_PORTADA_VERSION} ${w}w`)
  .join(", ");
