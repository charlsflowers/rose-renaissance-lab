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
  { id: 'bq-round-1', name: 'Elegancia Roja y Blanca', description: 'Mix de rosas rojas y blancas en ramo redondo', image: '', color: 'Rojo y Blanco', type: 'round' },
  { id: 'bq-round-2', name: 'Romance Hot Pink', description: 'Mix de rosas rojas y hot pink en ramo redondo', image: '', color: 'Rojo y Hot Pink', type: 'round' },
  { id: 'bq-round-3', name: 'Misterio Nocturno', description: 'Mix de rosas rojas y negras en ramo redondo', image: '', color: 'Rojo y Negro', type: 'round' },
  { id: 'bq-round-4', name: 'Dulzura Bicolor', description: 'Mix de rosas light pink y blancas en ramo redondo', image: '', color: 'Light Pink y Blanco', type: 'round' },
  // Heart
  { id: 'bq-heart-1', name: 'Corazón Rojo y Blanco', description: 'Bouquet corazón con rosas rojas y blancas', image: '', color: 'Rojo y Blanco', type: 'heart' },
  { id: 'bq-heart-2', name: 'Corazón Rosa Intenso', description: 'Bouquet corazón con rosas rojas y hot pink', image: '', color: 'Rojo y Hot Pink', type: 'heart' },
  { id: 'bq-heart-3', name: 'Corazón Elegante', description: 'Bouquet corazón con rosas negras y rojas', image: '', color: 'Rojo y Negro', type: 'heart' },
  { id: 'bq-heart-4', name: 'Corazón Suave', description: 'Bouquet corazón con rosas light pink y blancas', image: '', color: 'Light Pink y Blanco', type: 'heart' },
];

export const bouquetSizeOptions = [
  { roses: 50, price: 91 },
  { roses: 75, price: 116 },
  { roses: 100, price: 176 },
  { roses: 125, price: 231 },
  { roses: 150, price: 271 },
  { roses: 175, price: 296 },
  { roses: 200, price: 361 },
];
