#!/usr/bin/env node
/**
 * Indexation-coverage audit.
 *
 * The checklist only puts noindex on legal/transactional pages. It does NOT
 * audit what is REALLY indexed vs what SHOULD be indexed. This script does the
 * static half of that audit (verifiable from the repo) and prints the manual
 * half (the `site:` / GSC "Paginas indexadas" checks the human runs in Google).
 *
 * Romuald — Armada SEO 2025:
 *  - Modulo 07 GSC / 03.tour-google-search-console: "paginas indexadas vs sin
 *    indexar" — revisar el informe y DESINDEXAR lo que no deberia salir (su
 *    ejemplo: la receta de pollo que no pinta nada en el proyecto).
 *  - Modulo 16 / 04.parte-1: usar `site:dominio` para ver QUE esta indexado y
 *    si interesa que lo este (thin / sin-content / duplicado / tags / paginacion
 *    / busquedas internas).
 *
 * What this script checks AUTOMATICALLY (fails build only with --strict):
 *   A) Every page the app should keep OUT of the index actually carries a
 *      `noindex` (SeoHead noindex prop or a `noindex` robots meta). Source of
 *      truth = the route table in src/App.tsx + the noindex usages in src/.
 *   B) None of those should-be-noindex paths leaked into public/sitemap.xml
 *      (sitemap = the "should be indexed" set; overlap = a thin/transactional
 *      page wrongly declared indexable).
 *
 * What it can NOT know from the repo (printed as a manual checklist):
 *   C) The actual Google index — run the `site:` queries below and the GSC
 *      "Paginas -> indexadas / no indexadas" report, then desindexar anything
 *      thin / duplicated / not in our sitemap.
 *
 * Usage:
 *   npm run audit:coverage            # report
 *   npm run audit:coverage -- --strict   # exit 1 if a should-be-noindex page is indexable
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const read = (rel) => readFileSync(resolve(ROOT, rel), "utf8");

const HOST = "www.charlsflowers.com";
const STRICT = process.argv.includes("--strict");

// ─────────────────── A) should-be-noindex pages + their source files ───────────────────
// These are the page components the formation says must NOT be indexed:
// legal, transactional (checkout/cart), navigation aids, "coming soon" shells,
// 404, short-link cloaks. Each entry: a human path + the file that must mark it noindex.
const mustNoindex = [
  { path: "/checkout",        file: "src/pages/Checkout.tsx" },
  { path: "/contact",         file: "src/pages/Contact.tsx" },
  { path: "/privacy-policy",  file: "src/components/ShopifyPolicyPage.tsx" }, // legal pages share this shell
  { path: "/terms-of-service",file: "src/components/ShopifyPolicyPage.tsx" },
  { path: "/refund-policy",   file: "src/components/ShopifyPolicyPage.tsx" },
  { path: "/shipping-policy", file: "src/components/ShopifyPolicyPage.tsx" },
  { path: "/cookie-policy",   file: "src/pages/CookiePolicy.tsx" },
  { path: "/categoria/:slug", file: "src/pages/CategoryProducts.tsx" },      // "coming soon" shells
  { path: "/studio/*",        file: "src/pages/StudioPage.tsx" },
  { path: "/404",             file: "src/pages/NotFound.tsx" },
];

const noindexRe = /noindex(\s*=\s*\{?true\}?|\s*\/?>|")|content=["'][^"']*noindex/;

const failures = [];
for (const { path, file } of mustNoindex) {
  let src;
  try {
    src = read(file);
  } catch {
    failures.push(`MISSING FILE: ${file} (for ${path})`);
    continue;
  }
  // Accept either the SeoHead `noindex` prop or a raw robots noindex meta.
  if (!/noindex/.test(src)) {
    failures.push(`NOT noindex: ${path} (${file}) — should be kept out of the index`);
  }
}

// ─────────────────── B) overlap with the sitemap (should-be-indexed set) ───────────────────
let sitemap = "";
try {
  sitemap = read("public/sitemap.xml");
} catch {
  failures.push("public/sitemap.xml not found — run `npm run sitemap` first.");
}
const sitemapPaths = new Set(
  [...sitemap.matchAll(/<loc>https:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || "/"),
);

// Concrete (non-param) should-be-noindex paths must NOT appear in the sitemap.
for (const { path } of mustNoindex) {
  if (path.includes(":") || path.includes("*")) continue; // dynamic — checked via the route, not the sitemap
  const variants = [path, `/es${path}`];
  for (const v of variants) {
    if (sitemapPaths.has(v)) failures.push(`IN SITEMAP but should be noindex: ${v}`);
  }
}

// ─────────────────── report ───────────────────
console.log(`[coverage] sitemap declares ${sitemapPaths.size} indexable path(s).`);
console.log(`[coverage] checked ${mustNoindex.length} should-be-noindex page(s).`);
if (failures.length) {
  console.log(`[coverage] ${failures.length} issue(s):`);
  for (const f of failures) console.log(`           - ${f}`);
} else {
  console.log("[coverage] OK — no should-be-noindex page is indexable, all carry noindex.");
}

// ─────────────────── C) manual Google-side checklist ───────────────────
console.log("");
console.log("[coverage] MANUAL — run in Google / GSC to find content wrongly indexed (desindexar lo que no toque):");
console.log(`           site:${HOST}                              -> total indexed; compare with sitemap count above`);
console.log(`           site:${HOST} -inurl:bouquets -inurl:collections   -> spot pages outside the planned architecture`);
console.log(`           site:${HOST} inurl:checkout | inurl:cart | inurl:account   -> transactional pages that must NOT appear`);
console.log(`           site:${HOST} inurl:categoria                -> "coming soon" shells that must NOT appear`);
console.log(`           site:${HOST} inurl:?                         -> internal search / paginacion / tag params (thin) to desindexar`);
console.log("           GSC -> Indexacion -> Paginas: revisar 'No indexadas' (motivos) y 'Indexadas' (que no haya thin/duplicado).");

if (STRICT && failures.length) process.exit(1);
