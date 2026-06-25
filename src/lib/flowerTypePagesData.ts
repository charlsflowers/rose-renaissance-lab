/**
 * Flower-type collection pages — programmatic SEO landings, EN + ES.
 *
 * Same schema/shape as occasionPagesData.ts so the unified collection page
 * renders both with zero divergence.
 *
 * H1/title strategy (per owner directive):
 *   - Plain flower names ("tulips", "peonies", "lilies"…) are informational
 *     queries (gardening). For a florist we tilt H1/title/intro to the
 *     TRANSACTIONAL intent + Miami: "<Flower> Bouquets — Miami Delivery",
 *     "Ramos de <flor> en Miami". The slug stays as the flower name so the
 *     Shopify handle matches one-to-one.
 *   - Already-transactional concepts (Ramo Buchón, Money Bouquet, Bridal
 *     Bouquets, Preserved Roses, Floral Arrangements, Flower Subscription)
 *     stay as-is.
 */
import type { OccasionPage, OccasionTier } from "@/lib/occasionPagesData";

export type FlowerTypePage = OccasionPage;

export const flowerTypePages: FlowerTypePage[] = [
  // ─────────── TIER 1 (mega-menu "By Flower") ───────────
  {
    slug: "tulips",
    slugEs: "tulipanes",
    tier: 1,
    keyword: { en: "tulip bouquets miami", es: "ramos de tulipanes en miami" },
    keyword2: { en: "tulip delivery miami", es: "tulipanes a domicilio miami" },
    h1: { en: "Tulip Bouquets — Miami Delivery", es: "Ramos de Tulipanes en Miami" },
    title: {
      en: "Tulip Bouquets Miami | Same-Day Tulip Delivery | Charls Flowers",
      es: "Ramos de Tulipanes en Miami | Tulipanes a Domicilio | Charls Flowers",
    },
    description: {
      en: "Tulip bouquets delivered same-day in Miami. Fresh-cut Dutch tulips, hand-tied. Order before 3PM for evening delivery.",
      es: "Ramos de tulipanes a domicilio el mismo día en Miami. Tulipanes holandeses recién cortados, montados a mano. Pide antes de las 3PM.",
    },
    intro: {
      en: "Tulip bouquets in Miami, delivered today. We import Dutch tulips weekly and hand-tie them the morning of delivery — clean stems, tight buds that open over 3–4 days at home.",
      es: "Ramos de tulipanes en Miami, entregados hoy. Importamos tulipán holandés semanalmente y lo montamos a mano la mañana del envío — tallos limpios, botones cerrados que abren en 3–4 días en casa.",
    },
    sections: [
      {
        h2: { en: "Why tulips for Miami delivery", es: "Por qué tulipanes para entrega en Miami" },
        body: {
          en: "Tulips are the most elegant minimalist bouquet — fewer stems, more presence. Perfect for someone who already received roses and wants something different.",
          es: "El tulipán es el ramo minimalista más elegante — menos tallos, más presencia. Ideal para quien ya recibió rosas y quiere algo distinto.",
        },
      },
      {
        h2: { en: "Same-day tulip delivery in Miami", es: "Tulipanes el mismo día en Miami" },
        body: {
          en: "Order before 3PM Miami time and we deliver that evening across Miami-Dade and Broward. Outside Florida, FedEx Express overnight in our insulated box.",
          es: "Pide antes de las 3PM hora de Miami y entregamos esa tarde por Miami-Dade y Broward. Fuera de Florida, FedEx Express overnight en caja aislada.",
        },
      },
    ],
  },
  {
    slug: "peonies",
    slugEs: "peonias",
    tier: 1,
    keyword: { en: "peony bouquets miami", es: "ramos de peonías en miami" },
    keyword2: { en: "peony delivery miami", es: "peonías a domicilio miami" },
    h1: { en: "Peony Bouquets Miami", es: "Ramos de Peonías en Miami" },
    title: {
      en: "Peony Bouquets Miami | Same-Day Peony Delivery | Charls Flowers",
      es: "Ramos de Peonías en Miami | Peonías a Domicilio | Charls Flowers",
    },
    description: {
      en: "Peony bouquets delivered same-day in Miami. Seasonal premium peonies, hand-tied. Order before 3PM for evening delivery.",
      es: "Ramos de peonías a domicilio el mismo día en Miami. Peonías premium de temporada, montadas a mano. Pide antes de las 3PM.",
    },
    intro: {
      en: "Peony bouquets in Miami, delivered today. Peonies are seasonal — when they're in, we have them, hand-tied that same morning, soft pink or white.",
      es: "Ramos de peonías en Miami, entregados hoy. La peonía es de temporada — cuando hay, las tenemos, montadas a mano esa misma mañana, en rosa suave o blanco.",
    },
    sections: [
      {
        h2: { en: "Peonies: the romantic statement", es: "Peonías: el statement romántico" },
        body: {
          en: "A peony bouquet says wedding-day energy without the wedding — soft, generous, painterly. Pair with eucalyptus for a fuller bridal feel.",
          es: "Un ramo de peonías dice energía de día-de-boda sin la boda — suave, generoso, pictórico. Combínalo con eucalipto para un look más nupcial.",
        },
      },
      {
        h2: { en: "When are peonies in season in Miami", es: "Cuándo hay peonías en Miami" },
        body: {
          en: "Peak peony months are April–June. Outside that window we substitute with imported stems when available — call us to confirm before ordering.",
          es: "El pico de peonías es de abril a junio. Fuera de esa ventana sustituimos con tallos importados cuando hay disponibilidad — llámanos para confirmar antes de pedir.",
        },
      },
    ],
  },
  {
    slug: "sunflowers",
    slugEs: "girasoles",
    tier: 1,
    keyword: { en: "sunflower bouquets miami", es: "ramos de girasoles en miami" },
    h1: { en: "Sunflower Bouquets Miami", es: "Ramos de Girasoles en Miami" },
    title: {
      en: "Sunflower Bouquets Miami | Same-Day Sunflower Delivery | Charls Flowers",
      es: "Ramos de Girasoles en Miami | Girasoles a Domicilio | Charls Flowers",
    },
    description: {
      en: "Sunflower bouquets delivered same-day in Miami. Bright XL sunflowers, hand-tied with greens. Order before 3PM.",
      es: "Ramos de girasoles a domicilio el mismo día en Miami. Girasoles XL brillantes, montados con verdes. Pide antes de las 3PM.",
    },
    intro: {
      en: "Sunflower bouquets in Miami, delivered today. Big, cheerful, impossible to ignore — perfect for birthdays, get-wells, and 'just because' moments.",
      es: "Ramos de girasoles en Miami, entregados hoy. Grandes, alegres, imposibles de ignorar — perfectos para cumpleaños, mejórate-pronto, o un porque-sí.",
    },
    sections: [
      {
        h2: { en: "When sunflowers beat roses", es: "Cuándo los girasoles ganan a las rosas" },
        body: {
          en: "For a friend recovering from surgery, a teacher, a coworker promotion — sunflowers carry zero romantic baggage and 100% good-news energy.",
          es: "Para una amiga que se recupera, una profesora, un ascenso de un compañero — los girasoles no cargan baggage romántico y traen 100% energía de buenas noticias.",
        },
      },
      {
        h2: { en: "Mix it: sunflowers + red roses", es: "Mezcla: girasoles + rosas rojas" },
        body: {
          en: "Our most-ordered sunflower mix is the Sunflowers + Red Roses combo — see it in the custom builder or ask us by phone.",
          es: "Nuestra mezcla más pedida es Girasoles + Rosas Rojas — míralo en el builder a medida o pregúntanos por teléfono.",
        },
      },
    ],
  },
  {
    slug: "lilies",
    slugEs: "liliums",
    tier: 1,
    keyword: { en: "lily bouquets miami", es: "ramos de liliums en miami" },
    h1: { en: "Lily Bouquets Miami", es: "Ramos de Liliums en Miami" },
    title: {
      en: "Lily Bouquets Miami | Same-Day Lily Delivery | Charls Flowers",
      es: "Ramos de Liliums en Miami | Liliums a Domicilio | Charls Flowers",
    },
    description: {
      en: "Lily bouquets delivered same-day in Miami. Fragrant oriental lilies and stargazers, hand-tied. Order before 3PM.",
      es: "Ramos de liliums a domicilio el mismo día en Miami. Liliums orientales y stargazer fragantes, montados a mano. Pide antes de las 3PM.",
    },
    intro: {
      en: "Lily bouquets in Miami, delivered today. The most fragrant option in the shop — one stem perfumes a whole living room for a week.",
      es: "Ramos de liliums en Miami, entregados hoy. La opción más fragante de la tienda — un tallo perfuma todo el salón durante una semana.",
    },
    sections: [
      {
        h2: { en: "Oriental vs Asiatic lilies", es: "Liliums orientales vs asiáticos" },
        body: {
          en: "Oriental (stargazer, casablanca) are larger, more fragrant. Asiatic are smaller, no scent — better for sensitive recipients or hospital rooms.",
          es: "Los orientales (stargazer, casablanca) son más grandes y fragantes. Los asiáticos son más pequeños, sin aroma — mejores para personas sensibles o habitaciones de hospital.",
        },
      },
      {
        h2: { en: "Care tip: trim the anthers", es: "Consejo: corta las anteras" },
        body: {
          en: "Lily pollen stains. We trim the anthers before delivery, but if you see orange tips appear on new blooms, snip them with scissors — never wipe.",
          es: "El polen del lilium mancha. Cortamos las anteras antes de entregar, pero si aparecen puntas naranjas en flores nuevas, córtalas con tijera — nunca las limpies.",
        },
      },
    ],
  },
  {
    slug: "orchids",
    slugEs: "orquideas",
    tier: 1,
    keyword: { en: "orchid bouquets miami", es: "ramos de orquídeas en miami" },
    h1: { en: "Orchid Bouquets Miami", es: "Ramos de Orquídeas en Miami" },
    title: {
      en: "Orchid Bouquets Miami | Same-Day Orchid Delivery | Charls Flowers",
      es: "Ramos de Orquídeas en Miami | Orquídeas a Domicilio | Charls Flowers",
    },
    description: {
      en: "Orchid bouquets and arrangements delivered same-day in Miami. Phalaenopsis, cymbidium and dendrobium. Order before 3PM.",
      es: "Ramos y arreglos de orquídeas a domicilio el mismo día en Miami. Phalaenopsis, cymbidium y dendrobium. Pide antes de las 3PM.",
    },
    intro: {
      en: "Orchid arrangements in Miami, delivered today. From cut orchid bouquets to live phalaenopsis pots — the most long-lasting flower in the shop.",
      es: "Arreglos de orquídeas en Miami, entregados hoy. Desde ramos de orquídea cortada hasta phalaenopsis en maceta viva — la flor más duradera de la tienda.",
    },
    sections: [
      {
        h2: { en: "Cut orchids vs live plants", es: "Orquídea cortada vs planta viva" },
        body: {
          en: "A cut orchid bouquet lasts 10–14 days. A live phalaenopsis plant blooms 2–3 months and re-blooms yearly with basic care.",
          es: "Un ramo de orquídea cortada dura 10–14 días. Una phalaenopsis viva florece 2–3 meses y vuelve a florecer cada año con cuidado básico.",
        },
      },
      {
        h2: { en: "Orchids for corporate gifts", es: "Orquídeas para regalo corporativo" },
        body: {
          en: "Orchids read as luxury without being romantic — our most-ordered flower for client gifts, office openings, and executive thank-yous.",
          es: "La orquídea lee como lujo sin ser romántica — nuestra flor más pedida para regalos a clientes, aperturas de oficina y agradecimientos ejecutivos.",
        },
      },
    ],
  },
  // ─────────── TIER 2 (footer + index) — transactional flower names ───────────
  {
    slug: "carnations",
    slugEs: "claveles",
    tier: 2,
    keyword: { en: "carnation bouquets miami", es: "ramos de claveles en miami" },
    h1: { en: "Carnation Bouquets Miami", es: "Ramos de Claveles en Miami" },
    title: {
      en: "Carnation Bouquets Miami | Same-Day Delivery | Charls Flowers",
      es: "Ramos de Claveles en Miami | A Domicilio | Charls Flowers",
    },
    description: {
      en: "Carnation bouquets delivered same-day in Miami. Traditional carnations in classic and unusual colors. Order before 3PM.",
      es: "Ramos de claveles a domicilio el mismo día en Miami. Claveles tradicionales en colores clásicos y poco habituales. Pide antes de las 3PM.",
    },
    intro: {
      en: "Carnation bouquets in Miami, delivered today. Underrated, long-lasting, and beautifully traditional — carnations last longer in vase than almost any other cut flower.",
      es: "Ramos de claveles en Miami, entregados hoy. Infravalorados, duraderos y bellamente tradicionales — el clavel aguanta en jarrón más que casi cualquier flor cortada.",
    },
    sections: [
      {
        h2: { en: "Carnations for Mother's Day", es: "Claveles para el Día de la Madre" },
        body: {
          en: "Pink and white carnations are the traditional Mother's Day flower in the US. Long vase life means the bouquet still looks fresh a week later.",
          es: "El clavel rosa y blanco es la flor tradicional del Día de la Madre en EE.UU. Su larga vida en jarrón hace que el ramo siga fresco una semana después.",
        },
      },
      {
        h2: { en: "Same-day carnation delivery", es: "Claveles el mismo día en Miami" },
        body: {
          en: "Order before 3PM Miami time and we deliver that evening across Miami-Dade and Broward.",
          es: "Pide antes de las 3PM hora de Miami y entregamos esa tarde por Miami-Dade y Broward.",
        },
      },
    ],
  },
  {
    slug: "ranunculus",
    slugEs: "ranunculos",
    tier: 2,
    keyword: { en: "ranunculus bouquets miami", es: "ramos de ranúnculos en miami" },
    h1: { en: "Ranunculus Bouquets Miami", es: "Ramos de Ranúnculos en Miami" },
    title: {
      en: "Ranunculus Bouquets Miami | Same-Day Delivery | Charls Flowers",
      es: "Ramos de Ranúnculos en Miami | A Domicilio | Charls Flowers",
    },
    description: {
      en: "Ranunculus bouquets delivered same-day in Miami. Layered ranunculus, soft palette, hand-tied. Order before 3PM.",
      es: "Ramos de ranúnculos a domicilio el mismo día en Miami. Ranúnculo de pétalos en capas, paleta suave, montado a mano. Pide antes de las 3PM.",
    },
    intro: {
      en: "Ranunculus bouquets in Miami, delivered today. The 'paper-rose' look — dozens of tissue-thin petals layered into a perfect round head.",
      es: "Ramos de ranúnculos en Miami, entregados hoy. El look 'rosa de papel' — decenas de pétalos finos en capas formando una cabeza redonda perfecta.",
    },
    sections: [
      {
        h2: { en: "Why ranunculus reads expensive", es: "Por qué el ranúnculo se ve caro" },
        body: {
          en: "Ranunculus is on every wedding mood-board for a reason — the layered petals and saturated colors photograph like a painting.",
          es: "El ranúnculo está en todos los mood-boards de boda por algo — los pétalos en capas y los colores saturados fotografían como una pintura.",
        },
      },
      {
        h2: { en: "Seasonal availability", es: "Disponibilidad estacional" },
        body: {
          en: "Best from January through May. Outside that window we substitute with garden roses or peonies for a similar layered look.",
          es: "La mejor temporada es enero a mayo. Fuera de esa ventana sustituimos con garden roses o peonías para un look similar en capas.",
        },
      },
    ],
  },
  {
    slug: "gerberas",
    slugEs: "gerberas",
    tier: 2,
    keyword: { en: "gerbera bouquets miami", es: "ramos de gerberas en miami" },
    h1: { en: "Gerbera Bouquets Miami", es: "Ramos de Gerberas en Miami" },
    title: {
      en: "Gerbera Bouquets Miami | Same-Day Delivery | Charls Flowers",
      es: "Ramos de Gerberas en Miami | A Domicilio | Charls Flowers",
    },
    description: {
      en: "Gerbera daisy bouquets delivered same-day in Miami. Bright colors, modern look. Order before 3PM.",
      es: "Ramos de gerberas a domicilio el mismo día en Miami. Colores vivos, look moderno. Pide antes de las 3PM.",
    },
    intro: {
      en: "Gerbera bouquets in Miami, delivered today. Big-faced daisies in pop colors — the bouquet that reads as cheerful from across the room.",
      es: "Ramos de gerberas en Miami, entregados hoy. Margaritas grandes en colores pop — el ramo que se lee como alegre desde el otro lado de la habitación.",
    },
    sections: [
      {
        h2: { en: "Gerberas for birthdays", es: "Gerberas para cumpleaños" },
        body: {
          en: "Mixed-color gerbera bouquets are our birthday go-to: instant celebration, no romantic ambiguity, photographs beautifully on Instagram.",
          es: "Los ramos de gerberas mixtas son nuestro go-to para cumpleaños: celebración inmediata, sin ambigüedad romántica, fotografían genial en Instagram.",
        },
      },
      {
        h2: { en: "Vase-life tip", es: "Consejo para que duren" },
        body: {
          en: "Gerbera stems are hollow and bend quickly. Use a tall narrow vase and recut stems every 2 days under running water.",
          es: "El tallo del gerbera es hueco y se dobla rápido. Usa un jarrón alto y estrecho y recorta el tallo cada 2 días bajo agua corriente.",
        },
      },
    ],
  },
  {
    slug: "hydrangeas",
    slugEs: "hortensias",
    tier: 2,
    keyword: { en: "hydrangea bouquets miami", es: "ramos de hortensias en miami" },
    h1: { en: "Hydrangea Bouquets Miami", es: "Ramos de Hortensias en Miami" },
    title: {
      en: "Hydrangea Bouquets Miami | Same-Day Delivery | Charls Flowers",
      es: "Ramos de Hortensias en Miami | A Domicilio | Charls Flowers",
    },
    description: {
      en: "Hydrangea bouquets and arrangements delivered same-day in Miami. Blue, white and pink hydrangeas. Order before 3PM.",
      es: "Ramos y arreglos de hortensias a domicilio el mismo día en Miami. Hortensias azules, blancas y rosas. Pide antes de las 3PM.",
    },
    intro: {
      en: "Hydrangea bouquets in Miami, delivered today. Big mop-heads of blue, white or pink — one of the most photogenic single-flower bouquets we sell.",
      es: "Ramos de hortensias en Miami, entregados hoy. Cabezas grandes en azul, blanco o rosa — uno de los ramos monoflor más fotogénicos que vendemos.",
    },
    sections: [
      {
        h2: { en: "Hydrangeas hate dehydration", es: "La hortensia odia deshidratarse" },
        body: {
          en: "Once a hydrangea wilts it rarely recovers in vase. Submerge the whole head in cool water for 30 minutes the day of delivery — they bounce back instantly.",
          es: "Una hortensia que se marchita rara vez se recupera en jarrón. Sumerge la cabeza entera en agua fría 30 minutos el día de la entrega — vuelven al instante.",
        },
      },
      {
        h2: { en: "Wedding centerpieces", es: "Centros de mesa para boda" },
        body: {
          en: "White hydrangea is the wedding workhorse — fills a centerpiece for the price of three roses. Pair with eucalyptus for a clean modern look.",
          es: "La hortensia blanca es la workhorse de bodas — llena un centro por el precio de tres rosas. Combínala con eucalipto para un look limpio y moderno.",
        },
      },
    ],
  },
  {
    slug: "daisies",
    slugEs: "margaritas",
    tier: 2,
    keyword: { en: "daisy bouquets miami", es: "ramos de margaritas en miami" },
    h1: { en: "Daisy Bouquets Miami", es: "Ramos de Margaritas en Miami" },
    title: {
      en: "Daisy Bouquets Miami | Same-Day Delivery | Charls Flowers",
      es: "Ramos de Margaritas en Miami | A Domicilio | Charls Flowers",
    },
    description: {
      en: "Daisy bouquets delivered same-day in Miami. Classic white-and-yellow daisies, hand-tied. Order before 3PM.",
      es: "Ramos de margaritas a domicilio el mismo día en Miami. Margaritas clásicas blanco-amarillo, montadas a mano. Pide antes de las 3PM.",
    },
    intro: {
      en: "Daisy bouquets in Miami, delivered today. The happiest, most unpretentious flower we carry — perfect for friendships, get-wells, and just-because gifts.",
      es: "Ramos de margaritas en Miami, entregados hoy. La flor más feliz y sin pretensiones que tenemos — perfecta para amistad, mejórate-pronto y regalos porque-sí.",
    },
    sections: [
      {
        h2: { en: "Daisies in mixed bouquets", es: "Margaritas en ramos mixtos" },
        body: {
          en: "Daisies play well with almost anything — gerberas, sunflowers, alstroemerias. Ask us for a mixed seasonal bouquet at any price point.",
          es: "La margarita combina con casi todo — gerberas, girasoles, alstroemerias. Pídenos un ramo mixto de temporada en cualquier rango de precio.",
        },
      },
      {
        h2: { en: "Long vase life", es: "Larga vida en jarrón" },
        body: {
          en: "Daisies easily last 7–10 days with simple care: clean water every 2 days and a fresh diagonal cut on the stems.",
          es: "Las margaritas duran fácilmente 7–10 días con cuidado simple: agua limpia cada 2 días y un corte diagonal fresco en los tallos.",
        },
      },
    ],
  },
  // ─────────── TIER 1 (already transactional concepts — kept verbatim) ───────────
  {
    slug: "ramo-buchon",
    slugEs: "ramo-buchon",
    tier: 1,
    keyword: { en: "ramo buchon miami", es: "ramo buchón en miami" },
    h1: { en: "Ramo Buchón Miami", es: "Ramo Buchón en Miami" },
    title: {
      en: "Ramo Buchón Miami | Same-Day Delivery | Charls Flowers",
      es: "Ramo Buchón en Miami | A Domicilio | Charls Flowers",
    },
    description: {
      en: "Ramo Buchón delivered same-day in Miami. Traditional Mexican-style oversized rose bouquet, hand-built. Order before 3PM.",
      es: "Ramo Buchón a domicilio el mismo día en Miami. Ramo tradicional mexicano de rosas grandes, hecho a mano. Pide antes de las 3PM.",
    },
    intro: {
      en: "Ramo Buchón in Miami, delivered today. The classic oversized Mexican rose bouquet — wide round head, lots of stems, signature gift for quinceañeras, bodas and grandes ocasiones.",
      es: "Ramo Buchón en Miami, entregado hoy. El clásico ramo mexicano de rosas grande — cabeza redonda amplia, muchos tallos, regalo de firma para quinceañeras, bodas y grandes ocasiones.",
    },
    sections: [
      {
        h2: { en: "What makes a real Ramo Buchón", es: "Qué hace a un Ramo Buchón de verdad" },
        body: {
          en: "It's not just 'a lot of roses'. The Buchón is round and tight on top, dramatic in proportion, and wrapped in the traditional Mexican paper.",
          es: "No es solo 'muchas rosas'. El Buchón es redondo y compacto arriba, dramático en proporción, y envuelto en el papel tradicional mexicano.",
        },
      },
      {
        h2: { en: "Custom Ramo Buchón", es: "Ramo Buchón a medida" },
        body: {
          en: "Use the custom builder to choose color and roses count (50–200). Preview with AI before paying.",
          es: "Usa el builder a medida para elegir color y número de rosas (50–200). Previsualiza con IA antes de pagar.",
        },
      },
    ],
  },
  {
    slug: "money-bouquet",
    slugEs: "ramo-de-dinero",
    tier: 2,
    keyword: { en: "money bouquet miami", es: "ramo de dinero en miami" },
    h1: { en: "Money Bouquet Miami", es: "Ramo de Dinero en Miami" },
    title: {
      en: "Money Bouquet Miami | Cash Bouquet Delivery | Charls Flowers",
      es: "Ramo de Dinero en Miami | Entrega de Ramo con Billetes | Charls Flowers",
    },
    description: {
      en: "Money bouquets delivered in Miami. We assemble real-bill folded bouquets to your budget. Order in advance.",
      es: "Ramos de dinero en Miami. Montamos ramos con billetes reales doblados a tu presupuesto. Pide con antelación.",
    },
    intro: {
      en: "Money bouquet in Miami — real folded bills hand-arranged as flowers, paired with fresh greens. Popular for graduations, quinceañeras, and big birthdays.",
      es: "Ramo de dinero en Miami — billetes reales doblados como flores a mano, combinados con verdes frescos. Popular para graduaciones, quinceañeras y cumpleaños grandes.",
    },
    sections: [
      {
        h2: { en: "How the money bouquet works", es: "Cómo funciona el ramo de dinero" },
        body: {
          en: "You set the budget. We fold the bills (or you provide them), arrange the bouquet, and deliver. Bills are intact and re-usable — it's an arrangement, not a destruction.",
          es: "Tú pones el presupuesto. Doblamos los billetes (o los traes tú), montamos el ramo y entregamos. Los billetes quedan intactos y reutilizables — es un arreglo, no una destrucción.",
        },
      },
      {
        h2: { en: "Order in advance", es: "Pide con antelación" },
        body: {
          en: "Money bouquets need 48-hour lead time so we can prep the bills and assemble cleanly. Call us to coordinate.",
          es: "Los ramos de dinero necesitan 48 horas de antelación para preparar los billetes y montar con limpieza. Llámanos para coordinar.",
        },
      },
    ],
  },
  {
    slug: "floral-arrangements",
    slugEs: "arreglos-florales",
    tier: 2,
    keyword: { en: "floral arrangements miami", es: "arreglos florales en miami" },
    h1: { en: "Floral Arrangements Miami", es: "Arreglos Florales en Miami" },
    title: {
      en: "Floral Arrangements Miami | Same-Day Delivery | Charls Flowers",
      es: "Arreglos Florales en Miami | A Domicilio | Charls Flowers",
    },
    description: {
      en: "Floral arrangements delivered same-day in Miami. Vases, boxes, baskets and centerpieces. Order before 3PM.",
      es: "Arreglos florales a domicilio el mismo día en Miami. Jarrones, cajas, cestas y centros de mesa. Pide antes de las 3PM.",
    },
    intro: {
      en: "Floral arrangements in Miami, delivered today. Beyond hand-tied bouquets — arrangements in vases, boxes, baskets and centerpieces for tables and events.",
      es: "Arreglos florales en Miami, entregados hoy. Más allá de los ramos atados a mano — arreglos en jarrón, caja, cesta y centros de mesa para eventos.",
    },
    sections: [
      {
        h2: { en: "Vase vs hand-tied bouquet", es: "Arreglo en jarrón vs ramo atado" },
        body: {
          en: "A vase arrangement arrives ready to display — no scissors, no water mess, no decisions. Best for offices, hospitals, and recipients who travel.",
          es: "Un arreglo en jarrón llega listo para colocar — sin tijeras, sin agua que limpiar, sin decisiones. Ideal para oficinas, hospitales y personas que viajan.",
        },
      },
      {
        h2: { en: "Centerpieces for events", es: "Centros de mesa para eventos" },
        body: {
          en: "We build event centerpieces in any size and palette. Contact us with date, count, and color story for a quote.",
          es: "Hacemos centros de mesa de evento en cualquier tamaño y paleta. Contáctanos con fecha, cantidad y paleta para presupuesto.",
        },
      },
    ],
  },
  {
    slug: "preserved-roses",
    slugEs: "rosas-eternas",
    tier: 2,
    keyword: { en: "preserved roses miami", es: "rosas eternas en miami" },
    keyword2: { en: "eternal roses miami", es: "rosas preservadas en miami" },
    h1: { en: "Preserved / Eternal Roses Miami", es: "Rosas Eternas y Preservadas en Miami" },
    title: {
      en: "Preserved Roses Miami | Eternal Rose Boxes | Charls Flowers",
      es: "Rosas Eternas en Miami | Cajas de Rosas Preservadas | Charls Flowers",
    },
    description: {
      en: "Preserved (eternal) roses in Miami. Real roses treated to last 1–3 years, displayed in boxes. Same-day delivery available.",
      es: "Rosas eternas (preservadas) en Miami. Rosas reales tratadas que duran 1–3 años, presentadas en caja. Entrega el mismo día disponible.",
    },
    intro: {
      en: "Preserved (eternal) roses in Miami — real Ecuadorian roses treated to keep their shape, color and softness for 1–3 years without water.",
      es: "Rosas eternas (preservadas) en Miami — rosas reales ecuatorianas tratadas para conservar forma, color y suavidad durante 1–3 años sin agua.",
    },
    sections: [
      {
        h2: { en: "How preserved roses work", es: "Cómo funcionan las rosas eternas" },
        body: {
          en: "Fresh roses are infused with a glycerin solution that replaces the sap. They stay soft to the touch but don't need water, sun or care.",
          es: "Las rosas frescas se infusionan con una solución de glicerina que reemplaza la savia. Quedan suaves al tacto pero no necesitan agua, sol ni cuidado.",
        },
      },
      {
        h2: { en: "Best for these gifts", es: "Mejor regalo para estos casos" },
        body: {
          en: "Anniversaries, proposals, and long-distance gifts — when the recipient will travel or you want a keepsake that survives the year.",
          es: "Aniversarios, propuestas y regalos a distancia — cuando el destinatario viaja o quieres un recuerdo que sobreviva el año.",
        },
      },
    ],
  },
  {
    slug: "bridal-bouquets",
    slugEs: "ramos-de-novia",
    tier: 1,
    keyword: { en: "bridal bouquets miami", es: "ramos de novia en miami" },
    h1: { en: "Bridal Bouquets Miami", es: "Ramos de Novia en Miami" },
    title: {
      en: "Bridal Bouquets Miami | Custom Wedding Florist | Charls Flowers",
      es: "Ramos de Novia en Miami | Florista de Bodas | Charls Flowers",
    },
    description: {
      en: "Custom bridal bouquets in Miami. Round, cascade and asymmetric designs in your exact palette. Book a consult.",
      es: "Ramos de novia a medida en Miami. Diseños redondos, cascada y asimétricos en tu paleta exacta. Reserva una consulta.",
    },
    intro: {
      en: "Bridal bouquets in Miami — built around your dress, your palette, and your venue. Round classic, lush cascade, or modern asymmetric.",
      es: "Ramos de novia en Miami — diseñados alrededor de tu vestido, tu paleta y tu venue. Redondo clásico, cascada exuberante o asimétrico moderno.",
    },
    sections: [
      {
        h2: { en: "The bridal consult", es: "La consulta de novia" },
        body: {
          en: "Book a 30-minute consult with the lead florist. Bring dress photos, color references, and venue lighting — we build the brief together.",
          es: "Reserva una consulta de 30 minutos con la florista principal. Trae fotos del vestido, referencias de color y luz del venue — montamos el brief juntos.",
        },
      },
      {
        h2: { en: "Bridesmaids, boutonnières & arches", es: "Damas, boutonnières y arcos" },
        body: {
          en: "We coordinate the full floral story: bridesmaid bouquets, boutonnières, ceremony arch, and reception centerpieces — one cohesive palette.",
          es: "Coordinamos toda la historia floral: ramos de damas, boutonnières, arco de ceremonia y centros de recepción — una paleta cohesiva.",
        },
      },
    ],
  },
  {
    slug: "flower-subscription",
    slugEs: "suscripcion-de-flores",
    tier: 2,
    keyword: { en: "flower subscription miami", es: "suscripción de flores en miami" },
    h1: { en: "Flower Subscription Miami", es: "Suscripción de Flores en Miami" },
    title: {
      en: "Flower Subscription Miami | Weekly / Biweekly Delivery | Charls Flowers",
      es: "Suscripción de Flores en Miami | Entrega Semanal / Quincenal | Charls Flowers",
    },
    description: {
      en: "Flower subscription in Miami. Weekly, biweekly or monthly bouquet delivered to your door. Cancel anytime.",
      es: "Suscripción de flores en Miami. Bouquet semanal, quincenal o mensual a tu puerta. Cancela cuando quieras.",
    },
    intro: {
      en: "Flower subscription in Miami — a fresh bouquet at your door on the same day every week, every two weeks or every month. Designed seasonally by the lead florist.",
      es: "Suscripción de flores en Miami — un ramo fresco en tu puerta el mismo día cada semana, cada dos semanas o cada mes. Diseñado por temporada por la florista principal.",
    },
    sections: [
      {
        h2: { en: "How it works", es: "Cómo funciona" },
        body: {
          en: "Pick a frequency and a budget. We build the bouquet around what's freshest that week. Pause or cancel from your account anytime.",
          es: "Elige frecuencia y presupuesto. Montamos el ramo con lo más fresco de esa semana. Pausa o cancela desde tu cuenta cuando quieras.",
        },
      },
      {
        h2: { en: "Corporate subscriptions", es: "Suscripciones corporativas" },
        body: {
          en: "We service offices, lobbies, salons and restaurants across Miami with weekly arrangements on a single invoice — ask for the corporate rate.",
          es: "Atendemos oficinas, lobbies, salones y restaurantes en Miami con arreglos semanales en una sola factura — pregunta por la tarifa corporativa.",
        },
      },
    ],
  },
];

/** Find a flower-type page by either its EN slug or its ES slug. */
export const findFlowerTypeBySlug = (slug: string): FlowerTypePage | undefined =>
  flowerTypePages.find((f) => f.slug === slug || f.slugEs === slug);

/** Tier filter helper. */
export const flowerTypesByTier = (tier: OccasionTier): FlowerTypePage[] =>
  flowerTypePages.filter((f) => f.tier === tier);

/** Slugs (EN + ES) the unified collection router should treat as flower-type. */
export const isFlowerTypeSlug = (slug: string): boolean =>
  flowerTypePages.some((f) => f.slug === slug || f.slugEs === slug);