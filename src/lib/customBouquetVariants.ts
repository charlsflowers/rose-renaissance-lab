/**
 * Custom Bouquet (Product ID: gid://shopify/Product/10269542514820) variant mapping.
 * Maps color category combination + roses → correct Shopify Mix Type option value.
 *
 * Color categories:
 * - NATURAL: natural rose colors (white, hot pink, pink, yellow, orange, purple)
 * - RED: classic red only
 * - PAINTED: painted/special colors (black, green, blue)
 */

import type { ColorOption } from '@/lib/productData';

type ColorCategoryCount = { natural: number; red: number; painted: number };

/**
 * Count how many colors belong to each category.
 */
function countCategories(colors: ColorOption[]): ColorCategoryCount {
  const counts: ColorCategoryCount = { natural: 0, red: 0, painted: 0 };
  for (const c of colors) {
    if (c.name === 'Rojo') {
      counts.red++;
    } else if (c.category === 'painted') {
      counts.painted++;
    } else {
      counts.natural++;
    }
  }
  return counts;
}

/**
 * Determine the Shopify "Mix Type" option value based on selected colors.
 * Returns the exact string that must match the Shopify variant option.
 */
export function getCustomBouquetType(colors: ColorOption[]): string | null {
  const count = colors.length;
  if (count === 0) return null;

  const { natural, red, painted } = countCategories(colors);

  // ── 1 color ──
  if (count === 1) {
    if (natural === 1) return '1 Natural';
    if (red === 1) return '1 Red';
    if (painted === 1) return '1 Painted';
  }

  // ── 2 colors ──
  if (count === 2) {
    if (natural === 2) return '2 Natural';
    if (painted === 2) return '2 Painted';
    if (natural === 1 && red === 1) return '1 Natural + 1 Red';
    if (natural === 1 && painted === 1) return '1 Natural + 1 Painted';
    if (painted === 1 && red === 1) return '1 Painted + 1 Red';
  }

  // ── 3 colors ──
  if (count === 3) {
    if (natural === 3) return '3 Natural Colors';
    if (painted === 3) return '3 Painted';
    if (natural === 2 && red === 1) return '2 Natural + 1 Red';
    if (natural === 2 && painted === 1) return '2 Natural + 1 Painted';
    if (natural === 1 && painted === 1 && red === 1) return '1 Natural + 1 Painted + 1 Red';
    if (painted === 2 && natural === 1) return '2 Painted + 1 Natural';
    if (painted === 2 && red === 1) return '2 Painted + 1 Red';
  }

  return null;
}

/**
 * Resolve the Shopify variant ID for a Custom Bouquet.
 * @deprecated Use Storefront API variant matching instead.
 */
export function resolveCustomBouquetVariantId(colors: ColorOption[], roses: number): string | null {
  return null;
}
