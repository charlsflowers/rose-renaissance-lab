const CDN = 'https://cdn.shopify.com/s/files/1/0979/1671/5140/files';

export interface RoomDecorAddon {
  label: string;
  price: number; // 0 = free (complementary)
}

export interface RoomDecorPackage {
  id: string;
  name: string;
  shopifyHandle: string;
  shopifyVariantId: string;
  price: number;
  description: string;
  image: string;
  includes: string[];
  /** Bouquet included (color selection needed) */
  bouquetIncluded: { roses: number; restrictionsApply: boolean } | null;
  /** Ribbon for bouquet (Overly Romantic only) */
  ribbonOption: { price: number } | null;
  /** Complementary add-ons - user picks N */
  addons: RoomDecorAddon[];
  maxAddons: number;
  /** Delivery: 0-10 miles free, $1.60/mile after */
  freeDeliveryMiles: number;
}

/** Natural bouquet colors available (all natural EXCEPT red) */
export interface RoomDecorBouquetColor {
  name: string;
  image: string;
}

export const roomDecorBouquetColors: RoomDecorBouquetColor[] = [
  { name: 'White',    image: `${CDN}/7_66d51745-8450-43cc-9f6d-acf138fc2d81.png?v=1774610955` },
  { name: 'Hot Pink', image: `${CDN}/10_13e615d2-0e75-4583-a1bf-5b44f823ed23.png?v=1774610956` },
  { name: 'Pink',     image: `${CDN}/5_e69dee54-c820-4910-95cb-130b55626cda.png?v=1774610955` },
  { name: 'Purple',   image: `${CDN}/6_76f89215-f151-4ae3-858e-7b39b5aeb37f.png?v=1774610954` },
  { name: 'Orange',   image: `${CDN}/2_4ce938e3-ed17-43ba-93c8-4bb90bd8f839.png?v=1774610955` },
  { name: 'Yellow',   image: `${CDN}/4_64454122-543f-42d2-b5dd-0c63e33d023e.png?v=1774610954` },
];

export const roomDecorPackages: RoomDecorPackage[] = [
  {
    id: 'love-bomb',
    name: 'Love Bomb',
    shopifyHandle: 'love-bomb',
    shopifyVariantId: 'gid://shopify/ProductVariant/51693066223748',
    price: 350,
    description: 'Transform any room into a romantic paradise with our Love Bomb decoration service in Miami. Perfect for anniversaries, Valentine\'s Day, and surprise proposals. Includes premium floral arrangements, candles, and personalized setup. Available for same-day booking. Free consultation included.',
    image: `${CDN}/1_fca2072b-02a2-4f7a-a489-8a7bcb428241.png?v=1774615718`,
    includes: [
      '15 Ceiling Balloons',
      '10 Balloons on the floor',
      '6 Heart shaped Balloons',
      'Ribbon Bows on Pillows',
      'Rose Petal Walk Way',
      'LED Lights',
    ],
    bouquetIncluded: null,
    ribbonOption: null,
    addons: [],
    maxAddons: 0,
    freeDeliveryMiles: 10,
  },
  {
    id: 'overly-romantic',
    name: 'Overly Romantic',
    shopifyHandle: 'overly-romantic',
    shopifyVariantId: 'gid://shopify/ProductVariant/51693066289284',
    price: 480,
    description: 'Take romance to the next level with our Overly Romantic room decoration service in Miami. Ideal for surprise date nights, anniversaries, and special celebrations. Includes an elevated floral and decor setup tailored to your vision. Available for same-day booking.',
    image: `${CDN}/2_0d55a7e0-0374-4149-93df-e0d9ffe75962.png?v=1774615718`,
    includes: [
      '25 Ceiling Balloons',
      'Roses attached to the ceiling Balloons',
      '10 Heart shaped balloons',
      'Rose petals in the form of a heart on the bed',
      'Rose petal walk way',
      'LED lights',
      'Ribbon Bows on pillow',
      '15 Balloons on the floor',
      '50 Rose Bouquet included *',
    ],
    bouquetIncluded: { roses: 50, restrictionsApply: true },
    ribbonOption: { price: 25 },
    addons: [
      { label: 'Gold butter butterflies', price: 0 },
      { label: 'Any 2 colored small Bows', price: 0 },
      { label: '1 small crown Gold/Silver', price: 0 },
      { label: 'Bouquet add-on Banner', price: 20 },
    ],
    maxAddons: 1,
    freeDeliveryMiles: 10,
  },
  {
    id: 'deluxe-love-package',
    name: 'Deluxe Love Package',
    shopifyHandle: 'deluxe-love-package',
    shopifyVariantId: 'gid://shopify/ProductVariant/51693066322052',
    price: 835,
    description: 'Our most complete romantic experience in Miami. The Deluxe Love Package includes a full room transformation with premium florals, candles, rose petals, and personalized decor — everything you need for an unforgettable surprise. Perfect for proposals, anniversaries, and milestone celebrations. Available for same-day booking.',
    image: `${CDN}/3_adaa192a-8c9b-41b5-8586-cb7e13640829.png?v=1774615718`,
    includes: [
      '35 Ceiling balloons',
      'Roses attached to the ceiling Balloons',
      '25 Heart shaped balloons',
      'Rose petals in the form of a heart on the bed',
      'Rose petal walk way',
      'LED lights',
      'Ribbon Bows on pillow',
      '25 Balloons on the floor',
      'Ferrero Rocher 42 count',
      'Big Heart Balloon',
      'Medium Size Teddy Bear *',
      '75 Rose Bouquet included *',
    ],
    bouquetIncluded: { roses: 75, restrictionsApply: true },
    ribbonOption: null,
    addons: [
      { label: 'Customizable balloon banner', price: 0 },
      { label: 'Printed pictures attached to balloons', price: 0 },
      { label: 'Printed picture on a 4 by 6 frame', price: 0 },
      { label: 'Added Bows or crown on the Bouquet', price: 0 },
      { label: 'Birthday Sash', price: 0 },
      { label: 'Customizable letter/Note of your choosing', price: 0 },
      { label: 'Customizable banner on bouquet', price: 0 },
    ],
    maxAddons: 2,
    freeDeliveryMiles: 10,
  },
];
