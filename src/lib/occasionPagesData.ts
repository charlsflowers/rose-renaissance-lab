/**
 * Occasion collection pages — programmatic SEO landings.
 * Indexable EN + ES, native slugs per language (no /es prefix re-rooting).
 * Mother's Day is NOT included here — it already lives at /bouquets/mothers-day
 * and is integrated into the "By Occasion" menu group by the Navbar directly.
 */
export type OccasionTier = 1 | 2 | 3;

export interface OccasionPage {
  /** Canonical EN slug, used as the URL segment on /collections/<slug>. */
  slug: string;
  /** Canonical ES slug (no accents/n), used on /es/collections/<slugEs>. */
  slugEs: string;
  tier: OccasionTier;
  /**
   * Shopify collection handle. Defaults to `slug` when omitted (we created the
   * collections in Shopify with the same handle as the EN slug). When the
   * collection has products on Shopify they render inline; if empty/missing
   * the page keeps the existing SEO + cluster + "notify me" fallback.
   */
  shopifyHandle?: string;
  /** Primary search keyword (mirrored verbatim in H1 + first paragraph). */
  keyword: { en: string; es: string };
  /** Secondary keyword (woven naturally as synonym) — optional. */
  keyword2?: { en: string; es: string };
  h1: { en: string; es: string };
  title: { en: string; es: string };
  description: { en: string; es: string };
  /** First paragraph — mirror-effect: must contain the main keyword verbatim. */
  intro: { en: string; es: string };
  sections: Array<{
    h2: { en: string; es: string };
    body: { en: string; es: string };
  }>;
}

