/**
 * Shopify variant IDs for bouquet accessories.
 * These are added as separate line items in the cart permalink.
 */

// Glitter: $0.01 base, qty = total cost in cents (like delivery fee)
export const GLITTER_VARIANT_ID = "51632872259716";

// Free accessories (qty = 1)
export const NOTES_VARIANT_ID = "51632872456324";
export const CARDS_VARIANT_ID = "51632872620164";
export const BUTTERFLIES_VARIANT_ID = "51632872849540";

// Baby Breath Letters & Numbers: $0.01 base, qty = total cost in cents
export const BABY_BREATH_VARIANT_ID = "51632873013380";

// Vase variants by roses
export const VASE_VARIANTS: Record<number, string> = {
  50: "51632875143300",
  75: "51632875176068",
  100: "51632875208836",
};

// Crown variants
export const CROWN_SILVER_VARIANT_ID = "51632876028036";
export const CROWN_GOLD_VARIANT_ID = "51632876060804";

// Ribbon: fixed $25
export const RIBBON_VARIANT_ID = "51632873537668";

export interface AccessoryLineItem {
  variantId: string;
  quantity: number; // 1 for fixed-price, cents for $0.01-base items
}

/**
 * Build accessory line items from cart item data.
 */
export function buildAccessoryLineItems(opts: {
  glitter: boolean;
  rosesCount: number;
  accessory: string; // "none" | "note" | "card" | "butterfly"
  specialText: string; // letters/numbers text
  addVase: boolean;
  vaseRoses?: number;
  addCrown: boolean;
  crownSize: string; // "silver" | "gold"
  addRibbon: boolean;
}): AccessoryLineItem[] {
  const items: AccessoryLineItem[] = [];

  // Glitter: $8 per 25 roses → total in cents
  if (opts.glitter) {
    const glitterCost = Math.ceil(opts.rosesCount / 25) * 8;
    items.push({ variantId: GLITTER_VARIANT_ID, quantity: glitterCost * 100 });
  }

  // Free accessories
  if (opts.accessory === "note") {
    items.push({ variantId: NOTES_VARIANT_ID, quantity: 1 });
  } else if (opts.accessory === "card") {
    items.push({ variantId: CARDS_VARIANT_ID, quantity: 1 });
  } else if (opts.accessory === "butterfly") {
    items.push({ variantId: BUTTERFLIES_VARIANT_ID, quantity: 1 });
  }

  // Baby Breath Letters/Numbers: $40 per char → total in cents
  if (opts.specialText && opts.specialText.length > 0) {
    const bbCost = opts.specialText.length * 40;
    items.push({ variantId: BABY_BREATH_VARIANT_ID, quantity: bbCost * 100 });
  }

  // Vase
  if (opts.addVase && opts.vaseRoses) {
    const vaseVariant = VASE_VARIANTS[opts.vaseRoses];
    if (vaseVariant) {
      items.push({ variantId: vaseVariant, quantity: 1 });
    }
  }

  // Crown
  if (opts.addCrown) {
    const crownVariant = opts.crownSize === "gold" ? CROWN_GOLD_VARIANT_ID : CROWN_SILVER_VARIANT_ID;
    items.push({ variantId: crownVariant, quantity: 1 });
  }

  // Ribbon
  if (opts.addRibbon) {
    items.push({ variantId: RIBBON_VARIANT_ID, quantity: 1 });
  }

  return items;
}
