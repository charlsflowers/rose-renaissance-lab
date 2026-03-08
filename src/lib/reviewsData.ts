import type { ReviewData } from "@/components/ReviewCard";

import reviewPastelMagico from "@/assets/review-pastel-magico.png";
import reviewPasionTotal from "@/assets/review-pasion-total.png";
import reviewRosaIntenso from "@/assets/review-rosa-intenso.png";
import reviewOcasoNaranja from "@/assets/review-ocaso-naranja.png";
import reviewTernuraInfinita from "@/assets/review-ternura-infinita.png";
import reviewAtardecerCalido from "@/assets/review-atardecer-calido.png";
import reviewJardinPrimaveral from "@/assets/review-jardin-primaveral.png";
import reviewRomanceIntenso from "@/assets/review-romance-intenso.png";
import reviewFuegoSol from "@/assets/review-fuego-sol.png";
import reviewPasionIberica from "@/assets/review-pasion-iberica.png";
import reviewGirasolesPasion from "@/assets/review-girasoles-pasion.png";
import reviewLilaSuave from "@/assets/review-lila-suave.png";
import reviewNocheDia from "@/assets/review-noche-dia.png";
import reviewContrasteElegante from "@/assets/review-contraste-elegante.png";
import reviewTernuraInfinita2 from "@/assets/review-ternura-infinita-2.png";
import reviewCitricoRefrescante from "@/assets/review-citrico-refrescante.png";
import reviewFrescuraVerde from "@/assets/review-frescura-verde.png";
import reviewDulzuraRoja from "@/assets/review-dulzura-roja.png";
import reviewPurezaBlanca from "@/assets/review-pureza-blanca.png";
import reviewAmorTricolor from "@/assets/review-amor-tricolor.png";
import reviewNocheProfunda from "@/assets/review-noche-profunda.png";
import reviewCieloAzul from "@/assets/review-cielo-azul.png";
import reviewNaranjaCitrico from "@/assets/review-naranja-citrico.png";
import reviewAbejaImperial from "@/assets/review-abeja-imperial.png";
import reviewPasionBicolor from "@/assets/review-pasion-bicolor.png";
import reviewSolRadiante from "@/assets/review-sol-radiante.png";
import reviewOceanoBlanco from "@/assets/review-oceano-blanco.png";
import reviewCitricoClaro from "@/assets/review-citrico-claro.png";
import reviewPrimaveraSuave from "@/assets/review-primavera-suave.png";
import reviewRomanceOscuro from "@/assets/review-romance-oscuro.png";

import review31 from "@/assets/review-31.png";
import review32 from "@/assets/review-32.png";
import review33 from "@/assets/review-33.png";
import review34 from "@/assets/review-34.png";
import review35 from "@/assets/review-35.png";
import review36 from "@/assets/review-36.png";
import review37 from "@/assets/review-37.png";
import review38 from "@/assets/review-38.png";

