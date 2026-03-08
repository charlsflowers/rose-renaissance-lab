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

export const reviews: ReviewData[] = [
  // === BOUQUETS ===
  // Pasión Total (Rojo) → red tier: 50=$106, 75=$146, 100=$196, 125=$276, 150=$226, 175=$251, 200=$301
  { id: "rev-1", name: "María G.", rating: 5, text: "Pedí un bouquet de 100 rosas rojas para mi aniversario. ¡Quedó espectacular! Mi esposa lloró de la emoción.", image: reviewPasionTotal, productLabel: "Pasión Total", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo", roses: 100, price: 196 } },
  // Rosa Intenso (Hot Pink) → standard tier: 50=$76, 75=$101, 100=$136
  { id: "rev-2", name: "Carlos R.", rating: 5, text: "El bouquet de rosas hot pink fue perfecto para el cumpleaños de mi novia. Calidad increíble y entrega puntual.", image: reviewRosaIntenso, productLabel: "Rosa Intenso", category: "bouquets", cartData: { bouquetType: "round", color: "Hot Pink", roses: 75, price: 101 } },
  // Ocaso Naranja → standard tier: 100=$136
  { id: "rev-3", name: "Ana P.", rating: 5, text: "Compré el arreglo de rosas naranjas para decorar un evento. Todos me preguntaron dónde lo conseguí. ¡Hermoso!", image: reviewOcasoNaranja, productLabel: "Ocaso Naranja", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja", roses: 100, price: 136 } },
  // Ternura Infinita (Pink y Blanco) → standard tier: 150=$226
  { id: "rev-4", name: "Laura M.", rating: 5, text: "Las rosas pink con blancas son un sueño. Pedí 150 rosas y el resultado superó todas mis expectativas.", image: reviewTernuraInfinita, productLabel: "Ternura Infinita", category: "bouquets", cartData: { bouquetType: "round", color: "Pink y Blanco", roses: 150, price: 226 } },
  { id: "rev-5", name: "Roberto S.", rating: 5, text: "Le regalé a mi mamá un bouquet de 200 rosas rojas para su cumpleaños. Fue el mejor regalo que le he dado.", image: reviewPasionTotal, productLabel: "Pasión Total", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo", roses: 200, price: 301 } },
  // Pastel Mágico (Morado, Pink, Blanco) → standard tier: 100=$136
  { id: "rev-6", name: "Sandra L.", rating: 5, text: "Increíble la calidad de las rosas moradas, pink y blancas. Pedí 100 rosas y duró más de una semana perfectamente fresco.", image: reviewPastelMagico, productLabel: "Pastel Mágico", category: "bouquets", cartData: { bouquetType: "round", color: "Morado, Pink y Blanco", roses: 100, price: 136 } },
  // Jardín Primaveral (Amarillo y Blanco) → standard tier: 75=$101
  { id: "rev-7", name: "Diego F.", rating: 5, text: "El bouquet de rosas amarillas y blancas para mi graduación quedó precioso. Todas mis amigas querían uno igual.", image: reviewJardinPrimaveral, productLabel: "Jardín Primaveral", category: "bouquets", cartData: { bouquetType: "round", color: "Amarillo y Blanco", roses: 75, price: 101 } },
  // Romance Intenso (Rojo, Morado, Blanco) → mix3red: 125=$216
  { id: "rev-8", name: "Valentina C.", rating: 5, text: "Pedí uno de 125 rosas rojas, moradas y blancas y fue la sensación de la fiesta. Súper dramático y elegante.", image: reviewRomanceIntenso, productLabel: "Romance Intenso", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Morado y Blanco", roses: 125, price: 216 } },
  // Atardecer Cálido (Naranja, Hot Pink, Blanco) → standard tier: 75=$101
  { id: "rev-9", name: "Miguel A.", rating: 4, text: "Muy buen servicio. El bouquet de 75 rosas naranjas, hot pink y blancas llegó a tiempo y mi novia quedó encantada.", image: reviewAtardecerCalido, productLabel: "Atardecer Cálido", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja, Hot Pink y Blanco", roses: 75, price: 101 } },
  // Pasión Ibérica (Rojo y Amarillo) → mix2: 100=$166
  { id: "rev-10", name: "Camila R.", rating: 5, text: "El bouquet de rosas rojas y amarillas fue lo más bonito que he visto. Lo pedí para San Valentín y fue un éxito total.", image: reviewPasionIberica, productLabel: "Pasión Ibérica", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Amarillo", roses: 100, price: 166 } },
  // Fuego y Sol (Rojo, Amarillo, Pink) → mix3red: 175=$281
  { id: "rev-11", name: "Andrés M.", rating: 5, text: "Compré 175 rosas rojas, amarillas y pink para pedir matrimonio. Ella dijo que sí, ¡gracias Charl's Flowers!", image: reviewFuegoSol, productLabel: "Fuego y Sol", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Amarillo y Pink", roses: 175, price: 281 } },
  { id: "rev-12", name: "Paola V.", rating: 5, text: "Las rosas naranjas son impresionantes. El bouquet quedó espectacular. Repetiré seguro.", image: reviewOcasoNaranja, productLabel: "Ocaso Naranja", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja", roses: 75, price: 101 } },
  { id: "rev-13", name: "Fernando T.", rating: 4, text: "Buen producto, las rosas estaban muy frescas. El bouquet hot pink quedó precioso para el baby shower.", image: reviewRosaIntenso, productLabel: "Rosa Intenso", category: "bouquets", cartData: { bouquetType: "round", color: "Hot Pink", roses: 100, price: 136 } },
  // Ternura Infinita → standard: 200=$301
  { id: "rev-14", name: "Lucía H.", rating: 5, text: "El bouquet de 200 rosas pink y blancas fue impresionante. Todo el mundo en la boda quedó maravillado.", image: reviewTernuraInfinita, productLabel: "Ternura Infinita", category: "bouquets", cartData: { bouquetType: "round", color: "Pink y Blanco", roses: 200, price: 301 } },
  { id: "rev-15", name: "Javier P.", rating: 5, text: "Excelente atención. Pedí un bouquet personalizado de 125 rosas rojas y superó mis expectativas. 100% recomendado.", image: reviewPasionTotal, productLabel: "Pasión Total", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo", roses: 125, price: 276 } },
  // Pastel Mágico → standard: 75=$101
  { id: "rev-16", name: "Isabella N.", rating: 5, text: "Las rosas son de una calidad increíble. Pedí un bouquet de 75 rosas pastel y me encantó cada detalle.", image: reviewPastelMagico, productLabel: "Pastel Mágico", category: "bouquets", cartData: { bouquetType: "round", color: "Morado, Pink y Blanco", roses: 75, price: 101 } },
  // Pasión Ibérica → mix2: 150=$256
  { id: "rev-17", name: "Tomás D.", rating: 5, text: "Sorprendí a mi esposa con 150 rosas rojas y amarillas. La entrega fue puntual y las rosas estaban perfectas.", image: reviewPasionIberica, productLabel: "Pasión Ibérica", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Amarillo", roses: 150, price: 256 } },
  // Jardín Primaveral → standard: 50=$76
  { id: "rev-18", name: "Natalia E.", rating: 4, text: "El bouquet de 50 rosas amarillas y blancas fue un detalle perfecto para el día de las madres. Muy recomendable.", image: reviewJardinPrimaveral, productLabel: "Jardín Primaveral", category: "bouquets", cartData: { bouquetType: "round", color: "Amarillo y Blanco", roses: 50, price: 76 } },
  // Romance Intenso → mix3red: 125=$216
  { id: "rev-19", name: "Sebastián G.", rating: 5, text: "Increíble el bouquet de 125 rosas rojas, moradas y blancas. Mi novia publicó la foto en Instagram y tiene miles de likes.", image: reviewRomanceIntenso, productLabel: "Romance Intenso", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Morado y Blanco", roses: 125, price: 216 } },
  // Atardecer Cálido → standard: 100=$136
  { id: "rev-20", name: "Daniela J.", rating: 5, text: "El bouquet de rosas naranjas, hot pink y blancas fue perfecto para la decoración de mi sala. Duró más de 10 días fresco.", image: reviewAtardecerCalido, productLabel: "Atardecer Cálido", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja, Hot Pink y Blanco", roses: 100, price: 136 } },
  { id: "rev-21", name: "Alejandro B.", rating: 5, text: "Pedí el bouquet más grande de 200 rosas rojas. Fue una locura de bonito. Valió cada centavo.", image: reviewPasionTotal, productLabel: "Pasión Total", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo", roses: 200, price: 301 } },
  { id: "rev-22", name: "Gabriela O.", rating: 5, text: "Las rosas hot pink son mi color favorito y el bouquet quedó divino. Lo pedí para mi cumpleaños.", image: reviewRosaIntenso, productLabel: "Rosa Intenso", category: "bouquets", cartData: { bouquetType: "round", color: "Hot Pink", roses: 75, price: 101 } },
  // Fuego y Sol → mix3red: 100=$151
  { id: "rev-23", name: "Ricardo W.", rating: 4, text: "Muy contento con la compra. El bouquet de rosas rojas, amarillas y pink fue un hit en la celebración.", image: reviewFuegoSol, productLabel: "Fuego y Sol", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Amarillo y Pink", roses: 100, price: 151 } },
  // Ternura Infinita → standard: 175=$251
  { id: "rev-24", name: "Carmen S.", rating: 5, text: "Pedí 175 rosas pink y blancas para mi boda y fue lo más hermoso. Las fotos quedaron increíbles.", image: reviewTernuraInfinita, productLabel: "Ternura Infinita", category: "bouquets", cartData: { bouquetType: "round", color: "Pink y Blanco", roses: 175, price: 251 } },
  // Jardín Primaveral → standard: 75=$101
  { id: "rev-25", name: "Martín K.", rating: 5, text: "El servicio de Charl's Flowers es de primera. Las rosas siempre llegan frescas y el empaque es elegante.", image: reviewJardinPrimaveral, productLabel: "Jardín Primaveral", category: "bouquets", cartData: { bouquetType: "round", color: "Amarillo y Blanco", roses: 75, price: 101 } },
  // Pastel Mágico → standard: 100=$136
  { id: "rev-26", name: "Sofía Q.", rating: 5, text: "Mi mamá lloró cuando vio el bouquet de 100 rosas pastel. Dice que es el regalo más bonito que ha recibido.", image: reviewPastelMagico, productLabel: "Pastel Mágico", category: "bouquets", cartData: { bouquetType: "round", color: "Morado, Pink y Blanco", roses: 100, price: 136 } },
  { id: "rev-27", name: "Emilio R.", rating: 5, text: "Bouquet de 125 rosas naranjas para una fiesta temática. Fue la pieza central perfecta.", image: reviewOcasoNaranja, productLabel: "Ocaso Naranja", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja", roses: 125, price: 201 } },
  { id: "rev-28", name: "Teresa L.", rating: 4, text: "El bouquet de rosas rojas y amarillas para el quinceañero de mi hija quedó precioso. Todas las invitadas opinaron igual.", image: reviewPasionIberica, productLabel: "Pasión Ibérica", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Amarillo", roses: 100, price: 166 } },
  { id: "rev-29", name: "Pablo A.", rating: 5, text: "Segundo pedido que hago y siempre quedo satisfecho. Las 200 rosas rojas son una obra de arte.", image: reviewPasionTotal, productLabel: "Pasión Total", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo", roses: 200, price: 301 } },
  // Romance Intenso → mix3red: 100=$151
  { id: "rev-30", name: "Adriana F.", rating: 5, text: "El bouquet de rosas rojas, moradas y blancas es único. No he visto nada igual en ninguna otra floristería.", image: reviewRomanceIntenso, productLabel: "Romance Intenso", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Morado y Blanco", roses: 100, price: 151 } },
  // Atardecer Cálido → standard: 150=$226
  { id: "rev-31", name: "Raúl C.", rating: 5, text: "Pedí un bouquet de 150 rosas naranjas, hot pink y blancas para pedir perdón. Funcionó mejor que cualquier carta. ¡Gracias!", image: reviewAtardecerCalido, productLabel: "Atardecer Cálido", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja, Hot Pink y Blanco", roses: 150, price: 226 } },
  // Ternura Infinita → standard: 125=$201
  { id: "rev-32", name: "Mónica H.", rating: 5, text: "Las rosas pink y blancas para la recepción del hotel quedaron divinas. Los huéspedes no paraban de elogiarlas.", image: reviewTernuraInfinita, productLabel: "Ternura Infinita", category: "bouquets", cartData: { bouquetType: "round", color: "Pink y Blanco", roses: 125, price: 201 } },
  { id: "rev-33", name: "Héctor V.", rating: 4, text: "Buen precio por la cantidad de rosas. El bouquet de 75 rosas hot pink era justo lo que buscaba.", image: reviewRosaIntenso, productLabel: "Rosa Intenso", category: "bouquets", cartData: { bouquetType: "round", color: "Hot Pink", roses: 75, price: 101 } },
  // Fuego y Sol → mix3red: 200=$346
  { id: "rev-34", name: "Elena D.", rating: 5, text: "Tercer pedido en el año. Siempre rosas perfectas, entrega impecable. Mi floristería favorita sin duda.", image: reviewFuegoSol, productLabel: "Fuego y Sol", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Amarillo y Pink", roses: 200, price: 346 } },
  // Girasoles y Pasión → custom: 100=$166
  { id: "rev-35", name: "Valeria Z.", rating: 5, text: "El bouquet de girasoles con rosas rojas fue espectacular. Mi novio quedó sin palabras cuando lo vio.", image: reviewGirasolesPasion, productLabel: "Girasoles y Pasión", category: "bouquets", cartData: { bouquetType: "round", color: "Girasoles y Rojo", roses: 100, price: 166 } },
  // Lila Suave → standard: 100=$136
  { id: "rev-36", name: "Renata B.", rating: 5, text: "Las rosas lilas con blancas son una combinación divina. Lo pedí para un baby shower y todos me preguntaron dónde lo compré.", image: reviewLilaSuave, productLabel: "Lila Suave", category: "bouquets", cartData: { bouquetType: "round", color: "Lila y Blanco", roses: 100, price: 136 } },
  // Noche y Día → mix2painted: 100=$196
  { id: "rev-37", name: "Mateo L.", rating: 5, text: "El contraste de rosas negras y blancas es increíble. Muy elegante y moderno. Lo usé para una propuesta de matrimonio.", image: reviewNocheDia, productLabel: "Noche y Día", category: "bouquets", cartData: { bouquetType: "round", color: "Negro y Blanco", roses: 100, price: 196 } },
  // Contraste Elegante → custom: 100=$166
  { id: "rev-38", name: "Lorena F.", rating: 5, text: "El bouquet de rosas negras, hot pink y blancas es único. Nunca había visto algo tan original y elegante.", image: reviewContrasteElegante, productLabel: "Contraste Elegante", category: "bouquets", cartData: { bouquetType: "round", color: "Negro, Hot Pink y Blanco", roses: 100, price: 166 } },
  // Amanecer Rosa y Blanco → standard: 150=$226
  { id: "rev-39", name: "Andrea C.", rating: 5, text: "200 rosas hot pink y blancas para mi boda. Fue el centro de todas las fotos. ¡Absolutamente mágico!", image: reviewTernuraInfinita2, productLabel: "Amanecer Rosa y Blanco", category: "bouquets", cartData: { bouquetType: "round", color: "Hot Pink y Blanco", roses: 150, price: 226 } },
  // Cítrico Refrescante → standard: 100=$136
  { id: "rev-40", name: "Hugo M.", rating: 5, text: "Las rosas naranjas y amarillas son perfectas para alegrar cualquier espacio. Mi mamá las amó.", image: reviewCitricoRefrescante, productLabel: "Cítrico Refrescante", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja y Amarillo", roses: 100, price: 136 } },
  // Frescura Verde → painted: 100=$256
  { id: "rev-41", name: "Catalina V.", rating: 5, text: "Las rosas verdes son algo que nunca había visto. Súper originales y llamativas. Todos en la fiesta quedaron impresionados.", image: reviewFrescuraVerde, productLabel: "Frescura Verde", category: "bouquets", cartData: { bouquetType: "round", color: "Verde", roses: 100, price: 256 } },
  // Dulzura Roja → mix2: 150=$256
  { id: "rev-42", name: "Ignacio R.", rating: 5, text: "El bouquet de rosas rojas y pink fue la estrella de la noche. Mi novia no paraba de abrazarlo.", image: reviewDulzuraRoja, productLabel: "Dulzura Roja", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Pink", roses: 150, price: 256 } },
  // Pureza Blanca → standard: 100=$136
  { id: "rev-43", name: "Mariana T.", rating: 5, text: "El bouquet de rosas blancas puras es la elegancia en su máxima expresión. Perfecto para cualquier ocasión.", image: reviewPurezaBlanca, productLabel: "Pureza Blanca", category: "bouquets", cartData: { bouquetType: "round", color: "Blanco", roses: 100, price: 136 } },
  // Amor Tricolor → mix3red: 150=$256
  { id: "rev-44", name: "Juliana P.", rating: 5, text: "Las rosas rojas, pink y blancas combinan de forma increíble. Lo pedí para San Valentín y fue un éxito total.", image: reviewAmorTricolor, productLabel: "Amor Tricolor", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Pink y Blanco", roses: 150, price: 256 } },

  // === ARREGLOS ===
  { id: "rev-arr-1", name: "Verónica T.", rating: 5, text: "El arreglo de rosas para la mesa del comedor quedó precioso. Duró casi dos semanas fresco.", image: "/placeholder.svg", productLabel: "Arreglo Clásico", category: "arreglos", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 50, price: 91 } },
  { id: "rev-arr-2", name: "Jorge L.", rating: 5, text: "Pedí un arreglo grande para la recepción de la oficina. Todos los clientes lo elogiaron. Muy elegante.", image: "/placeholder.svg", productLabel: "Arreglo Premium", category: "arreglos", cartData: { bouquetType: "round", color: "Rojo y Negro", roses: 75, price: 131 } },
  { id: "rev-arr-3", name: "Patricia M.", rating: 4, text: "El arreglo floral para el baby shower quedó divino. Los colores pink combinaron perfecto con la decoración.", image: "/placeholder.svg", productLabel: "Arreglo Delicado", category: "arreglos", cartData: { bouquetType: "round", color: "Pink y Blanco", roses: 50, price: 76 } },
  { id: "rev-arr-4", name: "Ernesto R.", rating: 5, text: "Compré el arreglo de rosas hot pink para mi esposa y le encantó. La base es muy bonita y resistente.", image: "/placeholder.svg", productLabel: "Arreglo Vibrante", category: "arreglos", cartData: { bouquetType: "round", color: "Hot Pink", roses: 75, price: 101 } },
  { id: "rev-arr-5", name: "Claudia S.", rating: 5, text: "Tercer arreglo que pido este año. Siempre frescos, siempre perfectos. Ideales para centros de mesa.", image: "/placeholder.svg", productLabel: "Arreglo Clásico", category: "arreglos", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 100, price: 166 } },

  // === CAJAS ===
  { id: "rev-caj-1", name: "Lorena P.", rating: 5, text: "La caja de rosas rojas fue el regalo perfecto para mi mejor amiga. La presentación es de lujo.", image: "/placeholder.svg", productLabel: "Caja Elegante", category: "cajas", cartData: { bouquetType: "round", color: "Rojo", roses: 50, price: 106 } },
  { id: "rev-caj-2", name: "Marcos V.", rating: 5, text: "Pedí la caja grande con rosas hot pink y blancas. Mi novia no paraba de sacar fotos. ¡Increíble!", image: "/placeholder.svg", productLabel: "Caja Deluxe", category: "cajas", cartData: { bouquetType: "round", color: "Hot Pink y Blanco", roses: 75, price: 101 } },
  { id: "rev-caj-3", name: "Isabel G.", rating: 4, text: "La caja es preciosa y las rosas estaban super frescas. Perfecta para un cumpleaños especial.", image: "/placeholder.svg", productLabel: "Caja Romántica", category: "cajas", cartData: { bouquetType: "round", color: "Pink y Blanco", roses: 50, price: 76 } },
  { id: "rev-caj-4", name: "Óscar D.", rating: 5, text: "Sorprendí a mi mamá con una caja de rosas negras y rojas. Dijo que nunca había visto algo tan elegante.", image: "/placeholder.svg", productLabel: "Caja Misterio", category: "cajas", cartData: { bouquetType: "round", color: "Rojo y Negro", roses: 75, price: 131 } },
  { id: "rev-caj-5", name: "Daniela F.", rating: 5, text: "Repetí pedido de la caja de rosas para San Valentín. La calidad es consistente y siempre impresiona.", image: "/placeholder.svg", productLabel: "Caja Elegante", category: "cajas", cartData: { bouquetType: "round", color: "Rojo", roses: 100, price: 196 } },

  // === CESTAS ===
  { id: "rev-ces-1", name: "Alicia R.", rating: 5, text: "La cesta de rosas para el funeral fue sobria y hermosa. Transmitió mucho cariño. Gracias por la delicadeza.", image: "/placeholder.svg", productLabel: "Cesta Memorial", category: "cestas", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 75, price: 116 } },
  { id: "rev-ces-2", name: "Felipe N.", rating: 5, text: "Pedí una cesta grande de rosas para la entrada de mi negocio. Los clientes siempre comentan lo bonita que es.", image: "/placeholder.svg", productLabel: "Cesta Grand", category: "cestas", cartData: { bouquetType: "round", color: "Hot Pink", roses: 100, price: 136 } },
  { id: "rev-ces-3", name: "Marta J.", rating: 4, text: "La cesta de rosas pink para la despedida de soltera quedó perfecta. Combinó con toda la decoración.", image: "/placeholder.svg", productLabel: "Cesta Dulce", category: "cestas", cartData: { bouquetType: "round", color: "Pink y Blanco", roses: 50, price: 76 } },
  { id: "rev-ces-4", name: "Gustavo H.", rating: 5, text: "Regalé la cesta de rosas a mi abuela y casi llora de la emoción. Un detalle que vale oro.", image: "/placeholder.svg", productLabel: "Cesta Especial", category: "cestas", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 75, price: 116 } },
  { id: "rev-ces-5", name: "Carolina B.", rating: 5, text: "La cesta con rosas negras y rojas es impactante. La usé como centro de mesa en una cena y fue un éxito.", image: "/placeholder.svg", productLabel: "Cesta Elegante", category: "cestas", cartData: { bouquetType: "round", color: "Rojo y Negro", roses: 100, price: 196 } },

  // === JARRONES ===
  { id: "rev-jar-1", name: "Renata L.", rating: 5, text: "El jarrón con rosas rojas es una obra de arte. Lo tengo en mi sala y todos mis invitados lo admiran.", image: "/placeholder.svg", productLabel: "Jarrón Clásico", category: "jarrones", cartData: { bouquetType: "round", color: "Rojo", roses: 50, price: 106 } },
  { id: "rev-jar-2", name: "Eduardo K.", rating: 5, text: "Pedí el jarrón grande con rosas hot pink para la oficina. Da un toque de color increíble al espacio.", image: "/placeholder.svg", productLabel: "Jarrón Vibrante", category: "jarrones", cartData: { bouquetType: "round", color: "Hot Pink", roses: 75, price: 101 } },
  { id: "rev-jar-3", name: "Silvia C.", rating: 4, text: "El jarrón con rosas pink es delicado y hermoso. Perfecto para un regalo de aniversario.", image: "/placeholder.svg", productLabel: "Jarrón Suave", category: "jarrones", cartData: { bouquetType: "round", color: "Pink y Blanco", roses: 50, price: 76 } },
  { id: "rev-jar-4", name: "Hugo M.", rating: 5, text: "El jarrón de cristal con rosas negras y rojas queda espectacular. Lo puse en la entrada de mi casa.", image: "/placeholder.svg", productLabel: "Jarrón Premium", category: "jarrones", cartData: { bouquetType: "round", color: "Rojo y Negro", roses: 100, price: 196 } },
  { id: "rev-jar-5", name: "Andrea P.", rating: 5, text: "Segundo jarrón que compro. La combinación del cristal con las rosas frescas es simplemente perfecta.", image: "/placeholder.svg", productLabel: "Jarrón Clásico", category: "jarrones", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 75, price: 116 } },

  // === OSOS ===
  { id: "rev-oso-1", name: "Jimena T.", rating: 5, text: "El oso de rosas rojas es lo más tierno que he visto. Mi hija de 5 años no lo suelta. ¡Le encanta!", image: "/placeholder.svg", productLabel: "Oso Romántico", category: "osos", cartData: { bouquetType: "round", color: "Rojo", roses: 50, price: 106 } },
  { id: "rev-oso-2", name: "Luis A.", rating: 5, text: "Regalé el oso de rosas hot pink a mi novia y fue el mejor regalo de San Valentín. Súper original.", image: "/placeholder.svg", productLabel: "Oso Dulce", category: "osos", cartData: { bouquetType: "round", color: "Hot Pink", roses: 75, price: 101 } },
  { id: "rev-oso-3", name: "Rosa E.", rating: 4, text: "El oso de rosas pink para el baby shower fue un hit. Todas las invitadas querían saber dónde lo compré.", image: "/placeholder.svg", productLabel: "Oso Tierno", category: "osos", cartData: { bouquetType: "round", color: "Pink y Blanco", roses: 50, price: 76 } },
  { id: "rev-oso-4", name: "Damián F.", rating: 5, text: "El oso gigante de rosas fue la estrella de la fiesta de cumpleaños. Increíble la atención al detalle.", image: "/placeholder.svg", productLabel: "Oso Grand", category: "osos", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 100, price: 166 } },
  { id: "rev-oso-5", name: "Valeria O.", rating: 5, text: "Pedí un oso de rosas negras y rojas para mi hermana. ¡Le fascinó! Nunca había visto uno así.", image: "/placeholder.svg", productLabel: "Oso Elegante", category: "osos", cartData: { bouquetType: "round", color: "Rojo y Negro", roses: 75, price: 131 } },

  // === PERSONALIZADOS ===
  { id: "rev-per-1", name: "Andrea M.", rating: 5, text: "Personalicé un bouquet de 100 rosas pintadas en azul y dorado para mi graduación. ¡Fue la sensación! Todos preguntaban dónde lo conseguí.", image: "/placeholder.svg", productLabel: "Bouquet Personalizado", category: "personalizados", cartData: { bouquetType: "round", color: "Azul y Dorado", roses: 100, price: 196 } },
  { id: "rev-per-2", name: "Daniel V.", rating: 5, text: "Hice un ramo personalizado con rosas rojas y brillos plateados para pedir matrimonio. Ella dijo que sí al instante.", image: "/placeholder.svg", productLabel: "Bouquet con Brillos", category: "personalizados", cartData: { bouquetType: "heart", color: "Rojo con Brillos", roses: 150, price: 226 } },
  { id: "rev-per-3", name: "Mariana C.", rating: 5, text: "Diseñé un bouquet con letras que decían 'TE AMO' entre las rosas. La cara de mi novio no tenía precio.", image: "/placeholder.svg", productLabel: "Bouquet con Letras", category: "personalizados", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 125, price: 231 } },
  { id: "rev-per-4", name: "Fabián L.", rating: 4, text: "Personalicé un ramo con rosas pintadas en los colores del equipo de mi papá. Fue el mejor regalo de cumpleaños.", image: "/placeholder.svg", productLabel: "Bouquet Temático", category: "personalizados", cartData: { bouquetType: "round", color: "Personalizado", roses: 75, price: 191 } },
  { id: "rev-per-5", name: "Luciana R.", rating: 5, text: "Elegí cada detalle: rosas negras con bordes dorados, lazos de seda y una base especial. Quedó de revista.", image: "/placeholder.svg", productLabel: "Bouquet Premium", category: "personalizados", cartData: { bouquetType: "round", color: "Negro y Dorado", roses: 100, price: 256 } },
  { id: "rev-per-6", name: "Nicolás G.", rating: 5, text: "Hice un bouquet personalizado con rosas pintadas en degradé de rosa a blanco. Mi esposa dice que es lo más bonito que ha recibido.", image: "/placeholder.svg", productLabel: "Bouquet Degradé", category: "personalizados", cartData: { bouquetType: "round", color: "Degradé Rosa", roses: 200, price: 541 } },
  { id: "rev-per-7", name: "Camila F.", rating: 5, text: "Personalicé un bouquet con números para el cumpleaños 30 de mi hermana. Con rosas hot pink y brillos. ¡Perfecto!", image: "/placeholder.svg", productLabel: "Bouquet con Números", category: "personalizados", cartData: { bouquetType: "round", color: "Hot Pink con Brillos", roses: 100, price: 136 } },
  { id: "rev-per-8", name: "Esteban P.", rating: 5, text: "Diseñé un ramo con rosas de colores del arcoíris para el orgullo. Fue increíble ver la reacción de todos.", image: "/placeholder.svg", productLabel: "Bouquet Arcoíris", category: "personalizados", cartData: { bouquetType: "round", color: "Arcoíris", roses: 75, price: 101 } },
];
