import { describe, it, expect } from "vitest";
import { resolveBlogInterlinks } from "@/lib/blogInterlinks";

describe("resolveBlogInterlinks (blog → affine category, chain logic)", () => {
  it("resolves a color-collection hint and ends at the main category", () => {
    const links = resolveBlogInterlinks(["red-roses"], "en");
    // First the affine color collection, last the main category (authority sink).
    expect(links[0].to).toBe("/bouquets/red-roses");
    expect(links[links.length - 1].to).toBe("/bouquets");
  });

  it("emits native ES slugs for Spanish articles", () => {
    const links = resolveBlogInterlinks(["red-roses"], "es");
    expect(links[0].to).toBe("/es/bouquets/rosas-rojas");
    expect(links[links.length - 1].to).toBe("/es/bouquets");
  });

  it("orders affine collections low → high search volume (chain)", () => {
    // purple has volume 0 (long-tail / easy), red has 60500 (hard).
    const links = resolveBlogInterlinks(["red-roses", "purple-roses"], "en");
    const affine = links.filter((l) => l.to !== "/bouquets");
    expect(affine[0].to).toBe("/bouquets/purple-roses"); // easier first
    expect(affine[affine.length - 1].to).toBe("/bouquets/red-roses"); // harder last
  });

  it("matches occasion-collection hints to /collections and uses the real keyword anchor", () => {
    const links = resolveBlogInterlinks(["valentines-flowers"], "en");
    const occ = links.find((l) => l.to === "/collections/valentines-flowers");
    expect(occ).toBeTruthy();
    expect(occ!.anchor).toBe("valentines flowers");
  });

  it("de-duplicates and still returns just the main category when no hints match", () => {
    const links = resolveBlogInterlinks(["unknown-thing"], "en");
    expect(links).toHaveLength(1);
    expect(links[0].to).toBe("/bouquets");
  });
});