export const reviews: ReviewData[] = [
  // === BOUQUETS ===
  { id: "bq-1", name: "Mariana T.", rating: 5, text: "El bouquet de rosas blancas puras es la elegancia en su máxima expresión. Perfecto para cualquier ocasión.", image: reviewPurezaBlanca, productLabel: "Pureza Blanca", category: "bouquets", cartData: { bouquetType: "round", color: "Blanco", roses: 100, price: 136 } },
  { id: "bq-2", name: "Carlos R.", rating: 5, text: "El bouquet de rosas hot pink fue perfecto para el cumpleaños de mi novia. Calidad increíble.", image: reviewRosaIntenso, productLabel: "Rosa Intenso", category: "bouquets", cartData: { bouquetType: "round", color: "Hot Pink", roses: 75, price: 101 } },
  { id: "bq-3", name: "Laura M.", rating: 5, text: "Las rosas pink son un sueño. El resultado superó todas mis expectativas.", image: reviewTernuraInfinita, productLabel: "Ternura Rosa", category: "bouquets", cartData: { bouquetType: "round", color: "Pink", roses: 150, price: 226 } },
  { id: "bq-4", name: "Isabella N.", rating: 5, text: "El morado es mi color favorito y estas rosas son espectaculares. ¡Totalmente enamorada!", image: review35, productLabel: "Encanto Morado", category: "bouquets", cartData: { bouquetType: "round", color: "Morado", roses: 100, price: 136 } },
  { id: "bq-5", name: "Ana P.", rating: 5, text: "Compré el arreglo de rosas naranjas para decorar un evento. Todos me preguntaron dónde lo conseguí.", image: reviewOcasoNaranja, productLabel: "Ocaso Naranja", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja", roses: 100, price: 136 } },
  { id: "bq-6", name: "Roberto E.", rating: 5, text: "Compré el de rosas amarillas y le dio un toque muy alegre a la habitación. 100% recomendado.", image: reviewSolRadiante, productLabel: "Sol Radiante", category: "bouquets", cartData: { bouquetType: "round", color: "Amarillo", roses: 100, price: 136 } },
  { id: "bq-7", name: "María G.", rating: 5, text: "Pedí un bouquet de 100 rosas rojas para mi aniversario. ¡Quedó espectacular! Mi esposa lloró de la emoción.", image: reviewPasionTotal, productLabel: "Pasión Total", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo", roses: 100, price: 196 } },
  { id: "bq-8", name: "Mateo S.", rating: 5, text: "El azul de las rosas es muy intenso. Un detalle único que sorprendió a todos.", image: reviewCieloAzul, productLabel: "Cielo Azul", category: "bouquets", cartData: { bouquetType: "round", color: "Azul", roses: 100, price: 256 } },
  { id: "bq-9", name: "Diego G.", rating: 5, text: "Un bouquet completamente negro, súper elegante y exclusivo. Quedó espectacular.", image: reviewNocheProfunda, productLabel: "Noche Profunda", category: "bouquets", cartData: { bouquetType: "round", color: "Negro", roses: 100, price: 256 } },
  { id: "bq-10", name: "Catalina V.", rating: 5, text: "Las rosas verdes son algo que nunca había visto. Súper originales y llamativas.", image: reviewFrescuraVerde, productLabel: "Frescura Verde", category: "bouquets", cartData: { bouquetType: "round", color: "Verde", roses: 100, price: 256 } },
  { id: "bq-11", name: "Andrea C.", rating: 5, text: "Rosas hot pink y blancas para mi boda. Fue el centro de todas las fotos. ¡Absolutamente mágico!", image: review34, productLabel: "Sinfonía Rosa", category: "bouquets", cartData: { bouquetType: "round", color: "Hot Pink, Pink y Blanco", roses: 150, price: 226 } },
  { id: "bq-12", name: "Diego F.", rating: 5, text: "El bouquet de rosas amarillas y blancas para mi graduación quedó precioso.", image: reviewJardinPrimaveral, productLabel: "Jardín Primaveral", category: "bouquets", cartData: { bouquetType: "round", color: "Amarillo y Blanco", roses: 75, price: 101 } },
  { id: "bq-13", name: "Renata B.", rating: 5, text: "Las rosas lilas con blancas son una combinación divina. Lo pedí para un baby shower.", image: reviewLilaSuave, productLabel: "Lila Suave", category: "bouquets", cartData: { bouquetType: "round", color: "Lila y Blanco", roses: 100, price: 136 } },
  { id: "bq-14", name: "Hugo M.", rating: 5, text: "Las rosas naranjas y amarillas son perfectas para alegrar cualquier espacio. Mi mamá las amó.", image: reviewCitricoRefrescante, productLabel: "Cítrico Refrescante", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja y Amarillo", roses: 100, price: 136 } },
  { id: "bq-15", name: "Carla L.", rating: 5, text: "Hermoso bouquet en tonos naranja y blanco. Llegó a tiempo y las flores se ven muy frescas.", image: reviewNaranjaCitrico, productLabel: "Naranja Cítrico", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja y Blanco", roses: 100, price: 136 } },
  { id: "bq-16", name: "Mónica H.", rating: 5, text: "Las rosas pink y blancas para la recepción del hotel quedaron divinas. Los huéspedes no paraban de elogiarlas.", image: reviewTernuraInfinita2, productLabel: "Ternura Infinita", category: "bouquets", cartData: { bouquetType: "round", color: "Pink y Blanco", roses: 125, price: 201 } },
  { id: "bq-17", name: "Camila R.", rating: 5, text: "El bouquet de rosas rojas y amarillas fue lo más bonito que he visto. Un éxito total.", image: reviewPasionIberica, productLabel: "Pasión Ibérica", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Amarillo", roses: 100, price: 166 } },
  { id: "bq-18", name: "Ignacio R.", rating: 5, text: "El bouquet de rosas rojas y pink fue la estrella de la noche. Mi novia no paraba de abrazarlo.", image: reviewDulzuraRoja, productLabel: "Dulzura Roja", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Pink", roses: 150, price: 256 } },
  { id: "bq-19", name: "Fernanda O.", rating: 5, text: "Las rosas rojas y blancas son un clásico que nunca falla. El arreglo estuvo perfecto.", image: reviewPasionBicolor, productLabel: "Pasión Bicolor", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 100, price: 166 } },
  { id: "bq-20", name: "Juan P.", rating: 5, text: "La combinación de rojo y hot pink es fantástica. Todo llegó en excelentes condiciones.", image: reviewRomanceOscuro, productLabel: "Romance Oscuro", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Hot Pink", roses: 100, price: 166 } },
  { id: "bq-21", name: "Lucía D.", rating: 5, text: "Mezcla de rojas y rosas que transmite puro amor. ¡Me dejó sin palabras!", image: review33, productLabel: "Amor Apasionado", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Pink", roses: 125, price: 231 } },
  { id: "bq-22", name: "Mateo L.", rating: 5, text: "El contraste de rosas negras y blancas es increíble. Muy elegante y moderno.", image: reviewNocheDia, productLabel: "Noche y Día", category: "bouquets", cartData: { bouquetType: "round", color: "Negro y Blanco", roses: 100, price: 196 } },
  { id: "bq-23", name: "Valentina R.", rating: 5, text: "Increíble la mezcla de rosas azules y blancas. Se ve muy fino y la presentación es top.", image: reviewOceanoBlanco, productLabel: "Océano Blanco", category: "bouquets", cartData: { bouquetType: "round", color: "Azul y Blanco", roses: 100, price: 196 } },
  { id: "bq-24", name: "Elena V.", rating: 5, text: "El negro con el pink claro le da un toque tan chic. Perfecto para mi evento de gala.", image: review32, productLabel: "Elegancia Rosa Oscuro", category: "bouquets", cartData: { bouquetType: "round", color: "Pink y Negro", roses: 125, price: 261 } },
  { id: "bq-25", name: "Valeria Z.", rating: 5, text: "El bouquet de girasoles con rosas rojas fue espectacular. Mi novio quedó sin palabras cuando lo vio.", image: reviewGirasolesPasion, productLabel: "Girasoles y Pasión", category: "bouquets", cartData: { bouquetType: "round", color: "Girasoles y Rojo", roses: 100, price: 306 } },
  { id: "bq-26", name: "Sergio K.", rating: 5, text: "Rojas, blancas y pink... una trinidad que nunca falla. De los mejores que he comprado.", image: review36, productLabel: "Tricolor Clásico", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Blanco y Pink", roses: 125, price: 216 } },
  { id: "bq-27", name: "Valentina C.", rating: 5, text: "Pedí uno de rosas rojas, moradas y blancas y fue la sensación de la fiesta. Súper dramático.", image: reviewRomanceIntenso, productLabel: "Romance Intenso", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Morado y Blanco", roses: 125, price: 216 } },
  { id: "bq-28", name: "Andrés M.", rating: 5, text: "Compré rosas rojas, amarillas y pink para pedir matrimonio. Ella dijo que sí, ¡gracias!", image: reviewFuegoSol, productLabel: "Fuego y Sol", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Amarillo y Pink", roses: 175, price: 281 } },
  { id: "bq-29", name: "Juliana P.", rating: 5, text: "Las rosas rojas, pink y blancas combinan de forma increíble. Lo pedí para San Valentín.", image: reviewAmorTricolor, productLabel: "Amor Tricolor", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Pink y Blanco", roses: 150, price: 256 } },
  { id: "bq-30", name: "Sandra L.", rating: 5, text: "Increíble la calidad de las rosas moradas, pink y blancas. Duró más de una semana perfectamente fresco.", image: reviewPastelMagico, productLabel: "Pastel Mágico", category: "bouquets", cartData: { bouquetType: "round", color: "Morado, Pink y Blanco", roses: 100, price: 136 } },
  { id: "bq-31", name: "Miguel A.", rating: 4, text: "Muy buen servicio. El bouquet de naranjas, hot pink y blancas llegó a tiempo.", image: reviewAtardecerCalido, productLabel: "Atardecer Cálido", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja, Hot Pink y Blanco", roses: 75, price: 101 } },
  { id: "bq-32", name: "Emilia M.", rating: 5, text: "Pedí rosas naranjas, amarillas y blancas. El tamaño es enorme y huele delicioso.", image: reviewCitricoClaro, productLabel: "Cítrico Claro", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja, Amarillo y Blanco", roses: 150, price: 226 } },
  { id: "bq-33", name: "Luciana D.", rating: 5, text: "Un bouquet soñado. Tonos pink, amarillo y blanco que encantan a cualquiera.", image: reviewPrimaveraSuave, productLabel: "Primavera Suave", category: "bouquets", cartData: { bouquetType: "round", color: "Pink, Amarillo y Blanco", roses: 150, price: 226 } },
  { id: "bq-34", name: "Carmen P.", rating: 5, text: "Los colores amarillo, lila y blanco resaltan muy bien. Lo compré para alegrar la sala.", image: review31, productLabel: "Lila Brillante", category: "bouquets", cartData: { bouquetType: "round", color: "Amarillo, Lila y Blanco", roses: 100, price: 136 } },
  { id: "bq-35", name: "Lorena F.", rating: 5, text: "El bouquet de rosas negras, hot pink y blancas es único. Nunca había visto algo tan original.", image: reviewContrasteElegante, productLabel: "Contraste Elegante", category: "bouquets", cartData: { bouquetType: "round", color: "Negro, Hot Pink y Blanco", roses: 100, price: 166 } },
  { id: "bq-36", name: "Andrés V.", rating: 5, text: "Una combinación atrevida y muy bonita de amarillo, negro y blanco. Excelente calidad.", image: reviewAbejaImperial, productLabel: "Abeja Imperial", category: "bouquets", cartData: { bouquetType: "round", color: "Amarillo, Negro y Blanco", roses: 100, price: 196 } },
  { id: "bq-37", name: "Gloria M.", rating: 5, text: "Rojo y blanco. Puro lujo. Es la segunda vez que lo pido y siempre impacta.", image: review38, productLabel: "Pasión Elegante", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 125, price: 231 } },
  { id: "bq-38", name: "Patricia G.", rating: 5, text: "El bouquet de hot pink y blanco es precioso. Los tonos combinan de maravilla con cualquier decoración.", image: review37, productLabel: "Amanecer Rosa y Blanco", category: "bouquets", cartData: { bouquetType: "round", color: "Hot Pink y Blanco", roses: 100, price: 136 } },

  // === ARREGLOS ===
  { id: "rev-arr-1", name: "Verónica T.", rating: 5, text: "El arreglo de rosas para la mesa del comedor quedó precioso. Duró casi dos semanas fresco.", image: "/placeholder.svg", productLabel: "Arreglo Clásico", category: "arreglos", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 50, price: 91 } },
  { id: "rev-arr-2", name: "Jorge L.", rating: 5, text: "Pedí un arreglo grande para la recepción de la oficina. Todos los clientes lo elogiaron. Muy elegante.", image: "/placeholder.svg", productLabel: "Arreglo Premium", category: "arreglos", cartData: { bouquetType: "round", color: "Rojo y Negro", roses: 75, price: 131 } },

  // === CAJAS ===
  { id: "rev-caj-1", name: "Lorena P.", rating: 5, text: "La caja de rosas rojas fue el regalo perfecto para mi mejor amiga. La presentación es de lujo.", image: "/placeholder.svg", productLabel: "Caja Elegante", category: "cajas", cartData: { bouquetType: "round", color: "Rojo", roses: 50, price: 106 } },

  // === CESTAS ===
  { id: "rev-ces-1", name: "Alicia R.", rating: 5, text: "La cesta de rosas para el funeral fue sobria y hermosa. Transmitió mucho cariño. Gracias por la delicadeza.", image: "/placeholder.svg", productLabel: "Cesta Memorial", category: "cestas", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 75, price: 116 } },

  // === JARRONES ===
  { id: "rev-jar-1", name: "Renata L.", rating: 5, text: "El jarrón con rosas rojas es una obra de arte. Lo tengo en mi sala y todos mis invitados lo admiran.", image: "/placeholder.svg", productLabel: "Jarrón Clásico", category: "jarrones", cartData: { bouquetType: "round", color: "Rojo", roses: 50, price: 106 } },

  // === OSOS ===
  { id: "rev-oso-1", name: "Valeria N.", rating: 5, text: "El oso de rosas rojas fue la sensación en el baby shower. Todo el mundo quería sacarse una foto con él.", image: "/placeholder.svg", productLabel: "Oso de Rosas Rojo", category: "osos", cartData: { bouquetType: "round", color: "Rojo", roses: 50, price: 150 } },
];
