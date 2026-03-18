/**
 * Shopify variant IDs for bouquet accessories.
 * These are added as separate line items in checkout.
 */

// Variable-price accessory
export const GLITTER_VARIANT_ID = "51632872259716";

// Free accessories
export const NOTES_VARIANT_ID = "51632872456324";
export const CARDS_VARIANT_ID = "51632872620164";
export const BUTTERFLIES_VARIANT_ID = "51632872849540";

// Variable-price accessory
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

// Variable-price bouquet product
export const CUSTOM_BOUQUET_VARIANT_ID = "51634887295108";

export interface AccessoryLineItem {
  variantId: string;
  quantity: number;
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

  if (opts.glitter) {
    items.push({ variantId: GLITTER_VARIANT_ID, quantity: 1 });
  }

  if (opts.accessory === "note") {
    items.push({ variantId: NOTES_VARIANT_ID, quantity: 1 });
  } else if (opts.accessory === "card") {
    items.push({ variantId: CARDS_VARIANT_ID, quantity: 1 });
  } else if (opts.accessory === "butterfly") {
    items.push({ variantId: BUTTERFLIES_VARIANT_ID, quantity: 1 });
  }

  if (opts.specialText && opts.specialText.length > 0) {
    items.push({ variantId: BABY_BREATH_VARIANT_ID, quantity: 1 });
  }

  if (opts.addVase && opts.vaseRoses) {
    const vaseVariant = VASE_VARIANTS[opts.vaseRoses];
    if (vaseVariant) {
      items.push({ variantId: vaseVariant, quantity: 1 });
    }
  }

  if (opts.addCrown) {
    const crownVariant = opts.crownSize === "gold" ? CROWN_GOLD_VARIANT_ID : CROWN_SILVER_VARIANT_ID;
    items.push({ variantId: crownVariant, quantity: 1 });
  }

  if (opts.addRibbon) {
    items.push({ variantId: RIBBON_VARIANT_ID, quantity: 1 });
  }

  return items;
}
