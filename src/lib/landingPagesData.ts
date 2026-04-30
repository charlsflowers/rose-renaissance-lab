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
    h1: 'Flower Delivery Coral Gables | Same-Day – Charls Flowers Miami',
    seoTitle: 'Flower Delivery Coral Gables | Same-Day Roses – Charls Flowers',
    seoDescription: 'Same-day flower delivery to Coral Gables from Charls Flowers Miami. Fresh bouquets from 50 to 200 roses. Order before 3PM for delivery today.',
    intro: 'Looking for same-day flower delivery in Coral Gables? Charls Flowers delivers handcrafted bouquets from 50 to 200 roses directly to your door in Coral Gables. Choose from single color, mixed, or zodiac-inspired arrangements with natural, glitter, or painted finish. Our custom bouquet builder with AI preview lets you design exactly what you want. Order before 3PM and we\'ll deliver your bouquet today.',
    type: 'neighborhood',
    seo: {
      whyTitle: 'Why we deliver in Coral Gables',
      whyParagraph: "Coral Gables is one of Miami's most refined neighborhoods — Mediterranean architecture, tree-lined boulevards, gated estates and the iconic Biltmore Hotel. The deliveries we make here are different: weddings at Coral Gables Country Club, anniversary surprises along Coral Way, corporate gifts to law firms on Ponce de Leon Boulevard, and welcome bouquets to suites at the Biltmore and Hotel Colonnade. Our team knows the building protocols of the area and the discretion that residents and businesses in The Gables expect.",
      zonesTitle: 'Areas we cover in Coral Gables',
      zonesIntro: 'We deliver across the entire City Beautiful, including these specific zones and landmarks:',
      zones: [
        'Biltmore Hotel and Biltmore Way residences',
        'Hotel Colonnade and Loews Coral Gables',
        'Miracle Mile and the Downtown Coral Gables business district',
        'Ponce de Leon Boulevard offices and law firms',
        'Coral Gables Country Club and golf course estates',
        'Cocoplum, Gables Estates and Old Cutler Bay',
        'Granada Boulevard, Riviera and Coral Way residential streets',
        'Merrick Park, Village of Merrick Park shops and offices',
        'University of Miami area (Coral Gables campus)',
      ],
      occasionsTitle: 'Popular occasions in Coral Gables',
      occasionsIntro: 'These are the most common reasons our Coral Gables clients order flowers from us:',
      occasions: [
        'Wedding ceremonies and bridal bouquets at the Biltmore and country clubs',
        'Anniversary surprises delivered to historic estates',
        'Corporate gifts and client thank-yous to Ponce de Leon law and finance offices',
        'Birthday and graduation deliveries to UM students and families',
        'Hotel guest welcome bouquets at the Biltmore, Loews and Colonnade',
        'Sympathy arrangements to local funeral homes and chapels',
      ],
      deliveryTitle: 'Delivery information for Coral Gables',
      deliveryParagraph: "Coral Gables sits within close range of our Miami atelier — most addresses fall right around our 0–5 mile flat zone, so delivery to The Gables typically costs $20. Beyond 5 miles, the rate is $1.60 per additional mile, up to 87 miles total. Every order needs a minimum of 2 hours of preparation. For same-day delivery, place your order before 3PM Miami time — orders placed after the cutoff are scheduled for the next available window. Delivery hours are Monday to Friday 8AM–7PM, Saturday 8AM–6PM and Sunday 8AM–5PM. Free pickup is also available at 7261 NW 12th Street, Miami FL 33126. Full details on our shipping policy page.",
      faqTitle: 'Coral Gables delivery FAQs',
      faqs: [
        {
          question: 'Do you deliver to the Biltmore Hotel and other Coral Gables hotels?',
          answer: "Yes. We deliver regularly to the Biltmore Hotel, Hotel Colonnade and Loews Coral Gables. Just include the guest's full name and check-in date when ordering, and our courier coordinates handoff with the hotel concierge.",
        },
        {
          question: 'Can you deliver to gated estates in Cocoplum or Gables Estates?',
          answer: "Yes. We deliver inside Coral Gables' gated communities (Cocoplum, Gables Estates, Old Cutler Bay, Hammock Lakes). The recipient simply needs to authorize entry with their gatehouse, or we coordinate directly with security if you provide a contact at booking.",
        },
        {
          question: 'Can I order wedding flowers for a Coral Gables venue?',
          answer: 'Yes. We work with weddings and private events at the Biltmore, Coral Gables Country Club, the Westin Colonnade and private estates across The Gables. For full event florals (ceremony arch, centerpieces, bridal bouquets) please contact us directly so we can build a custom proposal.',
        },
        {
          question: 'How much does delivery to Coral Gables cost?',
          answer: 'Most Coral Gables addresses fall within our $20 flat-rate zone (0–5 miles from our NW 12th Street atelier). For zones farther into South Coral Gables or Old Cutler, the rate adds $1.60 per additional mile. Every order requires a minimum of 2 hours preparation, and same-day delivery is available for orders placed before 3PM Miami time. Delivery hours: Mon–Fri 8AM–7PM, Sat 8AM–6PM, Sun 8AM–5PM.',
        },
      ],
      internalLinksTitle: "If you're looking for flower delivery in nearby areas, we also serve:",
      internalLinks: [
        { label: 'Flower Delivery Brickell', slug: 'flower-delivery-brickell' },
        { label: 'Flower Delivery Kendall', slug: 'flower-delivery-kendall' },
        { label: 'Flower Delivery Doral', slug: 'flower-delivery-doral' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: 'Order Coral Gables Flower Delivery',
      areaServed: 'Coral Gables, Miami',
    },
  },
  {
    slug: 'flower-delivery-doral',
    h1: 'Flower Delivery Doral | Same-Day – Charls Flowers Miami',
    seoTitle: 'Flower Delivery Doral | Same-Day Roses – Charls Flowers',
    seoDescription: 'Same-day flower delivery to Doral from Charls Flowers Miami. Handcrafted bouquets, glitter or natural finish. Order before 3PM.',
    intro: 'Need fresh flowers delivered to Doral? Charls Flowers offers same-day flower delivery throughout Doral and surrounding areas. Our handcrafted rose bouquets range from 50 to 200 roses with your choice of natural, glitter, or painted finish. Whether it\'s a birthday, anniversary, or just because — we\'ve got the perfect bouquet. Order before 3PM for delivery today.',
    type: 'neighborhood',
    seo: {
      whyTitle: 'Why we deliver in Doral',
      whyParagraph: "Doral is one of Miami's fastest-growing business hubs, home to international corporate offices, Trump National Doral, and a strong residential community of professionals and families. Our atelier on NW 12th Street is just minutes away, which means we deliver corporate gifts to Doral business parks, executive welcomes to Trump Doral resort guests, and birthday surprises to homes around CityPlace Doral and Downtown Doral with very fast turnaround. Our team knows Doral's office complexes and gated neighborhoods well.",
      zonesTitle: 'Areas we cover in Doral',
      zonesIntro: 'We deliver across the entire Doral area, including these specific zones:',
      zones: [
        'Trump National Doral Miami (resort and event spaces)',
        'CityPlace Doral and Downtown Doral residential and retail',
        'Doral Park, Costa del Sol and Doral Isles communities',
        'Doral Cay, Doral Glen and gated residential subdivisions',
        'Office parks along NW 36th Street and NW 87th Avenue',
        'Miami International Mall and surrounding business area',
        'Doral business district near NW 41st Street and the Palmetto',
        'Lennar Headquarters and corporate offices around Doral Boulevard',
      ],
      occasionsTitle: 'Popular occasions in Doral',
      occasionsIntro: 'These are the most common reasons our Doral clients order flowers from us:',
      occasions: [
        'Corporate gifts and client appreciation deliveries to Doral offices',
        'Welcome bouquets for guests at Trump National Doral',
        'Birthday and quinceañera deliveries to CityPlace Doral homes',
        'Anniversary surprises to gated residential communities',
        'Mother\'s Day and Valentine\'s Day citywide deliveries',
        'Conference and event florals for Doral business meetings',
      ],
      deliveryTitle: 'Delivery information for Doral',
      deliveryParagraph: "Doral is one of the closest neighborhoods to our Miami atelier on NW 12th Street — most Doral addresses fall comfortably within our 0–5 mile flat zone, so delivery typically costs $20. Beyond 5 miles, the rate is $1.60 per additional mile, up to 87 miles total. Every order needs a minimum of 2 hours of preparation. For same-day delivery, place your order before 3PM Miami time — orders placed after the cutoff are scheduled for the next available window. Delivery hours are Monday to Friday 8AM–7PM, Saturday 8AM–6PM and Sunday 8AM–5PM. Free pickup is also available at 7261 NW 12th Street, Miami FL 33126. Full details on our shipping policy page.",
      faqTitle: 'Doral delivery FAQs',
      faqs: [
        {
          question: 'Do you deliver to Trump National Doral Miami?',
          answer: "Yes. We deliver to Trump National Doral, both resort guest rooms and event spaces. Just include the guest's full name and check-in date or the event/conference name when ordering, and our courier coordinates handoff with hotel staff.",
        },
        {
          question: 'Can you deliver to corporate offices in Doral?',
          answer: 'Yes. We regularly deliver to corporate offices and business parks across Doral, including the NW 36th Street and Doral Boulevard corridors. Our courier coordinates with reception or the security desk during business hours so the recipient receives the bouquet personally.',
        },
        {
          question: 'How fast can you deliver in Doral?',
          answer: 'Doral is one of the closest neighborhoods to our atelier, but every order still needs a minimum of 2 hours of preparation — that 2-hour window covers design and dispatch. After preparation, our courier reaches most Doral addresses quickly. Order before 3PM Miami time for same-day delivery.',
        },
        {
          question: 'How much does delivery to Doral cost?',
          answer: 'Most Doral addresses fall within our $20 flat-rate zone (0–5 miles from our NW 12th Street atelier). For more distant Doral zones, the rate adds $1.60 per additional mile. Same-day delivery requires ordering before 3PM Miami time, with a 2-hour minimum prep. Delivery hours: Mon–Fri 8AM–7PM, Sat 8AM–6PM, Sun 8AM–5PM.',
        },
      ],
      internalLinksTitle: "If you're looking for flower delivery in nearby areas, we also serve:",
      internalLinks: [
        { label: 'Flower Delivery Hialeah', slug: 'flower-delivery-hialeah' },
        { label: 'Flower Delivery Coral Gables', slug: 'flower-delivery-coral-gables' },
        { label: 'Flower Delivery Brickell', slug: 'flower-delivery-brickell' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: 'Order Doral Flower Delivery',
      areaServed: 'Doral, Miami',
    },
  },
  {
    slug: 'flower-delivery-hialeah',
    h1: 'Flower Delivery Hialeah | Same-Day – Charls Flowers Miami',
    seoTitle: 'Flower Delivery Hialeah | Same-Day Roses – Charls Flowers',
    seoDescription: 'Same-day flower delivery to Hialeah from Charls Flowers Miami. Fresh roses from 50 to 200 per bouquet. Free pickup available.',
    intro: 'Charls Flowers delivers beautiful, handcrafted rose bouquets to Hialeah with same-day delivery available. Choose from our extensive collection of single color, mixed, and zodiac bouquets — each customizable from 50 to 200 roses. Free in-store pickup is also available at our Miami location. Order before 3PM for same-day delivery.',
    type: 'neighborhood',
    seo: {
      whyTitle: 'Why we deliver in Hialeah',
      whyParagraph: "Hialeah is the heart of Miami's Cuban-American community, with deep family traditions around birthdays, quinceañeras, anniversaries and Mother's Day. Our team is fully bilingual (Spanish and English) and we understand how important flower delivery is for the celebrations Hialeah families care about most. Our atelier on NW 12th Street borders Hialeah, so most deliveries land within minutes — and free pickup is also available if you prefer to come by.",
      zonesTitle: 'Areas we cover in Hialeah',
      zonesIntro: 'We deliver across all of Hialeah and Hialeah Gardens, including:',
      zones: [
        'Downtown Hialeah and Palm Avenue',
        'West Hialeah and the West 49th Street corridor',
        'East Hialeah, near Okeechobee Road',
        'Hialeah Gardens residential neighborhoods',
        'Westland Mall area and surrounding streets',
        'Amelia Earhart Park area and family neighborhoods',
        'Hialeah Park Racing & Casino area',
        'Industrial and office zones along NW 79th Avenue',
      ],
      occasionsTitle: 'Popular occasions in Hialeah',
      occasionsIntro: 'These are the most common reasons our Hialeah clients order flowers from us:',
      occasions: [
        'Quinceañera bouquets and family celebration florals',
        'Mother\'s Day deliveries (Día de las Madres) — one of our busiest weeks of the year',
        'Birthday and anniversary bouquets to family homes',
        'Sympathy arrangements to local funeral homes',
        'Hospital and get-well deliveries to Hialeah Hospital and Palmetto General',
        'Valentine\'s Day rose bouquets in classic red and pink',
      ],
      deliveryTitle: 'Delivery information for Hialeah',
      deliveryParagraph: "Our Miami atelier on NW 12th Street is right on the Hialeah border, so most Hialeah addresses fall within our 0–5 mile flat zone — delivery typically costs $20. Beyond 5 miles (deeper Hialeah Gardens or West Hialeah), the rate is $1.60 per additional mile, up to 87 miles total. Every order needs a minimum of 2 hours of preparation. For same-day delivery, place your order before 3PM Miami time — orders placed after the cutoff are scheduled for the next available window. Delivery hours are Monday to Friday 8AM–7PM, Saturday 8AM–6PM and Sunday 8AM–5PM. Free pickup is also available at 7261 NW 12th Street, Miami FL 33126. Full details on our shipping policy page.",
      faqTitle: 'Hialeah delivery FAQs',
      faqs: [
        {
          question: '¿Hablan español? Can I order in Spanish?',
          answer: 'Yes — our team is fully bilingual. You can call us, message us or place your order in Spanish. We work daily with Hialeah families and understand the cultural details around flowers for quinceañeras, Día de las Madres and family celebrations.',
        },
        {
          question: 'Do you deliver to homes and apartments in Hialeah?',
          answer: 'Yes. We deliver to single-family homes, townhouses and apartment buildings across Hialeah and Hialeah Gardens. For apartment complexes, please include the building number and apartment number so our courier can hand the bouquet directly to the recipient.',
        },
        {
          question: 'Can I pick up my bouquet myself instead of delivery?',
          answer: 'Yes. Free in-store pickup is available at our atelier — 7261 NW 12th Street, Miami FL 33126, just minutes from Hialeah. Orders are ready 2 hours after placing them, within our regular hours: Mon–Fri 8AM–7PM, Sat 8AM–6PM, Sun 8AM–5PM.',
        },
        {
          question: 'How much does delivery to Hialeah cost?',
          answer: 'Most Hialeah addresses fall within our $20 flat-rate zone (0–5 miles from our atelier on NW 12th Street, which borders Hialeah). For Hialeah Gardens or zones beyond 5 miles, the rate adds $1.60 per additional mile. Same-day delivery requires ordering before 3PM Miami time, with a 2-hour minimum prep.',
        },
      ],
      internalLinksTitle: "If you're looking for flower delivery in nearby areas, we also serve:",
      internalLinks: [
        { label: 'Flower Delivery Doral', slug: 'flower-delivery-doral' },
        { label: 'Flower Delivery Brickell', slug: 'flower-delivery-brickell' },
        { label: 'Flower Delivery Coral Gables', slug: 'flower-delivery-coral-gables' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: 'Order Hialeah Flower Delivery',
      areaServed: 'Hialeah, Miami',
    },
  },
  {
    slug: 'flower-delivery-kendall',
    h1: 'Flower Delivery Kendall | Same-Day – Charls Flowers Miami',
    seoTitle: 'Flower Delivery Kendall | Same-Day Roses – Charls Flowers',
    seoDescription: 'Same-day flower delivery to Kendall from Charls Flowers Miami. Custom bouquets with AI preview. Order before 3PM.',
    intro: 'Send stunning rose bouquets to Kendall with same-day delivery from Charls Flowers. Our custom bouquet builder lets you choose colors, quantity (50-200 roses), paper color, and finish. Preview your bouquet with AI before ordering. Delivery available to Kendall and all of South Miami-Dade.',
    type: 'neighborhood',
    seo: {
      whyTitle: 'Why we deliver in Kendall',
      whyParagraph: "Kendall is one of Miami-Dade's largest residential areas — a mix of family neighborhoods, gated communities, shopping districts and the Baptist Health hospital corridor. We deliver to Kendall, West Kendall, Pinecrest and Palmetto Bay homes for birthdays, anniversaries, Mother's Day, hospital welcomes and everyday surprises. Because Kendall sits south of our Miami atelier, delivery cost includes our standard per-mile rate beyond the first 5 miles — but our team plans Kendall routes daily, so same-day delivery is fully available when you order before 3PM.",
      zonesTitle: 'Areas we cover in Kendall',
      zonesIntro: 'We deliver across Kendall and the surrounding South Miami-Dade neighborhoods, including:',
      zones: [
        'Kendall (central, around Dadeland Mall and US-1)',
        'West Kendall, including Hammocks and The Crossings',
        'East Kendall and Pinecrest',
        'Palmetto Bay and Cutler Bay (on request)',
        'Baptist Hospital of Miami and South Miami Hospital corridor',
        'Kendall Town & Country and Kings Bay area',
        'Pinecrest residential streets along Old Cutler Road',
        'Sunset Place and South Miami business district',
      ],
      occasionsTitle: 'Popular occasions in Kendall',
      occasionsIntro: 'These are the most common reasons our Kendall clients order flowers from us:',
      occasions: [
        'Birthday and anniversary deliveries to family homes',
        'Get-well bouquets to Baptist Hospital of Miami and South Miami Hospital',
        'Mother\'s Day deliveries across Kendall and Pinecrest',
        'Quinceañera and graduation arrangements',
        'Sympathy bouquets to local funeral homes',
        'Romantic surprise deliveries to gated communities',
      ],
      deliveryTitle: 'Delivery information for Kendall',
      deliveryParagraph: "Kendall sits roughly 8–15 miles from our Miami atelier depending on the address, so a typical Kendall delivery costs $20 (for the first 5 miles) plus $1.60 per additional mile — most addresses land in the $25–$35 range. Maximum delivery distance is 87 miles. Every order needs a minimum of 2 hours of preparation. For same-day delivery, place your order before 3PM Miami time — orders placed after the cutoff are scheduled for the next available window. Delivery hours are Monday to Friday 8AM–7PM, Saturday 8AM–6PM and Sunday 8AM–5PM. Free pickup is also available at 7261 NW 12th Street, Miami FL 33126. Full details on our shipping policy page.",
      faqTitle: 'Kendall delivery FAQs',
      faqs: [
        {
          question: 'Do you deliver to West Kendall and The Hammocks?',
          answer: 'Yes. We deliver throughout West Kendall, The Hammocks, The Crossings and Kendall Town & Country. These addresses sit farther from our atelier, so the per-mile rate ($1.60 per additional mile beyond the first 5) applies — but same-day delivery is available when you order before 3PM Miami time.',
        },
        {
          question: 'Can you deliver to Baptist Hospital of Miami or South Miami Hospital?',
          answer: "Yes. We regularly deliver get-well bouquets to Baptist Hospital of Miami, South Miami Hospital and Kendall area medical centers. Just include the patient's full name, room number (if known) and the hospital, and our courier hands off at the front desk per hospital policy.",
        },
        {
          question: 'How much does delivery to Kendall cost?',
          answer: "Kendall typically falls 8–15 miles from our atelier, so most deliveries cost between $25 and $35: $20 for the first 5 miles plus $1.60 per additional mile. The exact cost depends on the specific Kendall address. You'll see the calculated delivery fee at checkout based on your address.",
        },
        {
          question: 'What is your delivery cutoff for same-day in Kendall?',
          answer: 'Same-day delivery requires placing your order before 3PM Miami time, with a 2-hour minimum preparation window. Orders placed after 3PM are scheduled for the next available delivery window. Delivery hours: Mon–Fri 8AM–7PM, Sat 8AM–6PM, Sun 8AM–5PM.',
        },
      ],
      internalLinksTitle: "If you're looking for flower delivery in nearby areas, we also serve:",
      internalLinks: [
        { label: 'Flower Delivery Coral Gables', slug: 'flower-delivery-coral-gables' },
        { label: 'Flower Delivery Brickell', slug: 'flower-delivery-brickell' },
        { label: 'Flower Delivery Doral', slug: 'flower-delivery-doral' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: 'Order Kendall Flower Delivery',
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
    h1: 'Flower Delivery Wynwood | Same-Day – Charls Flowers Miami',
    seoTitle: 'Flower Delivery Wynwood | Same-Day Roses – Charls Flowers',
    seoDescription: 'Same-day flower delivery to Wynwood from Charls Flowers Miami. Handcrafted bouquets with custom AI preview. Order now.',
    intro: 'Add color to Wynwood with a stunning bouquet from Charls Flowers. We offer same-day delivery to Wynwood and the Miami Design District. Our bouquets feature 50 to 200 fresh roses with natural, glitter, or painted finish. Use our custom builder with AI preview to design a one-of-a-kind arrangement.',
    type: 'neighborhood',
  },
  {
    slug: 'flower-delivery-miami-beach',
    h1: 'Flower Delivery Miami Beach | Same-Day – Charls Flowers',
    seoTitle: 'Flower Delivery Miami Beach | Same-Day Roses – Charls Flowers',
    seoDescription: 'Same-day flower delivery to Miami Beach from Charls Flowers. Fresh bouquets from 50 to 200 roses. Order before 3PM for delivery today.',
    intro: 'Brighten any occasion in Miami Beach with fresh roses from Charls Flowers. We deliver handcrafted bouquets to South Beach, Mid-Beach, North Beach, and all Miami Beach neighborhoods. Same-day delivery available when you order before 3PM. Choose from 50 to 200 roses with your preferred finish.',
    type: 'neighborhood',
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
    h1: "Mother's Day Bouquets Miami | Fresh Roses – Charls Flowers",
    seoTitle: "Mother's Day Bouquets Miami | Fresh Roses – Charls Flowers",
    seoDescription: "Beautiful Mother's Day bouquets in Miami. Handcrafted rose arrangements from 50 to 200 roses. Same-day delivery available. Order now.",
    intro: "Show Mom how much she means with a beautiful bouquet from Charls Flowers. Our Mother's Day collection features handcrafted arrangements from 50 to 200 fresh roses in her favorite colors. Choose natural, glitter, or painted finish and add special accessories like crowns, ribbons, or butterflies. Same-day delivery across Miami or free in-store pickup.",
    type: 'seasonal',
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
    h1: 'Gender Reveal Flowers Miami | Pink & Blue Bouquets – Charls Flowers',
    seoTitle: 'Gender Reveal Flowers Miami | Pink & Blue Bouquets – Charls Flowers',
    seoDescription: 'Pink and blue gender reveal flower bouquets in Miami. Custom arrangements from 50 to 200 roses. Same-day delivery available.',
    intro: "Make your gender reveal extra special with pink or blue rose bouquets from Charls Flowers. Choose from our Soft Pink bouquet, Blue Sky bouquet, or create a custom arrangement with our AI-powered builder. Available in 50 to 200 roses with natural, glitter, or painted finish. Same-day delivery across Miami or free in-store pickup.",
    type: 'niche',
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
