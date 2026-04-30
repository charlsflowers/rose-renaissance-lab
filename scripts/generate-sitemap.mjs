#!/usr/bin/env node
/**
 * Auto-generate public/sitemap.xml at build time.
 *
 * Reads:
 *  - src/lib/catalogData.ts        -> bouquetProducts (shopifyHandle)
 *  - src/lib/landingPagesData.ts   -> landingPages (slug)
 *  - src/lib/blogData.tsx          -> blogArticles (slug)
 *  - src/lib/roomDecorData.ts      -> roomDecorPackages (id)
 *
 * Excludes:
 *  - Private routes: /checkout, /cart, /account, /admin
 *  - "Coming Soon" category routes (/categoria/:slug for all `categories`)
 *  - Dynamic redirect routes (/products/:handle, old /bouquets/:type/bq-*)
 *
 * Notes:
 *  - Legal pages are KEPT (matches the previous manual sitemap behaviour),
 *    with low priority (0.4), as requested by the audit prompt.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const BASE_URL = "https://www.charlsflowers.com";
const TODAY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// ───────────────────────── helpers ─────────────────────────

const read = (rel) => readFileSync(resolve(ROOT, rel), "utf8");

/** Extract every value of a given key from a TS source: `key: 'value'` or `key: "value"` */
const extractStringField = (src, key) => {
  const re = new RegExp(`\\b${key}\\s*:\\s*['"\`]([^'"\`]+)['"\`]`, "g");
  const out = new Set();
  let m;
  while ((m = re.exec(src)) !== null) out.add(m[1]);
  return [...out];
};

// ───────────────────────── data sources ─────────────────────────

const catalogSrc   = read("src/lib/catalogData.ts");
const landingSrc   = read("src/lib/landingPagesData.ts");
const roomDecorSrc = read("src/lib/roomDecorData.ts");

// All category slugs (ALL of them are currently "Coming Soon" — excluded from sitemap)
const categorySlugs = extractStringField(
  catalogSrc.split("export const categoryProducts")[0], // only the `categories` array
  "slug",
);

const bouquetHandles  = extractStringField(catalogSrc, "shopifyHandle");
const landingSlugs    = extractStringField(landingSrc, "slug");
const roomDecorIds    = extractStringField(
  roomDecorSrc.split("export const roomDecorPackages")[1] ?? "",
  "id",
);

// Fetch published blog post slugs from Sanity at build time
const SANITY_PROJECT_ID = "8326wvly";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";

let blogSlugs = [];
try {
  const groq = encodeURIComponent(
    `*[_type == "post" && defined(slug.current) && (!defined(language) || language == "en")].slug.current`,
  );
  const url = `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${groq}`;
  const res = await fetch(url);
  if (res.ok) {
    const json = await res.json();
    blogSlugs = Array.isArray(json.result) ? json.result.filter((s) => typeof s === "string") : [];
    console.log(`[sitemap] fetched ${blogSlugs.length} blog slug(s) from Sanity`);
  } else {
    console.warn(`[sitemap] Sanity fetch failed (${res.status}); blog posts will be omitted`);
  }
} catch (err) {
  console.warn(`[sitemap] Sanity fetch error: ${err.message}; blog posts will be omitted`);
}

// ───────────────────────── url builder ─────────────────────────

/** @type {{loc: string, changefreq: string, priority: string}[]} */
const urls = [];
const seen = new Set();
const push = (path, changefreq, priority) => {
  const loc = `${BASE_URL}${path}`;
  if (seen.has(loc)) return;
  seen.add(loc);
  urls.push({ loc, changefreq, priority });
};

// 1. Static main routes (priority 1.0 / 0.8 / 0.4)
push("/",                       "weekly",  "1.0");
push("/bouquets",               "weekly",  "0.8");
push("/bouquets/personalizar",  "monthly", "0.8");
push("/room-decors",            "weekly",  "0.8");
push("/about",                  "monthly", "0.4");
push("/contact",                "monthly", "0.4");
push("/delivery",               "monthly", "0.4");
push("/faq",                    "monthly", "0.4");
push("/blog",                   "weekly",  "0.6");
push("/sitemap",                "monthly", "0.4");

// Legal pages (kept, low priority)
push("/privacy-policy",   "monthly", "0.4");
push("/terms-of-service", "monthly", "0.4");
push("/refund-policy",    "monthly", "0.4");
push("/shipping-policy",  "monthly", "0.4");
push("/cookie-policy",    "monthly", "0.4");

// 2. Bouquet products (priority 0.8)
for (const handle of bouquetHandles) {
  push(`/bouquets/all/${handle}`, "weekly", "0.8");
}

// 3. Room decor packages (priority 0.8)
for (const id of roomDecorIds) {
  push(`/room-decors/${id}`, "weekly", "0.8");
}

// 4. Landing pages (priority 0.6)
for (const slug of landingSlugs) {
  push(`/${slug}`, "weekly", "0.6");
}

// 5. Blog posts (priority 0.6)
for (const slug of blogSlugs) {
  push(`/blog/${slug}`, "weekly", "0.6");
}

// NOTE: Category routes (/categoria/:slug) are intentionally excluded —
// they are all "Coming Soon" placeholders and marked noindex in the page itself.
void categorySlugs;

// ───────────────────────── render xml ─────────────────────────

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url>\n` +
        `    <loc>${u.loc}</loc>\n` +
        `    <lastmod>${TODAY}</lastmod>\n` +
        `    <changefreq>${u.changefreq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        `  </url>`,
    )
    .join("\n") +
  `\n</urlset>\n`;

const outPath = resolve(ROOT, "public/sitemap.xml");
writeFileSync(outPath, xml, "utf8");

// ───────────────────────── report ─────────────────────────

const counts = {
  total: urls.length,
  bouquets: bouquetHandles.length,
  landings: landingSlugs.length,
  blog: blogSlugs.length,
  roomDecors: roomDecorIds.length,
  excludedCategories: categorySlugs.length,
};
console.log(`[sitemap] wrote ${outPath}`);
console.log(`[sitemap] urls=${counts.total} bouquets=${counts.bouquets} landings=${counts.landings} blog=${counts.blog} roomDecors=${counts.roomDecors} (excluded comingSoon categories=${counts.excludedCategories})`);