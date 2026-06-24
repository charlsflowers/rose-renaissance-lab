#!/usr/bin/env node
/**
 * Auto-generate public/_redirects — a static 301 redirect map for a FUTURE
 * migration to Netlify / Cloudflare Pages / Vercel.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  IMPORTANT — this file is NOT used by Lovable.                            │
 * │                                                                          │
 * │  The site currently runs as a Lovable React SPA. All the redirects below │
 * │  are ALREADY handled client-side in src/App.tsx (BouquetSlugResolver,    │
 * │  ShopifyProductRedirect, RoomDecorRedirect, /bouquet-builder, etc.).     │
 * │  Lovable serves index.html for every path and ignores public/_redirects, │
 * │  so generating this file changes NOTHING about the live site today.      │
 * │                                                                          │
 * │  Why keep it: the day the site migrates to Netlify / Cloudflare Pages /  │
 * │  Vercel (which DO read public/_redirects), every legacy URL — old        │
 * │  handles, Shopify /products/ links from Meta/Instagram ads, bq-* ids,    │
 * │  rd-* room-decor ids, /bouquet-builder — keeps its SEO equity with a     │
 * │  real server-side HTTP 301 instead of a client-side bounce. Zero risk    │
 * │  now, ready when needed.                                                 │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * NOT wired into the main build (npm run build). Run on demand:
 *     npm run redirects
 *
 * Source of truth (parsed, never hard-coded):
 *  - src/lib/bouquetSlugs.ts   -> BOUQUET_SLUGS (handle -> { slug EN, slugEs ES })
 *  - src/lib/catalogData.ts    -> bouquetProducts (bq-* id + shopifyHandle)
 *  - src/lib/roomDecorData.ts  -> roomDecorPackages (id + shopifyHandle)
 *
 * Redirect patterns mirrored from src/App.tsx:
 *  - BouquetSlugResolver:    /bouquets/all/<handle>     -> /bouquets/<slug>   (301)
 *                            /bouquets/<handle> (raw)   -> /bouquets/<slug>   (301)
 *                            /bouquets/<bq-id> (legacy) -> /bouquets/<slug>   (301)
 *  - ShopifyProductRedirect: /products/<handle>         -> /bouquets/<slug>
 *                                                       or /room-decors/<id>  (301)
 *  - RoomDecorRedirect:      /room-decors/rd-<id>       -> /room-decors/<id>  (301)
 *                            /room-decors/rd-deluxe-love-> /room-decors/deluxe-love-package
 *  - /bouquet-builder        -> /bouquets/personalizar  (301)
 *  - /mothers-day/<handle>   -> /bouquets/mothers-day/<handle> (301)
 *
 * Every rule is emitted for BOTH languages: the EN root path and the /es prefix.
 * Output format is the Netlify / Cloudflare `_redirects` syntax:
 *     /from   /to   301
 * (Cloudflare Pages reads the same file; Vercel users translate these to
 *  vercel.json — the mapping is 1:1.)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const read = (rel) => readFileSync(resolve(ROOT, rel), "utf8");

// ───────────────────────── parse data sources ─────────────────────────

const slugsSrc     = read("src/lib/bouquetSlugs.ts");
const catalogSrc   = read("src/lib/catalogData.ts");
const roomDecorSrc = read("src/lib/roomDecorData.ts");

/**
 * BOUQUET_SLUGS: { handle: { slug, slugEs } }
 * matches:  "handle": { slug: "en-slug", slugEs: "es-slug" },
 */