export const occasionPages: OccasionPage[] = [
  // ----------- TIER 1 (menu) -----------
  {
    slug: "valentines-flowers",
    slugEs: "flores-san-valentin",
    tier: 1,
    keyword: { en: "valentines flowers", es: "flores para san valentín" },
    keyword2: { en: "valentine's day roses", es: "rosas para san valentín" },
    h1: { en: "Valentines Flowers in Miami", es: "Flores para San Valentín en Miami" },
    title: {
      en: "Valentines Flowers Miami | Same-Day Roses Delivery | Charls Flowers",
      es: "Flores para San Valentín Miami | Rosas a Domicilio el Mismo Día | Charls Flowers",
    },
    description: {
      en: "Valentines flowers delivered same-day in Miami. Hand-tied red rose bouquets, 50–200 stems, insulated luxury box. Order before 3PM.",
      es: "Flores para San Valentín a domicilio el mismo día en Miami. Bouquets de rosas rojas hechos a mano, 50–200 tallos, caja de lujo. Pide antes de las 3PM.",
    },
    intro: {
      en: "Looking for valentines flowers in Miami? Charls Flowers hand-ties premium red rose bouquets the morning of February 14th and delivers them across Miami the same day. The classic move — 100 long-stem red roses in our signature box — still wins.",
      es: "¿Buscas flores para San Valentín en Miami? Charls Flowers monta a mano bouquets premium de rosas rojas la mañana del 14 de febrero y los entrega el mismo día por todo Miami. El movimiento clásico —100 rosas rojas tallo largo en nuestra caja firma— sigue ganando.",
    },
    sections: [
      {
        h2: { en: "Why red roses still win on Valentine's Day", es: "Por qué la rosa roja sigue siendo la apuesta segura" },
        body: {
          en: "Red roses are the universal Valentine's Day language — no decoding required. We use Ecuadorian premium grade roses with 60–70cm stems, hydrated overnight so the heads open in 24–48 hours after delivery, not collapse.",
          es: "La rosa roja es el idioma universal de San Valentín — no hay que descifrar nada. Usamos rosa premium ecuatoriana con tallos de 60–70cm, hidratada toda la noche para que los botones abran en 24–48 horas tras la entrega, no que se caigan.",
        },
      },
      {
        h2: { en: "Beyond red: bicolor and mixed Valentine's bouquets", es: "Más allá del rojo: bouquets bicolor y mezclas" },
        body: {
          en: "If she already received red last year, switch lanes: a red+white bicolor, an all-white grand romantic statement, or a custom mixed bouquet in her exact colors. Use our custom builder to preview before paying.",
          es: "Si el año pasado ya recibió rojas, cambia de carril: un bicolor rojo+blanco, un statement romántico todo blanco, o un bouquet mixto a medida en sus colores exactos. Usa nuestro builder a medida para previsualizar antes de pagar.",
        },
      },
      {
        h2: { en: "Same-day Valentine's delivery: how it works", es: "Entrega el mismo día en San Valentín: cómo funciona" },
        body: {
          en: "Order before 3PM Miami time on February 14th and we deliver that evening across Miami-Dade and Broward. Outside Florida, FedEx Express overnight in our insulated box. Slots fill fast — book early.",
          es: "Pide antes de las 3PM hora de Miami el 14 de febrero y entregamos esa tarde por Miami-Dade y Broward. Fuera de Florida, FedEx Express overnight en caja aislada. Los slots se llenan rápido — reserva temprano.",
        },
      },
    ],
  },
  {
    slug: "birthday-flowers",
    slugEs: "flores-cumpleanos",
    tier: 1,
    keyword: { en: "birthday flowers", es: "flores de cumpleaños" },
    keyword2: { en: "birthday bouquet delivery", es: "ramo de cumpleaños a domicilio" },
    h1: { en: "Birthday Flowers in Miami", es: "Flores de Cumpleaños en Miami" },
    title: {
      en: "Birthday Flowers Miami | Bright Bouquets Delivered Today | Charls Flowers",
      es: "Flores de Cumpleaños Miami | Bouquets Vibrantes el Mismo Día | Charls Flowers",
    },
    description: {
      en: "Birthday flowers delivered same-day in Miami. Bright single-color bouquets and custom mixes. Order before 3PM for today's delivery.",
      es: "Flores de cumpleaños a domicilio el mismo día en Miami. Bouquets vibrantes de un color y mezclas a medida. Pide antes de las 3PM para entrega hoy.",
    },
    intro: {
      en: "Birthday flowers should match the person — not a stock SKU. We send same-day birthday bouquets across Miami in the recipient's favorite color: hot pink for the bold ones, yellow for the sunshine friend, white for the elegant aunt, or a custom mix from our builder.",
      es: "Las flores de cumpleaños deben parecerse a la persona — no a un SKU genérico. Enviamos ramos de cumpleaños el mismo día por Miami en el color favorito del cumpleañero: hot pink para los atrevidos, amarillo para la amiga solar, blanco para la tía elegante o una mezcla a medida desde nuestro builder.",
    },
    sections: [
      {
        h2: { en: "Pick a color, not a template", es: "Elige un color, no una plantilla" },
        body: {
          en: "Browse by color (red, white, hot pink, yellow, orange, blue, purple, black) and pick what matches her style. Each color collection shows every bouquet we make in that family — single color and mixed combinations included.",
          es: "Filtra por color (rojo, blanco, hot pink, amarillo, naranja, azul, morado, negro) y elige lo que va con su estilo. Cada colección de color muestra todos los bouquets que hacemos en esa familia — un color y mezclas.",
        },
      },
      {
        h2: { en: "Surprise office and home deliveries", es: "Sorpresas a oficinas y casas" },
        body: {
          en: "Sending to her office? Add a written card with the recipient's exact name. Surprise at home? Pick the AM or PM window at checkout. We text the driver's photo + delivery confirmation when it arrives.",
          es: "¿Lo mandas a su oficina? Añade tarjeta con el nombre exacto. ¿Sorpresa en casa? Elige ventana AM o PM en el checkout. Te mandamos la foto del repartidor y confirmación cuando llega.",
        },
      },
      {
        h2: { en: "Custom build for the picky birthday gift", es: "Builder a medida para el regalo difícil" },
        body: {
          en: "If she's particular, build the exact bouquet: 50–200 roses, your color, glitter or natural finish, paper choice, ribbon. AI preview shows what she'll receive before you pay.",
          es: "Si es exigente, construye el ramo exacto: 50–200 rosas, tu color, acabado glitter o natural, papel y lazo. Vista previa con IA muestra lo que va a recibir antes de pagar.",
        },
      },
    ],
  },
  {
    slug: "sympathy-flowers",
    slugEs: "arreglos-funebres",
    tier: 1,
    keyword: { en: "sympathy flowers", es: "arreglos fúnebres" },
    keyword2: { en: "funeral flowers", es: "flores para funeral" },
    h1: { en: "Sympathy & Funeral Flowers in Miami", es: "Arreglos Fúnebres y Flores para Funeral en Miami" },
    title: {
      en: "Sympathy & Funeral Flowers Miami | Same-Day Condolence Delivery | Charls Flowers",
      es: "Arreglos Fúnebres y Flores para Funeral Miami | Entrega Mismo Día | Charls Flowers",
    },
    description: {
      en: "Sympathy flowers and funeral flowers delivered same-day across Miami. Elegant all-white bouquets, dignified packaging, direct-to-home or to the funeral home.",
      es: "Arreglos fúnebres y flores para funeral entregadas el mismo día por Miami. Bouquets blancos elegantes, presentación digna, a casa o directamente a la funeraria.",
    },
    intro: {
      en: "When you need sympathy flowers — or funeral flowers — fast and quietly, we handle the timing so you can focus on family. Charls Flowers delivers same-day across Miami to homes, churches and funeral homes with dignified white-rose arrangements and discreet packaging.",
      es: "Cuando necesitas arreglos fúnebres o flores para funeral, rápido y con discreción, nosotros gestionamos los tiempos para que tú te ocupes de la familia. Charls Flowers entrega el mismo día por Miami a casas, iglesias y funerarias con arreglos de rosas blancas dignos y empaque sobrio.",
    },
    sections: [
      {
        h2: { en: "White roses: the universal language of condolence", es: "Rosa blanca: el idioma universal del pésame" },
        body: {
          en: "All-white bouquets are the safest, most respectful choice. We use 60–70cm Ecuadorian white roses tied with linen ribbon — never glitter, never bright accents — appropriate for any faith or family.",
          es: "Los bouquets todo blanco son la opción más segura y respetuosa. Usamos rosa blanca ecuatoriana de 60–70cm atada con lazo de lino — nunca glitter ni acentos llamativos — apropiada para cualquier fe o familia.",
        },
      },
      {
        h2: { en: "Delivery to funeral homes and viewings", es: "Entrega a funerarias y velorios" },
        body: {
          en: "We deliver directly to Miami-area funeral homes and chapels. Include the deceased's name and the family name on the card; we coordinate timing with the funeral director when needed.",
          es: "Entregamos directo a funerarias y capillas de Miami. Incluye el nombre del fallecido y el apellido de la familia en la tarjeta; coordinamos los tiempos con el director funerario cuando hace falta.",
        },
      },
      {
        h2: { en: "Sent to the family home instead", es: "Si va a la casa de la familia" },
        body: {
          en: "A bouquet sent to the home after the service is often more meaningful than another arrangement at the chapel. Order a hand-tied white bouquet for delivery 2–7 days after the funeral.",
          es: "Un bouquet enviado a la casa después del servicio suele ser más significativo que otro arreglo más en la capilla. Pide un bouquet blanco hecho a mano para entrega 2–7 días después del funeral.",
        },
      },
    ],
  },
  {
    slug: "wedding-flowers",
    slugEs: "ramo-de-novia",
    tier: 1,
    keyword: { en: "wedding flowers", es: "ramo de novia" },
    keyword2: { en: "bridal bouquet", es: "flores para boda" },
    h1: { en: "Wedding Flowers & Bridal Bouquets in Miami", es: "Ramo de Novia y Flores para Boda en Miami" },
    title: {
      en: "Wedding Flowers Miami | Bridal Bouquets & Reception Roses | Charls Flowers",
      es: "Ramo de Novia Miami | Flores para Boda y Recepción | Charls Flowers",
    },
    description: {
      en: "Wedding flowers and bridal bouquets in Miami. Hand-tied bouquets, bridesmaid arrangements and reception roses. Consult by phone for full wedding orders.",
      es: "Ramo de novia y flores para boda en Miami. Bouquets hechos a mano, arreglos para damas y rosas para la recepción. Consulta por teléfono para bodas completas.",
    },
    intro: {
      en: "Wedding flowers in Miami — and bridal bouquets specifically — are the one thing you don't risk on an online template. Charls Flowers makes bridal bouquets, bridesmaid pieces and reception arrangements by hand from premium Ecuadorian roses. Most brides book 4–8 weeks out; rush orders inside two weeks possible on availability.",
      es: "El ramo de novia en Miami — y las flores para boda en general — es la pieza con la que no se arriesga en una plantilla online. Charls Flowers hace ramos de novia, piezas para damas y arreglos de recepción a mano con rosa ecuatoriana premium. La mayoría reserva con 4–8 semanas; pedidos urgentes con menos de dos semanas, sujeto a disponibilidad.",
    },
    sections: [
      {
        h2: { en: "Classic white bridal bouquets", es: "Ramos de novia clásicos en blanco" },
        body: {
          en: "The timeless bridal bouquet: 30–50 stems of premium white roses, hand-tied with silk or linen ribbon, sized to the bride's frame. We match the white tone to the dress so they don't fight in photos.",
          es: "El ramo de novia atemporal: 30–50 tallos de rosa blanca premium, hecho a mano con lazo de seda o lino, dimensionado al cuerpo de la novia. Igualamos el tono de blanco con el vestido para que no peleen en las fotos.",
        },
      },
      {
        h2: { en: "Colored and bicolor bridal bouquets", es: "Ramos de novia con color o bicolor" },
        body: {
          en: "Hot pink, blush, deep red, or a white-and-rose-gold bicolor — we build the exact palette. Use the custom builder for preview, then we hand-finish it in the workshop.",
          es: "Hot pink, blush, rojo profundo o bicolor blanco-rosa dorado — montamos la paleta exacta. Usa el builder a medida para previsualizar, luego lo terminamos a mano en el taller.",
        },
      },
      {
        h2: { en: "Reception centerpieces and bridesmaids", es: "Centros de recepción y damas" },
        body: {
          en: "Bridesmaid bouquets, ceremony arrangements, sweetheart-table centerpieces. For full wedding orders (10+ pieces) call us — we quote and schedule a tasting/visual sample if needed.",
          es: "Bouquets para damas, arreglos para la ceremonia, centro para la mesa de los novios. Para bodas completas (10+ piezas) llámanos — cotizamos y agendamos muestra visual si hace falta.",
        },
      },
    ],
  },
  {
    slug: "christmas-flowers",
    slugEs: "flores-de-navidad",
    tier: 1,
    keyword: { en: "christmas flowers", es: "flores de navidad" },
    keyword2: { en: "holiday roses", es: "rosas navideñas" },
    h1: { en: "Christmas Flowers in Miami", es: "Flores de Navidad en Miami" },
    title: {
      en: "Christmas Flowers Miami | Red & White Holiday Roses Delivered | Charls Flowers",
      es: "Flores de Navidad Miami | Rosas Rojas y Blancas a Domicilio | Charls Flowers",
    },
    description: {
      en: "Christmas flowers delivered across Miami. Holiday red roses, white-and-gold bouquets and centerpieces for the table. Order ahead for Christmas Eve delivery.",
      es: "Flores de Navidad a domicilio en Miami. Rosas rojas navideñas, bouquets blanco-dorado y centros para la mesa. Pide con tiempo para entrega en Nochebuena.",
    },
    intro: {
      en: "Christmas flowers in Miami — fresh roses, not the supermarket poinsettia. We deliver hand-tied red and white rose bouquets across Miami all of December, including Christmas Eve (December 24th) until our cut-off. Book a few days early; holiday slots fill.",
      es: "Flores de Navidad en Miami — rosa fresca, no el poinsettia del supermercado. Entregamos bouquets de rosa roja y blanca hechos a mano por todo Miami durante diciembre, incluida Nochebuena (24 de diciembre) hasta nuestro cierre. Reserva con días de anticipación; los slots de fiestas se llenan.",
    },
    sections: [
      {
        h2: { en: "Red roses for the Christmas table", es: "Rosa roja para la mesa navideña" },
        body: {
          en: "100–200 long-stem red roses make the Christmas Eve centerpiece. We can split a large order into two smaller arrangements for both ends of the table.",
          es: "100–200 rosas rojas de tallo largo hacen el centro de Nochebuena. Podemos dividir un pedido grande en dos arreglos para ambas puntas de la mesa.",
        },
      },
      {
        h2: { en: "White-and-gold holiday bouquets", es: "Bouquets blanco-dorado para fiestas" },
        body: {
          en: "For a less classical look, a white bouquet with gold ribbon and paper feels editorial without losing the holiday cue. Pairs well with gold tableware.",
          es: "Para algo menos clásico, un bouquet blanco con lazo y papel dorado se siente editorial sin perder el código navideño. Combina bien con vajilla dorada.",
        },
      },
      {
        h2: { en: "Gift roses for clients and hosts", es: "Rosas regalo para clientes y anfitriones" },
        body: {
          en: "Bringing roses to a Christmas dinner is the easiest hostess gift. We deliver to the host's house in the afternoon so they're already arranged when you arrive.",
          es: "Llevar rosas a una cena de Navidad es el regalo de anfitriona más fácil. Entregamos a casa del anfitrión por la tarde para que ya estén arregladas cuando llegues.",
        },
      },
    ],
  },

  // ----------- TIER 2 (footer + index) -----------
  {
    slug: "day-of-the-dead-flowers",
    slugEs: "flores-dia-de-muertos",
    tier: 2,
    keyword: { en: "day of the dead flowers", es: "flores para día de muertos" },
    keyword2: { en: "ofrenda flowers", es: "flores para ofrenda" },
    h1: { en: "Day of the Dead Flowers in Miami", es: "Flores para Día de Muertos en Miami" },
    title: {
      en: "Day of the Dead Flowers Miami | Ofrenda Roses Delivered | Charls Flowers",
      es: "Flores para Día de Muertos Miami | Rosas para Ofrenda a Domicilio | Charls Flowers",
    },
    description: {
      en: "Day of the Dead flowers for your ofrenda in Miami. Hand-tied bouquets and roses delivered for November 1–2.",
      es: "Flores para Día de Muertos para tu ofrenda en Miami. Bouquets hechos a mano y rosas a domicilio para el 1 y 2 de noviembre.",
    },
    intro: {
      en: "Day of the Dead flowers honor the people we still talk about. Charls Flowers delivers bouquets for your home ofrenda across Miami for November 1st and 2nd — premium roses hand-tied in the colors your family chose to remember.",
      es: "Las flores para Día de Muertos honran a quienes seguimos nombrando. Charls Flowers entrega bouquets para tu ofrenda en casa por todo Miami el 1 y 2 de noviembre — rosa premium hecha a mano en los colores que tu familia eligió para recordar.",
    },
    sections: [
      {
        h2: { en: "Bouquets for the home ofrenda", es: "Bouquets para la ofrenda en casa" },
        body: {
          en: "Hand-tied bouquets in red, white or a vibrant mixed palette sit cleanly on a home altar. Tell us at checkout if you want a low, flat-tied style instead of the tall presentation.",
          es: "Bouquets hechos a mano en rojo, blanco o una mezcla vibrante quedan limpios sobre el altar de casa. Dinos en el checkout si quieres un estilo bajo y plano en vez de presentación alta.",
        },
      },
      {
        h2: { en: "About marigolds (cempasúchil)", es: "Sobre el cempasúchil" },
        body: {
          en: "Marigolds (cempasúchil) are the traditional Day of the Dead flower in Mexico. We don't carry marigolds — our specialty is premium Ecuadorian roses. If you want roses for the ofrenda as a complement (or instead), we have you covered.",
          es: "El cempasúchil es la flor tradicional del Día de Muertos en México. Nosotros no manejamos cempasúchil — nuestra especialidad es la rosa premium ecuatoriana. Si quieres rosas para la ofrenda como complemento (o en lugar), te cubrimos.",
        },
      },
      {
        h2: { en: "Same-day delivery November 1–2", es: "Entrega el mismo día 1 y 2 de noviembre" },
        body: {
          en: "Order before 3PM Miami time on November 1st or 2nd for same-day delivery. Outside Miami, order 2 days before for FedEx Express overnight.",
          es: "Pide antes de las 3PM hora de Miami el 1 o 2 de noviembre para entrega ese día. Fuera de Miami, pide con 2 días de antelación para FedEx Express overnight.",
        },
      },
    ],
  },
  {
    slug: "graduation-flowers",
    slugEs: "flores-de-graduacion",
    tier: 2,
    keyword: { en: "graduation flowers", es: "flores de graduación" },
    h1: { en: "Graduation Flowers in Miami", es: "Flores de Graduación en Miami" },
    title: {
      en: "Graduation Flowers Miami | Bouquets Delivered to the Ceremony | Charls Flowers",
      es: "Flores de Graduación Miami | Bouquets a Domicilio o a la Ceremonia | Charls Flowers",
    },
    description: {
      en: "Graduation flowers delivered in Miami. Bright bouquets in school colors or premium roses for the new grad. Same-day delivery available.",
      es: "Flores de graduación a domicilio en Miami. Bouquets vibrantes en los colores de la escuela o rosa premium para el graduado. Entrega el mismo día disponible.",
    },
    intro: {
      en: "Graduation flowers should match the school colors and travel well from car to ceremony. We hand-tie premium rose bouquets in the exact tones — UM orange and green, FIU blue and gold, FSU garnet, UF orange and blue, or whatever campus you're walking the stage at — and deliver same-day across Miami.",
      es: "Las flores de graduación deben combinar con los colores de la escuela y aguantar el trayecto del carro a la ceremonia. Hacemos bouquets de rosa premium en los tonos exactos — naranja y verde de UM, azul y dorado de FIU, granate de FSU, naranja y azul de UF, o el campus donde sea que cruces el escenario — y entregamos el mismo día por Miami.",
    },
    sections: [
      {
        h2: { en: "School-color bouquets built to order", es: "Bouquets en los colores de la escuela, a medida" },
        body: {
          en: "Use the custom builder to pick the exact color combination. We can do bicolor (e.g. blue + gold for FIU) or a deeper single-color statement.",
          es: "Usa el builder a medida para elegir la combinación exacta. Podemos hacer bicolor (p. ej. azul + dorado para FIU) o un statement profundo en un solo color.",
        },
      },
      {
        h2: { en: "Surprise delivery to the ceremony or after-party", es: "Sorpresa en la ceremonia o en la fiesta posterior" },
        body: {
          en: "We can deliver to the family's car in the parking lot, to the restaurant for the celebration dinner, or to the dorm. Add the new grad's name to the card.",
          es: "Podemos entregar al carro de la familia en el estacionamiento, al restaurante de la cena de celebración o al dormitorio. Añade el nombre del graduado en la tarjeta.",
        },
      },
    ],
  },
  {
    slug: "anniversary-flowers",
    slugEs: "flores-de-aniversario",
    tier: 2,
    keyword: { en: "anniversary flowers", es: "flores de aniversario" },
    h1: { en: "Anniversary Flowers in Miami", es: "Flores de Aniversario en Miami" },
    title: {
      en: "Anniversary Flowers Miami | Red Roses & Custom Bouquets | Charls Flowers",
      es: "Flores de Aniversario Miami | Rosas Rojas y Bouquets a Medida | Charls Flowers",
    },
    description: {
      en: "Anniversary flowers delivered same-day in Miami. Long-stem red roses, custom-color bouquets and our Love Bomb / Deluxe Love packages.",
      es: "Flores de aniversario a domicilio el mismo día en Miami. Rosa roja tallo largo, bouquets a medida y paquetes Love Bomb / Deluxe Love.",
    },
    intro: {
      en: "Anniversary flowers are about scale and color — the year-one bouquet should not look like the year-ten one. We deliver same-day across Miami: 50 stems for early years, 100 for the milestones, 200 + room decor for the big ones. Premium Ecuadorian roses, hand-tied.",
      es: "Las flores de aniversario son cuestión de escala y color — el ramo del primer año no debe verse igual que el del décimo. Entregamos el mismo día por Miami: 50 tallos para los primeros, 100 para los hitos, 200 + decoración para los grandes. Rosa premium ecuatoriana, hecha a mano.",
    },
    sections: [
      {
        h2: { en: "Year-by-year sizing guide", es: "Guía de tamaños por año" },
        body: {
          en: "1–5 years: 50–80 long-stem reds. 6–15 years: 100 reds in a hat box. 20+ years: 200 + a room decor for the celebration dinner. White accents for 25 and 50.",
          es: "1–5 años: 50–80 rosas rojas tallo largo. 6–15 años: 100 rojas en hat box. 20+ años: 200 + decoración para la cena. Acentos blancos para 25 y 50 años.",
        },
      },
      {
        h2: { en: "Love Bomb and Deluxe Love packages", es: "Paquetes Love Bomb y Deluxe Love" },
        body: {
          en: "When flowers alone aren't enough, our Love Bomb and Deluxe Love Package add balloons, candles and room setup to the bouquet. We deliver and stage it before she gets home.",
          es: "Cuando solo el bouquet no basta, nuestros paquetes Love Bomb y Deluxe Love suman globos, velas y montaje al ramo. Entregamos y montamos antes de que ella llegue a casa.",
        },
      },
    ],
  },
  {
    slug: "get-well-flowers",
    slugEs: "flores-para-recuperacion",
    tier: 2,
    keyword: { en: "get well flowers", es: "flores para recuperación" },
    h1: { en: "Get Well Flowers in Miami", es: "Flores para Recuperación en Miami" },
    title: {
      en: "Get Well Flowers Miami | Hospital & Home Delivery | Charls Flowers",
      es: "Flores para Recuperación Miami | Entrega a Hospital o Casa | Charls Flowers",
    },
    description: {
      en: "Get well flowers delivered to Miami-area hospitals and homes. Bright, low-fragrance bouquets that lift the room.",
      es: "Flores para recuperación a hospitales y casas en Miami. Bouquets vibrantes y de fragancia suave que iluminan la habitación.",
    },
    intro: {
      en: "Get well flowers should brighten a room without overwhelming it. We deliver same-day to Miami-area hospitals (Jackson, Baptist, Mount Sinai, Kendall Regional and more) and homes — bright, hand-tied bouquets that survive the patient room's dry AC.",
      es: "Las flores para recuperación deben alegrar el cuarto sin saturarlo. Entregamos el mismo día a hospitales de Miami (Jackson, Baptist, Mount Sinai, Kendall Regional y más) y a casas — bouquets vibrantes hechos a mano que aguantan el aire seco del cuarto del paciente.",
    },
    sections: [
      {
        h2: { en: "Hospital delivery tips", es: "Tips de entrega a hospital" },
        body: {
          en: "Always confirm the room number and floor when ordering. Some ICUs and oncology floors don't allow flowers; send to the family's home instead and have them carry it in.",
          es: "Confirma siempre el número de cuarto y piso al pedir. Algunas UCIs y plantas de oncología no permiten flores; envía a casa de la familia y que ellos lo lleven.",
        },
      },
      {
        h2: { en: "Best colors when you don't know the favorite", es: "Mejores colores cuando no sabes el favorito" },
        body: {
          en: "Yellow (warmth), hot pink (energy) and a white-and-yellow bicolor are the safest picks. Avoid all-white — it reads as sympathy, not recovery.",
          es: "Amarillo (calidez), hot pink (energía) y bicolor blanco-amarillo son las apuestas seguras. Evita el todo blanco — se lee como pésame, no como recuperación.",
        },
      },
    ],
  },
  {
    slug: "romance-flowers",
    slugEs: "flores-romanticas",
    tier: 2,
    keyword: { en: "romantic flowers", es: "flores románticas" },
    keyword2: { en: "love flowers", es: "flores de amor" },
    h1: { en: "Romantic Flowers in Miami", es: "Flores Románticas en Miami" },
    title: {
      en: "Romantic Flowers Miami | Love Roses Delivered Same-Day | Charls Flowers",
      es: "Flores Románticas Miami | Rosas de Amor el Mismo Día | Charls Flowers",
    },
    description: {
      en: "Romantic flowers delivered same-day in Miami — no occasion needed. Long-stem red roses and love bouquets, hand-tied, 50–200 stems. Order before 3PM.",
      es: "Flores románticas a domicilio el mismo día en Miami — sin necesidad de ocasión. Rosa roja tallo largo y bouquets de amor, hechos a mano, 50–200 tallos. Pide antes de las 3PM.",
    },
    intro: {
      en: "Romantic flowers don't need a date on the calendar. Charls Flowers hand-ties love bouquets of premium Ecuadorian red roses and delivers them same-day across Miami — the classic 100-rose statement, or a custom-color romantic bouquet in her exact palette. When it isn't Valentine's Day and isn't an anniversary, that's exactly when it lands hardest.",
      es: "Las flores románticas no necesitan una fecha en el calendario. Charls Flowers monta a mano bouquets de amor con rosa roja premium ecuatoriana y los entrega el mismo día por Miami — el statement clásico de 100 rosas, o un bouquet romántico a color en su paleta exacta. Cuando no es San Valentín ni un aniversario es justo cuando más pega.",
    },
    sections: [
      {
        h2: { en: "Red roses: the romantic default that always works", es: "Rosa roja: el clásico romántico que nunca falla" },
        body: {
          en: "Red long-stem roses are the universal romantic signal — no explanation needed. We use 60–70cm Ecuadorian premium roses, hydrated overnight so the heads open over 24–48 hours instead of collapsing. 50 stems for a warm gesture, 100 for a statement, 200 when you want to stop her in her tracks.",
          es: "La rosa roja de tallo largo es la señal romántica universal — no hay que explicar nada. Usamos rosa premium ecuatoriana de 60–70cm, hidratada toda la noche para que los botones abran en 24–48 horas en vez de caerse. 50 tallos para un gesto cálido, 100 para un statement, 200 cuando quieres dejarla sin palabras.",
        },
      },
      {
        h2: { en: "Beyond red: custom-color love bouquets", es: "Más allá del rojo: bouquets de amor a color" },
        body: {
          en: "If red isn't her, we build the exact palette — blush pinks, all-white elegance, a red-and-white bicolor, or her single favorite color. Use our custom builder to preview the romantic bouquet with AI before you pay, then we hand-finish it in the workshop.",
          es: "Si el rojo no es lo suyo, montamos la paleta exacta — rosas blush, elegancia todo blanco, bicolor rojo-blanco, o su color favorito. Usa nuestro builder a medida para previsualizar el bouquet romántico con IA antes de pagar, luego lo terminamos a mano en el taller.",
        },
      },
      {
        h2: { en: "Same-day romantic delivery across Miami", es: "Entrega romántica el mismo día por Miami" },
        body: {
          en: "Order before 3PM Miami time and we deliver that day to her home or office across Miami-Dade and Broward. Add a handwritten card, pick the AM or PM window, and we text you the delivery confirmation. For the full experience, our Love Bomb and Deluxe Love packages add balloons, candles and room setup.",
          es: "Pide antes de las 3PM hora de Miami y entregamos ese día a su casa u oficina por Miami-Dade y Broward. Añade una tarjeta escrita a mano, elige ventana AM o PM y te mandamos la confirmación de entrega. Para la experiencia completa, nuestros paquetes Love Bomb y Deluxe Love suman globos, velas y montaje.",
        },
      },
    ],
  },
  {
    slug: "thank-you-flowers",
    slugEs: "flores-de-agradecimiento",
    tier: 2,
    keyword: { en: "thank you flowers", es: "flores de agradecimiento" },
    h1: { en: "Thank You Flowers in Miami", es: "Flores de Agradecimiento en Miami" },
    title: {
      en: "Thank You Flowers Miami | Same-Day Bouquets Delivered | Charls Flowers",
      es: "Flores de Agradecimiento Miami | Bouquets el Mismo Día | Charls Flowers",
    },
    description: {
      en: "Thank you flowers delivered same-day across Miami. Mid-sized hand-tied bouquets perfect for clients, hosts and the person who showed up.",
      es: "Flores de agradecimiento el mismo día por Miami. Bouquets medianos hechos a mano, perfectos para clientes, anfitriones y quien estuvo ahí.",
    },
    intro: {
      en: "Thank you flowers work best when they're prompt — send within 48 hours of whatever you're thanking someone for. We deliver same-day across Miami, mid-sized hand-tied bouquets (50–80 roses) that read warm without being over the top.",
      es: "Las flores de agradecimiento funcionan cuando llegan rápido — envía en las primeras 48 horas. Entregamos el mismo día por Miami, bouquets medianos hechos a mano (50–80 rosas) que se leen cálidos sin ser exagerados.",
    },
    sections: [
      {
        h2: { en: "Client and B2B thank-yous", es: "Agradecimientos B2B y a clientes" },
        body: {
          en: "Sending to a client's office? Mid-size bouquet (50 stems), a clean white or hot-pink palette, handwritten card with your company name. We can invoice on net-30 for repeat business — call us.",
          es: "¿Para una oficina de cliente? Bouquet mediano (50 tallos), paleta blanco o hot pink, tarjeta a mano con el nombre de tu empresa. Facturamos a 30 días para clientes recurrentes — llámanos.",
        },
      },
      {
        h2: { en: "Personal thank-you bouquets", es: "Bouquets de agradecimiento personales" },
        body: {
          en: "For the friend who helped you move, the neighbor who watched the dog, the doctor who took the late call — pick a color that matches them, not a default red.",
          es: "Para la amiga que te ayudó a mudarte, el vecino que cuidó al perro, el médico que atendió la llamada tarde — elige un color que se parezca a esa persona, no un rojo por defecto.",
        },
      },
    ],
  },
  {
    slug: "fathers-day-flowers",
    slugEs: "flores-dia-del-padre",
    tier: 2,
    keyword: { en: "fathers day flowers", es: "flores día del padre" },
    h1: { en: "Father's Day Flowers in Miami", es: "Flores del Día del Padre en Miami" },
    title: {
      en: "Father's Day Flowers Miami | Bouquets for Dad Delivered | Charls Flowers",
      es: "Flores del Día del Padre Miami | Bouquets para Papá a Domicilio | Charls Flowers",
    },
    description: {
      en: "Father's Day flowers delivered across Miami. Sober palettes for dad — white, blue, or deep red — hand-tied and same-day.",
      es: "Flores del Día del Padre a domicilio en Miami. Paletas sobrias para papá — blanco, azul o rojo profundo — hechas a mano y el mismo día.",
    },
    intro: {
      en: "Father's Day flowers? Yes — but skip pink and pastels. We deliver same-day across Miami in palettes dads actually like: deep red, all-white, navy blue, or a moody black-and-white bicolor. Hand-tied, masculine paper, no glitter.",
      es: "¿Flores del Día del Padre? Sí — pero salta el rosa y los pasteles. Entregamos el mismo día por Miami en paletas que los papás sí aprecian: rojo profundo, todo blanco, azul oscuro o un bicolor blanco-negro. Hecho a mano, papel masculino, sin glitter.",
    },
    sections: [
      {
        h2: { en: "Palettes that work for dads", es: "Paletas que funcionan para papás" },
        body: {
          en: "Deep red, navy blue, all-white or black-and-white. Skip pink, peach, lavender. If he's a hobbyist (golfer, fisherman) match the bouquet color to his gear.",
          es: "Rojo profundo, azul oscuro, todo blanco o blanco-negro. Salta rosa, melocotón, lavanda. Si tiene un hobby (golf, pesca) iguala el color del bouquet a su equipo.",
        },
      },
    ],
  },
  {
    slug: "thanksgiving-flowers",
    slugEs: "flores-de-accion-de-gracias",
    tier: 2,
    keyword: { en: "thanksgiving flowers", es: "flores de acción de gracias" },
    h1: { en: "Thanksgiving Flowers in Miami", es: "Flores de Acción de Gracias en Miami" },
    title: {
      en: "Thanksgiving Flowers Miami | Centerpieces & Roses Delivered | Charls Flowers",
      es: "Flores de Acción de Gracias Miami | Centros y Rosas a Domicilio | Charls Flowers",
    },
    description: {
      en: "Thanksgiving flowers and table centerpieces delivered in Miami. Orange, deep red and white rose arrangements for the family table.",
      es: "Flores de Acción de Gracias y centros de mesa a domicilio en Miami. Arreglos de rosa naranja, rojo profundo y blanco para la mesa familiar.",
    },
    intro: {
      en: "Thanksgiving flowers belong on the table. We deliver hand-tied bouquets and low centerpieces across Miami the week of Thanksgiving — orange, deep red, and white roses that sit alongside the turkey without blocking sightlines across the table.",
      es: "Las flores de Acción de Gracias van en la mesa. Entregamos bouquets hechos a mano y centros bajos por Miami la semana de Thanksgiving — rosa naranja, rojo profundo y blanco, que conviven con el pavo sin bloquear la vista entre comensales.",
    },
    sections: [
      {
        h2: { en: "Low centerpieces for the family table", es: "Centros bajos para la mesa familiar" },
        body: {
          en: "Ask for a 'low + wide' style at checkout so the bouquet sits below eye level — guests can talk across the table without leaning around it.",
          es: "Pide 'low + wide' en el checkout para que el bouquet quede por debajo del nivel de los ojos — los invitados pueden hablar a través de la mesa sin esquivarlo.",
        },
      },
      {
        h2: { en: "Hostess bouquet to bring to dinner", es: "Bouquet de anfitriona para llevar a la cena" },
        body: {
          en: "Order a hand-tied bouquet delivered to the host's house the morning of — already arranged so they don't have to stop cooking to put it in water.",
          es: "Pide un bouquet hecho a mano entregado a la casa del anfitrión la misma mañana — ya arreglado para que no tengan que parar de cocinar para meterlo en agua.",
        },
      },
    ],
  },
  {
    slug: "quinceanera-bouquet",
    slugEs: "ramo-de-quinceanera",
    tier: 2,
    keyword: { en: "quinceañera bouquet", es: "ramo de quinceañera" },
    h1: { en: "Quinceañera Bouquet in Miami", es: "Ramo de Quinceañera en Miami" },
    title: {
      en: "Quinceañera Bouquet Miami | Custom Color Bouquets for 15s | Charls Flowers",
      es: "Ramo de Quinceañera Miami | Bouquets a Medida para los 15 | Charls Flowers",
    },
    description: {
      en: "Quinceañera bouquet in Miami — custom color, hand-tied, sized for the quinceañera. Order ahead for the ceremony day.",
      es: "Ramo de quinceañera en Miami — color a medida, hecho a mano, proporcionado para la quinceañera. Pide con tiempo para el día de la ceremonia.",
    },
    intro: {
      en: "A quinceañera bouquet should match her dress — not the floral shop's default. Charls Flowers builds custom-color bouquets in Miami for the misa, the photo shoot and the reception: pinks, whites, peach, lavender, or whatever palette she picked for her day.",
      es: "Un ramo de quinceañera debe combinar con su vestido — no con lo que tenga la florería en stock. Charls Flowers monta bouquets a color a medida en Miami para la misa, la sesión de fotos y la recepción: rosas, blancos, melocotón, lavanda o la paleta que ella eligió para su día.",
    },
    sections: [
      {
        h2: { en: "Match the dress exactly", es: "Iguala el vestido exactamente" },
        body: {
          en: "Send us a photo of the dress when you order; we match the rose tone. For two-tone dresses (e.g. white with hot-pink trim) we do a small accent in the trim color.",
          es: "Mándanos foto del vestido al pedir; igualamos el tono de la rosa. Para vestidos bicolor (p. ej. blanco con detalle hot pink) hacemos un acento pequeño en el color del detalle.",
        },
      },
    ],
  },
  {
    slug: "administrative-professionals-day-flowers",
    slugEs: "flores-dia-secretaria",
    tier: 2,
    keyword: { en: "administrative professionals day flowers", es: "flores día de la secretaria" },
    h1: { en: "Administrative Professionals Day Flowers in Miami", es: "Flores para el Día de la Secretaria en Miami" },
    title: {
      en: "Administrative Professionals Day Flowers Miami | Office Delivery | Charls Flowers",
      es: "Flores Día de la Secretaria Miami | Entrega a la Oficina | Charls Flowers",
    },
    description: {
      en: "Administrative Professionals Day flowers delivered to Miami offices. Mid-size hand-tied bouquets, card included.",
      es: "Flores para el Día de la Secretaria a domicilio en oficinas de Miami. Bouquets medianos hechos a mano, tarjeta incluida.",
    },
    intro: {
      en: "Administrative Professionals Day flowers — the easy way to say 'this place would fall apart without you.' We deliver mid-size hand-tied bouquets to Miami offices on the morning of the day, card included, signed however you want.",
      es: "Flores para el Día de la Secretaria — la manera fácil de decir 'esta oficina se cae sin ti.' Entregamos bouquets medianos hechos a mano a oficinas de Miami la mañana del día, con tarjeta firmada como quieras.",
    },
    sections: [
      {
        h2: { en: "Office-appropriate sizes", es: "Tamaños apropiados para oficina" },
        body: {
          en: "50 stems is the sweet spot — substantial enough to read as 'they spent real money' without dominating a desk. Skip 200-stem orders for office delivery.",
          es: "50 tallos es el punto justo — sustancial para que se note que se gastó dinero real sin dominar el escritorio. Evita pedidos de 200 tallos para entrega a oficina.",
        },
      },
    ],
  },
  {
    slug: "bosses-day-flowers",
    slugEs: "flores-dia-del-jefe",
    tier: 2,
    keyword: { en: "boss's day flowers", es: "flores día del jefe" },
    h1: { en: "Boss's Day Flowers in Miami", es: "Flores del Día del Jefe en Miami" },
    title: {
      en: "Boss's Day Flowers Miami | Office Bouquets Delivered | Charls Flowers",
      es: "Flores Día del Jefe Miami | Bouquets a Domicilio en Oficina | Charls Flowers",
    },
    description: {
      en: "Boss's Day flowers delivered to Miami offices. Subtle, mid-size hand-tied bouquets — never over the top.",
      es: "Flores del Día del Jefe a domicilio en oficinas de Miami. Bouquets medianos, sobrios y hechos a mano — nunca exagerados.",
    },
    intro: {
      en: "Boss's Day flowers are a balance — visible enough to be appreciated, restrained enough not to look like you're trying too hard. We hand-tie mid-size bouquets in clean palettes (white, deep red) for Miami office delivery on October 16th.",
      es: "Las flores del Día del Jefe son un equilibrio — visibles para que se aprecien, sobrias para no parecer que te pasas. Hacemos bouquets medianos en paletas limpias (blanco, rojo profundo) para entrega en oficinas de Miami el 16 de octubre.",
    },
    sections: [
      {
        h2: { en: "Group order from the team", es: "Pedido grupal del equipo" },
        body: {
          en: "If the team is splitting the cost, one larger bouquet reads better than five small ones. Sign the card from the whole department.",
          es: "Si el equipo divide el costo, un bouquet grande se ve mejor que cinco pequeños. Firma la tarjeta de parte de todo el departamento.",
        },
      },
    ],
  },

  // ----------- TIER 3 (footer + index, niche) -----------
  {
    slug: "congratulations-flowers",
    slugEs: "flores-de-felicitacion",
    tier: 3,
    keyword: { en: "congratulations flowers", es: "flores de felicitación" },
    h1: { en: "Congratulations Flowers in Miami", es: "Flores de Felicitación en Miami" },
    title: {
      en: "Congratulations Flowers Miami | Same-Day Bouquets Delivered | Charls Flowers",
      es: "Flores de Felicitación Miami | Bouquets el Mismo Día | Charls Flowers",
    },
    description: {
      en: "Congratulations flowers delivered same-day in Miami. Bright bouquets for new jobs, promotions and big wins.",
      es: "Flores de felicitación a domicilio el mismo día en Miami. Bouquets vibrantes para nuevos trabajos, ascensos y logros.",
    },
    intro: {
      en: "Congratulations flowers should match the size of the win. New job? Mid-size bright bouquet. Promotion? 100 stems. Closed a major deal? Go big. Same-day across Miami; bouquet on the desk the next morning.",
      es: "Las flores de felicitación deben acompañar el tamaño del logro. ¿Trabajo nuevo? Bouquet mediano y vibrante. ¿Ascenso? 100 tallos. ¿Cerró un trato grande? Sin límites. El mismo día por Miami; el bouquet en el escritorio a la mañana siguiente.",
    },
    sections: [
      {
        h2: { en: "What size for what win", es: "Qué tamaño para qué logro" },
        body: {
          en: "New job: 50 stems. Promotion / raise: 80–100 stems. Bar passed / book published / big deal: 150–200 stems. Colors should match the recipient, not the occasion.",
          es: "Trabajo nuevo: 50 tallos. Ascenso / aumento: 80–100. Pasó el bar / publicó libro / trato grande: 150–200. Los colores van con la persona, no con la ocasión.",
        },
      },
    ],
  },
  {
    slug: "womens-day-flowers",
    slugEs: "flores-dia-de-la-mujer",
    tier: 3,
    keyword: { en: "women's day flowers", es: "flores día de la mujer" },
    h1: { en: "Women's Day Flowers in Miami", es: "Flores del Día de la Mujer en Miami" },
    title: {
      en: "Women's Day Flowers Miami | March 8 Bouquets Delivered | Charls Flowers",
      es: "Flores Día de la Mujer Miami | Bouquets el 8 de Marzo a Domicilio | Charls Flowers",
    },
    description: {
      en: "Women's Day flowers delivered in Miami for March 8th. Yellow, white and pink hand-tied bouquets.",
      es: "Flores del Día de la Mujer a domicilio en Miami para el 8 de marzo. Bouquets amarillos, blancos y rosas hechos a mano.",
    },
    intro: {
      en: "Women's Day flowers on March 8th — for the mother, daughter, friend, or whole office. We hand-tie bright bouquets in Miami and deliver same-day. Yellow (the international color of Women's Day), white, or bright pink all read perfectly.",
      es: "Flores del Día de la Mujer el 8 de marzo — para la madre, la hija, la amiga o toda la oficina. Hacemos bouquets vibrantes en Miami y entregamos el mismo día. Amarillo (color internacional del Día de la Mujer), blanco o rosa fuerte funcionan perfecto.",
    },
    sections: [
      {
        h2: { en: "Bulk office orders", es: "Pedidos en bloque para oficina" },
        body: {
          en: "Sending one small bouquet to every woman on a team is the gold-standard gesture. Call us 1 week ahead for orders of 10+ identical pieces.",
          es: "Mandar un bouquet pequeño a cada mujer del equipo es el gesto top. Llámanos con 1 semana de antelación para 10+ piezas iguales.",
        },
      },
    ],
  },
  {
    slug: "new-baby-flowers",
    slugEs: "flores-recien-nacido",
    tier: 3,
    keyword: { en: "new baby flowers", es: "flores recién nacido" },
    h1: { en: "New Baby Flowers in Miami", es: "Flores para Recién Nacido en Miami" },
    title: {
      en: "New Baby Flowers Miami | Hospital & Home Delivery | Charls Flowers",
      es: "Flores para Recién Nacido Miami | Entrega a Hospital o Casa | Charls Flowers",
    },
    description: {
      en: "New baby flowers delivered to Miami hospitals and homes. Soft pinks, blues and whites for the new arrival.",
      es: "Flores para recién nacido a hospitales y casas en Miami. Rosas, azules y blancos suaves para el nuevo miembro.",
    },
    intro: {
      en: "New baby flowers should be soft, not loud — the new parents are running on no sleep. We deliver same-day to Miami-area maternity wards and homes: pale pink for a girl, soft blue for a boy, or all-white as the safe universal pick.",
      es: "Las flores para recién nacido deben ser suaves, no chillonas — los nuevos padres no han dormido. Entregamos el mismo día a maternidades de Miami y a casas: rosa pálido para niña, azul suave para niño, o todo blanco como apuesta universal.",
    },
    sections: [
      {
        h2: { en: "Hospital vs home delivery", es: "Hospital o casa" },
        body: {
          en: "Many hospitals limit floral deliveries in maternity wings — confirm with the family first. If unsure, deliver to home for when they get back.",
          es: "Muchos hospitales limitan las entregas florales en maternidad — confirma con la familia antes. Si dudas, entrega a casa para cuando regresen.",
        },
      },
    ],
  },
  {
    slug: "just-because-flowers",
    slugEs: "flores-porque-si",
    tier: 3,
    keyword: { en: "just because flowers", es: "flores porque sí" },
    h1: { en: "Just Because Flowers in Miami", es: "Flores Porque Sí en Miami" },
    title: {
      en: "Just Because Flowers Miami | No-Occasion Bouquets Delivered | Charls Flowers",
      es: "Flores Porque Sí Miami | Bouquets Sin Ocasión a Domicilio | Charls Flowers",
    },
    description: {
      en: "Just because flowers — no occasion needed. Same-day delivery across Miami.",
      es: "Flores porque sí — sin ocasión. Entrega el mismo día por Miami.",
    },
    intro: {
      en: "Just because flowers are the most powerful kind — there's no birthday, no anniversary, no apology attached. We deliver same-day across Miami for the random Tuesday gesture that's worth more than any annual one.",
      es: "Las flores porque sí son las más poderosas — no hay cumpleaños, ni aniversario, ni disculpa por delante. Entregamos el mismo día por Miami para el gesto del martes random que vale más que cualquiera anual.",
    },
    sections: [
      {
        h2: { en: "The gesture that wins", es: "El gesto que gana" },
        body: {
          en: "Pick her favorite color (not red by default), 50 stems, write a one-line card. Delivered to the office or home — the unexpected timing is the whole point.",
          es: "Elige su color favorito (no rojo por defecto), 50 tallos, escribe una tarjeta de una línea. A la oficina o a casa — la sorpresa es el punto.",
        },
      },
    ],
  },
  {
    slug: "im-sorry-flowers",
    slugEs: "flores-para-pedir-perdon",
    tier: 3,
    keyword: { en: "i'm sorry flowers", es: "flores para pedir perdón" },
    keyword2: { en: "apology flowers", es: "flores de disculpa" },
    h1: { en: "I'm Sorry Flowers in Miami", es: "Flores para Pedir Perdón en Miami" },
    title: {
      en: "I'm Sorry Flowers Miami | Apology Bouquets Delivered Same-Day | Charls Flowers",
      es: "Flores para Pedir Perdón Miami | Bouquets de Disculpa el Mismo Día | Charls Flowers",
    },
    description: {
      en: "I'm sorry flowers and apology bouquets delivered same-day in Miami. Send it fast — hand-tied roses that say it before you can. Order before 3PM.",
      es: "Flores para pedir perdón y bouquets de disculpa a domicilio el mismo día en Miami. Envíalas rápido — rosas hechas a mano que lo dicen antes que tú. Pide antes de las 3PM.",
    },
    intro: {
      en: "I'm sorry flowers work when they arrive fast — an apology that shows up two days late lands worse than none. Charls Flowers delivers same-day across Miami: hand-tied apology bouquets of premium roses, with a handwritten card in your own words. The gesture does half the work before you say anything.",
      es: "Las flores para pedir perdón funcionan cuando llegan rápido — una disculpa que aparece dos días tarde pega peor que ninguna. Charls Flowers entrega el mismo día por Miami: bouquets de disculpa hechos a mano con rosa premium y una tarjeta escrita a mano con tus palabras. El gesto hace la mitad del trabajo antes de que digas nada.",
    },
    sections: [
      {
        h2: { en: "Which color says sorry (and which doesn't)", es: "Qué color pide perdón (y cuál no)" },
        body: {
          en: "White roses read as sincere and humble — the safest apology choice. Red works if it's a partner and the relationship is romantic. Avoid loud, celebratory mixes — this isn't the moment for glitter. When in doubt, all-white with a plain handwritten card.",
          es: "La rosa blanca se lee sincera y humilde — la apuesta más segura para disculparse. El rojo funciona si es tu pareja y la relación es romántica. Evita mezclas ruidosas y festivas — no es el momento del glitter. En la duda, todo blanco con tarjeta escrita a mano y sencilla.",
        },
      },
    ],
  },
  {
    slug: "new-year-flowers",
    slugEs: "flores-de-ano-nuevo",
    tier: 3,
    keyword: { en: "new year flowers", es: "flores de año nuevo" },
    h1: { en: "New Year Flowers in Miami", es: "Flores de Año Nuevo en Miami" },
    title: {
      en: "New Year Flowers Miami | December 31 Bouquets Delivered | Charls Flowers",
      es: "Flores de Año Nuevo Miami | Bouquets para el 31 de Diciembre | Charls Flowers",
    },
    description: {
      en: "New Year flowers delivered in Miami for December 31st. White-and-gold or bright bouquets for the celebration.",
      es: "Flores de Año Nuevo a domicilio en Miami para el 31 de diciembre. Bouquets blanco-dorado o vibrantes para la celebración.",
    },
    intro: {
      en: "New Year flowers — for the house party, the dinner table, or the gift to whoever is hosting. We deliver across Miami on December 31st (book early, slots fill); white-and-gold for elegance, red for celebration, mixed bright for energy.",
      es: "Flores de Año Nuevo — para la fiesta en casa, la mesa de la cena, o regalo a quien sea que recibe. Entregamos por Miami el 31 de diciembre (reserva temprano, los slots se llenan); blanco-dorado para elegancia, rojo para celebración, mezcla vibrante para energía.",
    },
    sections: [
      {
        h2: { en: "Latin tradition: yellow for prosperity", es: "Tradición latina: amarillo para la prosperidad" },
        body: {
          en: "In many Latin households, yellow on New Year's Eve is for prosperity in the year ahead. A yellow bouquet on the table is both decoration and tradition.",
          es: "En muchas casas latinas, el amarillo en Año Nuevo es para la prosperidad del año que entra. Un bouquet amarillo en la mesa es decoración y tradición.",
        },
      },
    ],
  },
  {
    slug: "easter-flowers",
    slugEs: "flores-de-semana-santa",
    tier: 3,
    keyword: { en: "easter flowers", es: "flores de semana santa" },
    h1: { en: "Easter Flowers in Miami", es: "Flores de Semana Santa en Miami" },
    title: {
      en: "Easter Flowers Miami | Spring Bouquets Delivered | Charls Flowers",
      es: "Flores de Semana Santa Miami | Bouquets de Primavera a Domicilio | Charls Flowers",
    },
    description: {
      en: "Easter flowers delivered in Miami. White, pastel pink and yellow bouquets for the Sunday table.",
      es: "Flores de Semana Santa a domicilio en Miami. Bouquets blancos, rosa pastel y amarillos para la mesa del domingo.",
    },
    intro: {
      en: "Easter flowers in Miami — white roses for the Sunday table, pastel pinks for the brunch, yellow for the kids' egg hunt. We deliver across Miami the week of Easter; hand-tied bouquets, no lilies, no fragrance overload.",
      es: "Flores de Semana Santa en Miami — rosa blanca para la mesa del domingo, rosa pastel para el brunch, amarillo para la búsqueda de huevos de los niños. Entregamos por Miami la semana de Semana Santa; bouquets hechos a mano, sin lirios ni saturación de fragancia.",
    },
    sections: [
      {
        h2: { en: "Sunday table centerpiece", es: "Centro de mesa del domingo" },
        body: {
          en: "A low all-white bouquet keeps Easter brunch elegant. Add a touch of pale pink or yellow if the table feels too monochrome.",
          es: "Un bouquet bajo todo blanco mantiene el brunch elegante. Añade un toque de rosa pálido o amarillo si la mesa se siente muy monocroma.",
        },
      },
    ],
  },
];

/**
 * Find an occasion by either its EN slug or its ES slug.
 */
export const findOccasionBySlug = (slug: string): OccasionPage | undefined =>
  occasionPages.find((o) => o.slug === slug || o.slugEs === slug);

/** Tier filter helper. */
export const occasionsByTier = (tier: OccasionTier): OccasionPage[] =>
  occasionPages.filter((o) => o.tier === tier);
