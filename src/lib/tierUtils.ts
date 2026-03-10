import type { PricingTier } from '@/lib/productData';

/**
 * Infer the Shopify pricing tier from a color string.
 * Used when pricingTier is not explicitly provided (e.g., from reviews/videos).
 */
export function inferTierFromColor(colorStr: string): PricingTier {
  const colors = colorStr.split(/,\s*|\s+y\s+/).map(c => c.trim().toLowerCase());
  const count = colors.length;
  const hasRed = colors.some(c => c === 'rojo');
  const paintedColors = ['negro', 'verde', 'azul'];
  const hasPainted = colors.some(c => paintedColors.includes(c));
  const hasNatural = colors.some(c => !paintedColors.includes(c));

  if (count === 1) {
    if (hasRed) return 'red';
    if (hasPainted) return 'painted';
    return 'standard';
  }

  if (count === 2) {
    if (hasPainted && hasNatural) return 'mix2painted';
    if (hasPainted) return 'painted';
    if (hasRed) return 'mix2';
    return 'standard';
  }

  // 3+ colors
  if (hasPainted && hasNatural) return 'mix2painted';
  if (hasRed) return 'mix3red';
  return 'standard';
}
