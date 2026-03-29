import { pricingTable } from '@/lib/productData';

export interface ProductSize {
  label: string;
  price: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  sizes: ProductSize[];
}

export interface CustomSize {
  roses: number;
  price: number;
  label?: string;
}

export interface BouquetProduct {
  id: string;
  name: string;
  shopifyHandle: string;
  description: string;
  descriptionEs?: string;
  image: string;
  image2?: string;
  color: string;
  type: 'round' | 'heart';
  pricingTier: import('@/lib/productData').PricingTier;
  customSizes?: CustomSize[];
}

export interface CategoryInfo {
  slug: string;
  title: string;
  description: string;
}

export const categories: CategoryInfo[] = [
  { slug: 'arreglos', title: 'Arrangements', description: 'Unique floral arrangements for every occasion' },
  { slug: 'cajas', title: 'Boxes', description: 'Fresh roses presented in special boxes' },
  { slug: 'cestas', title: 'Baskets', description: 'Handmade baskets with fresh flowers' },
  { slug: 'jarrones', title: 'Vases', description: 'Arrangements in crystal vases' },
  { slug: 'osos', title: 'Bears', description: 'Adorable bears made entirely of roses' },
];

export const categoryProducts: Record<string, CatalogProduct[]> = {
  arreglos: [
    { id: 'arr-1', name: 'Spring Arrangement – Small', description: 'Fresh arrangement with roses and green foliage', image: '', sizes: [{ label: 'One size', price: 45 }] },
    { id: 'arr-2', name: 'Spring Arrangement – Medium', description: 'Fresh arrangement with roses and green foliage', image: '', sizes: [{ label: 'One size', price: 75 }] },
    { id: 'arr-3', name: 'Spring Arrangement – Large', description: 'Fresh arrangement with roses and green foliage', image: '', sizes: [{ label: 'One size', price: 110 }] },
    { id: 'arr-4', name: 'Elegant Arrangement – Small', description: 'Sophisticated composition in pastel tones', image: '', sizes: [{ label: 'One size', price: 55 }] },
    { id: 'arr-5', name: 'Elegant Arrangement – Medium', description: 'Sophisticated composition in pastel tones', image: '', sizes: [{ label: 'One size', price: 85 }] },
    { id: 'arr-6', name: 'Elegant Arrangement – Large', description: 'Sophisticated composition in pastel tones', image: '', sizes: [{ label: 'One size', price: 130 }] },
    { id: 'arr-7', name: 'Romantic Arrangement – Small', description: 'Red and white roses in perfect harmony', image: '', sizes: [{ label: 'One size', price: 50 }] },
    { id: 'arr-8', name: 'Romantic Arrangement – Medium', description: 'Red and white roses in perfect harmony', image: '', sizes: [{ label: 'One size', price: 80 }] },
    { id: 'arr-9', name: 'Romantic Arrangement – Large', description: 'Red and white roses in perfect harmony', image: '', sizes: [{ label: 'One size', price: 120 }] },
  ],
  cajas: [
    { id: 'caj-1', name: 'Classic Box – 50 Roses', description: 'Fresh roses in a black box', image: '', sizes: [{ label: 'One size', price: 65 }] },
    { id: 'caj-2', name: 'Classic Box – 75 Roses', description: 'Fresh roses in a black box', image: '', sizes: [{ label: 'One size', price: 95 }] },
    { id: 'caj-3', name: 'Classic Box – 100 Roses', description: 'Fresh roses in a black box', image: '', sizes: [{ label: 'One size', price: 140 }] },
    { id: 'caj-4', name: 'Heart Box – 50 Roses', description: 'Heart-shaped box with roses', image: '', sizes: [{ label: 'One size', price: 75 }] },
    { id: 'caj-5', name: 'Heart Box – 75 Roses', description: 'Heart-shaped box with roses', image: '', sizes: [{ label: 'One size', price: 110 }] },
    { id: 'caj-6', name: 'Heart Box – 100 Roses', description: 'Heart-shaped box with roses', image: '', sizes: [{ label: 'One size', price: 160 }] },
    { id: 'caj-7', name: 'Special Box – 50 Roses', description: 'Box with preserved roses', image: '', sizes: [{ label: 'One size', price: 85 }] },
    { id: 'caj-8', name: 'Special Box – 75 Roses', description: 'Box with preserved roses', image: '', sizes: [{ label: 'One size', price: 125 }] },
    { id: 'caj-9', name: 'Special Box – 100 Roses', description: 'Box with preserved roses', image: '', sizes: [{ label: 'One size', price: 180 }] },
  ],
  cestas: [
    { id: 'ces-1', name: 'Country Basket – Small', description: 'Rustic basket with wildflowers', image: '', sizes: [{ label: 'One size', price: 55 }] },
    { id: 'ces-2', name: 'Country Basket – Medium', description: 'Rustic basket with wildflowers', image: '', sizes: [{ label: 'One size', price: 85 }] },
    { id: 'ces-3', name: 'Country Basket – Large', description: 'Rustic basket with wildflowers', image: '', sizes: [{ label: 'One size', price: 125 }] },
    { id: 'ces-4', name: 'Rose & Lily Basket – Small', description: 'Basket with fresh roses and lilies', image: '', sizes: [{ label: 'One size', price: 70 }] },
    { id: 'ces-5', name: 'Rose & Lily Basket – Medium', description: 'Basket with fresh roses and lilies', image: '', sizes: [{ label: 'One size', price: 100 }] },
    { id: 'ces-6', name: 'Rose & Lily Basket – Large', description: 'Basket with fresh roses and lilies', image: '', sizes: [{ label: 'One size', price: 150 }] },
    { id: 'ces-7', name: 'Fruit Basket – Small', description: 'Basket with flowers and seasonal fruits', image: '', sizes: [{ label: 'One size', price: 60 }] },
    { id: 'ces-8', name: 'Fruit Basket – Medium', description: 'Basket with flowers and seasonal fruits', image: '', sizes: [{ label: 'One size', price: 90 }] },
    { id: 'ces-9', name: 'Fruit Basket – Large', description: 'Basket with flowers and seasonal fruits', image: '', sizes: [{ label: 'One size', price: 135 }] },
  ],
  jarrones: [
    { id: 'jar-1', name: 'Crystal Vase – Small', description: 'Roses in a transparent crystal vase', image: '', sizes: [{ label: 'One size', price: 70 }] },
    { id: 'jar-2', name: 'Crystal Vase – Medium', description: 'Roses in a transparent crystal vase', image: '', sizes: [{ label: 'One size', price: 105 }] },
    { id: 'jar-3', name: 'Crystal Vase – Large', description: 'Roses in a transparent crystal vase', image: '', sizes: [{ label: 'One size', price: 155 }] },
    { id: 'jar-4', name: 'Gold Vase – Small', description: 'Beautiful arrangement in a gold vase', image: '', sizes: [{ label: 'One size', price: 85 }] },
    { id: 'jar-5', name: 'Gold Vase – Medium', description: 'Beautiful arrangement in a gold vase', image: '', sizes: [{ label: 'One size', price: 120 }] },
    { id: 'jar-6', name: 'Gold Vase – Large', description: 'Beautiful arrangement in a gold vase', image: '', sizes: [{ label: 'One size', price: 175 }] },
    { id: 'jar-7', name: 'Vintage Vase – Small', description: 'Fresh flowers in a ceramic vase', image: '', sizes: [{ label: 'One size', price: 75 }] },
    { id: 'jar-8', name: 'Vintage Vase – Medium', description: 'Fresh flowers in a ceramic vase', image: '', sizes: [{ label: 'One size', price: 110 }] },
    { id: 'jar-9', name: 'Vintage Vase – Large', description: 'Fresh flowers in a ceramic vase', image: '', sizes: [{ label: 'One size', price: 160 }] },
  ],
  osos: [
    { id: 'oso-1', name: 'Red Rose Bear', description: 'Bear completely covered in red roses', image: '', sizes: [{ label: 'Small', price: 90 }, { label: 'Medium', price: 150 }, { label: 'Large', price: 220 }] },
    { id: 'oso-2', name: 'Pink Rose Bear', description: 'Adorable bear in pink roses', image: '', sizes: [{ label: 'Small', price: 90 }, { label: 'Medium', price: 150 }, { label: 'Large', price: 220 }] },
    { id: 'oso-3', name: 'White Rose Bear', description: 'Elegant bear in white roses', image: '', sizes: [{ label: 'Small', price: 90 }, { label: 'Medium', price: 150 }, { label: 'Large', price: 220 }] },
  ],
};

