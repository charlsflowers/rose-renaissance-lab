import bqRound1Img from '@/assets/bq-round-1.png';
import bqRojoImg from '@/assets/bq-rojo.png';
import bqHotpinkImg from '@/assets/bq-hotpink.png';
import bqNaranjaImg from '@/assets/bq-naranja.png';
import bqLightpinkImg from '@/assets/bq-lightpink.png';
import bqVerdeImg from '@/assets/bq-verde.png';
import bqBlancoImg from '@/assets/bq-blanco.png';
import bqNegroImg from '@/assets/bq-negro.png';
import bqAzulImg from '@/assets/bq-azul.png';
import bqAmarilloImg from '@/assets/bq-amarillo.png';
import bqPinkImg from '@/assets/bq-pink.png';
import bqMoradoImg from '@/assets/bq-morado.png';
import bqMixPastelImg from '@/assets/bq-mix-pastel.png';
import bqMixCalidoImg from '@/assets/bq-mix-calido.png';
import bqMixAmarilloBlancoImg from '@/assets/bq-mix-amarillo-blanco.png';
import bqMixRomanticoImg from '@/assets/bq-mix-romantico.png';
import bqMixAlegriaImg from '@/assets/bq-mix-alegria.png';
import bqMixEspanaImg from '@/assets/bq-mix-espana.png';
import bqMixGirasolesImg from '@/assets/bq-mix-girasoles.png';
import bqMixLilaBlancoImg from '@/assets/bq-mix-lila-blanco.png';
import bqMixNegroBlancoImg from '@/assets/bq-mix-negro-blanco.png';
import bqMixNegroRosaImg from '@/assets/bq-mix-negro-rosa.png';
import bqMixHotpinkBlancoImg from '@/assets/bq-mix-hotpink-blanco.png';
import bqMixNaranjaAmarilloImg from '@/assets/bq-mix-naranja-amarillo.png';
import bqMixRojoLightpinkImg from '@/assets/bq-mix-rojo-lightpink.png';
import bqMixRojoPinkLightpinkImg from '@/assets/bq-mix-rojo-pink-lightpink.png';
import bqMixNaranjaBlancoImg from '@/assets/bq-mix-naranja-blanco.png';
import bqMixAmarilloNegroBlancoImg from '@/assets/bq-mix-amarillo-negro-blanco.png';
import bqMixRojoBlancoImg from '@/assets/bq-mix-rojo-blanco.png';
import bqMixAzulBlancoImg from '@/assets/bq-mix-azul-blanco.png';
import bqMixNaranjaAmarillo2Img from '@/assets/bq-mix-naranja-amarillo-2.png';
import bqMixPinkAmarilloBlancoImg from '@/assets/bq-mix-pink-amarillo-blanco.png';

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
    { id: 'arr-1', name: 'Arreglo Primaveral – Pequeño', description: 'Arreglo fresco con rosas y follaje verde', image: '', sizes: [{ label: 'Único', price: 45 }] },
    { id: 'arr-2', name: 'Arreglo Primaveral – Mediano', description: 'Arreglo fresco con rosas y follaje verde', image: '', sizes: [{ label: 'Único', price: 75 }] },
    { id: 'arr-3', name: 'Arreglo Primaveral – Grande', description: 'Arreglo fresco con rosas y follaje verde', image: '', sizes: [{ label: 'Único', price: 110 }] },
    { id: 'arr-4', name: 'Arreglo Elegante – Pequeño', description: 'Composición sofisticada en tonos pastel', image: '', sizes: [{ label: 'Único', price: 55 }] },
    { id: 'arr-5', name: 'Arreglo Elegante – Mediano', description: 'Composición sofisticada en tonos pastel', image: '', sizes: [{ label: 'Único', price: 85 }] },
    { id: 'arr-6', name: 'Arreglo Elegante – Grande', description: 'Composición sofisticada en tonos pastel', image: '', sizes: [{ label: 'Único', price: 130 }] },
    { id: 'arr-7', name: 'Arreglo Romántico – Pequeño', description: 'Rosas rojas y blancas en armonía perfecta', image: '', sizes: [{ label: 'Único', price: 50 }] },
    { id: 'arr-8', name: 'Arreglo Romántico – Mediano', description: 'Rosas rojas y blancas en armonía perfecta', image: '', sizes: [{ label: 'Único', price: 80 }] },
    { id: 'arr-9', name: 'Arreglo Romántico – Grande', description: 'Rosas rojas y blancas en armonía perfecta', image: '', sizes: [{ label: 'Único', price: 120 }] },
  ],
  cajas: [
    { id: 'caj-1', name: 'Caja Clásica – 50 Rosas', description: 'Rosas frescas en caja negra', image: '', sizes: [{ label: 'Único', price: 65 }] },
    { id: 'caj-2', name: 'Caja Clásica – 75 Rosas', description: 'Rosas frescas en caja negra', image: '', sizes: [{ label: 'Único', price: 95 }] },
    { id: 'caj-3', name: 'Caja Clásica – 100 Rosas', description: 'Rosas frescas en caja negra', image: '', sizes: [{ label: 'Único', price: 140 }] },
    { id: 'caj-4', name: 'Caja Corazón – 50 Rosas', description: 'Caja en forma de corazón con rosas', image: '', sizes: [{ label: 'Único', price: 75 }] },
    { id: 'caj-5', name: 'Caja Corazón – 75 Rosas', description: 'Caja en forma de corazón con rosas', image: '', sizes: [{ label: 'Único', price: 110 }] },
    { id: 'caj-6', name: 'Caja Corazón – 100 Rosas', description: 'Caja en forma de corazón con rosas', image: '', sizes: [{ label: 'Único', price: 160 }] },
    { id: 'caj-7', name: 'Caja Especial – 50 Rosas', description: 'Caja con rosas preservadas', image: '', sizes: [{ label: 'Único', price: 85 }] },
    { id: 'caj-8', name: 'Caja Especial – 75 Rosas', description: 'Caja con rosas preservadas', image: '', sizes: [{ label: 'Único', price: 125 }] },
    { id: 'caj-9', name: 'Caja Especial – 100 Rosas', description: 'Caja con rosas preservadas', image: '', sizes: [{ label: 'Único', price: 180 }] },
  ],
  cestas: [
    { id: 'ces-1', name: 'Cesta Campestre – Pequeña', description: 'Cesta rústica con flores silvestres', image: '', sizes: [{ label: 'Único', price: 55 }] },
    { id: 'ces-2', name: 'Cesta Campestre – Mediana', description: 'Cesta rústica con flores silvestres', image: '', sizes: [{ label: 'Único', price: 85 }] },
    { id: 'ces-3', name: 'Cesta Campestre – Grande', description: 'Cesta rústica con flores silvestres', image: '', sizes: [{ label: 'Único', price: 125 }] },
    { id: 'ces-4', name: 'Cesta de Rosas y Lirios – Pequeña', description: 'Cesta con rosas y lirios frescos', image: '', sizes: [{ label: 'Único', price: 70 }] },
    { id: 'ces-5', name: 'Cesta de Rosas y Lirios – Mediana', description: 'Cesta con rosas y lirios frescos', image: '', sizes: [{ label: 'Único', price: 100 }] },
    { id: 'ces-6', name: 'Cesta de Rosas y Lirios – Grande', description: 'Cesta con rosas y lirios frescos', image: '', sizes: [{ label: 'Único', price: 150 }] },
    { id: 'ces-7', name: 'Cesta Frutal – Pequeña', description: 'Cesta con flores y frutas de temporada', image: '', sizes: [{ label: 'Único', price: 60 }] },
    { id: 'ces-8', name: 'Cesta Frutal – Mediana', description: 'Cesta con flores y frutas de temporada', image: '', sizes: [{ label: 'Único', price: 90 }] },
    { id: 'ces-9', name: 'Cesta Frutal – Grande', description: 'Cesta con flores y frutas de temporada', image: '', sizes: [{ label: 'Único', price: 135 }] },
  ],
  jarrones: [
    { id: 'jar-1', name: 'Jarrón Cristal – Pequeño', description: 'Rosas en jarrón de cristal transparente', image: '', sizes: [{ label: 'Único', price: 70 }] },
    { id: 'jar-2', name: 'Jarrón Cristal – Mediano', description: 'Rosas en jarrón de cristal transparente', image: '', sizes: [{ label: 'Único', price: 105 }] },
    { id: 'jar-3', name: 'Jarrón Cristal – Grande', description: 'Rosas en jarrón de cristal transparente', image: '', sizes: [{ label: 'Único', price: 155 }] },
    { id: 'jar-4', name: 'Jarrón Dorado – Pequeño', description: 'Arreglo bonito en jarrón dorado', image: '', sizes: [{ label: 'Único', price: 85 }] },
    { id: 'jar-5', name: 'Jarrón Dorado – Mediano', description: 'Arreglo bonito en jarrón dorado', image: '', sizes: [{ label: 'Único', price: 120 }] },
    { id: 'jar-6', name: 'Jarrón Dorado – Grande', description: 'Arreglo bonito en jarrón dorado', image: '', sizes: [{ label: 'Único', price: 175 }] },
    { id: 'jar-7', name: 'Jarrón Vintage – Pequeño', description: 'Flores frescas en jarrón de cerámica', image: '', sizes: [{ label: 'Único', price: 75 }] },
    { id: 'jar-8', name: 'Jarrón Vintage – Mediano', description: 'Flores frescas en jarrón de cerámica', image: '', sizes: [{ label: 'Único', price: 110 }] },
    { id: 'jar-9', name: 'Jarrón Vintage – Grande', description: 'Flores frescas en jarrón de cerámica', image: '', sizes: [{ label: 'Único', price: 160 }] },
  ],
  osos: [
    { id: 'oso-1', name: 'Oso de Rosas Rojo', description: 'Oso completamente cubierto de rosas rojas', image: '', sizes: [{ label: 'Pequeño', price: 90 }, { label: 'Mediano', price: 150 }, { label: 'Grande', price: 220 }] },
    { id: 'oso-2', name: 'Oso de Rosas Rosa', description: 'Oso adorable en rosas rosadas', image: '', sizes: [{ label: 'Pequeño', price: 90 }, { label: 'Mediano', price: 150 }, { label: 'Grande', price: 220 }] },
    { id: 'oso-3', name: 'Oso de Rosas Blanco', description: 'Oso elegante en rosas blancas', image: '', sizes: [{ label: 'Pequeño', price: 90 }, { label: 'Mediano', price: 150 }, { label: 'Grande', price: 220 }] },
  ],
};

