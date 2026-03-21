/**
 * Custom Bouquet (Product ID: 10269542514820) variant mapping.
 * Maps Type + Roses to the correct Shopify numeric variant ID.
 *
 * Pricing categories:
 * - "1 colour - Natural": 1 natural color (any, including red)
 * - "1 colour - Painted": 1 painted color (black, green, blue)
 * - "2 colours - Natural": 2 natural colors
 * - "2 colours - Painted": 2 colors with at least 1 painted
 * - "3 colours - Natural": 3 natural colors without red
 * - "3 colours - With Red": 3 natural colors including red
 * - "3 colours - Painted": 3 colors with at least 1 painted
 */

import type { ColorOption } from '@/lib/productData';

const CUSTOM_BOUQUET_VARIANT_MAP: Record<string, Record<number, string>> = {
  "1 colour - Natural": {
    50: "51647391105156", 75: "51647391137924", 100: "51647391170692",
    125: "51647391203460", 150: "51647391236228", 175: "51647391268996", 200: "51647391301764",
  },
  "1 colour - Painted": {
    50: "51647391563908", 75: "51647391596676", 100: "51647391629444",
    125: "51647391662212", 150: "51647391694980", 175: "51647391727748", 200: "51647391760516",
  },
  "2 colours - Natural": {
    50: "51647391334532", 75: "51647391367300", 100: "51647391400068",
    125: "51647391432836", 150: "51647391465604", 175: "51647391498372", 200: "51647391531140",
  },
  "2 colours - Painted": {
    50: "51647391563908", 75: "51647391596676", 100: "51647391629444",
    125: "51647391662212", 150: "51647391694980", 175: "51647391727748", 200: "51647391760516",
  },
  "3 colours - Natural": {
    75: "51647391793284", 100: "51647391826052", 125: "51647391858820",
    150: "51647391891588", 175: "51647391924356", 200: "51647391957124",
  },
  "3 colours - With Red": {
    75: "51647391989892", 100: "51647392022660", 125: "51647392055428",
    150: "51647392088196", 175: "51647392120964", 200: "51647392153732",
  },
  "3 colours - Painted": {
    75: "51647391563908", 100: "51647391629444", 125: "51647391662212",
    150: "51647391694980", 175: "51647391727748", 200: "51647391760516",
  },
};

/**
 * Determine the Custom Bouquet "Type" based on selected colors.
 */
export function getCustomBouquetType(colors: ColorOption[]): string | null {
  const count = colors.length;
  if (count === 0) return null;

  const hasRed = colors.some(c => c.name === 'Rojo');
  const hasPainted = colors.some(c => c.category === 'painted');
  const allNatural = colors.every(c => c.category === 'natural');

  if (count === 1) {
    return hasPainted ? "1 colour - Painted" : "1 colour - Natural";
  }

  if (count === 2) {
    return allNatural ? "2 colours - Natural" : "2 colours - Painted";
  }

  if (count === 3) {
    if (allNatural && !hasRed) return "3 colours - Natural";
    if (allNatural && hasRed) return "3 colours - With Red";
    return "3 colours - Painted";
  }

  return null;
}

/**
 * Resolve the Shopify variant ID for a Custom Bouquet.
 * Returns the numeric variant ID string, or null if no mapping exists.
 */
export function resolveCustomBouquetVariantId(colors: ColorOption[], roses: number): string | null {
  const type = getCustomBouquetType(colors);
  if (!type) return null;
  return CUSTOM_BOUQUET_VARIANT_MAP[type]?.[roses] ?? null;
}
