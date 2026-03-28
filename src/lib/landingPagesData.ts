export interface LandingPageData {
  slug: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  type: 'neighborhood' | 'seasonal' | 'niche';
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
  },
  {
    slug: 'flower-delivery-doral',
    h1: 'Flower Delivery Doral | Same-Day – Charls Flowers Miami',
    seoTitle: 'Flower Delivery Doral | Same-Day Roses – Charls Flowers',
    seoDescription: 'Same-day flower delivery to Doral from Charls Flowers Miami. Handcrafted bouquets, glitter or natural finish. Order before 3PM.',
    intro: 'Need fresh flowers delivered to Doral? Charls Flowers offers same-day flower delivery throughout Doral and surrounding areas. Our handcrafted rose bouquets range from 50 to 200 roses with your choice of natural, glitter, or painted finish. Whether it\'s a birthday, anniversary, or just because — we\'ve got the perfect bouquet. Order before 3PM for delivery today.',
    type: 'neighborhood',
  },
  {
    slug: 'flower-delivery-hialeah',
    h1: 'Flower Delivery Hialeah | Same-Day – Charls Flowers Miami',
    seoTitle: 'Flower Delivery Hialeah | Same-Day Roses – Charls Flowers',
    seoDescription: 'Same-day flower delivery to Hialeah from Charls Flowers Miami. Fresh roses from 50 to 200 per bouquet. Free pickup available.',
    intro: 'Charls Flowers delivers beautiful, handcrafted rose bouquets to Hialeah with same-day delivery available. Choose from our extensive collection of single color, mixed, and zodiac bouquets — each customizable from 50 to 200 roses. Free in-store pickup is also available at our Miami location. Order before 3PM for same-day delivery.',
    type: 'neighborhood',
  },
  {
    slug: 'flower-delivery-kendall',
    h1: 'Flower Delivery Kendall | Same-Day – Charls Flowers Miami',
    seoTitle: 'Flower Delivery Kendall | Same-Day Roses – Charls Flowers',
    seoDescription: 'Same-day flower delivery to Kendall from Charls Flowers Miami. Custom bouquets with AI preview. Order before 3PM.',
    intro: 'Send stunning rose bouquets to Kendall with same-day delivery from Charls Flowers. Our custom bouquet builder lets you choose colors, quantity (50-200 roses), paper color, and finish. Preview your bouquet with AI before ordering. Delivery available to Kendall and all of South Miami-Dade.',
    type: 'neighborhood',
  },
  {
    slug: 'flower-delivery-brickell',
    h1: 'Flower Delivery Brickell | Same-Day – Charls Flowers Miami',
    seoTitle: 'Flower Delivery Brickell | Same-Day Roses – Charls Flowers',
    seoDescription: 'Same-day flower delivery to Brickell from Charls Flowers Miami. Premium bouquets from 50 to 200 roses. Glitter or natural finish.',
    intro: 'Surprise someone special in Brickell with a premium handcrafted bouquet from Charls Flowers. We deliver same-day throughout Brickell — from luxury condos to office buildings. Choose from over 40 bouquet designs, or create your own with our AI-powered custom builder. From 50 to 200 roses, natural or glitter finish.',
    type: 'neighborhood',
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
    h1: 'Flower Shop Miami | Premium Bouquets & Same-Day Delivery – Charls Flowers',
    seoTitle: 'Flower Shop Miami | Premium Bouquets & Same-Day Delivery – Charls Flowers',
    seoDescription: "Looking for a flower shop in Miami? Charls Flowers offers handcrafted bouquets from 50 to 200 roses, same-day delivery up to 87 miles, and free pickup. Custom designs with AI preview.",
    intro: "Welcome to Charls Flowers — Miami's premier flower shop specializing in handcrafted rose bouquets. We offer the largest selection of bouquets in Miami with over 40 designs, from single color to mixed and zodiac-inspired arrangements. Every bouquet is made with 50 to 200 fresh roses and available in natural, glitter, or painted finish. Our unique AI-powered custom bouquet builder lets you preview your arrangement before ordering. Same-day delivery across Miami up to 87 miles, or free in-store pickup at our location in NW 12th Street.",
    type: 'niche',
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
