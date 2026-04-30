export interface LandingFAQ {
  question: string;
  answer: string;
}

/** Extended SEO content (per-page unique copy for indexable landings). */
export interface LandingSeoContent {
  /** Short H2 + intro paragraph for "Why we deliver here". */
  whyTitle: string;
  whyParagraph: string;
  /** "Zones we cover" list. */
  zonesTitle: string;
  zonesIntro: string;
  zones: string[];
  /** "Popular occasions" list. */
  occasionsTitle: string;
  occasionsIntro: string;
  occasions: string[];
  /** Delivery info section (heading + bullet copy, sourced from official policy). */
  deliveryTitle: string;
  deliveryParagraph: string;
  /** FAQ block (4 entries — used for FAQPage schema + UI). */
  faqTitle: string;
  faqs: LandingFAQ[];
  /** Internal links block (label + slug) — rendered at end. */
  internalLinksTitle: string;
  internalLinks: { label: string; slug: string }[];
  /** Final CTA copy. */
  ctaLabel: string;
  /** Schema.org areaServed name (city / neighborhood). */
  areaServed: string;
}

export interface LandingPageData {
  slug: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  type: 'neighborhood' | 'seasonal' | 'niche';
  /** When present, the page renders the extended SEO layout instead of the default. */
  seo?: LandingSeoContent;
}

