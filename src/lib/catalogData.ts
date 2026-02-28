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

export interface BouquetProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  color: string;
  type: 'round' | 'heart';
}

export interface CategoryInfo {
  slug: string;
  title: string;
  description: string;
}

export const categories: CategoryInfo[] = [
  { slug: 'arreglos', title: 'Arreglos', description: 'Arreglos florales únicos para cada ocasión' },
  { slug: 'cajas', title: 'Cajas', description: 'Rosas frescas presentadas en cajas especiales' },
  { slug: 'cestas', title: 'Cestas', description: 'Cestas hechas a mano con flores frescas' },
  { slug: 'jarrones', title: 'Jarrones', description: 'Arreglos en jarrones de cristal' },
  { slug: 'osos', title: 'Osos', description: 'Adorables osos hechos completamente de rosas' },
];

export const categoryProducts: Record<string, CatalogProduct[]> = {
  arreglos: [
    { id: 'arr-1', name: 'Arreglo Primaveral', description: 'Arreglo fresco con rosas y follaje verde', image: '', sizes: [{ label: 'Pequeño', price: 45 }, { label: 'Mediano', price: 75 }, { label: 'Grande', price: 110 }] },
    { id: 'arr-2', name: 'Arreglo Elegante', description: 'Composición sofisticada en tonos pastel', image: '', sizes: [{ label: 'Pequeño', price: 55 }, { label: 'Mediano', price: 85 }, { label: 'Grande', price: 130 }] },
    { id: 'arr-3', name: 'Arreglo Romántico', description: 'Rosas rojas y blancas en armonía perfecta', image: '', sizes: [{ label: 'Pequeño', price: 50 }, { label: 'Mediano', price: 80 }, { label: 'Grande', price: 120 }] },
  ],
  cajas: [
    { id: 'caj-1', name: 'Caja Clásica', description: 'Rosas frescas en caja negra', image: '', sizes: [{ label: 'Pequeño', price: 65 }, { label: 'Mediano', price: 95 }, { label: 'Grande', price: 140 }] },
    { id: 'caj-2', name: 'Caja Corazón', description: 'Caja en forma de corazón con rosas', image: '', sizes: [{ label: 'Pequeño', price: 75 }, { label: 'Mediano', price: 110 }, { label: 'Grande', price: 160 }] },
    { id: 'caj-3', name: 'Caja Especial', description: 'Caja con rosas preservadas', image: '', sizes: [{ label: 'Pequeño', price: 85 }, { label: 'Mediano', price: 125 }, { label: 'Grande', price: 180 }] },
  ],
  cestas: [
    { id: 'ces-1', name: 'Cesta Campestre', description: 'Cesta rústica con flores silvestres', image: '', sizes: [{ label: 'Pequeño', price: 55 }, { label: 'Mediano', price: 85 }, { label: 'Grande', price: 125 }] },
    { id: 'ces-2', name: 'Cesta Grande', description: 'Cesta con rosas y lirios frescos', image: '', sizes: [{ label: 'Pequeño', price: 70 }, { label: 'Mediano', price: 100 }, { label: 'Grande', price: 150 }] },
    { id: 'ces-3', name: 'Cesta Frutal', description: 'Cesta con flores y frutas de temporada', image: '', sizes: [{ label: 'Pequeño', price: 60 }, { label: 'Mediano', price: 90 }, { label: 'Grande', price: 135 }] },
  ],
  jarrones: [
    { id: 'jar-1', name: 'Jarrón Cristal', description: 'Rosas en jarrón de cristal transparente', image: '', sizes: [{ label: 'Pequeño', price: 70 }, { label: 'Mediano', price: 105 }, { label: 'Grande', price: 155 }] },
    { id: 'jar-2', name: 'Jarrón Dorado', description: 'Arreglo bonito en jarrón dorado', image: '', sizes: [{ label: 'Pequeño', price: 85 }, { label: 'Mediano', price: 120 }, { label: 'Grande', price: 175 }] },
    { id: 'jar-3', name: 'Jarrón Vintage', description: 'Flores frescas en jarrón de cerámica', image: '', sizes: [{ label: 'Pequeño', price: 75 }, { label: 'Mediano', price: 110 }, { label: 'Grande', price: 160 }] },
  ],
  osos: [
    { id: 'oso-1', name: 'Oso de Rosas Rojo', description: 'Oso completamente cubierto de rosas rojas', image: '', sizes: [{ label: 'Pequeño', price: 90 }, { label: 'Mediano', price: 150 }, { label: 'Grande', price: 220 }] },
    { id: 'oso-2', name: 'Oso de Rosas Rosa', description: 'Oso adorable en rosas rosadas', image: '', sizes: [{ label: 'Pequeño', price: 90 }, { label: 'Mediano', price: 150 }, { label: 'Grande', price: 220 }] },
    { id: 'oso-3', name: 'Oso de Rosas Blanco', description: 'Oso elegante en rosas blancas', image: '', sizes: [{ label: 'Pequeño', price: 90 }, { label: 'Mediano', price: 150 }, { label: 'Grande', price: 220 }] },
  ],
};

export const bouquetProducts: BouquetProduct[] = [
  // Round
  { id: 'bq-round-1', name: 'Bouquet Rojo Clásico', description: 'Ramo redondo de rosas rojas frescas', image: '', color: 'Rojo', type: 'round' },
  { id: 'bq-round-2', name: 'Bouquet Rosa Pastel', description: 'Ramo redondo de rosas rosa suave', image: '', color: 'Rosa', type: 'round' },
  { id: 'bq-round-3', name: 'Bouquet Blanco Puro', description: 'Ramo redondo de rosas blancas frescas', image: '', color: 'Blanco', type: 'round' },
  // Heart
  { id: 'bq-heart-1', name: 'Corazón Rojo Pasión', description: 'Bouquet en forma de corazón con rosas rojas', image: '', color: 'Rojo', type: 'heart' },
  { id: 'bq-heart-2', name: 'Corazón Rosa Amor', description: 'Bouquet en forma de corazón con rosas rosa', image: '', color: 'Rosa', type: 'heart' },
  { id: 'bq-heart-3', name: 'Corazón Bicolor', description: 'Bouquet corazón combinando rojo y rosa', image: '', color: 'Bicolor', type: 'heart' },
];

export const bouquetSizeOptions = [
  { roses: 50, price: 76 },
  { roses: 75, price: 101 },
  { roses: 100, price: 136 },
  { roses: 125, price: 201 },
  { roses: 150, price: 226 },
  { roses: 175, price: 251 },
  { roses: 200, price: 301 },
];
