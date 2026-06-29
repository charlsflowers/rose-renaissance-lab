/**
 * Transactional search-ranking (TSR) layer for PRODUCT pages.
 *
 * Purpose: capture the COMMERCIAL / near-purchase intent around each rose color
 * ("buy / price / same-day delivery / send …") that the collection-level
 * long-tail layer (longTailSeo.ts) does NOT cover. This file renders ONE short
 * transactional block at the bottom of a product page, keyed by the product's
 * dominant color. It is SEO copy + internal links only — no prices, cart,
 * checkout, tracking or H1 logic lives here.
 *
 * NADA INVENTADO — every keyword below is taken from the REAL keyword research
 * (volume cited inline as `vol`). Where a phrase combines a real root keyword
 * with the Miami geo-modifier / commercial qualifier (Romuald, Armada SEO 2025
 * — "TSR / long tail transaccional": keyword raíz + intención de compra +
 * modificador local), the cited volume is for the ROOT keyword; the composed
 * phrase is editorial copy, not a claimed standalone volume.
 *
 * SOURCES (real research files):
 *  - Charls-KW-EN-completo.md / Charls-KW-ES-completo.md
 *  - Charls-Keyword-Research.md
 *  - Charls-ColaLarga-Variantes-por-coleccion.md
 *
 * RULES baked in (consistent with longTailSeo.ts / linkDirection.ts):
 *  - Never a second H1: this block opens with an H2.
 *  - Internal anchors equal the keyword exactly.
 *  - EN links use clean root paths; ES links use /es native slugs.
 *  - Links go from the (easy) product page toward the (harder) color
 *    collection and the main /bouquets sink — easy → hard only.
 */

import type { RoseColor } from "@/lib/colorCollections";

export interface TsrLink {
  /** Anchor text — equals the keyword exactly. */
  anchor: string;
  /** Internal route. EN: "/…", ES: "/es/…" (native). */
  to: string;
}

export interface TsrContent {
  /** H2 heading for the block (never an H1). */
  h2: string;
  /** 1-2 line transactional paragraph (buy / price / delivery intent). */
  body: string;
  /** Closing line hosting the internal links via {{0}}, {{1}}, … */
  closing: string;
  /** Internal links, ordered LOW → HIGH search volume (easy → hard). */
  links: TsrLink[];
}

export interface TsrEntry {
  en: TsrContent;
  es: TsrContent;
}

/**
 * Shared transactional spine reused across colors (EN + ES). These are the
 * GLOBAL flower-delivery commercial keywords from the research, attached to
 * every color block so each product page also competes on the buy/delivery
 * intent that has the biggest real volume.
 *
 * Real volumes (Charls-KW-EN-completo.md):
 *   same day flower delivery        90,500
 *   flower delivery near me         49,500
 *   send flowers                    40,500
 *   send flowers same day            8,100
 * Real volumes (Charls-KW-ES-completo.md):
 *   flores a domicilio                 880
 *   envio de flores a domicilio        320
 *   enviar flores                    2,400
 *   ramo buchon                     27,100
 */

type ColorCopy = {
  /** Display name of the color in EN, used in copy + anchors. */
  enName: string;
  /** Display name of the color in ES, used in copy + anchors. */
  esName: string;
  /** EN color-collection route. */
  enTo: string;
  /** ES color-collection route. */
  esTo: string;
  /**
   * Real per-color root volumes used to phrase the copy honestly.
   * `enRoses`  -> "<color> roses" EN volume.
   * `esRosas`  -> "rosas <color>" ES volume.
   * `meaning`  -> "<color> roses meaning" EN volume (only used to gauge how
   *               commercial the color is; copy stays purchase-oriented).
   */
  enRoses: number;
  esRosas: number;
};

/**
 * Per-color real volumes (cited). EN "<color> roses" comes from
 * Charls-KW-EN-completo.md / Charls-Keyword-Research.md (red/white/pink/yellow/
 * black = 60,500; blue = 49,500). ES "rosas <color>" from
 * Charls-KW-ES-completo.md. purple/orange/green: the EN research lists the color
 * subcollection but gives no isolated "<color> roses" volume — marked 0 (still
 * indexable), mirroring colorCollections.ts.
 */
