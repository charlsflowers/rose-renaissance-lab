import { describe, it, expect } from "vitest";
import { buildCheckoutUrl } from "@/lib/checkout";

describe("buildCheckoutUrl", () => {
  it("forces Online Store attribution and preserves note metadata", () => {
    const url = buildCheckoutUrl("gid://shopify/ProductVariant/1234567890", {
      deliveryMethod: "delivery",
      deliveryCost: 20,
      serviceFee: 5,
      deliveryAddress: "7261 NW 12th St, Miami, FL 33126",
      deliveryZip: "33126",
      deliveryDate: "Mar 24, 2026",
      deliveryTime: "10:00",
      accessories: [{ variantId: "51632872456324", quantity: 1 }],
      note: "DATOS DEL ENVÍO\n- 🚚 Tipo: Home Delivery",
    });

    expect(url).toContain("/cart/1234567890:1,51632872456324:1,51629708935300:200,51654333595780:50");

    const parsed = new URL(url!);
    expect(parsed.searchParams.get("channel")).toBe("online_store");
    expect(parsed.searchParams.get("note")).toContain("DATOS DEL ENVÍO");
    expect(parsed.searchParams.get("checkout[shipping_address][country]")).toBe("US");
  });
});
