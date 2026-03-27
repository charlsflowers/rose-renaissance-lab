import roomDecorImg from '@/assets/room-decor.jpg';

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
export const roomDecorBouquetColors = [
  'Blanco',
  'Hot Pink',
  'Pink',
  'Morado',
  'Naranja',
  'Amarillo',
];

export const roomDecorPackages: RoomDecorPackage[] = [
  {
    id: 'rd-love-bomb',
    name: 'Love Bomb',
    price: 350,
    description: 'A romantic explosion of love for an unforgettable surprise',
    image: roomDecorImg,
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
    id: 'rd-overly-romantic',
    name: 'Overly Romantic',
    price: 480,
    description: 'The ultimate romantic experience with a 50-rose bouquet included',
    image: roomDecorImg,
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
    id: 'rd-deluxe-love',
    name: 'Deluxe Love Package',
    price: 835,
    description: 'The most complete and luxurious room decor with a 75-rose bouquet',
    image: roomDecorImg,
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
