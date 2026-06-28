#!/usr/bin/env node
/**
 * Active indexing push via IndexNow.
 *
 * The checklist only GENERATES + DECLARES the sitemap (scripts/generate-sitemap.mjs
 * + robots.txt). It does NOT actively push indexation. This script closes that gap.
 *
 * Romuald — Armada SEO 2025:
 *  - Modulo 19 Avanzado / 6.introduccion-indexacion: "forzar indexacion de cada
 *    URL nueva (GSC -> Inspeccionar URL -> Solicitar indexacion). Maximo ~10 URLs/dia;
 *    para volumen grande, IndexNow (hasta 10.000)."
 *  - Modulo 07 GSC / 03.tour-google-search-console: "Inspeccionar URL ... permite
 *    solicitar indexacion manual" (el limite ~10/dia es para el boton de GSC).
 *
 * Two complementary channels:
 *   1) BATCH (this script): IndexNow notifies Bing/Yandex/Seznam (and feeds Google's
 *      ecosystem) of up to 10.000 URLs in one request — for new/changed pages in bulk.
 *   2) MANUAL 10/dia (GSC): for the most important new URLs, the human still does
 *      GSC -> Inspeccionar URL -> Solicitar indexacion (max ~10/dia). This script
 *      prints the top URLs to copy-paste into that flow.
 *
 * Reads:  public/sitemap.xml  (must be built first: `npm run sitemap`)
 * Key:    public/<INDEXNOW_KEY>.txt  (already committed; verifies host ownership)
 *
 * Usage:
 *   npm run indexnow            # submit ALL sitemap URLs to IndexNow
 *   npm run indexnow -- --dry   # parse + report only, do NOT POST
 *
 * NOT part of `npm run build` on purpose: indexing should be pushed when content
 * actually changes, not on every CI build (avoids spamming the IndexNow endpoint).
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const HOST = "www.charlsflowers.com";
const KEY = "babbb289b2c2434d8163433109a70015";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

// Per the formation: IndexNow accepts up to 10.000 URLs per submission.
const MAX_PER_REQUEST = 10000;
// GSC manual "Solicitar indexacion" limit per the formation: ~10 URLs/dia.
const GSC_DAILY_LIMIT = 10;

const DRY = process.argv.includes("--dry");

// ───────────────────────── read sitemap ─────────────────────────

let xml;
try {
  xml = readFileSync(resolve(ROOT, "public/sitemap.xml"), "utf8");
} catch {
  console.error("[indexnow] public/sitemap.xml not found — run `npm run sitemap` first.");
  process.exit(1);
}

// Extract every <loc> (EN + ES). Both should be indexed, so both get pushed.
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.length === 0) {
  console.error("[indexnow] No <loc> entries parsed from sitemap.xml — aborting.");
  process.exit(1);
}

// IndexNow requires every URL to belong to the same host as the key file.
const offHost = urls.filter((u) => !u.startsWith(`https://${HOST}`));
if (offHost.length > 0) {
  console.error(`[indexnow] ${offHost.length} URL(s) are off-host (expected https://${HOST}). First: ${offHost[0]}`);
  process.exit(1);
}

// ───────────────────────── GSC manual top-10 hint ─────────────────────────
// Priority order in the sitemap already reflects importance; surface the first
// GSC_DAILY_LIMIT homepage/collection-level URLs for the manual 10/dia push.
const manualTop = urls.slice(0, GSC_DAILY_LIMIT);
console.log(`[indexnow] GSC manual push (max ~${GSC_DAILY_LIMIT}/dia) — paste these into Search Console -> Inspeccionar URL -> Solicitar indexacion:`);
for (const u of manualTop) console.log(`           ${u}`);

// ───────────────────────── batch submit ─────────────────────────

const batches = [];
for (let i = 0; i < urls.length; i += MAX_PER_REQUEST) {
  batches.push(urls.slice(i, i + MAX_PER_REQUEST));
}

console.log(`[indexnow] ${urls.length} URL(s) in ${batches.length} batch(es) of up to ${MAX_PER_REQUEST}.`);

if (DRY) {
  console.log("[indexnow] --dry: not submitting. Sample URLs:");
  for (const u of urls.slice(0, 5)) console.log(`           ${u}`);
  process.exit(0);
}

let ok = 0;
for (let b = 0; b < batches.length; b++) {
  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batches[b] };
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    // IndexNow returns 200 (accepted) or 202 (accepted, validation pending).
    if (res.status === 200 || res.status === 202) {
      ok++;
      console.log(`[indexnow] batch ${b + 1}/${batches.length}: ${res.status} OK (${batches[b].length} URLs)`);
    } else {
      console.warn(`[indexnow] batch ${b + 1}/${batches.length}: HTTP ${res.status} — ${await res.text()}`);
    }
  } catch (err) {
    console.warn(`[indexnow] batch ${b + 1}/${batches.length}: error ${err.message}`);
  }
}

console.log(`[indexnow] done — ${ok}/${batches.length} batch(es) accepted.`);
if (ok !== batches.length) process.exit(1);
