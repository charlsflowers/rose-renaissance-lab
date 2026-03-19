/**
 * Custom Bouquet (Product ID: 10269542514820) variant mapping.
 * Maps Type + Roses to the correct Shopify numeric variant ID.
 */

import type { ColorOption } from '@/lib/productData';

const CUSTOM_BOUQUET_VARIANT_MAP: Record<string, Record<number, string>> = {
  "1 colour - Red": {
    50: "51647391105156", 75: "51647391137924", 100: "51647391170692",
    125: "51647391203460", 150: "51647391236228", 175: "51647391268996", 200: "51647391301764",
  },
  "2 colours - Mixed": {
    50: "51647391334532", 75: "51647391367300", 100: "51647391400068",
    125: "51647391432836", 150: "51647391465604", 175: "51647391498372", 200: "51647391531140",
  },
  "2 colours - Painted": {
    50: "51647391563908", 75: "51647391596676", 100: "51647391629444",
    125: "51647391662212", 150: "51647391694980", 175: "51647391727748", 200: "51647391760516",
  },
  "3 colours - Mixed": {
    75: "51647391793284", 100: "51647391826052", 125: "51647391858820",
    150: "51647391891588", 175: "51647391924356", 200: "51647391957124",
  },
  "3 colours - With Red": {
    75: "51647391989892", 100: "51647392022660", 125: "51647392055428",
    150: "51647392088196", 175: "51647392120964", 200: "51647392153732",
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

  if (count === 1 && hasRed) return "1 colour - Red";
  if (count === 1) return "2 colours - Mixed"; // fallback: single non-red uses Mixed pricing
  if (count === 2 && hasPainted) return "2 colours - Painted";
  if (count === 2) return "2 colours - Mixed";
  if (count === 3 && hasRed) return "3 colours - With Red";
  if (count === 3) return "3 colours - Mixed";
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
