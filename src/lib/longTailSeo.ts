/**
 * Long-tail on-page SEO content for existing collection pages.
 *
 * One entry per collection key (color route, /bouquets, single-color, mixed,
 * zodiac, mother's day). Each entry holds the short intro paragraph that goes
 * directly under the existing H1 ("mirror" effect), plus a body block of
 * 2-3 H2/H3 sections and a closing sentence whose internal links keep the
 * exact anchor text the user requested, ordered low → high search volume.
 *
 * RULES baked in:
 *  - The page H1 is never overridden here — only intro + H2/H3 + copy.
 *  - Internal anchors must match the keyword EXACTLY (case is preserved).
 *  - "DATOS LIMITADOS" pages stay generic — no invented keywords.
 *  - EN entries use clean root paths, ES entries use /es native slugs (no
 *    auto-localization needed via LocalizedRouter).
 */

export interface LongTailLink {
  /** Anchor text — must equal the keyword exactly. */
  anchor: string;
  /** Internal route. EN: "/…", ES: "/es/…" (native). */
  to: string;
}

export interface LongTailContent {
  /** Short 1-2 line intro placed immediately under the existing H1. */
  intro: string;
  /** 2-3 sections — every heading is H2/H3, never a second H1. */
  sections: Array<{ h2: string; body: string }>;
  /**
   * Closing sentence that hosts the internal links. Use `{{0}}`, `{{1}}`, …
   * placeholders matching the `links` array order.
   */
  closing: string;
  /** Internal links, ordered LOW → HIGH search volume. */
  links: LongTailLink[];
  /**
   * Optional differentiator string (one of this page's long-tail variants),
   * used to compose per-page alt text when a hero image is available.
   */
  altVariant?: string;
}

export interface LongTailEntry {
  en: LongTailContent;
  es: LongTailContent;
}

