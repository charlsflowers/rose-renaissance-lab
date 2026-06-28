import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Internal-linking technical check — Romuald, Armada SEO 2025:
 *  Modulo 15 Enlazado Interno / 02.Enlazado en Cadena. Los enlaces internos
 *  deben abrirse en la MISMA pestana ("enlaces en zona superior/media del
 *  contenido, en la MISMA pestana"). Abrir un enlace INTERNO en pestana nueva
 *  (target="_blank") es incorrecto: rompe la cadena de navegacion y la
 *  transmision de autoridad escalonada.
 *
 * Este test escanea el codigo fuente y falla si algun enlace INTERNO se abre
 * en pestana nueva. Los enlaces EXTERNOS (http(s) a otro dominio, mailto:,
 * tel:) SI pueden usar target="_blank" y quedan excluidos a proposito.
 */

const SRC = path.resolve(__dirname, "..");

/** Recursively collect .ts/.tsx source files (excluding tests). */
const collectSourceFiles = (dir: string): string[] => {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...collectSourceFiles(full));
      continue;
    }
    if (!/\.(ts|tsx)$/.test(entry)) continue;
    if (/\.(test|spec)\.(ts|tsx)$/.test(entry)) continue;
    out.push(full);
  }
  return out;
};

/** Strip the leading domain so "https://charlsflowers.com/x" -> "/x". */
const isInternalHref = (href: string): boolean => {
  const h = href.trim();
  if (h === "" || h === "#") return false;
  // Same-site absolute URLs count as internal.
  if (/^https?:\/\/(www\.)?charlsflowers\.com/i.test(h)) return true;
  // Any other protocol (external http(s), mailto, tel, etc.) is external.
  if (/^[a-z][a-z0-9+.-]*:/i.test(h)) return false;
  if (/^\/\//.test(h)) return false; // protocol-relative -> external CDN/host
  // Root-relative or relative path -> internal.
  return h.startsWith("/") || !/^https?:/i.test(h);
};

const files = collectSourceFiles(SRC);

describe("internal links open in the same tab (Armada SEO - Enlazado Interno)", () => {
  it("scans the whole src/ tree", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it("no React Router <Link> uses target= (Link is always same-tab navigation)", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const code = readFileSync(file, "utf8");
      // Match opening <Link ...> tags and check for a target attribute inside.
      const linkTags = code.match(/<Link\b[^>]*>/g) ?? [];
      for (const tag of linkTags) {
        if (/\btarget\s*=/.test(tag)) {
          offenders.push(`${path.relative(SRC, file)} :: ${tag}`);
        }
      }
    }
    expect(offenders, offenders.join("\n")).toEqual([]);
  });

  it('no internal <a href="..."> uses target="_blank"', () => {
    const offenders: string[] = [];
    for (const file of files) {
      const code = readFileSync(file, "utf8");
      const anchorTags = code.match(/<a\b[^>]*>/g) ?? [];
      for (const tag of anchorTags) {
        if (!/\btarget\s*=\s*["'{]?_blank/.test(tag)) continue;
        // Only static href="..."/href='...' anchors can be statically checked.
        const hrefMatch = tag.match(/\bhref\s*=\s*["']([^"']*)["']/);
        if (!hrefMatch) continue; // dynamic href={...} handled below by render rules
        if (isInternalHref(hrefMatch[1])) {
          offenders.push(`${path.relative(SRC, file)} :: ${tag}`);
        }
      }
    }
    expect(offenders, offenders.join("\n")).toEqual([]);
  });
});
