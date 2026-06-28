/**
 * Directional internal-linking GUARD (single source of truth).
 *
 * Romuald — Armada SEO 2025, Modulo 15 Enlazado Interno
 *  (03.Enlazado Interno Tipo Silo + 02.Enlazado en Cadena):
 *
 *   "Lo que intentamos siempre es enlazar desde aquellas URLs mas faciles de
 *    posicionar hacia las URLs mas dificiles para transferir esa autoridad, y
 *    solo y exclusivamente desde lo mas facil hacia lo mas dificil, no desde lo
 *    mas dificil hacia lo mas facil en ningun caso."
 *
 *   "[una URL] solo podria recibir el enlazado interno desde aquella URL que es
 *    mas facil de posicionar... solo desde los anteriores... todo lo que esta en
 *    color marron son casillas que no nos permitirian poner un enlace."
 *
 * The repo already ORDERS some link lists low -> high by hand (longTailSeo
 * entries, blogInterlinks sort). What was missing — and what this module adds —
 * is the CODIFIED directional RULE itself: one function that, given any two
 * on-site pages, says whether a link is allowed, and one filter that strips the
 * reverse (hard -> easy) links from any candidate list. This is the digital
 * version of Romuald's "archivo de control" (the matrix where the brown cells
 * are forbidden), reusable for collections AND products.
 *
 * DIFFICULTY MODEL (no invented numbers):
 *  - Collections carry a REAL monthly search volume (COLOR_COLLECTIONS[].volume
 *    from the keyword research). Higher volume = harder to position.
 *  - Occasion collections have no isolated volume in the repo -> treated as a
 *    low, fixed mid-tier (1), exactly as blogInterlinks already does.
 *  - Products / TSR pages are, by the playbook's own architecture, the EASIEST
 *    layer ("paginas planas... long tail, menor volumen") and authority flows
 *    UP from them to the categories. So a product's difficulty is 0 (easiest).
 *    We do NOT invent a per-product volume — 0 is the structural floor.
 *
 * This module changes NOTHING about H1, prices, cart, checkout or tracking. It
 * only decides the DIRECTION of internal links.
 */

import { COLOR_COLLECTIONS } from "@/lib/colorCollections";
import { occasionPages } from "@/lib/occasionPagesData";

/** Difficulty of the easiest layer (products / TSR / long-tail). */
export const PRODUCT_DIFFICULTY = 0;

/** Difficulty assigned to occasion collections (no isolated volume in repo). */
export const OCCASION_DIFFICULTY = 1;

/** Difficulty of the main category sink (highest-authority target). */
export const MAIN_CATEGORY_DIFFICULTY = Number.MAX_SAFE_INTEGER;

/** Strip language prefix + known section prefixes, trim slashes, lowercase. */
const normPath = (path: string): string =>
  path
    .toLowerCase()
    .trim()
    .replace(/[?#].*$/, "")
    .replace(/^https?:\/\/(www\.)?charlsflowers\.com/i, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/^es\//, "");

/**
 * Difficulty (= positioning hardness) of an on-site path.
 *  - Higher number  = harder to position (more search volume / more competition).
 *  - `undefined`    = the path is not a known directional node (e.g. a single
 *    product page), so callers treat it as the easiest layer (PRODUCT_DIFFICULTY).
 *
 * Known nodes: color collections (real volume), occasion collections, and the
 * main /bouquets category.
 */
export const pageDifficulty = (path: string): number | undefined => {
  const p = normPath(path);

  // Main category sink.
  if (p === "bouquets") return MAIN_CATEGORY_DIFFICULTY;

  // Color collections: /bouquets/<slug|slugEs>.
  for (const c of COLOR_COLLECTIONS) {
    if (p === `bouquets/${c.slug}` || p === `bouquets/${c.slugEs}`) {
      return c.volume;
    }
  }

  // Occasion collections: /collections/<slug|slugEs>.
  for (const o of occasionPages) {
    if (p === `collections/${o.slug}` || p === `collections/${o.slugEs}`) {
      return OCCASION_DIFFICULTY;
    }
  }

  return undefined;
};

/** Resolve a path's difficulty, defaulting unknown nodes (products) to the floor. */
const resolveDifficulty = (path: string): number =>
  pageDifficulty(path) ?? PRODUCT_DIFFICULTY;

/**
 * Canonical node key for a path, language-agnostic: the EN+ES slugs of the same
 * collection map to ONE key, so a page never "links to itself" across languages.
 * Unknown nodes (products) fall back to their normalized path.
 */
const canonicalNode = (path: string): string => {
  const p = normPath(path);
  if (p === "bouquets") return "node:bouquets";
  for (const c of COLOR_COLLECTIONS) {
    if (p === `bouquets/${c.slug}` || p === `bouquets/${c.slugEs}`) {
      return `color:${c.color}`;
    }
  }
  for (const o of occasionPages) {
    if (p === `collections/${o.slug}` || p === `collections/${o.slugEs}`) {
      return `occasion:${o.slug}`;
    }
  }
  return `path:${p}`;
};

/**
 * Is a link FROM `fromPath` TO `toPath` allowed by the directional rule?
 *
 * Allowed ONLY when the origin is easier-or-equal to position than the target
 * (easy -> hard transfers authority up the chain). A link from a HARDER page to
 * an EASIER page is forbidden ("no desde lo mas dificil hacia lo mas facil en
 * ningun caso"). Self-links are not allowed.
 *
 * Equal difficulty is permitted (e.g. two color collections both at 60,500, or a
 * product -> product cross-link), matching the chain's "siguiente pagina que
 * tiene una demanda un poco superior pero no tan elevada" — we never go DOWN.
 */
export const isLinkAllowed = (fromPath: string, toPath: string): boolean => {
  // No self-link — including a page's own translated equivalent (same node).
  if (canonicalNode(fromPath) === canonicalNode(toPath)) return false;
  return resolveDifficulty(fromPath) <= resolveDifficulty(toPath);
};

/**
 * Filter a candidate list of target paths so a page only keeps links that go
 * easy -> hard (and, as a side effect, returns them ordered low -> high so the
 * chain reads correctly). This is the reusable "archivo de control" guard.
 *
 * @param fromPath  the page that hosts the links
 * @param targets   candidate destination paths (or objects carrying a `to`)
 */
export const filterDirectionalLinks = <T extends string | { to: string }>(
  fromPath: string,
  targets: T[],
): T[] => {
  const toPath = (t: T): string => (typeof t === "string" ? t : t.to);
  return targets
    .filter((t) => isLinkAllowed(fromPath, toPath(t)))
    .sort((a, b) => resolveDifficulty(toPath(a)) - resolveDifficulty(toPath(b)));
};