export const landingPages: LandingPageData[] = [
  // Neighborhood pages
  {
    slug: 'flower-delivery-coral-gables',
    h1: 'Flower Delivery in Coral Gables, Miami',
    seoTitle: "Flower Delivery Coral Gables | Wedding & Luxury Bouquets | Charl's Flowers",
    seoDescription: 'Flower delivery to Coral Gables homes, weddings and offices. Premium arrangements for Miracle Mile, Biltmore Hotel area, Gables Estates and Cocoplum.',
    intro: "Coral Gables — known as The City Beautiful — is one of Miami's most elegant neighborhoods, with Mediterranean Revival architecture, tree-lined streets and a culture of refined taste. Charl's Flowers delivers handcrafted luxury arrangements to Coral Gables homes, weddings, offices and hotels, including the historic Biltmore Hotel area, Miracle Mile and the prestigious Gables Estates.",
    type: 'neighborhood',
    seo: {
      whyTitle: 'Why we deliver in Coral Gables',
      whyParagraph: "Coral Gables clients appreciate the difference between mass-market florists and a true atelier. Many of our regular clients here are choosing flowers for weddings at the Biltmore, dinner parties in their Old Cutler Road homes, or executive lunches at the offices around Ponce de Leon Boulevard. We understand the aesthetic of Coral Gables — sophisticated, classic, never flashy — and our arrangements are designed to match that sensibility. We also work directly with several Coral Gables event planners and wedding coordinators.",
      zonesTitle: 'Areas we cover in Coral Gables',
      zonesIntro: 'We deliver across all of Coral Gables, including these specific zones and landmarks:',
      zones: [
        'The Biltmore Hotel and surrounding residential streets',
        'Miracle Mile and the downtown Coral Gables shopping district',
        'Gables Estates (gated community)',
        'Cocoplum and Tahiti Beach',
        'Old Cutler Road residential homes',
        'The Riviera and Granada Golf Course neighborhoods',
        'Ponce de Leon Boulevard office towers',
        'University of Miami area (Coral Gables campus)',
        'Merrick Park and surrounding luxury residences',
      ],
      occasionsTitle: 'Popular occasions in Coral Gables',
      occasionsIntro: 'Our Coral Gables clients most often order flowers for:',
      occasions: [
        'Weddings and bridal bouquets at the Biltmore and other historic venues',
        'Anniversary and dinner party arrangements for family homes',
        'Corporate gifts to law firms and financial offices on Ponce de Leon',
        "Mother's Day deliveries to multi-generational Coral Gables families",
        'Sympathy arrangements for services at Caballero Rivero Woodlawn',
        'University of Miami graduations, performances and faculty gifts',
      ],
      deliveryTitle: 'Delivery information for Coral Gables',
      deliveryParagraph: "Coral Gables sits close to our Miami atelier — most addresses fall right around our 0–5 mile flat zone, so delivery to The Gables typically costs $20. Beyond 5 miles, the rate is $1.60 per additional mile, up to 87 miles total. Every order needs a minimum of 2 hours of preparation. For same-day delivery, place your order before 3PM Miami time; orders placed after the cutoff are scheduled for the next available window. Delivery hours are Monday to Friday 8AM–7PM, Saturday 8AM–6PM and Sunday 8AM–5PM. Free pickup is also available at 7261 NW 12th Street, Miami FL 33126. Full details on our shipping policy page.",
      faqTitle: 'Coral Gables delivery FAQs',
      faqs: [
        {
          question: 'Do you handle wedding flowers at the Biltmore Hotel?',
          answer: 'Yes. We have experience delivering ceremony arrangements, bridal bouquets and reception centerpieces to the Biltmore Hotel and other Coral Gables venues. For full wedding services we recommend a consultation in advance.',
        },
        {
          question: 'Can you deliver to a private home in Gables Estates or Cocoplum?',
          answer: "Yes. We're familiar with the security protocols at Coral Gables gated communities including Gables Estates, Cocoplum, Tahiti Beach and Snapper Creek Lakes. Just provide the recipient's name as it appears on the gate list.",
        },
        {
          question: 'Do you offer flower arrangements for Coral Gables dinner parties?',
          answer: "Absolutely. Many of our Coral Gables clients order centerpieces and entryway arrangements for dinner parties at home. We can match a specific palette or style — just describe the event and we'll design accordingly.",
        },
        {
          question: 'How does office delivery work on Ponce de Leon Boulevard?',
          answer: 'We deliver to office buildings along Ponce de Leon during business hours and coordinate with reception so the recipient gets the arrangement personally. Most Ponce de Leon addresses fall within our $20 flat-rate zone (0–5 miles from our NW 12th Street atelier); beyond 5 miles the rate adds $1.60 per additional mile. Every order needs a minimum of 2 hours preparation, with same-day delivery available for orders placed before 3PM Miami time.',
        },
      ],
      internalLinksTitle: 'Looking for flower delivery in surrounding areas? We also serve:',
      internalLinks: [
        { label: 'Flower Delivery Brickell', slug: 'flower-delivery-brickell' },
        { label: 'Flower Delivery Kendall', slug: 'flower-delivery-kendall' },
        { label: 'Flower Delivery Doral', slug: 'flower-delivery-doral' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: 'Order Coral Gables Flower Delivery Now',
      areaServed: 'Coral Gables, Miami',
    },
  },
  {
    slug: 'flower-delivery-doral',
    h1: 'Flower Delivery in Doral, Miami',
    seoTitle: "Flower Delivery Doral Miami | Bouquets to Homes & Offices | Charl's Flowers",
    seoDescription: 'Premium flower delivery in Doral. Service to Doral Isles, Trump National Doral, corporate offices and family homes. Bilingual service in English and Spanish.',
    intro: "Doral is one of Miami's fastest-growing communities, home to international corporate headquarters, family neighborhoods and the iconic Trump National Doral resort. Charl's Flowers delivers premium fresh bouquets across all of Doral — from the corporate parks along NW 87th Avenue to the residential gated communities of Doral Isles. We cover the 33122, 33166 and 33178 zip codes.",
    type: 'neighborhood',
    seo: {
      whyTitle: 'Why we deliver in Doral',
      whyParagraph: "Doral has a unique mix: multinational corporate offices (Carnival, Univision, Ryder, hundreds of Latin American HQs) and large family-oriented residential communities. We deliver to both worlds. For corporate clients, we handle reception arrangements, executive gifts and welcome bouquets for international visitors. For families, we deliver birthday flowers, quinceañera arrangements and Día de las Madres bouquets — often in Spanish on request, since over 70% of Doral residents speak Spanish at home.",
      zonesTitle: 'Areas we cover in Doral',
      zonesIntro: 'We deliver throughout Doral, including these specific areas:',
      zones: [
        'Trump National Doral Miami resort and golf club',
        'Doral Isles (Estancia, Antigua, Cayman, Marbella)',
        'Doral Park, Doral Estates',
        'Costa del Sol and Grand Bay at Doral',
        'Corporate offices along NW 87th Avenue and NW 36th Street',
        'CityPlace Doral and surrounding residences',
        'Downtown Doral and Doral Square',
        'Schools and family communities near Ronald W. Reagan / Doral Senior High',
      ],
      occasionsTitle: 'Popular occasions in Doral',
      occasionsIntro: 'Our Doral clients most commonly order flowers for:',
      occasions: [
        'Corporate gifts to multinational HQs (Carnival, Univision, Ryder and others)',
        'Birthday and anniversary deliveries to family homes',
        'Quinceañera arrangements and centerpieces',
        "Mother's Day and Día de las Madres bouquets",
        'Hotel guest welcome flowers at Trump National Doral',
        'Office reception and lobby weekly flower programs',
      ],
      deliveryTitle: 'Delivery information for Doral',
      deliveryParagraph: "Doral is one of the closest neighborhoods to our Miami atelier on NW 12th Street — most Doral addresses fall comfortably within our 0–5 mile flat zone, so delivery typically costs $20. Beyond 5 miles, the rate is $1.60 per additional mile, up to 87 miles total. Every order needs a minimum of 2 hours of preparation. For same-day delivery, place your order before 3PM Miami time; orders placed after the cutoff are scheduled for the next available window. Delivery hours are Monday to Friday 8AM–7PM, Saturday 8AM–6PM and Sunday 8AM–5PM. Free pickup is also available at 7261 NW 12th Street, Miami FL 33126. Full details on our shipping policy page.",
      faqTitle: 'Doral delivery FAQs',
      faqs: [
        {
          question: 'Do you take orders in Spanish? ¿Hacen entregas en español?',
          answer: "Yes. We take orders in both English and Spanish, and our delivery team is bilingual. Many of our Doral clients prefer to communicate in Spanish, and we're happy to do so.",
        },
        {
          question: 'Do you deliver to Trump National Doral resort?',
          answer: "Yes. We deliver to guest rooms, the resort's events and to private homes inside the Trump Doral community. We coordinate with the front desk for guest deliveries.",
        },
        {
          question: 'Can you deliver to a corporate office in Doral?',
          answer: 'Absolutely. We deliver to the major corporate parks along NW 87th Avenue and NW 36th Street, including offices for Carnival, Univision, Ryder, US Century Bank and many Latin American multinationals. We handle reception protocols for each building.',
        },
        {
          question: 'Do you do quinceañera arrangements?',
          answer: 'Yes — quinceañeras are one of our most popular services in Doral. We design ceremony bouquets, table centerpieces, the recuerdo flowers and entrance arrangements. We recommend booking in advance for full event setups.',
        },
      ],
      internalLinksTitle: 'Need flowers in nearby areas? We also serve:',
      internalLinks: [
        { label: 'Flower Delivery Hialeah', slug: 'flower-delivery-hialeah' },
        { label: 'Flower Delivery Brickell', slug: 'flower-delivery-brickell' },
        { label: 'Flower Delivery Coral Gables', slug: 'flower-delivery-coral-gables' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: 'Order Doral Flower Delivery Now',
      areaServed: 'Doral, Miami',
    },
  },
  {
    slug: 'flower-delivery-hialeah',
    h1: 'Flower Delivery in Hialeah | Entrega de Flores en Hialeah',
    seoTitle: "Flower Delivery Hialeah | Florería con Servicio Bilingüe | Charl's Flowers",
    seoDescription: 'Flores frescas a domicilio en Hialeah. Entrega a casas, oficinas, funerarias y hospitales. Ramos para cumpleaños, quinces y aniversarios. Servicio bilingüe.',
    intro: "Hialeah is the heart of Cuban-American Miami and one of the most tight-knit communities in South Florida — where every birthday, quinceañera, anniversary and funeral is honored with flowers. Charl's Flowers delivers fresh, premium arrangements across all of Hialeah and Hialeah Gardens, with bilingual service to homes, hospitals, funeral homes and offices. Pedidos en español bienvenidos.",
    type: 'neighborhood',
    seo: {
      whyTitle: 'Why we deliver in Hialeah',
      whyParagraph: "Hialeah has its own floral traditions that we understand and respect. We deliver regularly to Caballero Rivero Funeral Homes, Palm Springs Hospital, Hialeah Hospital and the family homes that fill the neighborhoods between West 49th Street and Okeechobee Road. Our team is fully bilingual, and we know that for our Hialeah clients, freshness and presentation matter as much as the gesture itself. Whether it's a cumpleaños bouquet, a corona for a viewing, or quinces centerpieces, we deliver with the care this community expects.",
      zonesTitle: 'Areas we cover in Hialeah',
      zonesIntro: 'We deliver throughout Hialeah and Hialeah Gardens, including:',
      zones: [
        'Hialeah Hospital and Palm Springs General Hospital',
        'Caballero Rivero Funeral Home (multiple Hialeah locations)',
        'Westchester General and surrounding medical offices',
        'Amelia Earhart Park area',
        'Hialeah Gardens residential communities',
        'Westland Mall and surrounding shops',
        'West Hialeah neighborhoods (West 49th Street corridor)',
        'Leah Arts District',
      ],
      occasionsTitle: 'Popular occasions in Hialeah',
      occasionsIntro: 'Our Hialeah clients most often order flowers for:',
      occasions: [
        'Cumpleaños — birthday bouquets for family members',
        'Quinceañeras — centerpieces, recuerdos and ceremony flowers',
        'Coronas funerarias — funeral wreaths and sympathy arrangements',
        'Aniversarios de boda — wedding anniversaries',
        'Día de las Madres y Día del Padre',
        'Hospital deliveries to Palm Springs and Hialeah Hospital',
      ],
      deliveryTitle: 'Delivery information for Hialeah',
      deliveryParagraph: "Our Miami atelier on NW 12th Street is right on the Hialeah border, so most Hialeah addresses fall within our 0–5 mile flat zone — delivery typically costs $20. Beyond 5 miles (deeper Hialeah Gardens or West Hialeah), the rate is $1.60 per additional mile, up to 87 miles total. Every order needs a minimum of 2 hours of preparation. For same-day delivery, place your order before 3PM Miami time; orders placed after the cutoff are scheduled for the next available window. Delivery hours are Monday to Friday 8AM–7PM, Saturday 8AM–6PM and Sunday 8AM–5PM. Free pickup is also available at 7261 NW 12th Street, Miami FL 33126. Full details on our shipping policy page.",
      faqTitle: 'Hialeah delivery FAQs',
      faqs: [
        {
          question: '¿Entregan coronas funerarias en funerarias de Hialeah?',
          answer: 'Sí. Entregamos coronas, cruces y arreglos funerarios en todas las funerarias de Hialeah, incluyendo las distintas sedes de Caballero Rivero. Coordinamos directamente con la funeraria para que la corona llegue antes del velorio.',
        },
        {
          question: '¿Pueden entregar flores en el Hialeah Hospital o Palm Springs?',
          answer: 'Por supuesto. Hacemos entregas a Hialeah Hospital, Palm Springs General y otros centros médicos del área. Solo necesitamos el nombre del paciente y el número de habitación si lo tienes; si no, lo gestionamos con recepción del hospital.',
        },
        {
          question: '¿Hacen arreglos para quinceañeras?',
          answer: 'Sí, las quinces son uno de nuestros servicios más solicitados en Hialeah. Diseñamos centros de mesa, ramos para la quinceañera, recuerdos y arreglos de entrada. Recomendamos reservar con antelación para eventos completos.',
        },
        {
          question: '¿Hablan español? ¿Atienden por WhatsApp?',
          answer: 'Sí, todo nuestro equipo es bilingüe. Puedes hacer tu pedido por teléfono, WhatsApp o directamente desde la web — como prefieras. Aceptamos pedidos en español sin problema. Entregas mínimo 2 horas tras el pedido; mismo día si pides antes de las 3PM hora de Miami.',
        },
      ],
      internalLinksTitle: '¿Necesitas flores en zonas cercanas? También entregamos en:',
      internalLinks: [
        { label: 'Flower Delivery Doral', slug: 'flower-delivery-doral' },
        { label: 'Flower Delivery Miami Beach', slug: 'flower-delivery-miami-beach' },
        { label: 'Flower Delivery Brickell', slug: 'flower-delivery-brickell' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: 'Pide tu Entrega de Flores en Hialeah',
      areaServed: 'Hialeah, Miami',
    },
  },
  {
    slug: 'flower-delivery-kendall',
    h1: 'Flower Delivery in Kendall, Miami',
    seoTitle: "Flower Delivery Kendall Miami | Bouquets to Homes & Hospitals | Charl's Flowers",
    seoDescription: 'Flower delivery to Kendall, Pinecrest and Palmetto Bay. Birthday, anniversary and sympathy bouquets to family homes, hospitals and schools.',
    intro: "Kendall is the suburban heart of Miami-Dade — a community of family homes, schools, parks and shopping centers stretching from the Palmetto Expressway to Pinecrest. Charl's Flowers delivers premium fresh arrangements across all of Kendall, Pinecrest and Palmetto Bay. We're the trusted choice for Kendall families who want flowers that are fresher and more thoughtfully designed than what supermarket florists offer.",
    type: 'neighborhood',
    seo: {
      whyTitle: 'Why we deliver in Kendall',
      whyParagraph: "Kendall residents tell us they switched to Charl's Flowers because they were tired of receiving flowers that looked tired the same evening. Our arrangements are made-to-order with flowers that arrive at our atelier mid-week, so what we deliver on Friday wasn't sitting in a cooler since Monday. We deliver to Kendall family homes, to Baptist Hospital and Doctors Hospital, to Dadeland Mall area offices and to schools across the area.",
      zonesTitle: 'Areas we cover in Kendall',
      zonesIntro: 'We deliver throughout Kendall and surrounding areas:',
      zones: [
        'Baptist Hospital of Miami and Doctors Hospital',
        'Dadeland Mall and Dadeland office towers',
        'Pinecrest residential homes (US-1 corridor)',
        'Palmetto Bay neighborhoods',
        'The Falls shopping center area',
        'Kendall Town Center and Kendall Village Center',
        'Kendall Lakes and West Kendall family communities',
        'Killian and Sunset corridor schools and homes',
      ],
      occasionsTitle: 'Popular occasions in Kendall',
      occasionsIntro: 'Our Kendall clients most often order flowers for:',
      occasions: [
        'Birthday bouquets to family homes',
        'Anniversary surprises for couples',
        'Get-well arrangements to Baptist Hospital and Doctors Hospital',
        'Teacher appreciation and graduation flowers for Kendall schools',
        "Mother's Day deliveries to multi-generational families",
        'Sympathy arrangements to local funeral homes and family residences',
      ],
      deliveryTitle: 'Delivery information for Kendall',
      deliveryParagraph: "Kendall sits roughly 8–15 miles from our Miami atelier depending on the address, so a typical Kendall delivery costs $20 for the first 5 miles plus $1.60 per additional mile — most addresses land in the $25–$35 range. Maximum delivery distance is 87 miles. Every order needs a minimum of 2 hours of preparation. For same-day delivery, place your order before 3PM Miami time; orders placed after the cutoff are scheduled for the next available window. Delivery hours are Monday to Friday 8AM–7PM, Saturday 8AM–6PM and Sunday 8AM–5PM. Free pickup is also available at 7261 NW 12th Street, Miami FL 33126. Full details on our shipping policy page.",
      faqTitle: 'Kendall delivery FAQs',
      faqs: [
        {
          question: 'Do you deliver to Baptist Hospital and Doctors Hospital?',
          answer: "Yes — we deliver to both hospitals. We coordinate with the patient's room number or with the front desk if you don't have it. For ICU or restricted units, we leave the arrangement at the nursing station with a delivery note.",
        },
        {
          question: 'Can you deliver to a Pinecrest or Palmetto Bay home?',
          answer: 'Absolutely. Pinecrest and Palmetto Bay are within our delivery zone. We deliver to private homes throughout the US-1 corridor, Old Cutler Road and the residential streets between SW 67th Avenue and SW 87th Avenue.',
        },
        {
          question: 'Do you deliver to Kendall schools for teacher gifts or graduations?',
          answer: 'Yes. We deliver to elementary, middle and high schools throughout Kendall — including Sunset, Coral Reef, Killian and Palmetto Senior. We coordinate with the school office for the handoff during school hours.',
        },
        {
          question: 'Do you cover West Kendall and Kendall Lakes?',
          answer: 'Yes — we cover West Kendall, Kendall Lakes and the SW 137th Avenue corridor. These addresses sit farther from our atelier, so the per-mile rate applies ($20 flat for the first 5 miles plus $1.60 per additional mile), but the rest of our policy is the same: 2-hour minimum preparation and same-day delivery for orders placed before 3PM Miami time.',
        },
      ],
      internalLinksTitle: 'Need flowers in nearby areas? We also serve:',
      internalLinks: [
        { label: 'Flower Delivery Coral Gables', slug: 'flower-delivery-coral-gables' },
        { label: 'Flower Delivery Doral', slug: 'flower-delivery-doral' },
        { label: 'Flower Delivery Brickell', slug: 'flower-delivery-brickell' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: 'Order Kendall Flower Delivery Now',
      areaServed: 'Kendall, Miami',
    },
  },
  {
    slug: 'flower-delivery-brickell',
    h1: 'Luxury Flower Delivery in Brickell, Miami',
    seoTitle: "Flower Delivery Brickell Miami | Luxury Bouquets to Condos & Hotels | Charl's Flowers",
    seoDescription: 'Premium flower delivery to Brickell condos, offices and hotels. Service to Brickell City Centre, Four Seasons, SLS, Mandarin Oriental and all Brickell Avenue.',
    intro: "Brickell is Miami's financial heart, full of high-rise condos, executive offices and luxury hotels where every detail matters. At Charl's Flowers we deliver premium fresh bouquets directly to Brickell Avenue, Brickell Key and Brickell City Centre, with the discretion and presentation that this neighborhood expects. Whether it's a corporate gift, a romantic surprise to a 30th-floor condo, or a hotel suite delivery for a guest, our service has Brickell covered.",
    type: 'neighborhood',
    seo: {
      whyTitle: 'Why we deliver in Brickell',
      whyParagraph: "Brickell concentrates more luxury condo towers per square mile than any other Miami neighborhood. Our delivery team knows the building protocols at Echo Brickell, Reach, Rise, SLS Lux, Brickell Flatiron and Panorama Tower — including doorman procedures and concierge handoff. We understand that timing matters when sending flowers to a busy executive at Brickell City Centre or to a guest checking into the Four Seasons. That local expertise is why we're the preferred florist for Brickell residents and the businesses that operate here.",
      zonesTitle: 'Areas we cover in Brickell',
      zonesIntro: 'We deliver across the entire Brickell area, including these specific buildings and zones:',
      zones: [
        'Brickell City Centre (offices and residences)',
        'Four Seasons Hotel & Tower Brickell',
        'SLS Brickell Hotel and SLS Lux',
        'Mandarin Oriental Miami (Brickell Key)',
        'Brickell Flatiron, Echo Brickell, Reach, Rise, Panorama Tower',
        '1010 Brickell, Icon Brickell, The Plaza on Brickell',
        'Office towers along Brickell Avenue and Brickell Bay Drive',
        'Brickell Key residential towers (Carbonell, Asia, Three Tequesta Point)',
        'Mary Brickell Village area',
      ],
      occasionsTitle: 'Popular occasions in Brickell',
      occasionsIntro: 'These are the most common reasons our Brickell clients order flowers from us:',
      occasions: [
        'Corporate gifts and client appreciation deliveries to Brickell offices',
        'Romantic surprises delivered to high-rise condos',
        'Hotel guest welcome bouquets at Four Seasons, SLS and Mandarin Oriental',
        'Birthday and anniversary deliveries to Brickell residents',
        'Sympathy and get-well arrangements to Mercy Hospital nearby',
        'Executive assistant orders for partners, VIP clients and board members',
      ],
      deliveryTitle: 'Delivery information for Brickell',
      deliveryParagraph: "Brickell sits within our core delivery radius from our Miami atelier, so most addresses fall close to our flat-rate zone. Our delivery rate is $20 for the first 0–5 miles and $1.60 per additional mile, up to 87 miles total. Every order needs a minimum of 2 hours of preparation. For same-day delivery, place your order before 3PM Miami time — orders placed after the cutoff are scheduled for the next available window. Our delivery hours are Monday to Friday 8AM–7PM, Saturday 8AM–6PM and Sunday 8AM–5PM. Free pickup is also available at 7261 NW 12th Street, Miami FL 33126. Full details are on our shipping policy page.",
      faqTitle: 'Brickell delivery FAQs',
      faqs: [
        {
          question: 'Do you deliver to Brickell City Centre offices?',
          answer: 'Yes. We deliver directly to the office towers at Brickell City Centre (Three Brickell City Centre, Two Brickell City Centre and SLS Lux). Our courier coordinates with reception or the security desk to ensure the recipient receives the bouquet personally during business hours.',
        },
        {
          question: 'Can you deliver to a guest staying at the Four Seasons or SLS Brickell?',
          answer: "Absolutely. We work regularly with Brickell luxury hotels and follow the concierge handoff process for each property. Just include the guest's full name and check-in date when ordering, and we coordinate directly with the concierge.",
        },
        {
          question: 'How is delivery handled at Brickell high-rise condos?',
          answer: "All major Brickell condos (Echo, Reach, Rise, Brickell Flatiron, Panorama, etc.) accept floral deliveries through their doorman or concierge. We follow each building's specific protocol so your bouquet always reaches the right resident.",
        },
        {
          question: 'What is your delivery timing policy for Brickell?',
          answer: 'Brickell orders follow our standard policy: a minimum of 2 hours preparation time, with same-day delivery available for orders placed before 3PM Miami time. Delivery rate is $20 for the first 0–5 miles and $1.60 per additional mile. Brickell typically falls within or close to our flat-rate zone from our NW 12th Street atelier. Delivery hours: Mon–Fri 8AM–7PM, Sat 8AM–6PM, Sun 8AM–5PM.',
        },
      ],
      internalLinksTitle: "If you're looking for flower delivery in nearby areas, we also serve:",
      internalLinks: [
        { label: 'Flower Delivery Miami Beach', slug: 'flower-delivery-miami-beach' },
        { label: 'Flower Delivery Coral Gables', slug: 'flower-delivery-coral-gables' },
        { label: 'Flower Delivery Wynwood', slug: 'flower-delivery-wynwood' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: 'Order Brickell Flower Delivery',
      areaServed: 'Brickell, Miami',
    },
  },
  {
    slug: 'flower-delivery-wynwood',
    h1: 'Flower Delivery in Wynwood, Miami',
    seoTitle: "Flower Delivery Wynwood Miami | Modern Bouquets & Event Florals | Charl's Flowers",
    seoDescription: 'Flower delivery to Wynwood galleries, studios, restaurants and lofts. Modern, design-forward arrangements for events, openings and content creation.',
    intro: "Wynwood is Miami's creative district — home to street art, design studios, galleries, restaurants and the loft residences of the city's creative class. Charl's Flowers delivers contemporary, design-forward arrangements across Wynwood, with service to galleries, photo studios, restaurants, offices and residential lofts. Our aesthetic — bold, sculptural, never traditional — fits Wynwood's energy.",
    type: 'neighborhood',
    seo: {
      whyTitle: 'Why we deliver in Wynwood',
      whyParagraph: "Wynwood clients aren't looking for a dozen red roses. They're looking for arrangements that match the visual language of the neighborhood: monochromatic palettes, unusual textures, sculptural lines, statement single-stem moments. We work with Wynwood galleries for opening night arrangements, with restaurants for weekly bar florals, with photographers and content creators for set design, and with the residents of NoMa lofts and Wynwood 25 for personal deliveries.",
      zonesTitle: 'Areas we cover in Wynwood',
      zonesIntro: 'We deliver throughout Wynwood, the Design District and Edgewater:',
      zones: [
        'Wynwood Walls and the surrounding gallery district',
        'NW 2nd Avenue corridor (galleries, studios, restaurants)',
        'Wynwood 25, NoMa and Wynwood Square residential',
        'The Wynwood Arts District co-working spaces',
        'Miami Design District (Palm Court, Paseo Ponti)',
        'Edgewater high-rises along Biscayne Bay',
        'Midtown Miami residential and retail',
        'Wynwood restaurants and venues',
      ],
      occasionsTitle: 'Popular occasions in Wynwood',
      occasionsIntro: 'Our Wynwood clients most often order flowers for:',
      occasions: [
        'Gallery opening receptions and art events',
        'Restaurant weekly bar and host stand arrangements',
        'Photo shoots, content creation and brand activations',
        'Loft and condo housewarmings',
        'Office openings and brand launches',
        'Birthday surprises and gifts to creative professionals',
      ],
      deliveryTitle: 'Delivery information for Wynwood',
      deliveryParagraph: "Wynwood sits within easy range of our Miami atelier — typical deliveries fall just inside or near our 0–5 mile flat zone, so most Wynwood addresses cost $20. For zones slightly farther into Edgewater or the Design District beyond 5 miles, the rate adds $1.60 per additional mile, up to 87 miles total. Every order needs a minimum of 2 hours of preparation. For same-day delivery, place your order before 3PM Miami time; orders placed after the cutoff are scheduled for the next available window. Delivery hours are Monday to Friday 8AM–7PM, Saturday 8AM–6PM and Sunday 8AM–5PM. Free pickup is also available at 7261 NW 12th Street, Miami FL 33126. Full details on our shipping policy page.",
      faqTitle: 'Wynwood delivery FAQs',
      faqs: [
        {
          question: 'Do you provide flowers for gallery openings or art events?',
          answer: 'Yes — Wynwood galleries are some of our regular clients. We provide reception arrangements, sculptural pieces that complement the artwork on display, and statement entry florals. We recommend booking in advance for full event setups.',
        },
        {
          question: 'Can you deliver weekly flowers to a Wynwood restaurant or office?',
          answer: 'Yes. We run weekly subscription programs for restaurants, hotels and offices in Wynwood. Fresh delivery on a recurring schedule, with arrangements designed for high-traffic visibility (bar tops, host stands, lobbies).',
        },
        {
          question: 'Do you work with photographers and content creators?',
          answer: "Absolutely. We're regularly booked for editorial shoots, brand campaigns and social content in Wynwood studios. We can match a specific brief, mood board or color palette — just send the reference and we'll design accordingly.",
        },
        {
          question: 'Do you deliver to the Design District?',
          answer: 'Yes — the Design District is part of our Wynwood delivery zone. We deliver to retail boutiques, the residential towers and to Palm Court events. Most Design District addresses fall within our $20 flat-rate zone (0–5 miles from our NW 12th Street atelier); addresses beyond 5 miles add $1.60 per additional mile. Standard policy applies: 2-hour minimum prep and 3PM Miami time cutoff for same-day.',
        },
      ],
      internalLinksTitle: 'Need flowers in nearby areas? We also serve:',
      internalLinks: [
        { label: 'Flower Delivery Brickell', slug: 'flower-delivery-brickell' },
        { label: 'Flower Delivery Miami Beach', slug: 'flower-delivery-miami-beach' },
        { label: 'Flower Delivery Coral Gables', slug: 'flower-delivery-coral-gables' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: 'Order Wynwood Flower Delivery Now',
      areaServed: 'Wynwood, Miami',
    },
  },
  {
    slug: 'flower-delivery-miami-beach',
    h1: 'Luxury Flower Delivery in Miami Beach',
    seoTitle: "Flower Delivery Miami Beach | Hotel & Condo Luxury Florals | Charl's Flowers",
    seoDescription: 'Premium flower delivery to Miami Beach hotels, condos and residences. Service to South Beach, Mid-Beach, North Beach, Fisher Island and Sunset Harbour.',
    intro: "Miami Beach is where Miami's glamour lives — from the Art Deco hotels of Ocean Drive to the oceanfront condos of Mid-Beach and the private estates of North Bay Road. Charl's Flowers delivers premium, design-forward arrangements across all of Miami Beach. We work directly with concierge teams at the Faena, Setai, Edition, Fontainebleau, W South Beach and dozens of other Miami Beach properties.",
    type: 'neighborhood',
    seo: {
      whyTitle: 'Why we deliver in Miami Beach',
      whyParagraph: "Miami Beach is a destination — meaning many of our orders are surprises for guests staying at hotels, romantic gestures to condo residents, or events at private estates. We've built relationships with the concierge teams at all major Miami Beach hotels, which means delivery is fast, discreet and properly handed off. We also know which buildings on Collins Avenue, Ocean Drive and West Avenue have specific delivery protocols, so your bouquet doesn't sit at security for hours.",
      zonesTitle: 'Areas we cover in Miami Beach',
      zonesIntro: 'We deliver across all of Miami Beach, including:',
      zones: [
        'South Beach (1st–23rd Street, Ocean Drive, Collins, Washington)',
        'Mid-Beach (Faena District, Fontainebleau, Eden Roc, Edition)',
        'North Beach and Surfside',
        'Fisher Island (driver coordinates ferry — standard delivery rate, no surcharge)',
        'Star Island, Hibiscus Island and Palm Island',
        'South of Fifth (SoFi)',
        'Sunset Harbour and West Avenue condos',
        'Bal Harbour Shops area',
      ],
      occasionsTitle: 'Popular occasions in Miami Beach',
      occasionsIntro: 'Our Miami Beach clients most often order flowers for:',
      occasions: [
        'Hotel guest welcome bouquets and in-room surprises',
        'Romantic surprises to oceanfront condos',
        'Birthday and anniversary deliveries to Miami Beach residents',
        'Wedding and event flowers at Faena, Edition and Setai',
        'Photoshoot and content creation florals',
        'Yacht and superyacht deliveries at Miami Beach Marina',
      ],
      deliveryTitle: 'Delivery information for Miami Beach',
      deliveryParagraph: "Miami Beach addresses sit roughly 8–12 miles from our atelier across the causeways, so most deliveries cost $20 (for the first 5 miles) plus $1.60 per additional mile — typically landing in the $25–$32 range. Maximum delivery distance is 87 miles. Every order needs a minimum of 2 hours of preparation. For same-day delivery, place your order before 3PM Miami time — orders placed after the cutoff are scheduled for the next available window. Delivery hours are Monday to Friday 8AM–7PM, Saturday 8AM–6PM and Sunday 8AM–5PM. Free pickup is also available at 7261 NW 12th Street, Miami FL 33126. Fisher Island deliveries are charged at the standard rate — our driver handles the ferry coordination at no extra cost. Full details on our shipping policy page.",
      faqTitle: 'Miami Beach delivery FAQs',
      faqs: [
        {
          question: 'Do you deliver to hotels like Faena, Setai or Edition?',
          answer: 'Yes — we deliver to all major Miami Beach hotels including Faena, The Setai, The Edition, Fontainebleau, W South Beach, 1 Hotel, Eden Roc and many more. We coordinate with the concierge for in-room delivery or guest pickup.',
        },
        {
          answer: "Yes. Fisher Island is only accessible by ferry, but our driver handles the ferry coordination directly with the island's security — there is no additional charge. The standard delivery rate applies ($20 for the first 5 miles plus $1.60 per additional mile), calculated from our atelier to the island.",
        },
        {
          question: 'Do you deliver to yachts at Miami Beach Marina?',
          answer: 'Yes. We coordinate with the marina office and the yacht\'s captain or crew to ensure timely delivery. Common for charter welcomes and onboard celebrations.',
        },
        {
          question: 'How does delivery work for Miami Beach addresses?',
          answer: 'Miami Beach addresses are typically 8–12 miles from our atelier across the causeways, so most deliveries land in the $25–$32 range ($20 for the first 5 miles plus $1.60 per additional mile). The exact cost is calculated at checkout. Every order needs a minimum of 2 hours preparation, and same-day delivery requires placing your order before 3PM Miami time. Delivery hours: Mon–Fri 8AM–7PM, Sat 8AM–6PM, Sun 8AM–5PM.',
        },
      ],
      internalLinksTitle: 'Need flowers in nearby areas? We also serve:',
      internalLinks: [
        { label: 'Flower Delivery Brickell', slug: 'flower-delivery-brickell' },
        { label: 'Flower Delivery Wynwood', slug: 'flower-delivery-wynwood' },
        { label: 'Flower Delivery Coral Gables', slug: 'flower-delivery-coral-gables' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: 'Order Miami Beach flower delivery now',
      areaServed: 'Miami Beach, Florida',
    },
  },
  {
    slug: 'flower-delivery-aventura',
    h1: 'Flower Delivery Aventura | Same-Day – Charls Flowers Miami',
    seoTitle: 'Flower Delivery Aventura | Same-Day Roses – Charls Flowers',
    seoDescription: 'Same-day flower delivery to Aventura from Charls Flowers Miami. Custom bouquets, glitter or natural finish. Order before 3PM.',
    intro: 'Order premium rose bouquets for delivery to Aventura from Charls Flowers. Same-day service available for orders placed before 3PM. From romantic red roses to vibrant mixed arrangements, we offer the largest selection of handcrafted bouquets in Miami — 50 to 200 roses per bouquet with natural, glitter, or painted finish.',
    type: 'neighborhood',
  },
  // Seasonal pages
  {
    slug: 'valentines-day-flowers-miami',
    h1: "Valentine's Day Flowers Miami | Same-Day Delivery – Charls Flowers",
    seoTitle: "Valentine's Day Flowers Miami | Same-Day Delivery – Charls Flowers",
    seoDescription: "Order Valentine's Day flowers in Miami with same-day delivery. Handcrafted rose bouquets from 50 to 200 roses. Glitter or natural finish. Order before 3PM.",
    intro: "Make this Valentine's Day unforgettable with a premium handcrafted bouquet from Charls Flowers. We offer the largest selection of rose bouquets in Miami — from classic red roses to custom mixed arrangements. Choose from 50 to 200 roses with natural, glitter, or painted finish. Same-day delivery available across Miami when you order before 3PM. Don't wait until the last minute — order your Valentine's Day flowers today.",
    type: 'seasonal',
  },
  {
    slug: 'mothers-day-bouquets-miami',
    h1: "Mother's Day Bouquets — Miami Delivery",
    seoTitle: "Mother's Day Flowers Miami | Luxury Bouquet Delivery | Charl's Flowers",
    seoDescription: "Premium Mother's Day bouquets delivered across Miami. Hand-designed arrangements for moms, grandmothers and mother figures. Bilingual cards available.",
    intro: "Mother's Day is the busiest flower delivery day of the year in Miami — and the day where freshness, presentation and on-time delivery matter most. Charl's Flowers designs premium Mother's Day bouquets in our Miami atelier, with delivery across Brickell, Coral Gables, Miami Beach, Doral, Kendall, Hialeah and the rest of the city. Order early to guarantee your delivery window — Mother's Day fills up fast.",
    type: 'seasonal',
    seo: {
      whyTitle: "Why order Mother's Day flowers from us",
      whyParagraph: "Every Mother's Day, thousands of Miami families order flowers — and most wire-service florists run out of fresh stock by Saturday morning. Because we design every arrangement in our own atelier and source our flowers a full week in advance specifically for Mother's Day, we don't run out. We also expand our delivery team for the holiday weekend, meaning your mom's bouquet arrives on the day, in the time window you specified — not three days late or wilted.",
      zonesTitle: "Mother's Day delivery across Miami",
      zonesIntro: "We deliver Mother's Day bouquets across all of Miami:",
      zones: [
        'Brickell condos, Coral Gables family homes, Miami Beach properties',
        'Hialeah and Doral homes (Día de las Madres bilingual service)',
        'Kendall, Pinecrest and Palmetto Bay residential deliveries',
        'Wynwood lofts and Edgewater high-rises',
        'Aventura, Sunny Isles and Bal Harbour on request',
        'Miami hospitals (Baptist, Mercy, Mount Sinai) for moms in care',
      ],
      occasionsTitle: "Most popular Mother's Day designs",
      occasionsIntro: 'Most popular Mother\'s Day designs:',
      occasions: [
        'Classic peony and garden rose bouquets in soft pinks and creams',
        'Bold tropical arrangements with anthurium, protea and orchids',
        'Long-lasting orchid plants in luxury vessels',
        'Multi-bouquet sends (one for mom + one for grandma or mother-in-law)',
        'Custom-color arrangements matched to her favorite palette',
        'Bilingual cards in English and Spanish for Día de las Madres',
      ],
      deliveryTitle: "Mother's Day delivery information",
      deliveryParagraph: "We deliver across Miami-Dade up to 87 miles from our atelier. Delivery rate is $20 for the first 0–5 miles and $1.60 per additional mile. Every order needs a minimum of 2 hours of preparation. For same-day delivery on Mother's Day weekend, place your order before 3PM Miami time — but we strongly recommend pre-ordering at least 2–3 days in advance, since Mother's Day is our busiest delivery day and same-day windows fill up fast. Delivery hours are Monday to Friday 8AM–7PM, Saturday 8AM–6PM and Sunday 8AM–5PM (yes, we deliver on Mother's Day Sunday). Free pickup is also available at 7261 NW 12th Street, Miami FL 33126. Full details on our shipping policy page.",
      faqTitle: "Mother's Day flower FAQs",
      faqs: [
        {
          question: "When should I order Mother's Day flowers in Miami?",
          answer: "Ideally one week before Mother's Day. We accept Mother's Day orders up to the morning of (with our 2-hour minimum preparation window and the 3PM same-day cutoff), but specific time windows and premium designs sell out by the Wednesday before. The earlier you order, the more flexibility you have on delivery timing.",
        },
        {
          question: "Can I send flowers to my mom in another part of Miami while I'm away?",
          answer: 'Yes — this is exactly what we do. Many of our Mother\'s Day orders come from clients in New York, California or abroad sending flowers to moms in Miami. We deliver to any Miami neighborhood with full updates and photos when requested.',
        },
        {
          question: 'Do you offer bilingual Día de las Madres cards?',
          answer: 'Yes. All our Mother\'s Day cards can be written in English or Spanish, and we have a selection of pre-designed Día de las Madres options. For Hispanic families across Miami this is one of our most-requested details.',
        },
        {
          question: "Can I send Mother's Day flowers to my mom in the hospital?",
          answer: 'Yes. We deliver to Baptist Hospital, Mercy Hospital, Mount Sinai, Jackson Memorial and other Miami hospitals — and Mother\'s Day is no exception. Just provide the patient name and room number. Standard delivery rates apply ($20 for the first 5 miles plus $1.60 per additional mile).',
        },
      ],
      internalLinksTitle: 'Other categories you might be interested in:',
      internalLinks: [
        { label: 'Gender Reveal Flowers Miami', slug: 'gender-reveal-flowers-miami' },
        { label: 'Flower Delivery Coral Gables', slug: 'flower-delivery-coral-gables' },
        { label: 'Flower Delivery Hialeah (Día de las Madres)', slug: 'flower-delivery-hialeah' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: "Order Mother's Day flowers now",
      areaServed: 'Miami, Florida',
    },
  },
  // Niche pages
  {
    slug: 'flower-shop-miami',
    h1: "Charl's Flowers — Miami's Luxury Flower Shop",
    seoTitle: "Flower Shop Miami | Luxury Florist with Citywide Delivery | Charl's Flowers",
    seoDescription: "Charl's Flowers is Miami's luxury florist. Delivery to Brickell, Miami Beach, Coral Gables, Wynwood, Doral, Kendall and Hialeah. Premium arrangements made fresh daily.",
    intro: "Charl's Flowers is a Miami-based luxury florist delivering premium fresh arrangements across all of Miami-Dade. We're not a wire service or a marketplace — every bouquet is designed and arranged in our Miami atelier, using flowers sourced fresh each week. Citywide delivery to Brickell, Miami Beach, Coral Gables, Wynwood, Doral, Kendall, Hialeah and the surrounding neighborhoods.",
    type: 'niche',
    seo: {
      whyTitle: 'Why order from us in Miami',
      whyParagraph: "Most flower deliveries in Miami come from wire services that pass orders to the cheapest available florist — meaning what arrives often doesn't match the photo. We work differently: every order goes through our atelier, where each arrangement is designed by hand. Our flowers arrive directly from premium growers (Ecuador, Holland and local Florida farms) and are stored in cooled conditions until designed. The result is arrangements that last longer, look fresher and arrive looking like the photo.",
      zonesTitle: 'Areas we cover across Miami',
      zonesIntro: 'We deliver to every major Miami neighborhood, including:',
      zones: [
        'Brickell — luxury condos, offices and hotels',
        'Miami Beach — South Beach, Mid-Beach, North Beach and Fisher Island',
        'Coral Gables — homes, weddings and Biltmore Hotel area',
        'Wynwood and Design District — galleries, studios and lofts',
        'Doral — corporate offices and family homes',
        'Kendall, Pinecrest and Palmetto Bay — residential deliveries',
        'Hialeah and Hialeah Gardens — bilingual service',
        'Edgewater, Midtown, Aventura, Sunny Isles (on request)',
      ],
      occasionsTitle: 'Popular occasions across Miami',
      occasionsIntro: 'What our Miami clients order most often:',
      occasions: [
        'Birthday and anniversary deliveries',
        'Corporate gifts and weekly office programs',
        'Hotel guest welcome bouquets',
        'Wedding flowers and event florals',
        'Sympathy arrangements and funeral flowers',
        'Photoshoot and content creation florals',
      ],
      deliveryTitle: 'Delivery information across Miami',
      deliveryParagraph: "We deliver across Miami-Dade up to 87 miles from our atelier. Our delivery rate is $20 for the first 0–5 miles and $1.60 per additional mile. Every order needs a minimum of 2 hours of preparation. Same-day delivery is available for orders placed before 3PM Miami time; orders placed after the cutoff are scheduled for the next available window. Delivery hours are Monday to Friday 8AM–7PM, Saturday 8AM–6PM and Sunday 8AM–5PM. Free in-store pickup is available at 7261 NW 12th Street, Miami FL 33126. Full details on our shipping policy page.",
      faqTitle: 'Miami flower shop FAQs',
      faqs: [
        {
          question: "What makes Charl's Flowers different from other Miami florists?",
          answer: "Three things: every arrangement is designed by hand in our Miami atelier (no wire service handoffs), our flowers arrive fresh weekly from premium growers, and our delivery team knows the protocols at Miami's hotels, condo towers and gated communities — meaning your bouquet arrives properly and on time.",
        },
        {
          question: 'Which Miami neighborhoods do you deliver to?',
          answer: 'We deliver to every major Miami-Dade neighborhood including Brickell, Miami Beach, Coral Gables, Wynwood, Design District, Doral, Kendall, Pinecrest, Palmetto Bay, Hialeah, Edgewater, Midtown, Aventura and Sunny Isles. Each neighborhood has a dedicated page with specific delivery details.',
        },
        {
          question: 'What are your delivery times and costs?',
          answer: 'Our delivery rate is $20 for the first 0–5 miles and $1.60 per additional mile, up to 87 miles total. Every order requires a minimum of 2 hours preparation. Same-day delivery is available for orders placed before 3PM Miami time. Delivery hours: Monday to Friday 8AM–7PM, Saturday 8AM–6PM and Sunday 8AM–5PM. Free pickup is available at 7261 NW 12th Street, Miami FL 33126.',
        },
        {
          question: 'Do you offer corporate or weekly subscription programs?',
          answer: 'Yes. We work with hotels, restaurants, offices and showrooms across Miami on weekly fresh flower programs. Custom designs, rotating palettes, and dedicated delivery slots. Contact us for a corporate quote.',
        },
      ],
      internalLinksTitle: 'Browse our delivery pages by neighborhood:',
      internalLinks: [
        { label: 'Flower Delivery Brickell', slug: 'flower-delivery-brickell' },
        { label: 'Flower Delivery Miami Beach', slug: 'flower-delivery-miami-beach' },
        { label: 'Flower Delivery Coral Gables', slug: 'flower-delivery-coral-gables' },
        { label: 'Flower Delivery Wynwood', slug: 'flower-delivery-wynwood' },
        { label: 'Flower Delivery Doral', slug: 'flower-delivery-doral' },
        { label: 'Flower Delivery Kendall', slug: 'flower-delivery-kendall' },
        { label: 'Flower Delivery Hialeah', slug: 'flower-delivery-hialeah' },
      ],
      ctaLabel: 'Browse Our Collections',
      areaServed: 'Miami, Florida',
    },
  },
  {
    slug: 'quinceanera-bouquets-miami',
    h1: 'Quinceanera Bouquets Miami | Custom Arrangements – Charls Flowers',
    seoTitle: 'Quinceanera Bouquets Miami | Custom Rose Arrangements – Charls Flowers',
    seoDescription: 'Custom quinceañera bouquets in Miami. Choose colors, quantity and finish. AI preview available. Same-day delivery or free pickup.',
    intro: "Celebrate her quinceañera with a stunning bouquet from Charls Flowers. Our custom bouquet builder lets you design the perfect arrangement — choose her favorite colors, paper wrapping, quantity (50-200 roses), and finish (natural, glitter, or painted). Add special accessories like crowns, butterflies, or personalized ribbons. Preview your bouquet with AI before ordering. Same-day delivery available across Miami.",
    type: 'niche',
  },
  {
    slug: 'gender-reveal-flowers-miami',
    h1: 'Gender Reveal Flowers in Miami',
    seoTitle: "Gender Reveal Flowers Miami | Pink & Blue Bouquets | Charl's Flowers",
    seoDescription: 'Custom gender reveal flower arrangements in Miami. Pink, blue or hidden-color reveal bouquets and centerpieces. Delivery to Miami homes and event venues.',
    intro: "A gender reveal is one of the most photographed moments of a pregnancy — and the flowers should match the magic. Charl's Flowers designs custom gender reveal arrangements in Miami: bold pink-or-blue bouquets, hidden-color reveal pieces, party centerpieces and statement entrance florals. Available across Miami for last-minute reveals, with full event setups available with advance notice.",
    type: 'niche',
    seo: {
      whyTitle: 'Why order gender reveal flowers from us',
      whyParagraph: "We've designed gender reveal florals for hundreds of Miami families, and we know the small details that make the photos better: how saturated the pink or blue should be to read on camera, how to design reveal arrangements that work for both possible outcomes, and how to coordinate with cake designers and balloon vendors so the whole reveal aesthetic is cohesive. Whether the reveal is at home in Coral Gables, at a venue in Wynwood, or at a beach setup in Miami Beach, our team designs florals that hold up under the South Florida heat and look stunning in every photo.",
      zonesTitle: 'Gender reveal delivery across Miami',
      zonesIntro: 'We deliver gender reveal flowers across all of Miami:',
      zones: [
        'Home reveals across Brickell, Coral Gables, Doral, Kendall, Hialeah',
        'Beach setup reveals at Miami Beach and Key Biscayne',
        'Venue reveals at Wynwood event spaces and private clubs',
        'Hotel reveals at Faena, Edition, Fontainebleau and other Miami Beach properties',
        'Restaurant private dining rooms across the city',
      ],
      occasionsTitle: 'Popular gender reveal floral options',
      occasionsIntro: 'Our most popular gender reveal floral options:',
      occasions: [
        "Pink-or-blue reveal bouquet (we know, you don't, until the moment)",
        'Centerpieces in coordinated pink or blue palettes once gender is known',
        'Entrance floral arches or statement pieces for the reveal venue',
        'Cake table floral surrounds',
        'Photo backdrop floral installations',
        'Take-home mini bouquets for guests as party favors',
      ],
      deliveryTitle: 'Gender reveal delivery information',
      deliveryParagraph: "We deliver across Miami-Dade up to 87 miles from our atelier. Delivery rate is $20 for the first 0–5 miles and $1.60 per additional mile. Every order needs a minimum of 2 hours of preparation. For same-day delivery on a single reveal bouquet, place your order before 3PM Miami time — orders placed after the cutoff are scheduled for the next available window. For full event setups (arches, centerpieces and installations), we recommend booking at least 1–2 weeks in advance so we can coordinate design, sourcing and on-site setup. Delivery hours are Monday to Friday 8AM–7PM, Saturday 8AM–6PM and Sunday 8AM–5PM. Free pickup is also available at 7261 NW 12th Street, Miami FL 33126. Full details on our shipping policy page.",
      faqTitle: 'Gender reveal flower FAQs',
      faqs: [
        {
          question: 'Can you keep the gender a secret from us until the reveal?',
          answer: "Yes — this is one of our most-requested services. The parents-to-be share the gender confidentially with us (or have their doctor or a friend share it directly), and we design the arrangement so that you don't know what's inside until the moment of the reveal. We're very experienced at keeping the surprise.",
        },
        {
          question: 'How far in advance should we book gender reveal flowers?',
          answer: 'For a single reveal bouquet, our standard 2-hour minimum preparation window applies and same-day delivery is available for orders placed before 3PM Miami time. For full event setups with arches, centerpieces and floral installations, we recommend booking at least 1–2 weeks in advance so we can coordinate design, sourcing and on-site setup with you.',
        },
        {
          question: 'Do you coordinate with cake designers and balloon vendors?',
          answer: "Yes — we regularly coordinate with Miami's top cake designers and event vendors so that the whole reveal aesthetic is cohesive. Just connect us and we'll handle the rest.",
        },
        {
          question: 'Can you deliver to a beach reveal at Miami Beach or Key Biscayne?',
          answer: "Yes. Beach setups require some specific design choices (heat-tolerant flowers, weighted bases that won't blow over) but we've done many of them. Allow extra setup time and let us know about parking access at the beach location.",
        },
      ],
      internalLinksTitle: 'Other event services we offer in Miami:',
      internalLinks: [
        { label: "Mother's Day Bouquets Miami", slug: 'mothers-day-bouquets-miami' },
        { label: 'Flower Delivery Coral Gables', slug: 'flower-delivery-coral-gables' },
        { label: 'Flower Delivery Miami Beach', slug: 'flower-delivery-miami-beach' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: 'Book your gender reveal flowers',
      areaServed: 'Miami, Florida',
    },
  },
  {
    slug: '100-roses-bouquet-miami',
    h1: '100 Roses Bouquet Miami | Premium Arrangements – Charls Flowers',
    seoTitle: '100 Roses Bouquet Miami | Premium Rose Arrangements – Charls Flowers',
    seoDescription: 'Order a stunning 100 roses bouquet in Miami. Choose your color, finish and paper. Same-day delivery up to 87 miles. Custom AI preview.',
    intro: "A 100-rose bouquet makes a powerful statement. At Charls Flowers, our 100-rose arrangements are handcrafted with the freshest roses and available in every color — white, red, pink, hot pink, yellow, orange, purple, and painted options like black, blue, and green. Choose your finish (natural, glitter, or painted), paper color, and add accessories like crowns, ribbons, or butterflies. Preview your bouquet with AI before ordering. Same-day delivery across Miami up to 87 miles.",
    type: 'niche',
  },
];

export const getLandingPage = (slug: string): LandingPageData | undefined =>
  landingPages.find(p => p.slug === slug);
