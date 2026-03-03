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
  // Round (20 products)
  { id: 'bq-round-1', name: 'Elegancia Roja y Blanca', description: 'Mix de rosas rojas y blancas en ramo redondo', image: '', color: 'Rojo y Blanco', type: 'round' },
  { id: 'bq-round-2', name: 'Romance Hot Pink', description: 'Mix de rosas rojas y hot pink en ramo redondo', image: '', color: 'Rojo y Hot Pink', type: 'round' },
  { id: 'bq-round-3', name: 'Misterio Nocturno', description: 'Mix de rosas rojas y negras en ramo redondo', image: '', color: 'Rojo y Negro', type: 'round' },
  { id: 'bq-round-4', name: 'Dulzura Bicolor', description: 'Mix de rosas light pink y blancas en ramo redondo', image: '', color: 'Light Pink y Blanco', type: 'round' },
  { id: 'bq-round-5', name: 'Pasión Total', description: 'Ramo redondo de rosas rojas puras', image: '', color: 'Rojo', type: 'round' },
  { id: 'bq-round-6', name: 'Pureza Blanca', description: 'Ramo redondo de rosas blancas', image: '', color: 'Blanco', type: 'round' },
  { id: 'bq-round-7', name: 'Rosa Intenso', description: 'Ramo redondo de rosas hot pink vibrantes', image: '', color: 'Hot Pink', type: 'round' },
  { id: 'bq-round-8', name: 'Ternura Rosa', description: 'Ramo redondo de rosas light pink suaves', image: '', color: 'Light Pink', type: 'round' },
  { id: 'bq-round-9', name: 'Atardecer Dorado', description: 'Mix de rosas amarillas y naranjas', image: '', color: 'Amarillo y Naranja', type: 'round' },
  { id: 'bq-round-10', name: 'Cielo Azul', description: 'Ramo redondo de rosas azules pintadas', image: '', color: 'Azul', type: 'round' },
  { id: 'bq-round-11', name: 'Noche Profunda', description: 'Ramo redondo de rosas negras elegantes', image: '', color: 'Negro', type: 'round' },
  { id: 'bq-round-12', name: 'Encanto Morado', description: 'Ramo redondo de rosas moradas', image: '', color: 'Morado', type: 'round' },
  { id: 'bq-round-13', name: 'Amanecer Rosa y Blanco', description: 'Mix delicado de rosas hot pink y blancas', image: '', color: 'Hot Pink y Blanco', type: 'round' },
  { id: 'bq-round-14', name: 'Fuego y Hielo', description: 'Contraste de rosas rojas y azules', image: '', color: 'Rojo y Azul', type: 'round' },
  { id: 'bq-round-15', name: 'Jardín Primaveral', description: 'Mix de rosas amarillas y blancas', image: '', color: 'Amarillo y Blanco', type: 'round' },
  { id: 'bq-round-16', name: 'Luna de Plata', description: 'Ramo redondo de rosas grises y blancas', image: '', color: 'Gris y Blanco', type: 'round' },
  { id: 'bq-round-17', name: 'Seducción Bicolor', description: 'Mix de rosas moradas y hot pink', image: '', color: 'Morado y Hot Pink', type: 'round' },
  { id: 'bq-round-18', name: 'Tricolor Clásico', description: 'Mix de rosas rojas, blancas y light pink', image: '', color: 'Rojo, Blanco y Light Pink', type: 'round' },
  { id: 'bq-round-19', name: 'Ocaso Naranja', description: 'Ramo redondo de rosas naranjas vibrantes', image: '', color: 'Naranja', type: 'round' },
  { id: 'bq-round-20', name: 'Sol Radiante', description: 'Ramo redondo de rosas amarillas luminosas', image: '', color: 'Amarillo', type: 'round' },
  // Heart
  { id: 'bq-heart-1', name: 'Corazón Rojo y Blanco', description: 'Bouquet corazón con rosas rojas y blancas', image: '', color: 'Rojo y Blanco', type: 'heart' },
  { id: 'bq-heart-2', name: 'Corazón Rosa Intenso', description: 'Bouquet corazón con rosas rojas y hot pink', image: '', color: 'Rojo y Hot Pink', type: 'heart' },
  { id: 'bq-heart-3', name: 'Corazón Elegante', description: 'Bouquet corazón con rosas negras y rojas', image: '', color: 'Rojo y Negro', type: 'heart' },
  { id: 'bq-heart-4', name: 'Corazón Suave', description: 'Bouquet corazón con rosas light pink y blancas', image: '', color: 'Light Pink y Blanco', type: 'heart' },
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