// Shopify CDN base
const CDN = 'https://cdn.shopify.com/s/files/1/0979/1671/5140/files';

export const bouquetProducts: BouquetProduct[] = [
  // === Shuffled mix of single-color + multi-color bouquets ===

  // Mix 2 colors - Natural + Red
  { id: 'bq-round-37', name: 'Bicolor Passion', shopifyHandle: 'bicolor-passion', description: 'Colors: White and red roses.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $91.', descriptionEs: 'Colores: Rosas blancas y rojas.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $91.', image: `${CDN}/16.png?v=1774610789`, image2: `${CDN}/24_0314d01a-12b4-4e70-926b-75eadccc1a74.png?v=1774611351`, color: 'Rojo y Blanco', type: 'round', pricingTier: 'mix2' },

  // Single - Natural
  { id: 'bq-round-8', name: 'Soft Pink', shopifyHandle: 'soft-pink', description: 'Colors: Pink roses.\nPaper: White.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas pink.\nPapel: Blanco.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/5_e69dee54-c820-4910-95cb-130b55626cda.png?v=1774610955`, image2: `${CDN}/5_61493d6c-53c5-46a7-9862-3022e5b409c3.png?v=1774611351`, color: 'Pink', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Painted
  { id: 'bq-round-31', name: 'Elegant Contrast', shopifyHandle: 'elegant-contrast', description: 'Colors: White, hot pink, and black painted roses.\nPaper: Pink.\nSizes: 75, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $146.', descriptionEs: 'Colores: Rosas blancas, hot pink y negras pintadas.\nPapel: Rosa.\nTamaños: 75, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $146.', image: `${CDN}/9.png?v=1774610789`, image2: `${CDN}/13_1452edb3-b294-46be-8540-95fb0ba38405.png?v=1774611351`, color: 'Negro, Hot Pink y Blanco', type: 'round', pricingTier: 'mix2painted', customSizes: [{ roses: 75, price: 131 }, { roses: 100, price: 166 }, { roses: 125, price: 231 }, { roses: 150, price: 286 }, { roses: 175, price: 311 }, { roses: 200, price: 361 }] },

  // Single - Natural
  { id: 'bq-round-20', name: 'Radiant Sun', shopifyHandle: 'radiant-sun', description: 'Colors: Yellow roses.\nPaper: Beige.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas amarillas.\nPapel: Beige.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/4_64454122-543f-42d2-b5dd-0c63e33d023e.png?v=1774610954`, image2: `${CDN}/25_c6ba3fcb-bc77-4481-bea0-f51b6fb3b42b.png?v=1774611351`, color: 'Amarillo', type: 'round', pricingTier: 'standard' },

  // Mix 3 - Natural without red
  { id: 'bq-round-23', name: 'Magic Pastel', shopifyHandle: 'magic-pastel', description: 'Colors: White, pink, and purple roses.\nPaper: Purple.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $131.', descriptionEs: 'Colores: Rosas blancas, pink y moradas.\nPapel: Morado.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: `${CDN}/1.png?v=1774610789`, image2: `${CDN}/1_308eef44-e8df-4e4b-b905-091e2cc21003.png?v=1774611351`, color: 'Morado, Pink y Blanco', type: 'round', pricingTier: 'standard' },

  // Single - Painted
  { id: 'bq-round-10', name: 'Blue Sky', shopifyHandle: 'blue-sky', description: 'Colors: Blue painted roses.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $136.', descriptionEs: 'Colores: Rosas azules pintadas.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $136.', image: `${CDN}/1_8735cef8-ff63-47f8-86ef-d71c1bb57986.png?v=1774610955`, image2: `${CDN}/21_00027305-010a-484f-a712-ad6f561e59ed.png?v=1774611351`, color: 'Azul', type: 'round', pricingTier: 'painted' },

  // Mix 2 - Natural without red
  { id: 'bq-round-15', name: 'Spring Garden', shopifyHandle: 'spring-garden', description: 'Colors: White and yellow roses.\nPaper: White.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas blancas y amarillas.\nPapel: Blanco.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/3.png?v=1774610789`, image2: `${CDN}/7_a7912f37-4803-40b4-ac33-deaa7d4192c6.png?v=1774611352`, color: 'Amarillo y Blanco', type: 'round', pricingTier: 'standard' },

  // Single - Red
  { id: 'bq-round-5', name: 'Total Passion', shopifyHandle: 'total-passion', description: 'Colors: Red roses.\nPaper: Pink.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $106.', descriptionEs: 'Colores: Rosas rojas.\nPapel: Rosa.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $106.', image: `${CDN}/9_f5ae14ce-39a8-46e7-be8f-e549dd07f043.png?v=1774610955`, image2: `${CDN}/2_0b0317c5-cc6b-4b13-95ef-586bb809ce71.png?v=1774611351`, color: 'Rojo', type: 'round', pricingTier: 'red' },

  // 3 colors - With Red
  { id: 'bq-round-26', name: 'Fire & Sun', shopifyHandle: 'fire-sun', description: 'Colors: Yellow, red, and purple roses.\nPaper: Peach.\nSizes: 75, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $146.', descriptionEs: 'Colores: Rosas amarillas, rojas y moradas.\nPapel: Melocotón.\nTamaños: 75, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $146.', image: `${CDN}/5.png?v=1774610789`, image2: `${CDN}/9_4391728c-de10-4bae-89de-584176527a72.png?v=1774611351`, color: 'Rojo, Amarillo y Pink', type: 'round', pricingTier: 'mix3red' },

  // Single - Painted
  { id: 'bq-round-22', name: 'Green Fresh', shopifyHandle: 'green-fresh', description: 'Colors: Green painted roses.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $136.', descriptionEs: 'Colores: Rosas verdes pintadas.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $136.', image: `${CDN}/3_2cfe7583-0904-4673-9dd4-110546c46a33.png?v=1774610955`, image2: `${CDN}/16_4021ad91-0660-4856-9903-913ef4e7731e.png?v=1774611351`, color: 'Verde', type: 'round', pricingTier: 'painted' },

  // Mix 2 - Natural + Painted
  { id: 'bq-round-30', name: 'Night & Day', shopifyHandle: 'night-day', description: 'Colors: White and black painted roses.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $121.', descriptionEs: 'Colores: Rosas blancas y negras pintadas.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $121.', image: `${CDN}/8.png?v=1774610789`, image2: `${CDN}/12_613d3488-6368-4edc-a249-630c90337b1c.png?v=1774611351`, color: 'Negro y Blanco', type: 'round', pricingTier: 'mix2painted' },

  // Mix 2 - Natural without red
  { id: 'bq-round-35', name: 'Orange Citrus', shopifyHandle: 'orange-citrus', description: 'Colors: White and orange roses.\nPaper: Peach.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas blancas y naranjas.\nPapel: Melocotón.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/14.png?v=1774610789`, image2: `${CDN}/22_203bcb9c-de86-467e-99f8-abf99e5a034e.png?v=1774611351`, color: 'Naranja y Blanco', type: 'round', pricingTier: 'standard' },

  // Single - Natural
  { id: 'bq-round-7', name: 'Hot Pink Blush', shopifyHandle: 'hot-pink-blush', description: 'Colors: Hot pink roses.\nPaper: Pink.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas hot pink.\nPapel: Rosa.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/10_13e615d2-0e75-4583-a1bf-5b44f823ed23.png?v=1774610956`, image2: `${CDN}/3_813160a1-5301-4924-8104-0d68526cc63b.png?v=1774611351`, color: 'Hot Pink', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Red
  { id: 'bq-round-18', name: 'Classic Tricolor', shopifyHandle: 'classic-tricolor', description: 'Colors: Light pink and red roses.\nPaper: Peach.\nSizes: 75, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $116.', descriptionEs: 'Colores: Rosas rosa claro y rojas.\nPapel: Melocotón.\nTamaños: 75, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $116.', image: `${CDN}/13.png?v=1774610789`, image2: `${CDN}/19_a318d086-2c87-4b5e-ba78-50141e236d77.png?v=1774611351`, color: 'Rojo, Blanco y Pink', type: 'round', pricingTier: 'mix3red' },

  // Mix 2 - With Red
  { id: 'bq-round-34', name: 'Red Sweetness', shopifyHandle: 'red-sweetness', description: 'Colors: Light pink and hot pink roses.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas rosa claro y hot pink.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/12.png?v=1774610789`, image2: `${CDN}/17_d1f6e6d4-4408-4ba7-a0c5-df047c76ef58.png?v=1774611351`, color: 'Rojo y Pink', type: 'round', pricingTier: 'mix2' },

  // Single - Painted
  { id: 'bq-round-11', name: 'Deep Night', shopifyHandle: 'deep-night', description: 'Colors: Black painted roses.\nPaper: White.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $136.', descriptionEs: 'Colores: Rosas negras pintadas.\nPapel: Blanco.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $136.', image: `${CDN}/8_e5f14e13-bc9d-4cbb-bf31-8bd4994ba36c.png?v=1774610954`, image2: `${CDN}/20_f4c1ec83-306f-4c5c-92d7-db282bb6706c.png?v=1774611351`, color: 'Negro', type: 'round', pricingTier: 'painted' },

  // 3 colors - Natural without red
  { id: 'bq-round-24', name: 'Warm Sunset', shopifyHandle: 'warm-sunset', description: 'Colors: White, orange, and purple roses.\nNote: Purple roses may be substituted with hot pink depending on availability.\nPaper: Brown.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $131.', descriptionEs: 'Colores: Rosas blancas, naranjas y moradas.\nNota: Las rosas moradas pueden sustituirse por hot pink según disponibilidad.\nPapel: Marrón.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: `${CDN}/2.png?v=1774610789`, image2: `${CDN}/6_1a90e2f1-617c-4ddc-81e4-d251ffc2d02b.png?v=1774611351`, color: 'Naranja, Hot Pink y Blanco', type: 'round', pricingTier: 'standard' },

  // Mix 2 - Girasoles
  { id: 'bq-round-28', name: 'Sunflowers & Passion', shopifyHandle: 'sunflowers-passion', description: 'Colors: Sunflowers and red roses.\nPaper: Black.\nSizes: 50, 100, and 150 roses with sunflowers.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $146.', descriptionEs: 'Colores: Girasoles y rosas rojas.\nPapel: Negro.\nTamaños: 50, 100 y 150 rosas con girasoles.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $146.', image: `${CDN}/7.png?v=1774610789`, image2: `${CDN}/11_ef3d6f5c-0e8d-483d-8a57-8e431f98e364.png?v=1774611351`, color: 'Girasoles y Rojo', type: 'round', pricingTier: 'mix2', customSizes: [{ roses: 50, price: 146, label: '50 red roses + 8 sunflowers' }, { roses: 100, price: 306, label: '100 red roses + 22 sunflowers' }, { roses: 150, price: 426, label: '150 red roses + 22 sunflowers' }] },

  // Single - Natural
  { id: 'bq-round-19', name: 'Orange Sunset', shopifyHandle: 'orange-sunset', description: 'Colors: Orange roses.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas naranjas.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/2_4ce938e3-ed17-43ba-93c8-4bb90bd8f839.png?v=1774610955`, image2: `${CDN}/4_049f315b-d1dc-4503-8cd9-eb4892b00e4f.png?v=1774611351`, color: 'Naranja', type: 'round', pricingTier: 'standard' },

  // Mix 2 - With Red
  { id: 'bq-round-40', name: 'Dark Romance', shopifyHandle: 'dark-romance', description: 'Colors: Hot pink and red roses.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $121.', descriptionEs: 'Colores: Rosas hot pink y rojas.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $121.', image: `${CDN}/20.png?v=1774610789`, image2: `${CDN}/29.png?v=1774611351`, color: 'Rojo y Hot Pink', type: 'round', pricingTier: 'mix2' },

  // 3 colors - Natural without red
  { id: 'bq-round-39', name: 'Soft Spring', shopifyHandle: 'soft-spring', description: 'Colors: White, light pink, and yellow roses.\nPaper: Light pink.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $131.', descriptionEs: 'Colores: Rosas blancas, rosa claro y amarillas.\nPapel: Rosa claro.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: `${CDN}/19.png?v=1774610789`, image2: `${CDN}/28.png?v=1774611352`, color: 'Amarillo, Pink y Blanco', type: 'round', pricingTier: 'standard' },

  // Single - Natural
  { id: 'bq-round-6', name: 'Pure White', shopifyHandle: 'pure-white', description: 'Colors: White roses.\nPaper: White.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas blancas.\nPapel: Blanco.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/7_66d51745-8450-43cc-9f6d-acf138fc2d81.png?v=1774610955`, image2: `${CDN}/18_9f989947-5cb9-41ab-bd2c-4f4ce0338ed3.png?v=1774611351`, color: 'Blanco', type: 'round', pricingTier: 'standard' },

  // Mix 2 - Natural + Painted
  { id: 'bq-round-38', name: 'White Ocean', shopifyHandle: 'white-ocean', description: 'Colors: Blue painted and white roses.\nPaper: Blue.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $121.', descriptionEs: 'Colores: Rosas azules pintadas y blancas.\nPapel: Azul.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $121.', image: `${CDN}/17.png?v=1774610789`, image2: `${CDN}/26_89f6f108-2ce7-418a-90da-46eac59f98fc.png?v=1774611352`, color: 'Azul y Blanco', type: 'round', pricingTier: 'mix2painted' },

  // Mix 2 - With Red
  { id: 'bq-round-27', name: 'Iberian Passion', shopifyHandle: 'iberian-passion', description: 'Colors: Yellow and red roses.\nPaper: Beige.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $91.', descriptionEs: 'Colores: Rosas amarillas y rojas.\nPapel: Beige.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $91.', image: `${CDN}/6.png?v=1774610789`, image2: `${CDN}/10_edf36aaa-454f-4f98-8b86-7218143de468.png?v=1774611352`, color: 'Rojo y Amarillo', type: 'round', pricingTier: 'mix2' },

  // Single - Natural
  { id: 'bq-round-12', name: 'Purple Charm', shopifyHandle: 'purple-charm', description: 'Colors: Purple roses.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas moradas.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/6_76f89215-f151-4ae3-858e-7b39b5aeb37f.png?v=1774610954`, image2: `${CDN}/33.png?v=1774611352`, color: 'Morado', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Painted
  { id: 'bq-round-36', name: 'Imperial Bee', shopifyHandle: 'imperial-bee', description: 'Colors: White, yellow, and black painted roses.\nPaper: Light purple.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $161.', descriptionEs: 'Colores: Rosas blancas, amarillas y negras pintadas.\nPapel: Lila.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $161.', image: `${CDN}/15.png?v=1774610789`, image2: `${CDN}/23_69e8f416-037f-4416-9f9a-15a4b4ab64dd.png?v=1774611351`, color: 'Amarillo, Negro y Blanco', type: 'round', pricingTier: 'mix2painted' },

  // Mix 2 - Natural without red
  { id: 'bq-round-13', name: 'Pink & White Dawn', shopifyHandle: 'pink-white-dawn', description: 'Colors: Light pink, hot pink, and white roses.\nPaper: Pink.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas rosa claro, hot pink y blancas.\nPapel: Rosa.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/10.png?v=1774610789`, image2: `${CDN}/14_c088f644-9fa6-4fc6-99ba-6c3655554f7e.png?v=1774611351`, color: 'Hot Pink y Blanco', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Red
  { id: 'bq-round-25', name: 'Intense Romance', shopifyHandle: 'intense-romance', description: 'Colors: Pink, white, and purple roses.\nPaper: Light pink.\nSizes: 75, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $131.', descriptionEs: 'Colores: Rosas pink, blancas y moradas.\nPapel: Rosa claro.\nTamaños: 75, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: `${CDN}/4.png?v=1774610789`, image2: `${CDN}/8_6cc51f79-f007-4876-9a7a-a4def98a68e3.png?v=1774611351`, color: 'Rojo, Morado y Blanco', type: 'round', pricingTier: 'mix3red' },

  // Mix 2 - Natural + Painted
  { id: 'bq-round-42', name: 'Dark Pink Elegance', shopifyHandle: 'dark-pink-elegance', description: 'Colors: Pink and black painted roses.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $121.', descriptionEs: 'Colores: Rosas pink y negras pintadas.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $121.', image: `${CDN}/21.png?v=1774610789`, image2: `${CDN}/30.png?v=1774611351`, color: 'Pink y Negro', type: 'round', pricingTier: 'mix2painted' },

  // Mix 2 - Natural without red
  { id: 'bq-round-32', name: 'Citrus Refresh', shopifyHandle: 'citrus-refresh', description: 'Colors: White, yellow, and orange roses.\nPaper: Brown.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $106.', descriptionEs: 'Colores: Rosas blancas, amarillas y naranjas.\nPapel: Marrón.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $106.', image: `${CDN}/11.png?v=1774610789`, image2: `${CDN}/15_1d277f4a-67ae-432e-a58e-a0a278ee8732.png?v=1774611351`, color: 'Naranja y Amarillo', type: 'round', pricingTier: 'standard' },

  // 3 colors - Natural without red
  { id: 'bq-round-33', name: 'Light Citrus', shopifyHandle: 'light-citrus', description: 'Colors: Yellow and orange roses.\nPaper: Brown.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas amarillas y naranjas.\nPapel: Marrón.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/18.png?v=1774610789`, image2: `${CDN}/27.png?v=1774611352`, color: 'Naranja, Amarillo y Blanco', type: 'round', pricingTier: 'standard' },

  // Mix 2 - With Red
  { id: 'bq-round-43', name: 'Passionate Love', shopifyHandle: 'passionate-love', description: 'Colors: Red and purple roses.\nPaper: Pink.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $121.', descriptionEs: 'Colores: Rosas rojas y moradas.\nPapel: Rosa.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $121.', image: `${CDN}/22.png?v=1774610789`, image2: `${CDN}/31.png?v=1774611351`, color: 'Rojo y Pink', type: 'round', pricingTier: 'mix2' },

  // Mix 2 - Natural without red
  { id: 'bq-round-44', name: 'Infinite Tenderness', shopifyHandle: 'infinite-tenderness', description: 'Colors: Light pink and white roses.\nPaper: Pink.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas rosa claro y blancas.\nPapel: Rosa.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/25.png?v=1774610789`, image2: `${CDN}/35.png?v=1774611351`, color: 'Pink y Blanco', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Red
  { id: 'bq-round-46', name: 'Tricolor Love', shopifyHandle: 'tricolor-love', description: 'Colors: Red, white, and light pink roses.\nPaper: Pink.\nSizes: 75, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $116.', descriptionEs: 'Colores: Rosas rojas, blancas y rosa claro.\nPapel: Rosa.\nTamaños: 75, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $116.', image: `${CDN}/24.png?v=1774610789`, image2: `${CDN}/34.png?v=1774611351`, color: 'Rojo, Pink y Blanco', type: 'round', pricingTier: 'mix3red' },

  // 3 colors - Natural without red
  { id: 'bq-round-47', name: 'Pink Symphony', shopifyHandle: 'pink-symphony', description: 'Colors: Pink, white, and red roses.\nPaper: Pink.\nSizes: 75, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $116.', descriptionEs: 'Colores: Rosas pink, blancas y rojas.\nPapel: Rosa.\nTamaños: 75, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $116.', image: `${CDN}/23.png?v=1774610789`, image2: `${CDN}/32.png?v=1774611351`, color: 'Pink, Hot Pink, Amarillo y Blanco', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Painted
  { id: 'bq-round-45', name: 'Elegant Passion', shopifyHandle: 'elegant-passion', description: 'Colors: White and red roses.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nFinish: Natural, glitter, or painted.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $91.', descriptionEs: 'Colores: Rosas blancas y rojas.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $91.', image: `${CDN}/26.png?v=1774610789`, image2: `${CDN}/36.png?v=1774611351`, color: 'Rojo y Blanco', type: 'round', pricingTier: 'mix2' },

  // === Zodiac Bouquets (from Shopify) ===
  { id: 'bq-zodiac-aries', name: 'Aries Bouquet', shopifyHandle: 'aries-bouquet', description: 'Colors: Green flowers with Aries glyph and baby breath.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $131.', descriptionEs: 'Colores: Flores verdes con símbolo de Aries y baby breath.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: `${CDN}/4_98c38410-9d4b-4365-bfa7-9927b7ca4ea3.png?v=1774610984`, color: 'Verde', type: 'round', pricingTier: 'standard', customSizes: [{ roses: 50, price: 131 }, { roses: 75, price: 156 }, { roses: 100, price: 191 }, { roses: 125, price: 256 }, { roses: 150, price: 281 }, { roses: 175, price: 306 }, { roses: 200, price: 356 }] },
  { id: 'bq-zodiac-taurus', name: 'Taurus Bouquet', shopifyHandle: 'taurus-bouquet', description: 'Colors: Black flowers with Taurus glyph and baby breath.\nPaper: White.\nSizes: 50, 100, 150, and 200 roses.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $191.', descriptionEs: 'Colores: Flores negras con símbolo de Tauro y baby breath.\nPapel: Blanco.\nTamaños: 50, 100, 150 y 200 rosas.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $191.', image: `${CDN}/10_94d6885b-f94c-445b-91d1-27ccbabf278d.png?v=1774610985`, color: 'Negro', type: 'round', pricingTier: 'standard', customSizes: [{ roses: 50, price: 191 }, { roses: 75, price: 246 }, { roses: 100, price: 311 }, { roses: 125, price: 406 }, { roses: 150, price: 461 }, { roses: 175, price: 516 }, { roses: 200, price: 596 }] },
  { id: 'bq-zodiac-gemini', name: 'Gemini Bouquet', shopifyHandle: 'gemini-bouquet', description: 'Colors: Orange flowers with Gemini glyph and baby breath.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $131.', descriptionEs: 'Colores: Flores naranjas con símbolo de Géminis y baby breath.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: `${CDN}/1_a9459317-310f-4b89-ae07-5eb0b7d94e8b.png?v=1774610984`, color: 'Naranja', type: 'round', pricingTier: 'standard', customSizes: [{ roses: 50, price: 131 }, { roses: 75, price: 156 }, { roses: 100, price: 191 }, { roses: 125, price: 256 }, { roses: 150, price: 281 }, { roses: 175, price: 306 }, { roses: 200, price: 356 }] },
  { id: 'bq-zodiac-cancer', name: 'Cancer Bouquet', shopifyHandle: 'cancer-bouquet', description: 'Colors: Blue flowers with Cancer glyph and baby breath.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $191.', descriptionEs: 'Colores: Flores azules con símbolo de Cáncer y baby breath.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $191.', image: `${CDN}/2_2c0c3e34-098e-4ba6-ba7e-f0edaa470b0e.png?v=1774610985`, color: 'Azul', type: 'round', pricingTier: 'standard', customSizes: [{ roses: 50, price: 191 }, { roses: 75, price: 246 }, { roses: 100, price: 311 }, { roses: 125, price: 406 }, { roses: 150, price: 461 }, { roses: 175, price: 516 }, { roses: 200, price: 596 }] },
  { id: 'bq-zodiac-leo', name: 'Leo Bouquet', shopifyHandle: 'leo-bouquet', description: 'Colors: Yellow flowers with Leo glyph and baby breath.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $131.', descriptionEs: 'Colores: Flores amarillas con símbolo de Leo y baby breath.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: `${CDN}/8_b5b2f98b-a9dc-4246-86cf-b8f14dd5fbf1.png?v=1774610985`, color: 'Amarillo', type: 'round', pricingTier: 'standard', customSizes: [{ roses: 50, price: 131 }, { roses: 75, price: 156 }, { roses: 100, price: 191 }, { roses: 125, price: 256 }, { roses: 150, price: 281 }, { roses: 175, price: 306 }, { roses: 200, price: 356 }] },
  { id: 'bq-zodiac-virgo', name: 'Virgo Bouquet', shopifyHandle: 'virgo-bouquet', description: 'Colors: Purple flowers with Virgo glyph and baby breath.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $131.', descriptionEs: 'Colores: Flores moradas con símbolo de Virgo y baby breath.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: `${CDN}/3_6d7c7dd4-4403-4810-a587-c852b0a85c5b.png?v=1774610985`, color: 'Morado', type: 'round', pricingTier: 'standard', customSizes: [{ roses: 50, price: 131 }, { roses: 75, price: 156 }, { roses: 100, price: 191 }, { roses: 125, price: 256 }, { roses: 150, price: 281 }, { roses: 175, price: 306 }, { roses: 200, price: 356 }] },
  { id: 'bq-zodiac-libra', name: 'Libra Bouquet', shopifyHandle: 'libra-bouquet', description: 'Colors: Hot pink flowers with Libra glyph and baby breath.\nPaper: Pink.\nSizes: 50, 100, 150, and 200 roses.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $131.', descriptionEs: 'Colores: Flores hot pink con símbolo de Libra y baby breath.\nPapel: Rosa.\nTamaños: 50, 100, 150 y 200 rosas.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: `${CDN}/6_6c9b7961-a4a8-438e-b515-2f7431f68492.png?v=1774610985`, color: 'Hot Pink', type: 'round', pricingTier: 'standard', customSizes: [{ roses: 50, price: 131 }, { roses: 75, price: 156 }, { roses: 100, price: 191 }, { roses: 125, price: 256 }, { roses: 150, price: 281 }, { roses: 175, price: 306 }, { roses: 200, price: 356 }] },
  { id: 'bq-zodiac-scorpio', name: 'Scorpio Bouquet', shopifyHandle: 'scorpio-bouquet', description: 'Colors: Light pink flowers with Scorpio glyph and baby breath.\nPaper: White.\nSizes: 50, 100, 150, and 200 roses.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $131.', descriptionEs: 'Colores: Flores rosa claro con símbolo de Escorpio y baby breath.\nPapel: Blanco.\nTamaños: 50, 100, 150 y 200 rosas.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: `${CDN}/7_ae458d0d-d617-4e14-b611-76dd47515cdd.png?v=1774610985`, color: 'Pink', type: 'round', pricingTier: 'standard', customSizes: [{ roses: 50, price: 131 }, { roses: 75, price: 156 }, { roses: 100, price: 191 }, { roses: 125, price: 256 }, { roses: 150, price: 281 }, { roses: 175, price: 306 }, { roses: 200, price: 356 }] },
  { id: 'bq-zodiac-sagittarius', name: 'Sagittarius Bouquet', shopifyHandle: 'sagittarius-bouquet', description: 'Colors: Red flowers with Sagittarius glyph and baby breath.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $161.', descriptionEs: 'Colores: Flores rojas con símbolo de Sagitario y baby breath.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $161.', image: `${CDN}/5_d0e94289-d056-4354-8c88-edc79ba8da7d.png?v=1774610984`, color: 'Rojo', type: 'round', pricingTier: 'standard', customSizes: [{ roses: 50, price: 161 }, { roses: 75, price: 201 }, { roses: 100, price: 251 }, { roses: 125, price: 331 }, { roses: 150, price: 371 }, { roses: 175, price: 411 }, { roses: 200, price: 476 }] },
  { id: 'bq-zodiac-capricorn', name: 'Capricorn Bouquet', shopifyHandle: 'capricorn-bouquet', description: 'Colors: Red flowers with Capricorn glyph and baby breath.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $161.', descriptionEs: 'Colores: Flores rojas con símbolo de Capricornio y baby breath.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $161.', image: `${CDN}/12_6e63d665-e716-4ea9-bda5-c1c0b4b3d946.png?v=1774610985`, color: 'Rojo', type: 'round', pricingTier: 'standard', customSizes: [{ roses: 50, price: 161 }, { roses: 75, price: 201 }, { roses: 100, price: 251 }, { roses: 125, price: 331 }, { roses: 150, price: 371 }, { roses: 175, price: 411 }, { roses: 200, price: 476 }] },
  { id: 'bq-zodiac-aquarius', name: 'Aquarius Bouquet', shopifyHandle: 'aquarius-bouquet', description: 'Colors: Red flowers with Aquarius glyph and baby breath.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $161.', descriptionEs: 'Colores: Flores rojas con símbolo de Acuario y baby breath.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $161.', image: `${CDN}/11_3a031d75-378a-4d75-b477-37ecca4e5234.png?v=1774610985`, color: 'Rojo', type: 'round', pricingTier: 'standard', customSizes: [{ roses: 50, price: 161 }, { roses: 75, price: 201 }, { roses: 100, price: 251 }, { roses: 125, price: 331 }, { roses: 150, price: 371 }, { roses: 175, price: 411 }, { roses: 200, price: 476 }] },
  { id: 'bq-zodiac-pisces', name: 'Pisces Bouquet', shopifyHandle: 'pisces-bouquet', description: 'Colors: Blue flowers with Pisces glyph and baby breath.\nPaper: Black.\nSizes: 50, 100, 150, and 200 roses.\nDelivery: Same-day up to 87 miles. Free pickup in Miami, FL.\nFrom $191.', descriptionEs: 'Colores: Flores azules con símbolo de Piscis y baby breath.\nPapel: Negro.\nTamaños: 50, 100, 150 y 200 rosas.\nEnvío: Mismo día hasta 87 millas. Recogida gratis en Miami, FL.\nDesde $191.', image: `${CDN}/9_ae25c0c3-54e8-4b6d-9adc-3b4475e60cad.png?v=1774610984`, color: 'Azul', type: 'round', pricingTier: 'standard', customSizes: [{ roses: 50, price: 191 }, { roses: 75, price: 246 }, { roses: 100, price: 311 }, { roses: 125, price: 406 }, { roses: 150, price: 461 }, { roses: 175, price: 516 }, { roses: 200, price: 596 }] },
];

export const bouquetSizeOptions = pricingTable;
