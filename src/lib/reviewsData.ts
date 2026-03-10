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
  { id: "bq-1", name: "Mariana T.", rating: 5, text: "A huge and beautiful bouquet. The white roses were fresh and perfect. I bought it for my wedding decoration.", image: reviewPurezaBlanca, productLabel: "Pureza Blanca", category: "bouquets", cartData: { bouquetType: "round", color: "Blanco", roses: 75, price: 101 } },
  { id: "bq-2", name: "Carlos R.", rating: 5, text: "I gifted this hot pink roses bouquet to my girlfriend for her birthday and she loved it. Vibrant colors and very fresh.", image: reviewRosaIntenso, productLabel: "Rosa Intenso", category: "bouquets", cartData: { bouquetType: "round", color: "Hot Pink", roses: 150, price: 226 } },
  { id: "bq-3", name: "Laura M.", rating: 5, text: "The pink roses are a dream. The result exceeded all my expectations. A huge and gorgeous bouquet.", image: reviewTernuraInfinita, productLabel: "Ternura Rosa", category: "bouquets", cartData: { bouquetType: "round", color: "Pink", roses: 150, price: 226 } },
  { id: "bq-4", name: "Isabella N.", rating: 5, text: "I always wanted a 200 purple roses bouquet and this one exceeded my expectations. Absolutely stunning!", image: review35, productLabel: "Encanto Morado", category: "bouquets", cartData: { bouquetType: "round", color: "Morado", roses: 200, price: 286 } },
  { id: "bq-5", name: "Ana P.", rating: 5, text: "I bought this orange roses bouquet for a corporate event. Everyone asked me where I got it.", image: reviewOcasoNaranja, productLabel: "Ocaso Naranja", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja", roses: 100, price: 136 } },
  { id: "bq-6", name: "Roberto E.", rating: 5, text: "I got the yellow roses bouquet and it brightened up the whole room. 100% recommended.", image: reviewSolRadiante, productLabel: "Sol Radiante", category: "bouquets", cartData: { bouquetType: "round", color: "Amarillo", roses: 100, price: 136 } },
  { id: "bq-7", name: "María G.", rating: 5, text: "I surprised my husband with 200 red roses for our anniversary. He couldn't stop smiling all day. Impressive!", image: reviewPasionTotal, productLabel: "Pasión Total", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo", roses: 200, price: 316 } },
  { id: "bq-8", name: "Mateo S.", rating: 5, text: "The blue of the roses is very intense. A unique detail that surprised everyone at the party.", image: reviewCieloAzul, productLabel: "Cielo Azul", category: "bouquets", cartData: { bouquetType: "round", color: "Azul", roses: 100, price: 256 } },
  { id: "bq-9", name: "Diego G.", rating: 5, text: "An entirely black bouquet, super elegant and exclusive. It looked spectacular in the decoration.", image: reviewNocheProfunda, productLabel: "Noche Profunda", category: "bouquets", cartData: { bouquetType: "round", color: "Negro", roses: 100, price: 256 } },
  { id: "bq-10", name: "Catalina V.", rating: 5, text: "Green roses are something I had never seen. Super original and eye-catching.", image: reviewFrescuraVerde, productLabel: "Frescura Verde", category: "bouquets", cartData: { bouquetType: "round", color: "Verde", roses: 100, price: 256 } },
  { id: "bq-11", name: "Andrea C.", rating: 5, text: "Hot pink, pink, and white roses for my wedding. It was the center of all the photos. Absolutely magical!", image: review34, productLabel: "Sinfonía Rosa", category: "bouquets", cartData: { bouquetType: "round", color: "Hot Pink, Pink y Blanco", roses: 150, price: 226 } },
  { id: "bq-12", name: "Diego F.", rating: 5, text: "I ordered 150 yellow and white roses for my graduation. The bouquet was huge and everyone loved it.", image: reviewJardinPrimaveral, productLabel: "Jardín Primaveral", category: "bouquets", cartData: { bouquetType: "round", color: "Amarillo y Blanco", roses: 150, price: 226 } },
  { id: "bq-13", name: "Renata B.", rating: 5, text: "The lilac and white roses are a divine combination. I ordered it for a baby shower and it was the perfect touch.", image: reviewLilaSuave, productLabel: "Lila Suave", category: "bouquets", cartData: { bouquetType: "round", color: "Lila y Blanco", roses: 100, price: 136 } },
  { id: "bq-14", name: "Hugo M.", rating: 5, text: "I gifted this 175 orange and yellow roses bouquet to my partner. The colors are spectacular and they lasted so long.", image: reviewCitricoRefrescante, productLabel: "Cítrico Refrescante", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja y Amarillo", roses: 175, price: 276 } },
  { id: "bq-15", name: "Carla L.", rating: 5, text: "Beautiful orange and white bouquet. It arrived on time and the flowers look very fresh.", image: reviewNaranjaCitrico, productLabel: "Naranja Cítrico", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja y Blanco", roses: 100, price: 136 } },
  { id: "bq-16", name: "Mónica H.", rating: 5, text: "The pink and white roses for the hotel reception looked divine. Guests couldn't stop complimenting them.", image: reviewTernuraInfinita2, productLabel: "Ternura Infinita", category: "bouquets", cartData: { bouquetType: "round", color: "Pink y Blanco", roses: 125, price: 201 } },
  { id: "bq-17", name: "Camila R.", rating: 5, text: "The red and yellow roses bouquet was the most beautiful thing I've seen. A total success.", image: reviewPasionIberica, productLabel: "Pasión Ibérica", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Amarillo", roses: 100, price: 166 } },
  { id: "bq-18", name: "Ignacio R.", rating: 5, text: "The red and pink roses bouquet was the star of the night. My girlfriend couldn't stop hugging it.", image: reviewDulzuraRoja, productLabel: "Dulzura Roja", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Pink", roses: 150, price: 256 } },
  { id: "bq-19", name: "Fernanda O.", rating: 5, text: "Red and white roses are a classic that never fails. The arrangement was perfect.", image: reviewPasionBicolor, productLabel: "Pasión Bicolor", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 100, price: 166 } },
  { id: "bq-20", name: "Juan P.", rating: 5, text: "The red and hot pink combination is fantastic. Everything arrived in excellent condition.", image: reviewRomanceOscuro, productLabel: "Romance Oscuro", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Hot Pink", roses: 100, price: 166 } },
  { id: "bq-21", name: "Lucía D.", rating: 5, text: "A mix of red and pink roses that conveys pure love. Left me speechless!", image: review33, productLabel: "Amor Apasionado", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Pink", roses: 125, price: 231 } },
  { id: "bq-22", name: "Mateo L.", rating: 5, text: "The contrast of black and white roses is incredible. Very elegant and modern.", image: reviewNocheDia, productLabel: "Noche y Día", category: "bouquets", cartData: { bouquetType: "round", color: "Negro y Blanco", roses: 100, price: 196 } },
  { id: "bq-23", name: "Valentina R.", rating: 5, text: "I loved this 175 blue and white roses bouquet. The contrast is beautiful and the quality is unbeatable.", image: reviewOceanoBlanco, productLabel: "Océano Blanco", category: "bouquets", cartData: { bouquetType: "round", color: "Azul y Blanco", roses: 175, price: 326 } },
  { id: "bq-24", name: "Elena V.", rating: 5, text: "The black with light pink gives it such a chic touch. Perfect for my gala event.", image: review32, productLabel: "Elegancia Rosa Oscuro", category: "bouquets", cartData: { bouquetType: "round", color: "Pink y Negro", roses: 125, price: 261 } },
  { id: "bq-25", name: "Valeria Z.", rating: 5, text: "The sunflower and red roses bouquet was spectacular. My boyfriend was speechless when he saw it.", image: reviewGirasolesPasion, productLabel: "Girasoles y Pasión", category: "bouquets", cartData: { bouquetType: "round", color: "Girasoles y Rojo", roses: 100, price: 306 } },
  { id: "bq-26", name: "Sergio K.", rating: 5, text: "Red, white, and pink... a trinity that never fails. One of the best I've ever bought.", image: review36, productLabel: "Tricolor Clásico", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Blanco y Pink", roses: 125, price: 216 } },
  { id: "bq-27", name: "Valentina C.", rating: 5, text: "I ordered red, purple, and white roses and it was the sensation of the party. Super dramatic.", image: reviewRomanceIntenso, productLabel: "Romance Intenso", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Morado y Blanco", roses: 125, price: 216 } },
  { id: "bq-28", name: "Andrés M.", rating: 5, text: "I bought red, yellow, and pink roses to propose. She said yes, thank you!", image: reviewFuegoSol, productLabel: "Fuego y Sol", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Amarillo y Pink", roses: 175, price: 281 } },
  { id: "bq-29", name: "Juliana P.", rating: 5, text: "The red, pink, and white roses combine incredibly. I ordered it for Valentine's Day.", image: reviewAmorTricolor, productLabel: "Amor Tricolor", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Pink y Blanco", roses: 150, price: 256 } },
  { id: "bq-30", name: "Sandra L.", rating: 5, text: "Incredible quality of the purple, pink, and white roses. Lasted more than a week perfectly fresh.", image: reviewPastelMagico, productLabel: "Pastel Mágico", category: "bouquets", cartData: { bouquetType: "round", color: "Morado, Pink y Blanco", roses: 100, price: 136 } },
  { id: "bq-31", name: "Miguel A.", rating: 5, text: "I ordered 200 orange, hot pink, and white roses for my partner's birthday. The size is impressive and the colors are beautiful.", image: reviewAtardecerCalido, productLabel: "Atardecer Cálido", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja, Hot Pink y Blanco", roses: 200, price: 286 } },
  { id: "bq-32", name: "Emilia M.", rating: 5, text: "I ordered orange, yellow, and white roses. The size is huge and it smells delicious.", image: reviewCitricoClaro, productLabel: "Cítrico Claro", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja, Amarillo y Blanco", roses: 150, price: 226 } },
  { id: "bq-33", name: "Luciana D.", rating: 5, text: "A dreamy bouquet. Pink, yellow, and white tones that enchant anyone.", image: reviewPrimaveraSuave, productLabel: "Primavera Suave", category: "bouquets", cartData: { bouquetType: "round", color: "Pink, Amarillo y Blanco", roses: 150, price: 226 } },
  { id: "bq-34", name: "Carmen P.", rating: 5, text: "The yellow, lilac, and white colors stand out beautifully. I bought it to brighten up the living room.", image: review31, productLabel: "Lila Brillante", category: "bouquets", cartData: { bouquetType: "round", color: "Amarillo, Lila y Blanco", roses: 100, price: 136 } },
  { id: "bq-35", name: "Lorena F.", rating: 5, text: "The black, hot pink, and white roses bouquet is unique. I'd never seen anything so original.", image: reviewContrasteElegante, productLabel: "Contraste Elegante", category: "bouquets", cartData: { bouquetType: "round", color: "Negro, Hot Pink y Blanco", roses: 100, price: 166 } },
  { id: "bq-36", name: "Andrés V.", rating: 5, text: "A bold and very beautiful combination of yellow, black, and white. Excellent quality.", image: reviewAbejaImperial, productLabel: "Abeja Imperial", category: "bouquets", cartData: { bouquetType: "round", color: "Amarillo, Negro y Blanco", roses: 100, price: 196 } },
  { id: "bq-37", name: "Gloria M.", rating: 5, text: "Red and white. Pure luxury. It's the second time I've ordered it and it always impresses.", image: review38, productLabel: "Pasión Elegante", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 125, price: 231 } },
  { id: "bq-38", name: "Patricia G.", rating: 5, text: "The hot pink and white bouquet is gorgeous. The tones match wonderfully with any decoration.", image: review37, productLabel: "Amanecer Rosa y Blanco", category: "bouquets", cartData: { bouquetType: "round", color: "Hot Pink y Blanco", roses: 100, price: 136 } },

  // === ARREGLOS ===
  { id: "rev-arr-1", name: "Verónica T.", rating: 5, text: "The rose arrangement for the dining table looked beautiful. It lasted almost two weeks fresh.", image: "/placeholder.svg", productLabel: "Classic Arrangement", category: "arreglos", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 50, price: 91 } },
  { id: "rev-arr-2", name: "Jorge L.", rating: 5, text: "I ordered a large arrangement for the office reception. All clients praised it. Very elegant.", image: "/placeholder.svg", productLabel: "Premium Arrangement", category: "arreglos", cartData: { bouquetType: "round", color: "Rojo y Negro", roses: 75, price: 131 } },

  // === CAJAS ===
  { id: "rev-caj-1", name: "Lorena P.", rating: 5, text: "The red roses box was the perfect gift for my best friend. The presentation is luxurious.", image: "/placeholder.svg", productLabel: "Elegant Box", category: "cajas", cartData: { bouquetType: "round", color: "Rojo", roses: 50, price: 106 } },

  // === CESTAS ===
  { id: "rev-ces-1", name: "Alicia R.", rating: 5, text: "The rose basket for the memorial was sober and beautiful. It conveyed so much care. Thank you for the delicacy.", image: "/placeholder.svg", productLabel: "Memorial Basket", category: "cestas", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 75, price: 116 } },

  // === JARRONES ===
  { id: "rev-jar-1", name: "Renata L.", rating: 5, text: "The vase with red roses is a work of art. I have it in my living room and all my guests admire it.", image: "/placeholder.svg", productLabel: "Classic Vase", category: "jarrones", cartData: { bouquetType: "round", color: "Rojo", roses: 50, price: 106 } },

  // === OSOS ===
  { id: "rev-oso-1", name: "Valeria N.", rating: 5, text: "The red rose bear was the sensation at the baby shower. Everyone wanted to take a photo with it.", image: "/placeholder.svg", productLabel: "Red Rose Bear", category: "osos", cartData: { bouquetType: "round", color: "Rojo", roses: 50, price: 150 } },
];