const COLOR_COPY: Record<RoseColor, ColorCopy> = {
  red: {
    enName: "red roses", esName: "rosas rojas",
    enTo: "/bouquets/red-roses", esTo: "/es/bouquets/rosas-rojas",
    enRoses: 60500, esRosas: 5400, // EN Charls-Keyword-Research.md ; ES Charls-KW-ES-completo.md L49
  },
  white: {
    enName: "white roses", esName: "rosas blancas",
    enTo: "/bouquets/white-roses", esTo: "/es/bouquets/rosas-blancas",
    enRoses: 60500, esRosas: 1900, // ES Charls-KW-ES-completo.md L128
  },
  pink: {
    enName: "pink roses", esName: "rosas rosadas",
    enTo: "/bouquets/pink-roses", esTo: "/es/bouquets/rosas-rosadas",
    enRoses: 60500, esRosas: 2900, // ES Charls-KW-ES-completo.md L86
  },
  yellow: {
    enName: "yellow roses", esName: "rosas amarillas",
    enTo: "/bouquets/yellow-roses", esTo: "/es/bouquets/rosas-amarillas",
    enRoses: 60500, esRosas: 2400, // ES Charls-KW-ES-completo.md L97
  },
  black: {
    enName: "black roses", esName: "rosas negras",
    enTo: "/bouquets/black-roses", esTo: "/es/bouquets/rosas-negras",
    enRoses: 60500, esRosas: 9900, // ES Charls-KW-ES-completo.md L38
  },
  blue: {
    enName: "blue roses", esName: "rosas azules",
    enTo: "/bouquets/blue-roses", esTo: "/es/bouquets/rosas-azules",
    enRoses: 49500, esRosas: 1300, // EN Charls-KW-EN-completo.md L241 ; ES L177
  },
  purple: {
    enName: "purple roses", esName: "rosas moradas",
    enTo: "/bouquets/purple-roses", esTo: "/es/bouquets/rosas-moradas",
    enRoses: 0, esRosas: 0, // no isolated "<color> roses" volume in research
  },
  orange: {
    enName: "orange roses", esName: "rosas naranjas",
    enTo: "/bouquets/orange-roses", esTo: "/es/bouquets/rosas-naranjas",
    enRoses: 0, esRosas: 0,
  },
  green: {
    enName: "green roses", esName: "rosas verdes",
    enTo: "/bouquets/green-roses", esTo: "/es/bouquets/rosas-verdes",
    enRoses: 0, esRosas: 0,
  },
};

/** Build the EN/ES transactional entry for a color from its real copy data. */
const buildEntry = (c: ColorCopy): TsrEntry => ({
  en: {
    h2: `Buy ${c.enName} in Miami — same-day flower delivery`,
    body:
      `Order ${c.enName} online and we deliver the same day across Miami: every ` +
      `bouquet is hand-arranged the morning it ships. Same-day delivery up to 87 ` +
      `miles, FedEx shipping beyond that, and free store pickup in Miami, FL. ` +
      `Need it fast? "Send flowers" today and we cover the city.`,
    // Order: color collection (per-color volume) → /bouquets sink (highest).
    closing: `Browse every {{0}} arrangement or see the full {{1}} catalog.`,
    links: [
      { anchor: c.enName, to: c.enTo },
      { anchor: "rose bouquet", to: "/bouquets" }, // vol 40,500 (ColaLarga C1)
    ],
  },
  es: {
    h2: `Comprar ${c.esName} en Miami — flores a domicilio el mismo día`,
    body:
      `Pide ${c.esName} por internet y las entregamos el mismo día en Miami: ` +
      `cada ramo se monta a mano el día del envío. Flores a domicilio hasta 87 ` +
      `millas, envío FedEx fuera de ese radio y recogida gratis en Miami, FL. ` +
      `¿Es urgente? Enviar flores hoy en toda la ciudad.`,
    closing: `Mira todos los arreglos de {{0}} o el catálogo completo de {{1}}.`,
    links: [
      { anchor: c.esName, to: c.esTo },
      { anchor: "ramo de rosas", to: "/es/bouquets" }, // vol 12,100 (KW-ES L33)
    ],
  },
});

/** TSR block per rose color. */
export const PRODUCT_TSR: Record<RoseColor, TsrEntry> = Object.fromEntries(
  (Object.keys(COLOR_COPY) as RoseColor[]).map((k) => [k, buildEntry(COLOR_COPY[k])]),
) as Record<RoseColor, TsrEntry>;

/** Lookup the TSR content for a color + language. */
export const getProductTsr = (
  color: RoseColor | undefined,
  lang: "en" | "es",
): TsrContent | undefined => {
  if (!color) return undefined;
  const entry = PRODUCT_TSR[color];
  return entry ? entry[lang] : undefined;
};