/** All long-tail SEO blocks keyed by collection. */
export const LONG_TAIL_SEO: Record<string, LongTailEntry> = {
  // ───────────── A. ROSES BY COLOR (EN root) ─────────────
  "color:red": {
    en: {
      intro:
        "Looking for red roses in Miami, delivered fresh today? Our red roses bouquets — from a single stem to a classic dozen red roses — are hand-arranged and ready for same-day delivery across the city.",
      sections: [
        {
          h2: "Red roses bouquet, hand-arranged in Miami",
          body: "Every red roses bouquet is built to order with premium long-stem red roses flowers, foliage and signature wrapping. Whether you want a compact red rose flower bouquet for a desk surprise or a tall arrangement for a dinner table, we shape it the same morning it ships.",
        },
        {
          h2: "Red roses for anniversary, birthdays and last-minute gifts",
          body: 'A dozen red roses is still the most-requested anniversary gift in Miami — and the easiest "red roses near me" answer when the date sneaks up on you. Order before 3 PM and we deliver the same day across Miami-Dade.',
        },
        {
          h2: "How many roses? From a dozen red roses to two dozen roses and 100 red roses",
          body: "The size makes the message. A dozen red roses (or a full red roses dozen) is the classic anniversary and Valentine's choice; step up to two dozen roses when you want more impact; and for a milestone — an engagement, a big anniversary, a grand gesture — a 100 red roses bouquet with 50 red roses and 100 long stem roses options turns heads. Every quantity is available with long stem red roses, hand-arranged the morning it ships.",
        },
      ],
      closing: "Prefer a softer palette? Try our {{0}}, browse the full {{1}} catalog or explore every variety of {{2}}.",
      links: [
        { anchor: "pink roses bouquet", to: "/bouquets/pink-roses" },
        { anchor: "rose bouquet", to: "/bouquets" },
        { anchor: "roses", to: "/bouquets" },
      ],
      altVariant: "Dozen red roses bouquet — Charls Flowers Miami",
    },
    es: {
      intro:
        "¿Buscas un ramo de rosas rojas en Miami para hoy? Nuestras rosas rojas naturales se preparan a mano y se entregan el mismo día.",
      sections: [
        {
          h2: "Ramo de rosas rojas, hecho a mano en Miami",
          body: "Cada ramo de rosas rojas se monta a pedido con rosas rojas naturales de tallo largo, verdes complementarios y papelería propia. Desde una docena clásica hasta ramos de rosas rojas elegantes de gran formato, mantenemos el corte fresco del día.",
        },
        {
          h2: "Arreglo de rosas rojas para aniversario y fechas especiales",
          body: "Un arreglo de rosas rojas sigue siendo el regalo de aniversario más pedido en Miami, y también funciona como detalle de última hora. Para combinaciones románticas en dos tonos, también preparamos el ramo de rosas blancas y rojas con la misma rapidez.",
        },
        {
          // Cola larga de cantidad — keywords ES VERIFICADAS del Keyword Planner
          // (geo 2840 lang 1003, mercado hispano de US/Miami; "ramo de rosas rojas"
          // también confirmado en geo 2724 ES). Volúmenes reales: "ramo de rosas
          // rojas" 2.400 · "ramo de 100 rosas" 1.000 · "ramo de 50 rosas" 1.000 ·
          // "rosas rojas naturales" 480 · "docena de rosas" 170 · "ramo de 12 rosas"
          // 320 · "ramo de 100 rosas rojas" 70 · "ramo de 50 rosas rojas" 70 ·
          // "ramo de rosas rojas naturales" 90 · "100 rosas rojas" 40.
          h2: "Ramo de rosas rojas: desde una docena de rosas hasta 100 rosas rojas",
          body: "Elige el tamaño según el mensaje. Un ramo de 12 rosas o una docena de rosas es el clásico de aniversario y San Valentín; para un gran gesto —una pedida, un aniversario grande— un ramo de 50 rosas o un ramo de 100 rosas impacta de verdad, y el ramo de 100 rosas rojas es nuestro más pedido en ese formato. Todos se montan con rosas rojas naturales de tallo largo el mismo día del envío en Miami.",
        },
      ],
      closing: "Si prefieres un tono más suave, mira nuestras {{0}}, todo el {{1}} disponible o el catálogo completo de {{2}}.",
      links: [
        { anchor: "rosas rosadas", to: "/es/bouquets/rosas-rosadas" },
        { anchor: "ramo de rosas", to: "/es/bouquets" },
        { anchor: "rosas", to: "/es/bouquets" },
      ],
      altVariant: "Ramo de rosas rojas naturales — Charls Flowers Miami",
    },
  },

  "color:white": {
    en: {
      intro:
        "White roses for a wedding, a sympathy gift or a fresh white roses bouquet for someone special — arranged by hand in Miami and delivered the same day.",
      sections: [
        {
          h2: "White roses bouquet for weddings and ceremonies",
          body: "White roses for wedding tables, bridal parties and church arrangements are our most consistent request. Every white rose flower we use is sorted for tightness, height and color uniformity so a bouquet with white roses photographs cleanly under any lighting.",
        },
        {
          h2: "White rose flower bouquet for sympathy and elegance",
          body: 'When you need white roses near me with very little notice — a memorial, a hospital visit, a last-minute thank-you — our white rose flower bouquet ships the same day with discreet wrapping.',
        },
      ],
      closing: "Pair them with a soft {{0}} blend, explore the full {{1}} or browse all our {{2}}.",
      links: [
        { anchor: "pink and white roses", to: "/bouquets/pink-roses" },
        { anchor: "white roses bouquet", to: "/bouquets" },
        { anchor: "roses", to: "/bouquets" },
      ],
      altVariant: "White roses bouquet for wedding delivery in Miami",
    },
    es: {
      intro:
        "Rosas blancas para una boda, un duelo o un detalle especial — preparadas a mano en Miami y entregadas el mismo día.",
      sections: [
        {
          h2: "Rosas blancas naturales para bodas y ceremonias",
          body: "Nuestras rosas blancas naturales se seleccionan por uniformidad de color y apertura, ideales para mesas de boda, decoración religiosa y ramos de novia. Solicitamos siempre flores blancas naturales del mismo lote para que el resultado salga impecable en foto.",
        },
        {
          h2: "Combinaciones bicolor: ramo de rosas rosadas y blancas o ramo de rosas blancas y rojas",
          body: "Cuando buscas algo menos clásico, el ramo de rosas rosadas y blancas aporta dulzura y el ramo de rosas blancas y rojas refuerza el mensaje romántico. Ambos se montan a mano el mismo día del envío.",
        },
      ],
      closing: "Para un tono más intenso prueba con {{0}}, mira todo nuestro {{1}} o el catálogo completo de {{2}}.",
      links: [
        { anchor: "rosas rojas", to: "/es/bouquets/rosas-rojas" },
        { anchor: "ramo de rosas", to: "/es/bouquets" },
        { anchor: "rosas", to: "/es/bouquets" },
      ],
      altVariant: "Ramo de rosas blancas naturales — Miami",
    },
  },

  "color:pink": {
    en: {
      intro:
        "From soft light pink roses to bold hot pink roses, our pink roses bouquets are hand-arranged in Miami for same-day delivery.",
      sections: [
        {
          h2: "Pink roses bouquet — soft, classic and modern tones",
          body: "We work with several pink varieties so every pink roses bouquet has its own personality: light pink roses for a delicate, romantic feel and hot pink roses when you want the arrangement to pop. The same pink rose flower bouquet ships same-day in Miami.",
        },
        {
          h2: "Flowers pink roses for birthdays, mothers and just-because",
          body: 'Pink is the most-versatile color in the shop. When someone searches "pink roses near me" they\'re usually looking for an everyday gift — birthdays, anniversaries, get-wells — and a flower bouquet pink roses arrangement always lands.',
        },
      ],
      closing: "If you want something bolder check our {{0}}, browse every {{1}} or our full collection of {{2}}.",
      links: [
        { anchor: "pink roses near me", to: "/bouquets/red-roses" },
        { anchor: "flower bouquet pink roses", to: "/bouquets" },
        { anchor: "roses", to: "/bouquets" },
      ],
      altVariant: "Hot pink roses bouquet delivered in Miami",
    },
    es: {
      intro:
        "Rosas rosadas naturales para regalar dulzura — preparadas a mano en Miami con entrega el mismo día.",
      sections: [
        {
          h2: "Rosa rosada en varios tonos",
          body: "Trabajamos con varios cultivos de rosa rosada para cubrir desde el palo rosa más suave hasta tonos fucsia. Todas nuestras rosas rosadas naturales se cortan el día del envío.",
        },
        {
          h2: "Combinaciones: ramo de rosas rosadas y blancas o ramo de rosas rojas y rosadas",
          body: "Para regalos con doble lectura el ramo de rosas rosadas y blancas aporta delicadeza, mientras que el ramo de rosas rojas y rosadas suma intensidad. Cualquiera de los dos se monta a mano por la mañana y sale el mismo día.",
        },
      ],
      closing: "También puedes ver nuestras {{0}}, todo el {{1}} disponible o el catálogo completo de {{2}}.",
      links: [
        { anchor: "rosas amarillas", to: "/es/bouquets/rosas-amarillas" },
        { anchor: "ramo de rosas", to: "/es/bouquets" },
        { anchor: "rosas", to: "/es/bouquets" },
      ],
      altVariant: "Ramo de rosas rosadas naturales — Miami",
    },
  },

  "color:yellow": {
    en: {
      intro:
        "Yellow roses say friendship and joy — perfect for a birthday. Our yellow roses bouquets are arranged fresh in Miami and delivered the same day.",
      sections: [
        {
          h2: "Yellow roses bouquet for birthdays",
          body: "Yellow roses for birthday gifts are our top friendship pick — bright, warm and easy to deliver before lunch. Every bouquet with yellow roses uses long-stem cultivars selected the same morning.",
        },
        {
          h2: "Mixes with yellow roses near me: red and yellow roses, pink and yellow roses",
          body: "If a single tone feels too plain, red and yellow roses add contrast and pink and yellow roses keep things soft. Both options are arranged on demand and ship same-day across Miami.",
        },
      ],
      closing: "Looking for warmer tones? Try {{0}}, browse the full {{1}} or our complete {{2}} catalog.",
      links: [
        { anchor: "yellow roses for birthday", to: "/bouquets/orange-roses" },
        { anchor: "yellow roses bouquet", to: "/bouquets" },
        { anchor: "roses", to: "/bouquets" },
      ],
      altVariant: "Yellow roses bouquet for birthday delivery Miami",
    },
    es: {
      intro:
        "Rosas amarillas, color de amistad y alegría — perfectas para un cumpleaños. Preparadas en Miami con entrega el mismo día.",
      sections: [
        {
          h2: "Ramo de rosas amarillas para cumpleaños",
          body: "El ramo de rosas amarillas es nuestro regalo de amistad más pedido: alegre, luminoso y fácil de entregar antes de mediodía. Usamos rosas amarillas naturales de tallo largo del mismo lote para garantizar uniformidad.",
        },
        {
          h2: "Variantes: ramo de flores amarillas y ramo flores amarillas mixto",
          body: "Si quieres ir más allá del cultivo único, el ramo de flores amarillas combina rosas con margaritas o crisantemos, y el ramo flores amarillas mixto añade follaje contrastante.",
        },
      ],
      closing: "Para tonos más cálidos prueba {{0}}, mira todo el {{1}} o el catálogo completo de {{2}}.",
      links: [
        { anchor: "rosas rojas", to: "/es/bouquets/rosas-rojas" },
        { anchor: "ramo de rosas", to: "/es/bouquets" },
        { anchor: "rosas", to: "/es/bouquets" },
      ],
      altVariant: "Ramo de rosas amarillas naturales — Miami",
    },
  },

  "color:black": {
    en: {
      intro:
        "Dramatic and bold, our black roses bouquets — including striking black and red roses — are arranged in Miami with same-day delivery.",
      sections: [
        {
          h2: "Black rose bouquet — bold and unmistakable",
          body: "Our black rose bouquet uses deep-burgundy cultivars tinted to a true black finish — the closest thing to real black roses you'll see in Miami. Every black rose flower bouquet is checked stem-by-stem before it ships.",
        },
        {
          h2: "Black and red roses for statement gifts",
          body: 'When you search "black roses near me" you usually need it fast. We keep stock ready for same-day black roses delivery, and black and red roses combinations are arranged in under an hour.',
        },
      ],
      closing: "If you want another rare tone, see our {{0}}, the full {{1}} or our complete catalog of {{2}}.",
      links: [
        { anchor: "black roses delivery", to: "/bouquets/purple-roses" },
        { anchor: "black rose bouquet", to: "/bouquets" },
        { anchor: "roses", to: "/bouquets" },
      ],
      altVariant: "Black rose bouquet — Charls Flowers Miami",
    },
    es: {
      intro:
        "Rosas negras, intensas y elegantes — un regalo que no pasa desapercibido. Preparadas en Miami con entrega el mismo día.",
      sections: [
        {
          h2: "Ramo de rosas negras",
          body: "Nuestro ramo de rosas negras usa cultivos burdeos teñidos hasta un negro real. Cada vara es revisada de forma individual antes del envío.",
        },
        {
          h2: "Rosas negras naturales y combinaciones con flores negras naturales",
          body: "Cuando hace falta un detalle muy serio, las rosas negras naturales se combinan con flores negras naturales o follaje oscuro para reforzar el efecto dramático.",
        },
      ],
      closing: "Para otro tono raro mira {{0}}, todo el {{1}} o el catálogo completo de {{2}}.",
      links: [
        { anchor: "rosas azules", to: "/es/bouquets/rosas-azules" },
        { anchor: "ramo de rosas", to: "/es/bouquets" },
        { anchor: "rosas", to: "/es/bouquets" },
      ],
      altVariant: "Ramo de rosas negras naturales — Miami",
    },
  },

  "color:blue": {
    en: {
      intro:
        "Rare and unforgettable, our blue roses bouquets stand out for any occasion — arranged fresh in Miami with same-day delivery.",
      sections: [
        {
          h2: "Blue roses bouquet — the rarest gift in the shop",
          body: "Our blue roses bouquet starts with white roses dyed with food-grade pigment, the same technique used for the closest version to real blue roses on the market. Each blue rose flower bouquet is wrapped to protect the petals during delivery.",
        },
        {
          h2: 'The blue rose flower as a "blue roses near me" answer in Miami',
          body: "When somebody searches for the blue rose flower in Miami they're usually looking for something unique — a proposal, a graduation or a milestone birthday. We keep stock ready for same-day delivery.",
        },
      ],
      closing: "Want something equally distinctive? Try {{0}}, browse the full {{1}} or all our {{2}}.",
      links: [
        { anchor: "blue roses near me", to: "/bouquets/green-roses" },
        { anchor: "blue roses bouquet", to: "/bouquets" },
        { anchor: "roses", to: "/bouquets" },
      ],
      altVariant: "Blue roses bouquet — same-day Miami delivery",
    },
    es: {
      intro:
        "Rosas azules, raras y memorables — incluido el ramo de rosas azules para hombres. Preparadas en Miami con entrega el mismo día.",
      sections: [
        {
          h2: "Ramo de rosas azules",
          body: "El ramo de rosas azules se prepara tiñendo rosas blancas con pigmento alimentario, lo más cercano a unas rosas azules naturales que vas a encontrar en Miami. Cada vara va envuelta para proteger el pétalo.",
        },
        {
          h2: "Ramos de rosas azules para hombres y ramo de flores azules",
          body: "Los ramos de rosas azules para hombres se piden mucho como detalle de cumpleaños o aniversario en pareja, y el ramo de flores azules añade flor de temporada al diseño.",
        },
      ],
      closing: "Si quieres otro tono raro mira {{0}}, todo el {{1}} o el catálogo completo de {{2}}.",
      links: [
        { anchor: "rosas moradas", to: "/es/bouquets/rosas-moradas" },
        { anchor: "ramo de rosas", to: "/es/bouquets" },
        { anchor: "rosas", to: "/es/bouquets" },
      ],
      altVariant: "Ramo de rosas azules — Miami",
    },
  },

  "color:purple": {
    en: {
      intro:
        "Elegant and unique, our purple roses bouquets bring a touch of royalty to any gift — hand-arranged in Miami, delivered same day.",
      sections: [
        {
          h2: "Purple roses bouquet for special occasions",
          body: "Each purple roses bouquet — also requested as bouquet purple roses — pairs deep lilac and lavender cultivars with neutral foliage. A bunch of purple roses works for graduations, retirements and any milestone where you want something less obvious than red.",
        },
        {
          h2: "Bicolor: black and purple roses",
          body: "When the occasion is dramatic, the black and purple roses combination uses our tinted black cultivars next to deep-purple stems for an instantly recognizable look.",
        },
      ],
      closing: "Prefer something with more warmth? See our {{0}}, the full {{1}} or every variety of {{2}}.",
      links: [
        { anchor: "bunch of purple roses", to: "/bouquets/blue-roses" },
        { anchor: "purple roses bouquet", to: "/bouquets" },
        { anchor: "roses", to: "/bouquets" },
      ],
      altVariant: "Bunch of purple roses — Charls Flowers Miami",
    },
    es: {
      intro:
        "Rosas moradas (y rosas lilas) para un detalle único y elegante — preparadas en Miami con entrega el mismo día.",
      sections: [
        {
          h2: "Rosas moradas naturales",
          body: "Trabajamos con rosas moradas naturales de tonos lilas y violetas para que el ramo conserve la profundidad de color. También usamos rosas lilas como tono intermedio.",
        },
        {
          h2: "Ramo de flores moradas",
          body: "El ramo de flores moradas combina rosa morada con limonium, lisianthus o eucalipto para reforzar la paleta sin perder elegancia.",
        },
      ],
      closing: "Si quieres un tono más cálido mira {{0}}, todo el {{1}} o el catálogo completo de {{2}}.",
      links: [
        { anchor: "rosas naranjas", to: "/es/bouquets/rosas-naranjas" },
        { anchor: "ramo de rosas", to: "/es/bouquets" },
        { anchor: "rosas", to: "/es/bouquets" },
      ],
      altVariant: "Ramo de rosas moradas naturales — Miami",
    },
  },

  "color:orange": {
    en: {
      intro:
        "Warm and full of energy, our orange roses bouquets — and vibrant yellow-orange roses blends — are arranged fresh in Miami for same-day delivery.",
      sections: [
        {
          h2: "Orange roses bouquet for warm occasions",
          body: "An orange roses bouquet feels seasonal year-round in Miami — perfect for autumn-themed gifts, work celebrations and warm-toned weddings. Every bouquet orange roses arrangement uses long-stem cultivars cut the same day.",
        },
        {
          h2: "Yellow orange roses and orange and yellow roses combinations",
          body: "Mixes with yellow orange roses are our most-photographed: the orange and yellow roses palette has a sunset effect that works for birthdays, retirements and welcome bouquets.",
        },
      ],
      closing: "Want pure brightness instead? See our {{0}}, the full {{1}} or all our {{2}}.",
      links: [
        { anchor: "orange roses bouquet", to: "/bouquets/yellow-roses" },
        { anchor: "bouquet orange roses", to: "/bouquets" },
        { anchor: "roses", to: "/bouquets" },
      ],
      altVariant: "Orange roses bouquet — Miami delivery",
    },
    es: {
      intro:
        "Rosas naranjas (anaranjadas), color de energía y entusiasmo — preparadas en Miami con entrega el mismo día.",
      sections: [
        {
          h2: "Rosas anaranjadas para regalos cálidos",
          body: "Las rosas anaranjadas funcionan todo el año en Miami: cumpleaños, agradecimientos y bodas con paleta cálida. Cada ramo se monta a mano el mismo día del envío.",
        },
        {
          h2: "Mezclas con flores naranjas",
          body: "Cuando se busca un efecto puesta-de-sol, combinamos rosas naranjas con flores naranjas complementarias (gerberas, lirios) para suavizar la transición de tono.",
        },
      ],
      closing: "Si prefieres un tono más raro mira {{0}}, todo el {{1}} o el catálogo completo de {{2}}.",
      links: [
        { anchor: "rosas verdes", to: "/es/bouquets/rosas-verdes" },
        { anchor: "ramo de rosas", to: "/es/bouquets" },
        { anchor: "rosas", to: "/es/bouquets" },
      ],
      altVariant: "Ramo de rosas naranjas — Miami",
    },
  },

  // Green — DATOS LIMITADOS: generic copy, no invented keywords.
  "color:green": {
    en: {
      intro:
        "Green roses are a rare symbol of renewal and good fortune — our green roses arrangements are prepared fresh in Miami with same-day delivery.",
      sections: [
        {
          h2: "Green roses arrangements in Miami",
          body: "Green roses are an unusual gift — perfect for new beginnings, graduations or anyone who already has the classics. We prepare each arrangement on the day of delivery.",
        },
      ],
      closing: "Browse other unusual tones with our {{0}}, the full {{1}} or every variety of {{2}}.",
      links: [
        { anchor: "green roses", to: "/bouquets/orange-roses" },
        { anchor: "rose bouquet", to: "/bouquets" },
        { anchor: "roses", to: "/bouquets" },
      ],
      altVariant: "Green roses arrangement — Charls Flowers Miami",
    },
    es: {
      intro:
        "Rosas verdes, símbolo raro de renovación y buena suerte — preparadas en Miami con entrega el mismo día.",
      sections: [
        {
          h2: "Rosas verdes naturales",
          body: "Las rosas verdes naturales son una elección poco común, ideal para nuevos comienzos o cuando se busca algo distinto. Cada arreglo se monta el día del envío.",
        },
      ],
      closing: "Para otros tonos poco comunes mira {{0}}, todo el {{1}} o el catálogo completo de {{2}}.",
      links: [
        { anchor: "rosas amarillas", to: "/es/bouquets/rosas-amarillas" },
        { anchor: "ramo de rosas", to: "/es/bouquets" },
        { anchor: "rosas", to: "/es/bouquets" },
      ],
      altVariant: "Ramo de rosas verdes — Miami",
    },
  },

  // ───────────── C. /bouquets — Flower Bouquets / Ramos de Flores ─────────────
  bouquets: {
    en: {
      intro:
        "Fresh flower bouquets in Miami, delivered the same day — from a classic rose bouquet to a colorful mixed flower bouquet, hand-arranged for any occasion.",
      sections: [
        {
          h2: "Rose bouquet and bouquet with roses for every occasion",
          body: 'Most of our orders are still a rose bouquet — anniversaries, apologies, birthdays — but a bouquet with roses can be customized for almost anything: a single tone, a duo or a full bouquet of flowers red roses.',
        },
        {
          h2: "Flower bouquet near me, delivered the same day",
          body: 'When you search "flower bouquet near me" in Miami you usually need it within hours. Our cutoff is 3 PM and we ship same-day across Miami-Dade, including a mixed flower bouquet built on the spot if you want extra color.',
        },
      ],
      closing: "Pick a {{0}} for full color, a classic {{1}} or browse every variety of {{2}}.",
      links: [
        { anchor: "mixed flower bouquet", to: "/bouquets/mixed-color" },
        { anchor: "rose bouquet", to: "/bouquets/red-roses" },
        { anchor: "roses", to: "/bouquets" },
      ],
      altVariant: "Mixed flower bouquet for same-day Miami delivery",
    },
    es: {
      intro:
        "Ramos de flores en Miami con entrega el mismo día — desde un ramo de rosas clásico hasta ramos para cumpleaños o novia, hechos a mano.",
      sections: [
        {
          h2: "Ramo de rosas y ramos para ocasiones",
          body: "El ramo de rosas sigue siendo el regalo más pedido para aniversarios y cumpleaños. También preparamos ramos de flores para cumpleaños con paletas alegres y ramos de flores para novia con tallos largos y follaje seleccionado.",
        },
        {
          h2: "Mezclas: ramo de rosas buchon y combinaciones de temporada",
          body: "Si quieres algo más vistoso, el ramo de rosas buchon (buchón) usa rosa abierta de gran formato — un imán visual para fotos y momentos especiales.",
        },
      ],
      closing: "Empieza por un {{0}}, un {{1}} clásico o explora todas nuestras {{2}}.",
      links: [
        { anchor: "ramo de rosas con girasoles", to: "/es/bouquets/rosas-amarillas" },
        { anchor: "ramo de rosas", to: "/es/bouquets/rosas-rojas" },
        { anchor: "rosas", to: "/es/bouquets" },
      ],
      altVariant: "Ramo de flores mixto — Miami",
    },
  },

  // ───────────── D. Single-color filter ─────────────
  "single-color": {
    en: {
      intro:
        "Single-color roses make a clean, classic statement — a single rose, a dozen red roses or a full bunch in one color, delivered same day in Miami.",
      sections: [
        {
          h2: "Single rose, a dozen or a full bunch",
          body: 'A single rose is the most discreet gift in the shop; a dozen red roses is the classic anniversary order; and a full bunch of purple roses is the option when you want one bold color.',
        },
        {
          h2: 'Why "single roses near me" almost always means Miami same-day',
          body: "When customers search for single roses near me they expect a delivery slot today, not next week. Order before 3 PM and we cut, arrange and dispatch the same morning.",
        },
      ],
      closing: "Want more colors at once? Mix with our {{0}}, send a classic {{1}}, see the full {{2}} or every variety of {{3}}.",
      links: [
        { anchor: "single roses near me", to: "/bouquets/mixed-color" },
        { anchor: "red roses bouquet", to: "/bouquets/red-roses" },
        { anchor: "rose bouquet", to: "/bouquets" },
        { anchor: "roses", to: "/bouquets" },
      ],
      altVariant: "Single rose and dozen red roses — Miami same-day",
    },
    es: {
      // DATOS LIMITADOS — copy genérico, sin keywords inventadas.
      intro:
        "Rosas naturales en un solo color — clásicas, limpias y perfectas para regalos elegantes. Preparadas en Miami con entrega el mismo día.",
      sections: [
        {
          h2: "Rosas naturales en un solo tono",
          body: "Cuando el regalo tiene que ir al grano, una sola variedad de rosas naturales en color uniforme es la opción más segura. Cada tallo se selecciona el mismo día del envío.",
        },
      ],
      closing: "Para combinar tonos mira nuestras {{0}}, todo el {{1}} o el catálogo completo de {{2}}.",
      links: [
        { anchor: "rosas naturales", to: "/es/bouquets/rosas-rojas" },
        { anchor: "ramo de rosas", to: "/es/bouquets" },
        { anchor: "rosas", to: "/es/bouquets" },
      ],
      altVariant: "Rosas naturales un solo color — Miami",
    },
  },

  // ───────────── E. Mixed-color filter ─────────────
  "mixed-color": {
    en: {
      intro:
        "Can't decide on one color? A mixed bouquet of colorful flowers brings together the best of the season — hand-arranged in Miami, delivered same day.",
      sections: [
        {
          h2: "Mixed flower bouquet, built on the spot",
          body: "Every mixed flower bouquet is composed by hand — we don't pre-pack mixes. The result is a mixed bouquet of flowers with current-week varieties at peak freshness.",
        },
        {
          h2: "Colorful flowers, year-round in Miami",
          body: "Miami's climate lets us source colorful flowers throughout the year, so a mixed bouquet looks just as good in February as it does in July.",
        },
      ],
      closing: "Looking for a starting point? Try our {{0}}, the full {{1}} or every variety of {{2}}.",
      links: [
        { anchor: "mixed bouquet", to: "/bouquets/pink-roses" },
        { anchor: "flower bouquet", to: "/bouquets" },
        { anchor: "roses", to: "/bouquets" },
      ],
      altVariant: "Mixed bouquet of colorful flowers — Miami",
    },
    es: {
      // DATOS LIMITADOS — apoyado con sinónimos seguros, sin inventar keywords.
      intro:
        "Un ramo de flores de colores reúne lo mejor de la temporada — hecho a mano en Miami con entrega el mismo día.",
      sections: [
        {
          h2: "Ramo de flores de colores",
          body: "Cada ramo de flores de colores se monta a mano, sin mezclas pre-empaquetadas, usando las flores de colores que mejor están esa misma semana en el mercado.",
        },
      ],
      closing: "Para empezar mira nuestro {{0}} o el catálogo completo de {{1}}.",
      links: [
        { anchor: "ramo de flores de colores", to: "/es/bouquets" },
        { anchor: "rosas", to: "/es/bouquets" },
      ],
      altVariant: "Ramo de flores de colores — Miami",
    },
  },

  // ───────────── F. Zodiac / Birth Flowers ─────────────
  zodiac: {
    en: {
      intro:
        "Every month — and every zodiac sign — has its own birth flower. Find your birth flower by month and send a meaningful arrangement, delivered same day in Miami.",
      sections: [
        {
          h2: "Birth flowers by month — what each one means",
          body: "The birth month flowers tradition assigns a specific bloom to each month (carnations for January, roses for June, marigolds for October…). It's an easy way to personalize a birthday gift with real meaning behind it.",
        },
        {
          h2: "Flower of zodiac signs — from Aries to Pisces",
          body: "Each zodiac sign gets its own flower too. A birth flower for sagittarius (carnations or narcissus depending on the source) is one of the most-requested in November and December — and the rest of the calendar follows the same logic.",
        },
      ],
      closing: "Personalize the gesture with our {{0}}, a classic {{1}} or every variety of {{2}}. You can also read our full guide to birth flowers by month on the blog.",
      links: [
        { anchor: "flower of zodiac signs", to: "/bouquets/purple-roses" },
        { anchor: "rose bouquet", to: "/bouquets" },
        { anchor: "roses", to: "/bouquets" },
      ],
      altVariant: "Birth flowers by month bouquet — Miami",
    },
    es: {
      // DATOS LIMITADOS — sin volumen real en ES, copy genérico.
      intro:
        "Cada signo del zodiaco tiene una flor asociada — un detalle con significado, entregado el mismo día en Miami.",
      sections: [
        {
          h2: "Flores y signos del zodiaco",
          body: "Asociamos una flor a cada signo para que el regalo tenga un significado personal. Todos los arreglos se preparan a mano el día del envío.",
        },
      ],
      closing: "Mira todo nuestro {{0}} o el catálogo completo de {{1}}.",
      links: [
        { anchor: "ramo de rosas", to: "/es/bouquets" },
        { anchor: "rosas", to: "/es/bouquets" },
      ],
      altVariant: "Flores del zodiaco — Miami",
    },
  },

  // ───────────── G. Mother's Day ─────────────
  "mothers-day": {
    en: {
      intro:
        "Make her day with Mother's Day flowers delivered to her door in Miami — from classic mother's day carnations to fresh roses, hand-arranged for same-day delivery.",
      sections: [
        {
          h2: "Happy mothers day flowers, hand-arranged in Miami",
          body: "Happy mothers day flowers should arrive looking like they were cut that morning — because they were. Our mother's day flowers for delivery are prepared the same day they ship.",
        },
        {
          h2: "From mother's day carnations to mums flowers",
          body: 'Beyond roses we offer mother\'s day carnations (the original Mother\'s Day flower) and softer arrangements with mums flowers when you want a longer-lasting gift. Searching "flowers for mom on mother\'s day" the day before? We still deliver same-day in Miami.',
        },
      ],
      closing: "Pick a tender {{0}}, the full {{1}} or any variety of {{2}}.",
      links: [
        { anchor: "mothers day flowers delivery", to: "/bouquets/pink-roses" },
        { anchor: "flower bouquet", to: "/bouquets" },
        { anchor: "roses", to: "/bouquets" },
      ],
      altVariant: "Mother's Day flowers delivery in Miami",
    },
    es: {
      intro:
        "Sorpréndela con flores para mamá en su día — desde un ramo de flores para mamá hasta arreglos florales grandes, entregados el mismo día en Miami.",
      sections: [
        {
          h2: "Ramo de flores para mamá",
          body: "El ramo de flores para mamá es el regalo más pedido el Día de la Madre — clásico, seguro y siempre bien recibido. Lo preparamos a mano el mismo día del envío.",
        },
        {
          h2: "Arreglo de flores para mamá y arreglos florales para mamá grandes",
          body: "Cuando el detalle es central (mesa de comedor, recibidor) el arreglo de flores para mamá en formato grande gana presencia. Para regalos en oficina o cocina, los arreglos florales para mamá grandes mantienen el impacto sin perder elegancia.",
        },
      ],
      closing: "Empieza por nuestros {{0}}, mira todo el {{1}} o el catálogo completo de {{2}}.",
      links: [
        { anchor: "arreglos florales para el día de la madre", to: "/es/bouquets/rosas-rosadas" },
        { anchor: "ramo de flores", to: "/es/bouquets" },
        { anchor: "rosas", to: "/es/bouquets" },
      ],
      altVariant: "Flores para el Día de la Madre — Miami",
    },
  },

  // ───────────── H. Bicolor (two-tone roses) ─────────────
  bicolor: {
    en: {
      intro:
        "Two-tone bicolor roses make a bold, eye-catching gift — our bicolor rose bouquets blend two colors in one arrangement, hand-arranged in Miami for same-day delivery.",
      sections: [
        {
          h2: "Bicolor roses — two-tone roses bouquet, built by hand",
          body: "Every bicolor rose bouquet pairs two complementary cultivars in the same arrangement — a two-tone roses bouquet that reads cleaner in photos and on camera than a generic mixed bunch. We compose every bicolor on the morning of the delivery.",
        },
        {
          h2: "Red and white roses bouquet and other two color roses combinations",
          body: "The classic red and white roses bouquet is our most-requested two color roses combo for anniversaries and romantic dinners. We also build bicolor pairings with pink, yellow and purple cultivars when the brief is less traditional.",
        },
      ],
      closing: "Prefer a single tone? Try our {{0}}, our classic {{1}}, browse the full {{2}} or every variety of {{3}}.",
      links: [
        { anchor: "red and white roses", to: "/bouquets/white-roses" },
        { anchor: "red roses bouquet", to: "/bouquets/red-roses" },
        { anchor: "rose bouquet", to: "/bouquets" },
        { anchor: "roses", to: "/bouquets" },
      ],
      altVariant: "Bicolor red and white roses bouquet — Miami",
    },
    es: {
      intro:
        "Las rosas bicolor combinan dos colores en un mismo ramo — un regalo que llama la atención, hecho a mano en Miami con entrega el mismo día.",
      sections: [
        {
          h2: "Rosas bicolor — ramo de rosas de dos colores",
          body: "Cada ramo de rosas de dos colores se monta a mano con cultivos complementarios para que el contraste se lea limpio en foto y en mano. Preparamos las rosas bicolor el mismo día del envío.",
        },
        {
          h2: "Ramo de rosas blancas y rojas y otras combinaciones bicolor",
          body: "El ramo de rosas blancas y rojas sigue siendo la combinación bicolor más pedida para aniversarios. También combinamos rosa con amarillo, blanco con morado y otras parejas según la ocasión.",
        },
      ],
      closing: "Si prefieres un solo tono prueba nuestras {{0}}, mira todo el {{1}} o el catálogo completo de {{2}}.",
      links: [
        { anchor: "rosas rojas", to: "/es/bouquets/rosas-rojas" },
        { anchor: "ramo de rosas", to: "/es/bouquets" },
        { anchor: "rosas", to: "/es/bouquets" },
      ],
      altVariant: "Ramo de rosas bicolor — Miami",
    },
  },
};

/** Convenience: pick the right language block for a key. */
export const getLongTail = (key: string | undefined, lang: "en" | "es"): LongTailContent | undefined => {
  if (!key) return undefined;
  const entry = LONG_TAIL_SEO[key];
  return entry ? entry[lang] : undefined;
};