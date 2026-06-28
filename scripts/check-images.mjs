#!/usr/bin/env node
/**
 * Image weight + format guard (SEO / page-speed).
 *
 * Romuald — Armada SEO 2025:
 *  - Modulo 06 Plugins / 11.Otras optimizaciones: "convertir tus imagenes...
 *    directamente a webp, el formato que en principio google otorga como mejor...
 *    es un formato que pesa menos".
 *  - Directos / 05.Imagenes: las imagenes "menos de 100 kilobytes" (idealmente
 *    mucho menos, 10-20 KB cuando se puede).
 *
 * So: every raster image we ship from the repo (src/assets + public) must be a
 * real WebP and weigh < 100 KB. This script FAILS the build if either rule is
 * broken, so a future oversized or wrong-format image can't slip in.
 *
 * It does NOT touch image bytes — it only verifies. To fix an offender, resize
 * / re-encode it to WebP (e.g. ffmpeg -c:v libwebp) and keep it under the limit.
 *
 * Runs as part of `npm run build`.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve, join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Hard limit from the formation: 100 KB per image.
const MAX_BYTES = 100 * 1024;

// Raster extensions we serve directly. SVG (vector) and ICO (favicon) are exempt.
const RASTER_EXT = new Set([".webp", ".png", ".jpg", ".jpeg", ".gif"]);

// Folders to scan for shipped images.
const SCAN_DIRS = ["src/assets", "public"];

// Exempt: favicons / touch icons are required as PNG/ICO by browsers and are
// not page-speed content images, so the WebP rule does not apply to them.
const EXEMPT_NAME = /^favicon\.(png|ico)$/i;

/** Read the first bytes and decide the real image format from magic numbers. */
function realFormat(buf) {
  if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (buf.length >= 8 && buf.toString("ascii", 1, 4) === "PNG") return "png";
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf.length >= 6 && buf.toString("ascii", 0, 3) === "GIF") return "gif";
  return "unknown";
}

function walk(dir, out) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // dir may not exist in some checkouts
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      walk(full, out);
    } else if (RASTER_EXT.has(extname(e.name).toLowerCase()) && !EXEMPT_NAME.test(e.name)) {
      out.push(full);
    }
  }
}

const files = [];
for (const d of SCAN_DIRS) walk(resolve(ROOT, d), files);

const tooHeavy = [];
const wrongFormat = [];

for (const f of files) {
  const rel = relative(ROOT, f);
  const size = statSync(f).size;
  const buf = readFileSync(f).subarray(0, 16);
  const fmt = realFormat(buf);
  const ext = extname(f).toLowerCase();

  // Format rule: ship WebP. A .webp that is secretly PNG/JPEG is the worst case.
  if (ext === ".webp" && fmt !== "webp") {
    wrongFormat.push(`${rel} — extension is .webp but bytes are ${fmt.toUpperCase()} (re-encode to real WebP)`);
  } else if (ext !== ".webp") {
    wrongFormat.push(`${rel} — ${fmt.toUpperCase()} should be converted to WebP (lighter, preferred by Google)`);
  }

  // Weight rule: under 100 KB.
  if (size > MAX_BYTES) {
    tooHeavy.push(`${rel} — ${(size / 1024).toFixed(0)} KB (limit ${MAX_BYTES / 1024} KB)`);
  }
}

if (tooHeavy.length === 0 && wrongFormat.length === 0) {
  console.log(`[check-images] OK — ${files.length} images, all WebP and < 100 KB.`);
  process.exit(0);
}

console.error("[check-images] FAILED:");
if (wrongFormat.length) {
  console.error("\n  Wrong format (must be WebP):");
  for (const m of wrongFormat) console.error(`   - ${m}`);
}
if (tooHeavy.length) {
  console.error("\n  Over weight (must be < 100 KB):");
  for (const m of tooHeavy) console.error(`   - ${m}`);
}
console.error("\n  Fix: re-encode with WebP and resize to display size, e.g.:");
console.error("    ffmpeg -i in.png -vf \"scale='min(640,iw)':-1\" -c:v libwebp -quality 75 out.webp");
process.exit(1);
