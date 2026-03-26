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

// Product images for cart
import bqBlancoImg from '@/assets/bq-blanco.png';
import bqHotpinkImg from '@/assets/bq-hotpink.png';
import bqLightpinkImg from '@/assets/bq-lightpink.png';
import bqMoradoImg from '@/assets/bq-morado.png';
import bqNaranjaImg from '@/assets/bq-naranja.png';
import bqAmarilloImg from '@/assets/bq-amarillo.png';
import bqRojoImg from '@/assets/bq-rojo.png';
import bqAzulImg from '@/assets/bq-azul.png';
import bqNegroImg from '@/assets/bq-negro.png';
import bqVerdeImg from '@/assets/bq-verde.png';
import bqMixHotpinkBlancoImg from '@/assets/bq-mix-hotpink-blanco.png';
import bqMixAmarilloBlancoImg from '@/assets/bq-mix-amarillo-blanco.png';
import bqMixLilaBlancoImg from '@/assets/bq-mix-lila-blanco.png';
import bqMixNaranjaAmarilloImg from '@/assets/bq-mix-naranja-amarillo.png';
import bqMixNaranjaBlancoImg from '@/assets/bq-mix-naranja-blanco.png';
import bqMixLightpinkBlancoImg from '@/assets/bq-mix-lightpink-blanco.png';
import bqMixEspanaImg from '@/assets/bq-mix-espana.png';
import bqMixRojoLightpinkImg from '@/assets/bq-mix-rojo-lightpink.png';
import bqMixRojoBlancoImg from '@/assets/bq-mix-rojo-blanco.png';
import bqMixRojoHotpinkImg from '@/assets/bq-mix-rojo-hotpink.png';
import bqMixRojoLightpink2Img from '@/assets/bq-mix-rojo-lightpink-2.png';
import bqMixNegroBlancoImg from '@/assets/bq-mix-negro-blanco.png';
import bqMixAzulBlancoImg from '@/assets/bq-mix-azul-blanco.png';
import bqMixLightpinkNegroImg from '@/assets/bq-mix-lightpink-negro.png';
import bqMixGirasolesImg from '@/assets/bq-mix-girasoles.png';
import bqMixRojoPinkLightpinkImg from '@/assets/bq-mix-rojo-pink-lightpink.png';
import bqMixRomanticoImg from '@/assets/bq-mix-romantico.png';
import bqMixAlegriaImg from '@/assets/bq-mix-alegria.png';
import bqMixRojoPinkBlancoImg from '@/assets/bq-mix-rojo-pink-blanco.png';
import bqMixPastelImg from '@/assets/bq-mix-pastel.png';
import bqMixCalidoImg from '@/assets/bq-mix-calido.png';
import bqMixNaranjaAmarillo2Img from '@/assets/bq-mix-naranja-amarillo-2.png';
import bqMixPinkAmarilloBlancoImg from '@/assets/bq-mix-pink-amarillo-blanco.png';
import bqMixAmarilloLilaBlancoImg from '@/assets/bq-mix-amarillo-lila-blanco.png';
import bqMixRojoBlanco3Img from '@/assets/bq-mix-rojo-blanco-3.png';
import bqMixNegroRosaImg from '@/assets/bq-mix-negro-rosa.png';
import bqMixAmarilloNegroBlancoImg from '@/assets/bq-mix-amarillo-negro-blanco.png';
import bqMixRojoPinkBlanco2Img from '@/assets/bq-mix-rojo-pink-blanco-2.png';
import bqMixRojoBlancoNegroImg from '@/assets/bq-mix-rojo-blanco-negro.png';

