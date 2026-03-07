export type ColorCategory = 'natural' | 'painted';

export interface ColorOption {
  name: string;
  hex: string;
  category: ColorCategory;
}

export const colorOptions: ColorOption[] = [
  // Natural
  { name: 'Blanco', hex: '#FEFEFE', category: 'natural' },
  { name: 'Hot Pink', hex: '#FF69B4', category: 'natural' },
  { name: 'Pink', hex: '#FFB6C1', category: 'natural' },
  { name: 'Amarillo', hex: '#F5D547', category: 'natural' },
  { name: 'Naranja', hex: '#F0913A', category: 'natural' },
  { name: 'Morado', hex: '#8B5EA0', category: 'natural' },
  { name: 'Rojo', hex: '#C41E3A', category: 'natural' },
  // Painted
  { name: 'Negro', hex: '#1A1A1A', category: 'painted' },
  { name: 'Verde', hex: '#4CAF50', category: 'painted' },
  { name: 'Azul', hex: '#3A6BC5', category: 'painted' },
];

export type PricingTier = 'standard' | 'red' | 'painted' | 'mix2' | 'mix2painted' | 'mix3red';

export interface PricingRow {
  roses: number;
  standard: number;
  red: number;
  painted: number;
  mix2: number;
  mix2painted: number;
  mix3red: number;
}

export const pricingTable: PricingRow[] = [
  { roses: 50,  standard: 76,  red: 106, painted: 136, mix2: 91,  mix2painted: 106, mix3red: 0 },
  { roses: 75,  standard: 101, red: 146, painted: 191, mix2: 116, mix2painted: 131, mix3red: 116 },
  { roses: 100, standard: 136, red: 196, painted: 256, mix2: 166, mix2painted: 196, mix3red: 151 },
  { roses: 125, standard: 201, red: 276, painted: 351, mix2: 231, mix2painted: 261, mix3red: 216 },
  { roses: 150, standard: 226, red: 226, painted: 406, mix2: 256, mix2painted: 316, mix3red: 256 },
  { roses: 175, standard: 251, red: 251, painted: 461, mix2: 296, mix2painted: 341, mix3red: 281 },
  { roses: 200, standard: 301, red: 301, painted: 541, mix2: 361, mix2painted: 421, mix3red: 346 },
];

export function determinePricingTier(colors: ColorOption[]): PricingTier {
  const count = colors.length;
  const hasRed = colors.some(c => c.name === 'Rojo');
  const hasPainted = colors.some(c => c.category === 'painted');
  const hasNatural = colors.some(c => c.category === 'natural');

  if (count === 1) {
    if (hasRed) return 'red';
    if (hasPainted) return 'painted';
    return 'standard';
  }

  if (count === 2) {
    if (hasPainted && hasNatural) return 'mix2painted';
    return 'mix2';
  }

  // 3 colors
  if (hasPainted && hasNatural) return 'mix2painted'; // natural+painted mix uses this tier
  if (hasRed) return 'mix3red';
  return 'mix3red'; // 3 colors without red: use same tier
}

export function getPrice(tier: PricingTier, rosesCount: number): number {
  const row = pricingTable.find(r => r.roses === rosesCount);
  if (!row) return 0;
  return row[tier];
}

export function getMinRoses(tier: PricingTier): number {
  if (tier === 'mix3red') return 75;
  return 50;
}

// Legacy exports for backward compatibility
export interface SizeOption {
  roses: number;
  priceRegular: number;
  priceRed: number;
}

export const sizeOptions: SizeOption[] = pricingTable.map(r => ({
  roses: r.roses,
  priceRegular: r.standard,
  priceRed: r.red,
}));

export type AccessoryType = 'none' | 'note' | 'card' | 'butterfly';

export interface CrownOption {
  size: string;
  label: string;
}

export const crownOptions: CrownOption[] = [
  { size: 'silver', label: 'Plateado' },
  { size: 'gold', label: 'Dorado' },
];

export const ribbonPresets = ['Happy Birthday', 'Congratulations', 'I Love You'];

export type BouquetType = 'classic' | 'letters' | 'numbers';

export const specialBouquetPrice = 285;
export const specialBouquetRoses = 125;
export const letterNumberExtraPrice = 40;
export const crownPrice = 10;
export const ribbonPrice = 25;

export interface VaseOption {
  roses: number;
  label: string;
  price: number;
}

export const vaseOptions: VaseOption[] = [
  { roses: 50, label: 'Jarrón 50', price: 25 },
  { roses: 75, label: 'Jarrón 75', price: 30 },
  { roses: 100, label: 'Jarrón 100', price: 35 },
];
