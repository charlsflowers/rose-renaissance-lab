/**
 * Shopify variant IDs for bouquet accessories.
 * These are added as separate line items in checkout.
 */

// Glitter Finish — variant by roses count (numeric IDs for cart permalinks)
export const GLITTER_VARIANTS: Record<number, string> = {
  50: "51641804390532",
  75: "51641804423300",
  100: "51641804456068",
  125: "51641804488836",
  150: "51641804521604",
  175: "51641804554372",
  200: "51641804587140",
};

// Baby Breath Letters & Numbers — variant by digit count (numeric IDs)
export const BABY_BREATH_VARIANTS: Record<number, string> = {
  1: "51641811304580",
  2: "51641811337348",
  3: "51641811370116",
  4: "51641811402884",
};

// Free accessories
export const NOTES_VARIANT_ID = "51632872456324";
export const CARDS_VARIANT_ID = "51632872620164";
export const BUTTERFLIES_VARIANT_ID = "51632872849540";

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

// Home Delivery fee product (base $0.10, qty = cost × 10, e.g. $31.20 → qty 312)
export const DELIVERY_FEE_VARIANT_ID = "51629708935300";
export const DELIVERY_FEE_VARIANT_GID = `gid://shopify/ProductVariant/${DELIVERY_FEE_VARIANT_ID}`;

export interface AccessoryLineItem {
  variantId: string;
  quantity: number;
}

/**
 * Build accessory line items from cart item data.
 * Glitter and Baby Breath now select the correct Shopify variant
 * based on roses/digits — quantity is always 1, price comes from Shopify.
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

  // Glitter: select variant by roses count
  if (opts.glitter) {
    const glitterVariant = GLITTER_VARIANTS[opts.rosesCount];
    if (glitterVariant) {
      items.push({ variantId: glitterVariant, quantity: 1 });
    } else {
      console.warn(`No Glitter variant for ${opts.rosesCount} roses`);
    }
  }

  if (opts.accessory === "note") {
    items.push({ variantId: NOTES_VARIANT_ID, quantity: 1 });
  } else if (opts.accessory === "card") {
    items.push({ variantId: CARDS_VARIANT_ID, quantity: 1 });
  } else if (opts.accessory === "butterfly") {
    items.push({ variantId: BUTTERFLIES_VARIANT_ID, quantity: 1 });
  }

  // Baby Breath: select variant by digit count (1-4)
  if (opts.specialText && opts.specialText.length > 0) {
    const digitCount = Math.min(opts.specialText.length, 4);
    const bbVariant = BABY_BREATH_VARIANTS[digitCount];
    if (bbVariant) {
      items.push({ variantId: bbVariant, quantity: 1 });
    } else {
      console.warn(`No Baby Breath variant for ${digitCount} digits`);
    }
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