export const reviews: ReviewData[] = [
  // === BOUQUETS ===
  { id: "bq-1", name: "Mariana T.", rating: 5, text: "A huge and beautiful bouquet. The white roses were fresh and perfect. I bought it for my wedding decoration.", image: reviewPurezaBlanca, productLabel: "Pure White", category: "bouquets", cartData: { bouquetType: "round", color: "Blanco", roses: 75, price: 101, productImage: bqBlancoImg } },
  { id: "bq-2", name: "Carlos R.", rating: 5, text: "I gifted this hot pink roses bouquet to my girlfriend for her birthday and she loved it. Vibrant colors and very fresh.", image: reviewRosaIntenso, productLabel: "Hot Pink Blush", category: "bouquets", cartData: { bouquetType: "round", color: "Hot Pink", roses: 150, price: 226, productImage: bqHotpinkImg } },
  { id: "bq-3", name: "Laura M.", rating: 5, text: "The pink roses are a dream. The result exceeded all my expectations. A huge and gorgeous bouquet.", image: reviewTernuraInfinita, productLabel: "Soft Pink", category: "bouquets", cartData: { bouquetType: "round", color: "Pink", roses: 150, price: 226, productImage: bqLightpinkImg } },
  { id: "bq-4", name: "Isabella N.", rating: 5, text: "I always wanted a 200 purple roses bouquet and this one exceeded my expectations. Absolutely stunning!", image: review35, productLabel: "Purple Charm", category: "bouquets", cartData: { bouquetType: "round", color: "Morado", roses: 200, price: 286, productImage: bqMoradoImg } },
  { id: "bq-5", name: "Ana P.", rating: 5, text: "I bought this orange roses bouquet for a corporate event. Everyone asked me where I got it.", image: reviewOcasoNaranja, productLabel: "Orange Sunset", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja", roses: 100, price: 136, productImage: bqNaranjaImg } },
  { id: "bq-6", name: "Roberto E.", rating: 5, text: "I got the yellow roses bouquet and it brightened up the whole room. 100% recommended.", image: reviewSolRadiante, productLabel: "Radiant Sun", category: "bouquets", cartData: { bouquetType: "round", color: "Amarillo", roses: 100, price: 136, productImage: bqAmarilloImg } },
  { id: "bq-7", name: "María G.", rating: 5, text: "I surprised my husband with 200 red roses for our anniversary. He couldn't stop smiling all day. Impressive!", image: reviewPasionTotal, productLabel: "Total Passion", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo", roses: 200, price: 316, productImage: bqRojoImg } },
  { id: "bq-8", name: "Mateo S.", rating: 5, text: "The blue of the roses is very intense. A unique detail that surprised everyone at the party.", image: reviewCieloAzul, productLabel: "Blue Sky", category: "bouquets", cartData: { bouquetType: "round", color: "Azul", roses: 100, price: 256, productImage: bqAzulImg } },
  { id: "bq-9", name: "Diego G.", rating: 5, text: "An entirely black bouquet, super elegant and exclusive. It looked spectacular in the decoration.", image: reviewNocheProfunda, productLabel: "Deep Night", category: "bouquets", cartData: { bouquetType: "round", color: "Negro", roses: 100, price: 256, productImage: bqNegroImg } },
  { id: "bq-10", name: "Catalina V.", rating: 5, text: "Green roses are something I had never seen. Super original and eye-catching.", image: reviewFrescuraVerde, productLabel: "Green Fresh", category: "bouquets", cartData: { bouquetType: "round", color: "Verde", roses: 100, price: 256, productImage: bqVerdeImg } },
  { id: "bq-11", name: "Andrea C.", rating: 5, text: "Hot pink, pink, and white roses for my wedding. It was the center of all the photos. Absolutely magical!", image: review34, productLabel: "Pink Symphony", category: "bouquets", cartData: { bouquetType: "round", color: "Hot Pink, Pink y Blanco", roses: 150, price: 226, productImage: bqMixRojoBlanco3Img } },
  { id: "bq-12", name: "Diego F.", rating: 5, text: "I ordered 150 yellow and white roses for my graduation. The bouquet was huge and everyone loved it.", image: reviewJardinPrimaveral, productLabel: "Spring Garden", category: "bouquets", cartData: { bouquetType: "round", color: "Amarillo y Blanco", roses: 150, price: 226, productImage: bqMixAmarilloBlancoImg } },
  
  { id: "bq-14", name: "Hugo M.", rating: 5, text: "I gifted this 175 orange and yellow roses bouquet to my partner. The colors are spectacular and they lasted so long.", image: reviewCitricoRefrescante, productLabel: "Citrus Refresh", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja y Amarillo", roses: 175, price: 276, productImage: bqMixNaranjaAmarilloImg } },
  { id: "bq-15", name: "Carla L.", rating: 5, text: "Beautiful orange and white bouquet. It arrived on time and the flowers look very fresh.", image: reviewNaranjaCitrico, productLabel: "Orange Citrus", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja y Blanco", roses: 100, price: 136, productImage: bqMixNaranjaBlancoImg } },
  { id: "bq-16", name: "Mónica H.", rating: 5, text: "The pink and white roses for the hotel reception looked divine. Guests couldn't stop complimenting them.", image: reviewTernuraInfinita2, productLabel: "Infinite Tenderness", category: "bouquets", cartData: { bouquetType: "round", color: "Pink y Blanco", roses: 125, price: 201, productImage: bqMixLightpinkBlancoImg } },
  { id: "bq-17", name: "Camila R.", rating: 5, text: "The red and yellow roses bouquet was the most beautiful thing I've seen. A total success.", image: reviewPasionIberica, productLabel: "Iberian Passion", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Amarillo", roses: 100, price: 166, productImage: bqMixEspanaImg } },
  { id: "bq-18", name: "Ignacio R.", rating: 5, text: "The red and pink roses bouquet was the star of the night. My girlfriend couldn't stop hugging it.", image: reviewDulzuraRoja, productLabel: "Red Sweetness", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Pink", roses: 150, price: 256, productImage: bqMixRojoLightpinkImg } },
  { id: "bq-19", name: "Fernanda O.", rating: 5, text: "Red and white roses are a classic that never fails. The arrangement was perfect.", image: reviewPasionBicolor, productLabel: "Bicolor Passion", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 100, price: 166, productImage: bqMixRojoBlancoImg } },
  { id: "bq-20", name: "Juan P.", rating: 5, text: "The red and hot pink combination is fantastic. Everything arrived in excellent condition.", image: reviewRomanceOscuro, productLabel: "Dark Romance", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Hot Pink", roses: 100, price: 166, productImage: bqMixRojoHotpinkImg } },
  { id: "bq-21", name: "Lucía D.", rating: 5, text: "A mix of red and pink roses that conveys pure love. Left me speechless!", image: review33, productLabel: "Passionate Love", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Pink", roses: 125, price: 231, productImage: bqMixRojoLightpink2Img } },
  { id: "bq-22", name: "Mateo L.", rating: 5, text: "The contrast of black and white roses is incredible. Very elegant and modern.", image: reviewNocheDia, productLabel: "Night & Day", category: "bouquets", cartData: { bouquetType: "round", color: "Negro y Blanco", roses: 100, price: 196, productImage: bqMixNegroBlancoImg } },
  { id: "bq-23", name: "Valentina R.", rating: 5, text: "I loved this 175 blue and white roses bouquet. The contrast is beautiful and the quality is unbeatable.", image: reviewOceanoBlanco, productLabel: "White Ocean", category: "bouquets", cartData: { bouquetType: "round", color: "Azul y Blanco", roses: 175, price: 326, productImage: bqMixAzulBlancoImg } },
  { id: "bq-24", name: "Elena V.", rating: 5, text: "The black with light pink gives it such a chic touch. Perfect for my gala event.", image: review32, productLabel: "Dark Pink Elegance", category: "bouquets", cartData: { bouquetType: "round", color: "Pink y Negro", roses: 125, price: 261, productImage: bqMixLightpinkNegroImg } },
  { id: "bq-25", name: "Valeria Z.", rating: 5, text: "The sunflower and red roses bouquet was spectacular. My boyfriend was speechless when he saw it.", image: reviewGirasolesPasion, productLabel: "Sunflowers & Passion", category: "bouquets", cartData: { bouquetType: "round", color: "Girasoles y Rojo", roses: 100, price: 306, productImage: bqMixGirasolesImg } },
  { id: "bq-26", name: "Sergio K.", rating: 5, text: "Red, white, and pink... a trinity that never fails. One of the best I've ever bought.", image: review36, productLabel: "Classic Tricolor", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Blanco y Pink", roses: 125, price: 216, productImage: bqMixRojoPinkLightpinkImg } },
  { id: "bq-27", name: "Valentina C.", rating: 5, text: "I ordered red, purple, and white roses and it was the sensation of the party. Super dramatic.", image: reviewRomanceIntenso, productLabel: "Intense Romance", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Morado y Blanco", roses: 125, price: 216, productImage: bqMixRomanticoImg } },
  { id: "bq-28", name: "Andrés M.", rating: 5, text: "I bought red, yellow, and pink roses to propose. She said yes, thank you!", image: reviewFuegoSol, productLabel: "Fire & Sun", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Amarillo y Pink", roses: 175, price: 281, productImage: bqMixAlegriaImg } },
  { id: "bq-29", name: "Juliana P.", rating: 5, text: "The red, pink, and white roses combine incredibly. I ordered it for Valentine's Day.", image: reviewAmorTricolor, productLabel: "Tricolor Love", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo, Pink y Blanco", roses: 150, price: 256, productImage: bqMixRojoPinkBlancoImg } },
  { id: "bq-30", name: "Sandra L.", rating: 5, text: "Incredible quality of the purple, pink, and white roses. Lasted more than a week perfectly fresh.", image: reviewPastelMagico, productLabel: "Magic Pastel", category: "bouquets", cartData: { bouquetType: "round", color: "Morado, Pink y Blanco", roses: 100, price: 136, productImage: bqMixPastelImg } },
  { id: "bq-31", name: "Miguel A.", rating: 5, text: "I ordered 200 orange, hot pink, and white roses for my partner's birthday. The size is impressive and the colors are beautiful.", image: reviewAtardecerCalido, productLabel: "Warm Sunset", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja, Hot Pink y Blanco", roses: 200, price: 286, productImage: bqMixCalidoImg } },
  { id: "bq-32", name: "Emilia M.", rating: 5, text: "I ordered orange, yellow, and white roses. The size is huge and it smells delicious.", image: reviewCitricoClaro, productLabel: "Light Citrus", category: "bouquets", cartData: { bouquetType: "round", color: "Naranja, Amarillo y Blanco", roses: 150, price: 226, productImage: bqMixNaranjaAmarillo2Img } },
  { id: "bq-33", name: "Luciana D.", rating: 5, text: "A dreamy bouquet. Pink, yellow, and white tones that enchant anyone.", image: reviewPrimaveraSuave, productLabel: "Soft Spring", category: "bouquets", cartData: { bouquetType: "round", color: "Pink, Amarillo y Blanco", roses: 150, price: 226, productImage: bqMixPinkAmarilloBlancoImg } },
  { id: "bq-34", name: "Carmen P.", rating: 5, text: "The yellow, lilac, and white colors stand out beautifully. I bought it to brighten up the living room.", image: review31, productLabel: "Bright Lilac", category: "bouquets", cartData: { bouquetType: "round", color: "Amarillo, Lila y Blanco", roses: 100, price: 136, productImage: bqMixAmarilloLilaBlancoImg } },
  { id: "bq-35", name: "Lorena F.", rating: 5, text: "The black, hot pink, and white roses bouquet is unique. I'd never seen anything so original.", image: reviewContrasteElegante, productLabel: "Elegant Contrast", category: "bouquets", cartData: { bouquetType: "round", color: "Negro, Hot Pink y Blanco", roses: 100, price: 166, productImage: bqMixNegroRosaImg } },
  { id: "bq-36", name: "Andrés V.", rating: 5, text: "A bold and very beautiful combination of yellow, black, and white. Excellent quality.", image: reviewAbejaImperial, productLabel: "Imperial Bee", category: "bouquets", cartData: { bouquetType: "round", color: "Amarillo, Negro y Blanco", roses: 100, price: 196, productImage: bqMixAmarilloNegroBlancoImg } },
  { id: "bq-37", name: "Gloria M.", rating: 5, text: "Red and white. Pure luxury. It's the second time I've ordered it and it always impresses.", image: review38, productLabel: "Elegant Passion", category: "bouquets", cartData: { bouquetType: "round", color: "Rojo y Blanco", roses: 125, price: 231, productImage: bqMixRojoBlancoNegroImg } },
  { id: "bq-38", name: "Patricia G.", rating: 5, text: "The hot pink and white bouquet is gorgeous. The tones match wonderfully with any decoration.", image: review37, productLabel: "Pink & White Dawn", category: "bouquets", cartData: { bouquetType: "round", color: "Hot Pink y Blanco", roses: 100, price: 136, productImage: bqMixHotpinkBlancoImg } },

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
