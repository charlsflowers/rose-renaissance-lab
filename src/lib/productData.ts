export type ColorCategory = 'natural' | 'painted';

export interface ColorOption {
  name: string;
  nameEn: string;
  hex: string;
  category: ColorCategory;
}

export const colorOptions: ColorOption[] = [
  // Natural
  { name: 'Blanco', nameEn: 'White', hex: '#FEFEFE', category: 'natural' },
  { name: 'Hot Pink', nameEn: 'Hot Pink', hex: '#FF69B4', category: 'natural' },
  { name: 'Pink', nameEn: 'Pink', hex: '#FFB6C1', category: 'natural' },
  { name: 'Amarillo', nameEn: 'Yellow', hex: '#F5D547', category: 'natural' },
  { name: 'Naranja', nameEn: 'Orange', hex: '#F0913A', category: 'natural' },
  { name: 'Morado', nameEn: 'Purple', hex: '#8B5EA0', category: 'natural' },
  { name: 'Rojo', nameEn: 'Red', hex: '#C41E3A', category: 'natural' },
  // Painted
  { name: 'Negro', nameEn: 'Black', hex: '#1A1A1A', category: 'painted' },
  { name: 'Verde', nameEn: 'Green', hex: '#4CAF50', category: 'painted' },
  { name: 'Azul', nameEn: 'Blue', hex: '#3A6BC5', category: 'painted' },
];

export type PricingTier = 'standard' | 'red' | 'painted' | 'mix2' | 'mix2painted' | 'mix3red' | 'painted1';

export interface PricingRow {
  roses: number;
  standard: number;
  red: number;
  painted: number;
  mix2: number;
  mix2painted: number;
  mix3red: number;
  painted1: number;
}

export const pricingTable: PricingRow[] = [
  { roses: 50,  standard: 76,  red: 106, painted: 136, mix2: 91,  mix2painted: 106, mix3red: 0,   painted1: 60 },
  { roses: 75,  standard: 101, red: 146, painted: 191, mix2: 116, mix2painted: 131, mix3red: 116, painted1: 90 },
  { roses: 100, standard: 136, red: 196, painted: 256, mix2: 166, mix2painted: 196, mix3red: 151, painted1: 120 },
  { roses: 125, standard: 201, red: 276, painted: 351, mix2: 231, mix2painted: 261, mix3red: 216, painted1: 150 },
  { roses: 150, standard: 226, red: 226, painted: 406, mix2: 256, mix2painted: 316, mix3red: 256, painted1: 180 },
  { roses: 175, standard: 251, red: 251, painted: 461, mix2: 296, mix2painted: 341, mix3red: 281, painted1: 210 },
  { roses: 200, standard: 301, red: 301, painted: 541, mix2: 361, mix2painted: 421, mix3red: 346, painted1: 240 },
];

export function determinePricingTier(colors: ColorOption[]): PricingTier {
  const count = colors.length;
  const hasRed = colors.some(c => c.name === 'Rojo');
  const hasPainted = colors.some(c => c.category === 'painted');
  const hasNatural = colors.some(c => c.category === 'natural');
  const allPainted = colors.every(c => c.category === 'painted');
  const allNatural = colors.every(c => c.category === 'natural');

  if (count === 1) {
    if (hasPainted) return 'painted1';
    // All single natural colors (including red) use 'red' tier pricing
    return 'red';
  }

  if (count === 2) {
    if (allNatural) return 'standard';
    // At least 1 painted
    return 'painted';
  }

  // 3 colors
  if (allNatural && !hasRed) return 'standard';
  if (allNatural && hasRed) return 'mix3red';
  // At least 1 painted
  return 'painted';
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
  { size: 'silver', label: 'Silver' },
  { size: 'gold', label: 'Gold' },
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
  { roses: 50, label: 'Vase 50', price: 25 },
  { roses: 75, label: 'Vase 75', price: 30 },
  { roses: 100, label: 'Vase 100', price: 35 },
];
