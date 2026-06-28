#!/usr/bin/env node
/**
 * Crawl-budget maintenance guard.
 *
 * The checklist has 301s for legacy URLs but no CONTINUOUS maintenance of 404s
 * / redirect chains, and no crawl-budget concept. This script enforces both so
 * the bot spends its budget on the good URLs, not on chains, loops or noindex.
 *
 * Romuald — Armada SEO 2025:
 *  - Modulo 32 Web Rango S / 11.analisis-on-page: webs descuidadas acumulan
 *    "1000+ 404s" y "34.000 redirecciones en cadena" + profundidad de rastreo
 *    excesiva — todo eso quema presupuesto de rastreo.
 *  - Modulo 32 / 08.link-outreach: "subir el crawl budget" y "capar por robots /
 *    desindexar sin-content" para que el bot no gaste presupuesto en URLs malas.
 *  - Biblia Universal §9.6 Crawl budget: detectar 404 y redirecciones EN CADENA;
 *    no dejar morir PageRank en callejones.
 *
 * Checks (against the build artefacts, no live crawl):
 *   1) Redirect CHAINS in public/_redirects: a 301 target that is itself the
 *      source of another 301 (A->B, B->C). Chains waste crawl budget and dilute
 *      PageRank — they must be flattened to A->C directly.
 *   2) Redirect LOOPS: A->A or A->B->A.
 *   3) Redirect target = 404 / not a real path: a 301 pointing to a destination
 *      that is neither in the sitemap nor itself a redirect source (likely 404).
 *   4) Sitemap URLs that are ALSO a 301 source: we'd be advertising a URL in the
 *      sitemap that immediately redirects — the bot wastes a hop on every crawl.
 *
 * Runs as part of `npm run build` (after redirects + sitemap are generated), so a
 * future chain / 404 / self-redirect can't slip in. FAILS the build on any issue.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const read = (rel) => readFileSync(resolve(ROOT, rel), "utf8");

// ─────────────────── parse _redirects ───────────────────
let redirectsTxt;
try {
  redirectsTxt = read("public/_redirects");
} catch {
  console.error("[crawl-budget] public/_redirects not found — run `npm run redirects` first.");
  process.exit(1);
}

/** @type {{from: string, to: string}[]} */
const rules = [];
for (const line of redirectsTxt.split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  // "from   to   301"  (the SPA fallback "/*  /index.html  200" is ignored)
  const parts = t.split(/\s+/);
  if (parts.length < 3) continue;
  const [from, to, code] = parts;
  if (code !== "301") continue;
  rules.push({ from, to });
}

const redirectFrom = new Map(rules.map((r) => [r.from, r.to]));

// ─────────────────── parse sitemap (the "good" URLs) ───────────────────
let sitemap = "";
try {
  sitemap = read("public/sitemap.xml");
} catch {
  console.error("[crawl-budget] public/sitemap.xml not found — run `npm run sitemap` first.");
  process.exit(1);
}
const sitemapPaths = new Set(
  [...sitemap.matchAll(/<loc>https:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || "/"),
);

// ─────────────────── checks ───────────────────
const chains = [];
const loops = [];
const toMissing = [];
const sitemapRedirects = [];

for (const { from, to } of rules) {
  // (2) direct loop
  if (from === to) {
    loops.push(`${from} -> itself`);
    continue;
  }
  // (1) chain: the target is itself a redirect source
  if (redirectFrom.has(to)) {
    const next = redirectFrom.get(to);
    if (next === from) loops.push(`${from} -> ${to} -> ${from}`);
    else chains.push(`${from} -> ${to} -> ${next}  (flatten to ${from} -> ${next})`);
    continue;
  }
  // (3) target not in sitemap and not a known redirect source => probably a 404
  if (!sitemapPaths.has(to) && !redirectFrom.has(to)) {
    toMissing.push(`${from} -> ${to}  (target not in sitemap → verify it is not a 404)`);
  }
}

// (4) sitemap URL that is also a redirect source
for (const p of sitemapPaths) {
  if (redirectFrom.has(p)) sitemapRedirects.push(`${p} -> ${redirectFrom.get(p)}  (in sitemap AND redirected — drop from sitemap or stop redirecting)`);
}

// ─────────────────── report ───────────────────
const total = chains.length + loops.length + toMissing.length + sitemapRedirects.length;
console.log(`[crawl-budget] parsed ${rules.length} 301 rule(s), ${sitemapPaths.size} sitemap path(s).`);

const section = (title, items) => {
  if (!items.length) return;
  console.log(`[crawl-budget] ${title} (${items.length}):`);
  for (const i of items) console.log(`               - ${i}`);
};
section("REDIRECT CHAINS", chains);
section("REDIRECT LOOPS", loops);
section("301 TARGET LIKELY 404", toMissing);
section("SITEMAP URL ALSO REDIRECTED", sitemapRedirects);

if (total === 0) {
  console.log("[crawl-budget] OK — no chains, loops, dead targets or self-redirected sitemap URLs. Crawl budget clean.");
  process.exit(0);
}

console.error(`[crawl-budget] FAIL — ${total} crawl-budget issue(s). Fix to stop the bot wasting budget.`);
process.exit(1);