export const bouquetProducts: BouquetProduct[] = [
  // Round (20 products)
  { id: 'bq-round-1', name: 'Elegancia Roja y Blanca', description: 'Mix de rosas rojas y blancas en ramo redondo', image: bqRound1Img, color: 'Rojo y Blanco', type: 'round' },
  { id: 'bq-round-2', name: 'Romance Hot Pink', description: 'Mix de rosas rojas y hot pink en ramo redondo', image: '', color: 'Rojo y Hot Pink', type: 'round' },
  { id: 'bq-round-3', name: 'Misterio Nocturno', description: 'Mix de rosas rojas y negras en ramo redondo', image: '', color: 'Rojo y Negro', type: 'round' },
  { id: 'bq-round-4', name: 'Dulzura Bicolor', description: 'Mix de rosas light pink y blancas en ramo redondo', image: '', color: 'Light Pink y Blanco', type: 'round' },
  { id: 'bq-round-5', name: 'Pasión Total', description: 'Ramo redondo de rosas rojas puras', image: bqRojoImg, color: 'Rojo', type: 'round' },
  { id: 'bq-round-6', name: 'Pureza Blanca', description: 'Ramo redondo de rosas blancas', image: bqBlancoImg, color: 'Blanco', type: 'round' },
  { id: 'bq-round-7', name: 'Rosa Intenso', description: 'Ramo redondo de rosas hot pink vibrantes', image: bqHotpinkImg, color: 'Hot Pink', type: 'round' },
  { id: 'bq-round-8', name: 'Ternura Rosa', description: 'Ramo redondo de rosas light pink suaves', image: bqLightpinkImg, color: 'Light Pink', type: 'round' },
  { id: 'bq-round-9', name: 'Atardecer Dorado', description: 'Mix de rosas amarillas y naranjas', image: '', color: 'Amarillo y Naranja', type: 'round' },
  { id: 'bq-round-10', name: 'Cielo Azul', description: 'Ramo redondo de rosas azules pintadas', image: bqAzulImg, color: 'Azul', type: 'round' },
  { id: 'bq-round-11', name: 'Noche Profunda', description: 'Ramo redondo de rosas negras elegantes', image: bqNegroImg, color: 'Negro', type: 'round' },
  { id: 'bq-round-12', name: 'Encanto Morado', description: 'Ramo redondo de rosas moradas', image: bqMoradoImg, color: 'Morado', type: 'round' },
  { id: 'bq-round-13', name: 'Amanecer Rosa y Blanco', description: 'Mix delicado de rosas hot pink y blancas', image: bqMixHotpinkBlancoImg, color: 'Hot Pink y Blanco', type: 'round' },
  { id: 'bq-round-14', name: 'Fuego y Hielo', description: 'Contraste de rosas rojas y azules', image: '', color: 'Rojo y Azul', type: 'round' },
  { id: 'bq-round-15', name: 'Jardín Primaveral', description: 'Mix de rosas amarillas y blancas', image: bqMixAmarilloBlancoImg, color: 'Amarillo y Blanco', type: 'round' },
  { id: 'bq-round-16', name: 'Luna de Plata', description: 'Ramo redondo de rosas grises y blancas', image: '', color: 'Gris y Blanco', type: 'round' },
  { id: 'bq-round-17', name: 'Seducción Bicolor', description: 'Mix de rosas moradas y hot pink', image: '', color: 'Morado y Hot Pink', type: 'round' },
  { id: 'bq-round-18', name: 'Tricolor Clásico', description: 'Mix de rosas rojas, blancas y light pink', image: bqMixRojoPinkLightpinkImg, color: 'Rojo, Blanco y Light Pink', type: 'round' },
  { id: 'bq-round-19', name: 'Ocaso Naranja', description: 'Ramo redondo de rosas naranjas vibrantes', image: bqNaranjaImg, color: 'Naranja', type: 'round' },
  { id: 'bq-round-20', name: 'Sol Radiante', description: 'Ramo redondo de rosas amarillas luminosas', image: bqAmarilloImg, color: 'Amarillo', type: 'round' },
  { id: 'bq-round-21', name: 'Pink Elegante', description: 'Ramo redondo de rosas pink vibrantes', image: bqPinkImg, color: 'Pink', type: 'round' },
  { id: 'bq-round-22', name: 'Frescura Verde', description: 'Ramo redondo de rosas verdes pintadas', image: bqVerdeImg, color: 'Verde', type: 'round' },
  { id: 'bq-round-23', name: 'Pastel Mágico', description: 'Mix de rosas moradas, light pink y blancas', image: bqMixPastelImg, color: 'Morado, Light Pink y Blanco', type: 'round' },
  { id: 'bq-round-24', name: 'Atardecer Cálido', description: 'Mix vibrante de rosas naranjas, hot pink y blancas', image: bqMixCalidoImg, color: 'Naranja, Hot Pink y Blanco', type: 'round' },
  { id: 'bq-round-25', name: 'Romance Intenso', description: 'Mix de rosas rojas, moradas y blancas', image: bqMixRomanticoImg, color: 'Rojo, Morado y Blanco', type: 'round' },
  { id: 'bq-round-26', name: 'Fuego y Sol', description: 'Mix alegre de rosas rojas, amarillas y pink', image: bqMixAlegriaImg, color: 'Rojo, Amarillo y Pink', type: 'round' },
  { id: 'bq-round-27', name: 'Pasión Ibérica', description: 'Mix de rosas rojas y amarillas', image: bqMixEspanaImg, color: 'Rojo y Amarillo', type: 'round' },
  { id: 'bq-round-28', name: 'Girasoles y Pasión', description: 'Ramo de girasoles y rosas rojas', image: bqMixGirasolesImg, color: 'Girasoles y Rojo', type: 'round' },
  { id: 'bq-round-29', name: 'Lila Suave', description: 'Mix de rosas lilas y blancas', image: bqMixLilaBlancoImg, color: 'Lila y Blanco', type: 'round' },
  { id: 'bq-round-30', name: 'Noche y Día', description: 'Mix de rosas negras y blancas', image: bqMixNegroBlancoImg, color: 'Negro y Blanco', type: 'round' },
  { id: 'bq-round-31', name: 'Contraste Elegante', description: 'Mix de rosas negras, hot pink y blancas', image: bqMixNegroRosaImg, color: 'Negro, Hot Pink y Blanco', type: 'round' },
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
