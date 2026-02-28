export type ColorCategory = 'natural' | 'painted' | 'glitter';

export interface ColorOption {
  name: string;
  hex: string;
  category: ColorCategory;
}

export const colorOptions: ColorOption[] = [
  // Natural
  { name: 'Blanco', hex: '#FEFEFE', category: 'natural' },
  { name: 'Rosa', hex: '#F4A0B0', category: 'natural' },
  { name: 'Amarillo', hex: '#F5D547', category: 'natural' },
  { name: 'Naranja', hex: '#F0913A', category: 'natural' },
  { name: 'Morado', hex: '#8B5EA0', category: 'natural' },
  { name: 'Rojo', hex: '#C41E3A', category: 'natural' },
  // Painted
  { name: 'Negro', hex: '#1A1A1A', category: 'painted' },
  { name: 'Azul', hex: '#3A6BC5', category: 'painted' },
  { name: 'Gris', hex: '#9E9E9E', category: 'painted' },
];

export interface SizeOption {
  roses: number;
  priceRegular: number;
  priceRed: number;
}

export const sizeOptions: SizeOption[] = [
  { roses: 50, priceRegular: 76, priceRed: 106 },
  { roses: 75, priceRegular: 101, priceRed: 146 },
  { roses: 100, priceRegular: 136, priceRed: 196 },
  { roses: 125, priceRegular: 201, priceRed: 276 },
  { roses: 150, priceRegular: 226, priceRed: 316 },
  { roses: 175, priceRegular: 251, priceRed: 356 },
  { roses: 200, priceRegular: 301, priceRed: 421 },
];

export type AccessoryType = 'none' | 'note' | 'card' | 'butterfly';

export interface CrownOption {
  size: string;
  label: string;
}

export const crownOptions: CrownOption[] = [
  { size: 'small', label: 'Pequeña' },
  { size: 'medium', label: 'Mediana' },
  { size: 'large', label: 'Grande' },
];

export const ribbonPresets = ['Happy Birthday', 'Congratulations', 'I Love You'];

export type BouquetType = 'classic' | 'heart' | 'letters' | 'numbers';

export const specialBouquetPrice = 285;
export const specialBouquetRoses = 125;
export const letterNumberExtraPrice = 40;
export const crownPrice = 10;
export const ribbonPrice = 25;
