import { Helmet } from "react-helmet-async";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

const JsonLd = ({ data }: JsonLdProps) => {
  const items = Array.isArray(data) ? data : [data];
  return (
    <Helmet>
      {items.map((item, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

export default JsonLd;

// ── Schema generators ──

export const localBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Florist"],
  name: "Charls Flowers",
  url: "https://www.charlsflowers.com",
  telephone: "904-442-4042",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "7261 Northwest 12th Street",
    addressLocality: "Miami",
    addressRegion: "FL",
    postalCode: "33126",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "08:00", closes: "17:00" },
  ],
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: { "@type": "GeoCoordinates", latitude: 25.7617, longitude: -80.3999 },
    geoRadius: "140000",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Flower Arrangements Miami",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Custom Bouquets Miami" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Single Color Bouquets Miami" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Mixed Bouquets Miami" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Room Decoration Miami" } },
    ],
  },
});

export const serviceSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Same-Day Flower Delivery Miami",
  provider: { "@type": "LocalBusiness", name: "Charls Flowers" },
  areaServed: { "@type": "City", name: "Miami" },
  description: "Same-day flower delivery across Miami up to 87 miles. Order before 3PM. $20 flat rate for 0-5 miles, $1.60/mile after.",
  offers: { "@type": "Offer", price: "20.00", priceCurrency: "USD" },
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Charls Flowers",
  url: "https://www.charlsflowers.com",
});

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Charls Flowers",
  url: "https://www.charlsflowers.com",
  logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/pPT3n7ZwBuTW9aMFgpnKH957a2Y2/social-images/social-1773180724629-LOGO_charls.webp",
  telephone: "904-442-4042",
  address: {
    "@type": "PostalAddress",
    streetAddress: "7261 Northwest 12th Street",
    addressLocality: "Miami",
    addressRegion: "FL",
    postalCode: "33126",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.instagram.com/charlsflowers",
    "https://www.facebook.com/charlsflowers",
    "https://www.tiktok.com/@charlsflowers",
  ],
});

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(faq => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
});

export const productSchema = (name: string, description: string, price: number, image?: string) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: `${name} Miami`,
  description,
  brand: { "@type": "Brand", name: "Charls Flowers" },
  ...(image ? { image } : {}),
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: price.toFixed(2),
    availability: "https://schema.org/InStock",
    seller: { "@type": "Organization", name: "Charls Flowers" },
  },
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});

export const articleSchema = (headline: string, slug: string, datePublished: string, image?: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline,
  author: { "@type": "Organization", name: "Charls Flowers" },
  publisher: {
    "@type": "Organization",
    name: "Charls Flowers",
    logo: { "@type": "ImageObject", url: "https://storage.googleapis.com/gpt-engineer-file-uploads/pPT3n7ZwBuTW9aMFgpnKH957a2Y2/social-images/social-1773180724629-LOGO_charls.webp" },
  },
  datePublished,
  dateModified: datePublished,
  ...(image ? { image } : {}),
  url: `https://www.charlsflowers.com/blog/${slug}`,
});

export const homepageFaqs = [
  { question: "Do you offer same-day flower delivery in Miami?", answer: "Yes! We offer same-day delivery across Miami up to 87 miles. Order before 3PM and your bouquet will be delivered today. Minimum 2 hours preparation time." },
  { question: "How much does flower delivery cost in Miami?", answer: "$20 flat rate for 0-5 miles. $1.60 per mile from 5 to 87 miles. Free in-store pickup available at 7261 NW 12th Street, Miami FL 33126." },
  { question: "Can I customize my bouquet?", answer: "Yes! Use our custom bouquet builder to choose color, paper, quantity (50-200 roses), finish (natural, glitter, painted) and accessories. AI preview shows exactly what you'll receive." },
  { question: "What is the difference between glitter and natural bouquets?", answer: "Natural bouquets use fresh roses in their original color. Glitter bouquets have a premium glitter coating applied to the petals for a glamorous, long-lasting effect." },
  { question: "How does the AI bouquet preview work?", answer: "Our custom bouquet builder uses AI (powered by Gemini) to generate a realistic preview of your bouquet before you order, based on your color, quantity and finish selections." },
  { question: "What flowers are best for birthdays?", answer: "For birthdays we recommend bright single-color bouquets like Hot Pink Blush, Radiant Sun or Orange Sunset, or a custom mixed bouquet in the recipient's favorite colors." },
  { question: "Can I schedule a delivery for a specific time?", answer: "Yes, you can request a preferred delivery window at checkout. Same-day delivery requires ordering before 3PM with a minimum 2-hour preparation time." },
];
