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
import { homedir } from "node:os";
import puppeteer from "puppeteer-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITEMAP = resolve(DIST, "sitemap.xml");
const PORT = 4179;

// ─────────────────── Chromium discovery ───────────────────
//
// Two worlds:
//   • Netlify / any Linux CI build → @sparticuz/chromium ships a self-contained
//     Chromium that runs WITHOUT system libraries (this is what was missing: the
//     old code looked for /usr/bin/chromium, never found it, launch threw, and
//     the build silently shipped a single empty index.html).
//   • Local dev (macOS / Windows / Linux-with-Chrome) → use a real installed
//     Chrome or the one Puppeteer cached under ~/.cache/puppeteer.
//
// PUPPETEER_EXECUTABLE_PATH overrides everything (escape hatch).

// Look up a Chrome/Chromium already present on the machine (local dev).
function findLocalChrome() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/bin/chromium",
  ];
  for (const p of candidates) if (existsSync(p)) return p;
  return findPuppeteerCacheChrome();
}

// Puppeteer downloads Chrome for Testing into ~/.cache/puppeteer/chrome/<rev>/…
// Since we no longer depend on the full `puppeteer` package, reuse whatever it
// cached previously so local prerender still works out of the box.
function findPuppeteerCacheChrome() {
  const base = process.env.PUPPETEER_CACHE_DIR || join(homedir(), ".cache", "puppeteer", "chrome");
  if (!existsSync(base)) return undefined;
  for (const rev of readdirSync(base)) {
    const dir = join(base, rev);
    const macArm = join(dir, "chrome-mac-arm64", "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing");
    if (existsSync(macArm)) return macArm;
    const macX64 = join(dir, "chrome-mac-x64", "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing");
    if (existsSync(macX64)) return macX64;
    for (const sub of ["chrome-linux64", "chrome-linux"]) {
      const linBin = join(dir, sub, "chrome");
      if (existsSync(linBin)) return linBin;
    }
  }
  return undefined;
}

// Launch a browser that actually works in the current environment.
async function launchBrowser() {
  const BASE_ARGS = ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"];

  // (1) Linux build (Netlify) → full puppeteer's downloaded Chrome-for-Testing.
  //     Netlify's build image is Ubuntu (NOT AWS Lambda), where @sparticuz/chromium
  //     does not launch. Full `puppeteer` ships a Chrome built for this OS and is the
  //     reliable path here; @sparticuz is kept only as a last-resort fallback.
  if (process.platform === "linux" && !process.env.PUPPETEER_EXECUTABLE_PATH) {
    try {
      const pptr = (await import("puppeteer")).default;
      const execPath = pptr.executablePath();
      if (execPath && existsSync(execPath)) {
        console.log(`[prerender] chromium: puppeteer (${execPath})`);
        return puppeteer.launch({ executablePath: execPath, args: BASE_ARGS, headless: "new" });
      }
      console.warn("[prerender] puppeteer Chrome path missing; launching via full puppeteer directly");
      return pptr.launch({ args: BASE_ARGS, headless: "new" });
    } catch (err) {
      console.error("[prerender] full puppeteer failed, trying @sparticuz/chromium:", err.message);
      const { default: chromium } = await import("@sparticuz/chromium");
      const executablePath = await chromium.executablePath();
      console.log(`[prerender] chromium: @sparticuz/chromium (${executablePath})`);
      return puppeteer.launch({
        executablePath,
        args: [...chromium.args, "--disable-dev-shm-usage"],
        headless: chromium.headless,
        defaultViewport: { width: 1280, height: 800 },
      });
    }
  }

  // (2) Local dev → real installed / cached Chrome.
  const execPath = findLocalChrome();
  if (!execPath) {
    throw new Error(
      "No Chrome/Chromium found. Set PUPPETEER_EXECUTABLE_PATH to a Chrome binary, " +
        "or run `npx @puppeteer/browsers install chrome` once.",
    );
  }
  console.log(`[prerender] chromium: ${execPath}`);
  return puppeteer.launch({ executablePath: execPath, args: BASE_ARGS, headless: "new" });
}

// ─────────────────── route list ───────────────────
if (!existsSync(SITEMAP)) {
  console.warn("[prerender] dist/sitemap.xml missing — skipping prerender.");
  process.exit(0);
}
const xml = readFileSync(SITEMAP, "utf8");
const locMatches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
// Domain-agnostic: take the pathname of each <loc> so it works whether the
// sitemap is www or apex. (The sitemap migrated to sin-www; the old hardcoded
// BASE "https://www.charlsflowers.com" no longer matched → every route stayed
// an absolute URL → "Cannot navigate to invalid URL" → prerender produced
// nothing.)
const routes = [...new Set(locMatches.map((u) => {
  try {
    return new URL(u).pathname || "/";
  } catch {
    return u.replace(/^https?:\/\/[^/]+/, "") || "/";
  }
}))];
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
let browser;
try {
  browser = await launchBrowser();
} catch (err) {
  console.error("[prerender] Failed to launch Chromium:", err.message);
  console.error("[prerender] FAILING the build on purpose — never ship an empty SPA shell that Googlebot can't read.");
  server.close();
  process.exit(1);
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
      waitUntil: "networkidle2",
      timeout: 45_000,
    });
    // Give Helmet + lazy components time to mount, then wait two animation
    // frames — react-helmet-async batches head mutations via requestAnimationFrame,
    // so without this the snapshot misses canonical/hreflang/JSON-LD.
    await new Promise((r) => setTimeout(r, 1200));
    await page.evaluate(
      () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
    );

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

// Concurrency-limited loop. 344 routes at 4 parallel took ~10 min and risked
// blowing Netlify's build-time limit; 8 halves the wall time (images/media/
// fonts are blocked so each tab is light). Override with PRERENDER_CONCURRENCY.
const CONCURRENCY = Number(process.env.PRERENDER_CONCURRENCY) || 8;
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

// Retry routes that failed on the first pass (transient timeouts, e.g. the heavy
// home page with its hero video) with a fresh attempt before giving up.
if (failed.length) {
  const retry = failed.splice(0, failed.length).map((f) => f.route);
  console.log(`[prerender] retrying ${retry.length} failed route(s)...`);
  for (const r of retry) await snapshot(r);
}

await browser.close();
server.close();

console.log(`[prerender] done: ok=${ok} failed=${failed.length} skipped=${skipped}`);
if (failed.length) {
  console.log("[prerender] failed routes (first 10):");
  failed.slice(0, 10).forEach((f) => console.log(`  ${f.route} → ${f.error}`));
}

// Fail the build if NOTHING prerendered — this is the exact bug we're killing:
// a green build that silently ships one empty SPA shell Googlebot can't read.
if (ok === 0) {
  console.error("[prerender] 0 pages prerendered — FAILING build so we never ship an empty shell.");
  process.exit(1);
}

process.exit(0);