const bouquetSlugMap = (() => {
  const map = {};
  const re = /["']([a-z0-9-]+)["']\s*:\s*\{\s*slug\s*:\s*["']([^"']+)["']\s*,\s*slugEs\s*:\s*["']([^"']+)["']\s*\}/g;
  let m;
  while ((m = re.exec(slugsSrc)) !== null) {
    map[m[1]] = { slug: m[2], slugEs: m[3] };
  }
  return map;
})();

/**
 * bouquetProducts: pair each legacy `bq-*` id with its shopifyHandle.
 * matches:  id: 'bq-...', name: '...', shopifyHandle: '...'
 */
const bouquetIdToHandle = (() => {
  const map = {};
  const re = /id:\s*['"](bq-[a-z0-9-]+)['"][^}]*?shopifyHandle:\s*['"]([a-z0-9-]+)['"]/gi;
  let m;
  while ((m = re.exec(catalogSrc)) !== null) {
    map[m[1]] = m[2];
  }
  return map;
})();

/**
 * roomDecorPackages: pair each shopifyHandle with its route id.
 * matches:  id: 'love-bomb', ... shopifyHandle: 'love-bomb'
 */
const roomDecorHandleToId = (() => {
  const map = {};
  const body = roomDecorSrc.split("export const roomDecorPackages")[1] ?? "";
  const re = /id:\s*['"]([a-z0-9-]+)['"][\s\S]*?shopifyHandle:\s*['"]([a-z0-9-]+)['"]/gi;
  let m;
  while ((m = re.exec(body)) !== null) {
    // map handle -> id
    map[m[2]] = m[1];
  }
  return map;
})();

// ───────────────────────── build redirect rules ─────────────────────────

/**
 * Each rule is { from, to }. We emit it once for the EN root and once for the
 * /es prefix (the SPA mounts the same tree under /es). `addRule` de-dupes and
 * never emits a no-op (from === to).
 */
const rules = [];
const seen = new Set();

const addRule = (from, to) => {
  if (!from || !to || from === to || seen.has(from)) return;
  seen.add(from);
  rules.push({ from, to });
};

/** Emit a rule for EN root and its /es-prefixed twin. */
const addBoth = (from, to) => {
  addRule(from, to);
  addRule(`/es${from}`, `/es${to}`);
};

// 1. Bouquet handle / legacy paths -> clean keyword-first slug.
//    The destination uses the language-matched slug (EN slug for root, ES slug for /es).
for (const [handle, { slug, slugEs }] of Object.entries(bouquetSlugMap)) {
  // 1a. /bouquets/all/<handle>  (legacy two-segment listing path)
  addRule(`/bouquets/all/${handle}`, `/bouquets/${slug}`);
  addRule(`/es/bouquets/all/${handle}`, `/es/bouquets/${slugEs}`);

  // 1b. /bouquets/<handle>  (raw handle used in old links / ads)
  //     Only meaningful when the handle differs from its slug (it always does).
  addRule(`/bouquets/${handle}`, `/bouquets/${slug}`);
  addRule(`/es/bouquets/${handle}`, `/es/bouquets/${slugEs}`);

  // 1c. /products/<handle>  (Shopify-style URL from Meta/Instagram ads)
  addRule(`/products/${handle}`, `/bouquets/${slug}`);
  addRule(`/es/products/${handle}`, `/es/bouquets/${slugEs}`);
}

// 2. Legacy internal bq-* ids -> clean slug (BouquetSlugResolver bq-* branch).
for (const [bqId, handle] of Object.entries(bouquetIdToHandle)) {
  const m = bouquetSlugMap[handle];
  if (!m) continue;
  addRule(`/bouquets/${bqId}`, `/bouquets/${m.slug}`);
  addRule(`/es/bouquets/${bqId}`, `/es/bouquets/${m.slugEs}`);
}

// 3. Room decor packages: /products/<handle> -> /room-decors/<id>, and rd-* ids.
for (const [handle, id] of Object.entries(roomDecorHandleToId)) {
  // 3a. /products/<handle> -> /room-decors/<id>
  addBoth(`/products/${handle}`, `/room-decors/${id}`);
  // 3b. /room-decors/rd-<id> -> /room-decors/<id>  (RoomDecorRedirect rd-* branch)
  addBoth(`/room-decors/rd-${id}`, `/room-decors/${id}`);
}
// 3c. Explicit legacy alias kept in App.tsx.
addBoth(`/room-decors/rd-deluxe-love`, `/room-decors/deluxe-love-package`);

// 4. /bouquet-builder -> /bouquets/personalizar
addBoth(`/bouquet-builder`, `/bouquets/personalizar`);

// 5. /mothers-day/<handle> -> /bouquets/mothers-day/<handle>
//    Handles come from the bouquet catalog (Mother's Day fichas reuse handles).
for (const handle of Object.keys(bouquetSlugMap)) {
  addBoth(`/mothers-day/${handle}`, `/bouquets/mothers-day/${handle}`);
}

// ───────────────────────── render _redirects ─────────────────────────

const HEADER = `# ───────────────────────────────────────────────────────────────────────────
# public/_redirects — 301 redirect map (Netlify / Cloudflare Pages syntax)
#
# GENERATED by scripts/generate-redirects.mjs — DO NOT EDIT BY HAND.
# Run:  npm run redirects
#
# ⚠️  LOVABLE IGNORES THIS FILE.
#     The live site is a Lovable React SPA; these redirects are already handled
#     client-side in src/App.tsx. Lovable serves index.html for every path and
#     never reads public/_redirects, so this file is a NO-OP on the current host.
#
# ✅  WHY IT EXISTS: the day the site moves to Netlify / Cloudflare Pages / Vercel
#     (which DO honour _redirects), every legacy URL keeps its SEO equity via a
#     real HTTP 301 — old handles, Shopify /products/ ad links, bq-* / rd-* ids,
#     /bouquet-builder, /mothers-day/<handle> — in both EN and ES (/es).
#
# Format (Netlify & Cloudflare Pages, identical):
#     /old-path   /new-path   301
# Vercel: translate 1:1 into vercel.json "redirects" (permanent: true).
# ───────────────────────────────────────────────────────────────────────────
`;

// Column-align the destination for readability.
const fromWidth = Math.max(...rules.map((r) => r.from.length), 0) + 2;
const body = rules
  .map((r) => `${r.from.padEnd(fromWidth)}${r.to}  301`)
  .join("\n");

const out = `${HEADER}\n${body}\n`;
const outPath = resolve(ROOT, "public/_redirects");
writeFileSync(outPath, out, "utf8");

// ───────────────────────── report ─────────────────────────

console.log(`[redirects] wrote ${outPath}`);
console.log(
  `[redirects] generated ${rules.length} 301 rules ` +
    `(bouquets=${Object.keys(bouquetSlugMap).length}, ` +
    `bq-ids=${Object.keys(bouquetIdToHandle).length}, ` +
    `roomDecors=${Object.keys(roomDecorHandleToId).length})`,
);
if (rules[0]) console.log(`[redirects] example: ${rules[0].from} -> ${rules[0].to} 301`);
