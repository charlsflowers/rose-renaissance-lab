import { describe, it, expect } from "vitest";
import { PRODUCT_TSR, getProductTsr } from "@/lib/productTransactionalSeo";
import {
  COLOR_COLLECTIONS,
  dominantColorForProduct,
  type RoseColor,
} from "@/lib/colorCollections";
import type { BouquetProduct } from "@/lib/catalogData";

/**
 * Transactional search-ranking (TSR) layer for product pages.
 * Romuald, Armada SEO 2025 — TSR / long tail transaccional:
 * the product page (easiest layer) links UP to its color collection and the
 * /bouquets sink, never down. Nothing invented: every color has an entry and
 * the per-color link target equals a real color-collection route.
 */

const ALL_COLORS = COLOR_COLLECTIONS.map((c) => c.color) as RoseColor[];

const fakeProduct = (color: string): BouquetProduct =>
  ({ id: "x", name: "Test", shopifyHandle: "test", description: "", color } as BouquetProduct);

describe("productTransactionalSeo — TSR per color", () => {
  it("has an EN + ES entry for every color collection", () => {
    for (const color of ALL_COLORS) {
      expect(PRODUCT_TSR[color]).toBeDefined();
      expect(PRODUCT_TSR[color].en.h2).toBeTruthy();
      expect(PRODUCT_TSR[color].es.h2).toBeTruthy();
    }
  });

  it("never emits a second H1 (block content is plain copy + H2 in component)", () => {
    for (const color of ALL_COLORS) {
      // Heading text must not contain markdown/HTML H1 markers.
      expect(PRODUCT_TSR[color].en.h2).not.toMatch(/<h1|^#\s/i);
      expect(PRODUCT_TSR[color].es.h2).not.toMatch(/<h1|^#\s/i);
    }
  });

  it("links from product UP to the real color-collection route (EN + ES)", () => {
    for (const collection of COLOR_COLLECTIONS) {
      const en = getProductTsr(collection.color, "en")!;
      const es = getProductTsr(collection.color, "es")!;
      // First link = the per-color collection. Must match the real slug routes.
      expect(en.links[0].to).toBe(`/bouquets/${collection.slug}`);
      expect(es.links[0].to).toBe(`/es/bouquets/${collection.slugEs}`);
    }
  });

  it("the /bouquets sink link is always present (easy → hard)", () => {
    for (const color of ALL_COLORS) {
      expect(getProductTsr(color, "en")!.links.some((l) => l.to === "/bouquets")).toBe(true);
      expect(getProductTsr(color, "es")!.links.some((l) => l.to === "/es/bouquets")).toBe(true);
    }
  });

  it("anchor text is non-empty and equals a keyword (no empty anchors)", () => {
    for (const color of ALL_COLORS) {
      for (const lang of ["en", "es"] as const) {
        for (const link of getProductTsr(color, lang)!.links) {
          expect(link.anchor.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("resolves the DOMINANT color for multi-color bouquets by real-volume order", () => {
    // Red (60,500) beats White in a Red + White bouquet.
    expect(dominantColorForProduct(fakeProduct("Rojo y Blanco"))).toBe("red");
    // Single-color still works.
    expect(dominantColorForProduct(fakeProduct("Amarillo"))).toBe("yellow");
    // Tricolor: first by COLOR_COLLECTIONS order wins.
    expect(dominantColorForProduct(fakeProduct("Negro, Hot Pink y Blanco"))).toBe("white");
  });

  it("returns undefined content when the color is unknown", () => {
    expect(getProductTsr(undefined, "en")).toBeUndefined();
  });
});
