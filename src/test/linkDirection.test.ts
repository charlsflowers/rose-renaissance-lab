import { describe, it, expect } from "vitest";
import {
  pageDifficulty,
  isLinkAllowed,
  filterDirectionalLinks,
  PRODUCT_DIFFICULTY,
  MAIN_CATEGORY_DIFFICULTY,
} from "@/lib/linkDirection";
import { COLOR_COLLECTIONS } from "@/lib/colorCollections";

/**
 * Directional internal-linking rule — Romuald, Armada SEO 2025,
 * Modulo 15 Enlazado Interno (03.Tipo Silo / 02.En Cadena):
 *   "solo y exclusivamente desde lo mas facil hacia lo mas dificil, no desde lo
 *    mas dificil hacia lo mas facil en ningun caso."
 *
 * Difficulty = real search volume for collections; products/TSR = 0 (easiest).
 */

describe("linkDirection — directional guard (easy -> hard only)", () => {
  it("reads the real search volume of a color collection as its difficulty", () => {
    expect(pageDifficulty("/bouquets/red-roses")).toBe(60500);
    expect(pageDifficulty("/bouquets/blue-roses")).toBe(49500);
    // purple has volume 0 in the research -> easiest collection.
    expect(pageDifficulty("/bouquets/purple-roses")).toBe(0);
  });

  it("treats the main category as the highest-authority sink", () => {
    expect(pageDifficulty("/bouquets")).toBe(MAIN_CATEGORY_DIFFICULTY);
  });

  it("treats an unknown node (a product page) as the easiest layer", () => {
    expect(pageDifficulty("/bouquets/total-passion")).toBeUndefined();
  });

  it("ALLOWS linking from an easier page to a harder page", () => {
    // purple (0) -> red (60500): easy -> hard. OK.
    expect(isLinkAllowed("/bouquets/purple-roses", "/bouquets/red-roses")).toBe(true);
    // any collection -> main category sink. OK.
    expect(isLinkAllowed("/bouquets/red-roses", "/bouquets")).toBe(true);
    // product (0) -> a collection. OK (authority flows up from TSR).
    expect(isLinkAllowed("/bouquets/total-passion", "/bouquets/red-roses")).toBe(true);
  });

  it("FORBIDS linking from a harder page to an easier page (the brown cells)", () => {
    // red (60500) -> purple (0): hard -> easy. FORBIDDEN.
    expect(isLinkAllowed("/bouquets/red-roses", "/bouquets/purple-roses")).toBe(false);
    // blue (49500) -> purple (0): hard -> easy. FORBIDDEN.
    expect(isLinkAllowed("/bouquets/blue-roses", "/bouquets/purple-roses")).toBe(false);
    // main category -> a collection: never link down from the sink.
    expect(isLinkAllowed("/bouquets", "/bouquets/red-roses")).toBe(false);
    // collection -> product (down to TSR): forbidden via strategic linking
    // (the natural silo down-link is a separate, architectural mechanism).
    expect(isLinkAllowed("/bouquets/red-roses", "/bouquets/total-passion")).toBe(false);
  });

  it("ALLOWS equal-difficulty links (same volume / product <-> product)", () => {
    // red and white are both 60500 in the research.
    expect(isLinkAllowed("/bouquets/red-roses", "/bouquets/white-roses")).toBe(true);
    // product (0) <-> product (0): cross-sell is directionally neutral.
    expect(isLinkAllowed("/bouquets/total-passion", "/bouquets/blue-sky")).toBe(true);
  });

  it("never allows a self-link", () => {
    expect(isLinkAllowed("/bouquets/red-roses", "/bouquets/red-roses")).toBe(false);
    expect(isLinkAllowed("/es/bouquets/rosas-rojas", "/bouquets/red-roses")).toBe(false);
  });

  it("normalizes ES native slugs and absolute URLs to the same node", () => {
    expect(pageDifficulty("/es/bouquets/rosas-rojas")).toBe(60500);
    expect(pageDifficulty("https://www.charlsflowers.com/bouquets/red-roses")).toBe(60500);
  });

  it("filterDirectionalLinks strips reverse links and orders survivors low -> high", () => {
    const from = "/bouquets/blue-roses"; // 49500
    const candidates = [
      "/bouquets/purple-roses", // 0   -> reverse, must be dropped
      "/bouquets/red-roses", // 60500 -> harder, kept
      "/bouquets/white-roses", // 60500 -> equal-or-harder, kept
      "/bouquets", // sink, kept (highest)
    ];
    const kept = filterDirectionalLinks(from, candidates);
    expect(kept).not.toContain("/bouquets/purple-roses");
    // Survivors ordered low -> high, sink last.
    expect(kept[kept.length - 1]).toBe("/bouquets");
  });

  it("works on objects carrying a `to` field (e.g. InterLink lists)", () => {
    const from = "/bouquets/purple-roses"; // 0 (easiest)
    const links = [
      { to: "/bouquets/red-roses", anchor: "red roses" },
      { to: "/bouquets", anchor: "all rose bouquets" },
    ];
    const kept = filterDirectionalLinks(from, links);
    // Easiest origin -> everything harder survives, ordered low -> high.
    expect(kept.map((l) => l.to)).toEqual(["/bouquets/red-roses", "/bouquets"]);
  });

  it("PRODUCT_DIFFICULTY is the structural floor (0)", () => {
    expect(PRODUCT_DIFFICULTY).toBe(0);
    // Every real collection volume is >= the product floor.
    for (const c of COLOR_COLLECTIONS) {
      expect(c.volume).toBeGreaterThanOrEqual(PRODUCT_DIFFICULTY);
    }
  });
});
