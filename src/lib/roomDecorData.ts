const CDN = 'https://cdn.shopify.com/s/files/1/0979/1671/5140/files';

export interface RoomDecorAddon {
  label: string;
  labelEs?: string;
  price: number; // 0 = free (complementary)
}

export interface RoomDecorPackage {
  id: string;
  name: string;
  shopifyHandle: string;
  shopifyVariantId: string;
  price: number;
  description: string;
  descriptionEs?: string;
  image: string;
  includes: string[];
  includesEs?: string[];
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
    descriptionEs: 'Transforma cualquier habitación en un paraíso romántico con nuestro servicio de decoración Love Bomb en Miami. Perfecto para aniversarios, San Valentín y propuestas sorpresa. Incluye arreglos florales premium, velas y montaje personalizado. Disponible para reserva el mismo día. Consulta gratuita incluida.',
    image: `${CDN}/1_fca2072b-02a2-4f7a-a489-8a7bcb428241.png?v=1774615718`,
    includes: [
      '15 Ceiling Balloons',
      '10 Balloons on the floor',
      '6 Heart shaped Balloons',
      'Ribbon Bows on Pillows',
      'Rose Petal Walk Way',
      'LED Lights',
    ],
    includesEs: [
      '15 globos en el techo',
      '10 globos en el suelo',
      '6 globos con forma de corazón',
      'Lazos de cinta en las almohadas',
      'Pasillo de pétalos de rosa',
      'Luces LED',
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
    descriptionEs: 'Lleva el romance al siguiente nivel con nuestro servicio de decoración Overly Romantic en Miami. Ideal para citas sorpresa, aniversarios y celebraciones especiales. Incluye un montaje floral y decorativo de alto nivel adaptado a tu visión. Disponible para reserva el mismo día.',
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
    includesEs: [
      '25 globos en el techo',
      'Rosas adheridas a los globos del techo',
      '10 globos con forma de corazón',
      'Pétalos de rosa en forma de corazón sobre la cama',
      'Pasillo de pétalos de rosa',
      'Luces LED',
      'Lazos de cinta en la almohada',
      '15 globos en el suelo',
      'Ramo de 50 rosas incluido *',
    ],
    bouquetIncluded: { roses: 50, restrictionsApply: true },
    ribbonOption: { price: 25 },
    addons: [
      { label: 'Gold butter butterflies', labelEs: 'Mariposas doradas', price: 0 },
      { label: 'Any 2 colored small Bows', labelEs: '2 pequeños lazos de colores', price: 0 },
      { label: '1 small crown Gold/Silver', labelEs: '1 corona pequeña dorada/plateada', price: 0 },
      { label: 'Bouquet add-on Banner', labelEs: 'Banner adicional para el ramo', price: 20 },
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
    descriptionEs: 'Nuestra experiencia romántica más completa en Miami. El Deluxe Love Package incluye una transformación total de la habitación con flores premium, velas, pétalos de rosa y decoración personalizada — todo lo que necesitas para una sorpresa inolvidable. Perfecto para propuestas, aniversarios y celebraciones importantes. Disponible para reserva el mismo día.',
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
    includesEs: [
      '35 globos en el techo',
      'Rosas adheridas a los globos del techo',
      '25 globos con forma de corazón',
      'Pétalos de rosa en forma de corazón sobre la cama',
      'Pasillo de pétalos de rosa',
      'Luces LED',
      'Lazos de cinta en la almohada',
      '25 globos en el suelo',
      'Ferrero Rocher (42 unidades)',
      'Globo grande con forma de corazón',
      'Oso de peluche tamaño mediano *',
      'Ramo de 75 rosas incluido *',
    ],
    bouquetIncluded: { roses: 75, restrictionsApply: true },
    ribbonOption: null,
    addons: [
      { label: 'Customizable balloon banner', labelEs: 'Banner de globos personalizable', price: 0 },
      { label: 'Printed pictures attached to balloons', labelEs: 'Fotos impresas adheridas a los globos', price: 0 },
      { label: 'Printed picture on a 4 by 6 frame', labelEs: 'Foto impresa en marco 4x6', price: 0 },
      { label: 'Added Bows or crown on the Bouquet', labelEs: 'Lazos o corona adicional en el ramo', price: 0 },
      { label: 'Birthday Sash', labelEs: 'Banda de cumpleaños', price: 0 },
      { label: 'Customizable letter/Note of your choosing', labelEs: 'Carta/nota personalizable', price: 0 },
      { label: 'Customizable banner on bouquet', labelEs: 'Banner personalizable en el ramo', price: 0 },
    ],
    maxAddons: 2,
    freeDeliveryMiles: 10,
  },
];
