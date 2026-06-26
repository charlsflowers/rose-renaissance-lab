#!/usr/bin/env node
/**
 * Static prerender pass — runs AFTER `vite build`.
 *
 * For every indexable route declared in `public/sitemap.xml` we:
 *   1. Serve `dist/` locally with a tiny static server (with SPA fallback).
 *   2. Open the route in headless Chromium.
 *   3. Wait for React + react-helmet-async to mount and inject
 *      <title>, <meta>, <link rel="canonical">, hreflang, JSON-LD, the H1
 *      and the on-page copy.
 *   4. Mark `<div id="root">` with `data-prerendered="true"` so the runtime
 *      bundle calls `hydrateRoot` instead of throwing the SSR markup away.
 *   5. Write the resulting HTML to `dist/<route>/index.html`.
 *
 * Hosting (Netlify-style `_redirects` with `/*  /index.html  200` as the
 * LAST rule) serves any matching physical file BEFORE applying the SPA
 * fallback, so these files are what crawlers see on first request.
 *
 * Robustness rules:
 * - We never fail the build if prerender fails for a single route — we log
 *   the error and keep going so the deploy still ships.
 * - We use the Chromium that ships with the sandbox (env override available)
 *   so we don't pay the 170 MB download cost on every build.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, readdirSync } from "node:fs";
import { resolve, dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITEMAP = resolve(DIST, "sitemap.xml");
const PORT = 4179;

// ─────────────────── Chromium discovery ───────────────────
function findChromium() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    "/bin/chromium",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
  ];
  for (const p of candidates) if (existsSync(p)) return p;
  return undefined; // puppeteer will fall back to its bundled download (may be absent)
}

// ─────────────────── route list ───────────────────
if (!existsSync(SITEMAP)) {
  console.warn("[prerender] dist/sitemap.xml missing — skipping prerender.");
  process.exit(0);
}
const xml = readFileSync(SITEMAP, "utf8");
const BASE = "https://www.charlsflowers.com";
const locMatches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const routes = [...new Set(locMatches.map((u) => u.replace(BASE, "") || "/"))];
console.log(`[prerender] ${routes.length} routes from sitemap`);

// ─────────────────── static server with SPA fallback ───────────────────
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const server = createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  let filePath = join(DIST, urlPath);
  try {
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      // serve as-is
    } else {
      // SPA fallback for unknown routes — serve dist/index.html
      filePath = join(DIST, "index.html");
    }
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(readFileSync(filePath));
  } catch (err) {
    res.writeHead(500);
    res.end(String(err));
  }
});

await new Promise((r) => server.listen(PORT, r));

// ─────────────────── puppeteer ───────────────────
const execPath = findChromium();
console.log(`[prerender] chromium: ${execPath ?? "(puppeteer bundled)"}`);

let browser;
try {
  browser = await puppeteer.launch({
    headless: "new",
    executablePath: execPath,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
} catch (err) {
  console.error("[prerender] Failed to launch Chromium:", err.message);
  console.error("[prerender] Skipping prerender — falling back to SPA-only HTML.");
  server.close();
  process.exit(0);
}

let ok = 0;
let skipped = 0;
const failed = [];

async function snapshot(route) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  // Block heavy 3rd-party (Shopify CDN images, GA/Meta) so the snapshot is fast
  // and doesn't depend on external uptime. We still let our own JS run.
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const url = req.url();
    const type = req.resourceType();
    if (type === "image" || type === "media" || type === "font") return req.abort();
    if (
      url.includes("googletagmanager.com") ||
      url.includes("google-analytics.com") ||
      url.includes("facebook.net") ||
      url.includes("connect.facebook") ||
      url.includes("klaviyo.com") ||
      url.includes("doubleclick.net")
    ) return req.abort();
    req.continue();
  });
  // Surface in-page errors without failing the build.
  page.on("pageerror", (err) => console.warn(`  [pageerror ${route}] ${err.message}`));

  try {
    await page.goto(`http://localhost:${PORT}${route}`, {
      waitUntil: "networkidle0",
      timeout: 30_000,
    });
    // Give Helmet + lazy components one extra microtask tick.
    await new Promise((r) => setTimeout(r, 400));

    // Mark the root so the client hydrates instead of re-rendering.
    await page.evaluate(() => {
      const r = document.getElementById("root");
      if (r) r.setAttribute("data-prerendered", "true");
    });

    const html = "<!doctype html>\n" + (await page.content()).replace(/^<!doctype[^>]*>\s*/i, "");

    // Write to dist/<route>/index.html — `/` overwrites the root index.
    const outDir = route === "/" ? DIST : join(DIST, route);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "index.html"), html, "utf8");
    ok++;
  } catch (err) {
    failed.push({ route, error: err.message });
  } finally {
    await page.close();
  }
}

// Concurrency-limited loop (4 parallel).
const CONCURRENCY = 4;
let cursor = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < routes.length) {
      const i = cursor++;
      const r = routes[i];
      if ((i + 1) % 25 === 0) console.log(`[prerender] ${i + 1}/${routes.length}`);
      await snapshot(r);
    }
  }),
);

await browser.close();
server.close();

console.log(`[prerender] done: ok=${ok} failed=${failed.length} skipped=${skipped}`);
if (failed.length) {
  console.log("[prerender] failed routes (first 10):");
  failed.slice(0, 10).forEach((f) => console.log(`  ${f.route} → ${f.error}`));
}

// Never fail the build because of prerender errors.
process.exit(0);