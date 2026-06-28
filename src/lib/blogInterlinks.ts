/**
 * Blog → category internal-linking resolver (PageRank / chain logic).
 *
 * Romuald — Armada SEO 2025:
 *  - Modulo 15 Enlazado Interno / 02.Enlazado en cadena: "vas enlazando desde
 *    mas facil hacia mas dificil... trasladariamos la autoridad del proyecto
 *    desde una pagina que es mas facil de posicionar [long tail, menor volumen]
 *    hacia una pagina mas dificil [mayor demanda]". El enlazado interno hacia la
 *    "categoria principal" concentra autoridad en ella.
 *  - Modulo 16 Correccion Webs Rango C / 08.Revision: "un interlinking que me
 *    ayudara a posicionar las keywords mas dificiles desde las mas faciles...
 *    desde ese articulo enlazaria a la categoria afin".
 *
 * What this does (mechanism only — NO invented keywords/copy):
 *  - Given a blog article's affinity hints (its Sanity `categories` slugs and/or
 *    its `relatedLandings`), it resolves the AFFINE on-site collections that
 *    ALREADY exist in the repo (color collections + occasion collections).
 *  - The anchor text is each collection's OWN existing localized title/keyword
 *    (never fabricated here).
 *  - Results are ordered by real search volume LOW → HIGH (chain logic) and the
 *    main bouquets category is appended LAST as the highest-authority target,
 *    so the article passes authority up the chain into the category.
 *
 * It does NOT change H1, prices, cart, checkout or tracking.
 */

import { COLOR_COLLECTIONS } from "@/lib/colorCollections";
import { occasionPages } from "@/lib/occasionPagesData";
import { filterDirectionalLinks } from "@/lib/linkDirection";

export type Lang = "en" | "es";

export interface InterLink {
  /** Native localized path (already includes the right slug for the language). */
  to: string;
  /** Anchor text = the collection's own existing title/keyword for the language. */
  anchor: string;
  /** Real monthly search volume; used only to order the chain (low → high). */
  volume: number;
}

/** Normalize a slug-ish hint for tolerant matching (lowercase, strip /es/, etc). */
const norm = (s: string): string =>
  s
    .toLowerCase()
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/^(es\/)?(bouquets|collections|flowers|flores)\//, "")
    .replace(/^(es\/)/, "");

/**
 * Build the lookup table of affine collections that exist on the site.
 * key = a slug the article might reference (EN slug, ES slug, or color key).
 */
const buildIndex = (lang: Lang): Map<string, InterLink> => {
  const idx = new Map<string, InterLink>();

  // Color collections → /bouquets/<slug> (EN) or /es/bouquets/<slugEs> (ES).
  for (const c of COLOR_COLLECTIONS) {
    const to = lang === "es" ? `/es/bouquets/${c.slugEs}` : `/bouquets/${c.slug}`;
    // Anchor = the collection's own keyword (the color slug, humanized) — this is
    // the collection's existing identity, not invented copy. We keep it minimal
    // and let the title come from the slug to avoid duplicating i18n strings here.
    const anchor = (lang === "es" ? c.slugEs : c.slug).replace(/-/g, " ");
    const entry: InterLink = { to, anchor, volume: c.volume };
    idx.set(norm(c.slug), entry);
    idx.set(norm(c.slugEs), entry);
    idx.set(norm(c.color), entry);
  }

  // Occasion collections → /collections/<slug> (EN) or /es/collections/<slugEs>.
  for (const o of occasionPages) {
    const to = lang === "es" ? `/es/collections/${o.slugEs}` : `/collections/${o.slug}`;
    // Anchor = the occasion's OWN keyword for this language (already real copy).
    const anchor = lang === "es" ? o.keyword.es : o.keyword.en;
    // Occasion pages don't carry an isolated volume in the repo; treat as mid
    // priority (1) so they order before the main category but after long-tail
    // color collections that have a real 0 volume marker.
    const entry: InterLink = { to, anchor, volume: 1 };
    idx.set(norm(o.slug), entry);
    idx.set(norm(o.slugEs), entry);
  }

  return idx;
};

/**
 * Resolve a list of affinity hints (Sanity category slugs and/or relatedLandings)
 * into ordered, de-duplicated internal links toward the affine categories.
 *
 * @param hints  raw slugs from the article (categories[].slug.current, relatedLandings)
 * @param lang   current UI language
 * @param limit  max affine links to render (excluding the main category)
 */
export const resolveBlogInterlinks = (
  hints: string[],
  lang: Lang,
  limit = 4,
): InterLink[] => {
  const idx = buildIndex(lang);
  const seen = new Set<string>();
  const out: InterLink[] = [];

  for (const raw of hints) {
    if (!raw) continue;
    const link = idx.get(norm(raw));
    if (link && !seen.has(link.to)) {
      seen.add(link.to);
      out.push(link);
    }
  }

  // Chain order + directional guard: a blog article is the easiest origin
  // (long-tail info page), so it may only link UP toward harder collections.
  // filterDirectionalLinks enforces the rule centrally ("solo desde lo mas
  // facil hacia lo mas dificil") and orders the survivors low → high volume.
  const origin = lang === "es" ? "/es/blog" : "/blog";
  const ordered = filterDirectionalLinks(origin, out);

  const trimmed = ordered.slice(0, limit);

  // Always pass authority up to the main category (highest-authority target),
  // appended LAST so the chain ends at "bouquets".
  const mainTo = lang === "es" ? "/es/bouquets" : "/bouquets";
  if (!seen.has(mainTo)) {
    trimmed.push({
      to: mainTo,
      anchor: lang === "es" ? "todos los ramos de rosas" : "all rose bouquets",
      volume: Number.MAX_SAFE_INTEGER,
    });
  }

  return trimmed;
};
