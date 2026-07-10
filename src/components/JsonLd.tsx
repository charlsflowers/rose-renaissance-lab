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
  "@id": "https://charlsflowers.com/#localbusiness",
  name: "Charls Flowers",
  url: "https://charlsflowers.com",
  telephone: "+19044424042",
  email: "charls@charlsflowers.com",
  image: "https://storage.googleapis.com/gpt-engineer-file-uploads/pPT3n7ZwBuTW9aMFgpnKH957a2Y2/social-images/social-1773180724629-LOGO_charls.webp",
  priceRange: "$$",
  paymentAccepted: "Visa, Mastercard, American Express, Apple Pay, Google Pay, Shop Pay, Zelle",
  availableLanguage: ["English", "Spanish"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "7261 NW 12th St",
    addressLocality: "Miami",
    addressRegion: "FL",
    postalCode: "33126",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "17:00" },
  ],
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: { "@type": "GeoCoordinates", latitude: 25.7617, longitude: -80.3999 },
    geoRadius: "140000",
  },
});

export const serviceSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Same-Day Flower Delivery Miami",
  provider: { "@id": "https://charlsflowers.com/#localbusiness" },
  areaServed: { "@type": "City", name: "Miami" },
  description: "Same-day flower delivery across Miami up to 87 miles. Order before 3PM. $25 flat rate for 0-5 miles, $1.60/mile after.",
  offers: { "@type": "Offer", price: "25.00", priceCurrency: "USD" },
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Charls Flowers",
  url: "https://charlsflowers.com",
});

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Charls Flowers",
  url: "https://charlsflowers.com",
  logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/pPT3n7ZwBuTW9aMFgpnKH957a2Y2/social-images/social-1773180724629-LOGO_charls.webp",
  image: "https://storage.googleapis.com/gpt-engineer-file-uploads/pPT3n7ZwBuTW9aMFgpnKH957a2Y2/social-images/social-1773180724629-LOGO_charls.webp",
  telephone: "+19044424042",
  email: "charls@charlsflowers.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "7261 NW 12th St",
    addressLocality: "Miami",
    addressRegion: "FL",
    postalCode: "33126",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.instagram.com/charlsflowers_?igsh=MzAzc3l1dGdkZWV2",
    "https://www.facebook.com/charlsflowersmiami",
    "https://www.tiktok.com/@charlsflowers_?_r=1&_t=ZN-96sa6qDFByA",
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

export const productSchema = (name: string, description: string, price: number, image?: string, nameSuffix = " Miami") => ({
  "@context": "https://schema.org",
  "@type": "Product",
  // `nameSuffix` lets each page align the schema name with its visible H1
  // (e.g. " Bouquet Miami" for bouquets, " Miami" for room decors).
  name: `${name}${nameSuffix}`,
  description,
  brand: { "@type": "Brand", name: "Charls Flowers" },
  ...(image ? { image } : {}),
  // Only emit a (valid) Offer when there is a real price (> 0). Google rejects
  // an Offer with price 0 / missing, which would re-trigger the same critical.
  ...(price > 0
    ? {
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: price.toFixed(2),
          availability: "https://schema.org/InStock",
          seller: { "@type": "Organization", name: "Charls Flowers" },
        },
      }
    : {}),
});

/**
 * ItemList schema for collection / listing pages.
 * `items` must already be in display order. URLs are absolute web routes.
 */
export const itemListSchema = (
  items: { name: string; url: string; image?: string; price?: number }[],
  listName?: string,
  // Availability for the emitted Offers. Defaults to InStock; seasonal/locked
  // collections pass "https://schema.org/OutOfStock" so we never tell Google a
  // blocked product is buyable.
  availability = "https://schema.org/InStock",
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  ...(listName ? { name: listName } : {}),
  numberOfItems: items.length,
  itemListElement: items.map((item, i) => {
    // Only items with a REAL price (> 0) are emitted as a full Product with an
    // Offer — Google requires offers/review/aggregateRating on every Product.
    // Price-less entries (city / occasion / flower-type index pages are NOT
    // products) stay as plain ListItems pointing to their URL, so Google does
    // not flag them as a Product missing an offer.
    const hasPrice = typeof item.price === "number" && item.price > 0;
    return {
      "@type": "ListItem",
      position: i + 1,
      url: item.url,
      name: item.name,
      ...(hasPrice
        ? {
            item: {
              "@type": "Product",
              name: item.name,
              url: item.url,
              ...(item.image ? { image: item.image } : {}),
              offers: {
                "@type": "Offer",
                priceCurrency: "USD",
                price: item.price!.toFixed(2),
                availability,
                seller: { "@type": "Organization", name: "Charls Flowers" },
              },
            },
          }
        : {}),
    };
  }),
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
  url: `https://charlsflowers.com/blog/${slug}`,
});

export const blogPostingSchema = (args: {
  headline: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  description?: string;
  author?: string;
  inLanguage?: string;
}) => {
  const url = `https://charlsflowers.com/blog/${args.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: args.headline,
    ...(args.description ? { description: args.description } : {}),
    ...(args.image ? { image: args.image } : {}),
    datePublished: args.datePublished,
    dateModified: args.dateModified || args.datePublished,
    inLanguage: args.inLanguage || "en-US",
    author: { "@type": "Organization", name: args.author || "Charls Flowers" },
    publisher: {
      "@type": "Organization",
      name: "Charls Flowers",
      logo: {
        "@type": "ImageObject",
        url: "https://storage.googleapis.com/gpt-engineer-file-uploads/pPT3n7ZwBuTW9aMFgpnKH957a2Y2/social-images/social-1773180724629-LOGO_charls.webp",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
};

export const homepageFaqs = [
  { question: "Do you offer same-day flower delivery in Miami?", answer: "Yes! We offer same-day delivery across Miami up to 87 miles. Order before 3PM and your bouquet will be delivered today. Minimum 2 hours preparation time." },
  { question: "How much does flower delivery cost in Miami?", answer: "$25 flat rate for 0-5 miles. $1.60 per mile from 5 to 87 miles. Free in-store pickup available at 7261 NW 12th St, Miami FL 33126." },
  { question: "Can I customize my bouquet?", answer: "Yes! Use our custom bouquet builder to choose color, paper, quantity (50-200 roses), finish (natural, glitter, painted) and accessories. AI preview shows exactly what you'll receive." },
  { question: "What is the difference between glitter and natural bouquets?", answer: "Natural bouquets use fresh roses in their original color. Glitter bouquets have a premium glitter coating applied to the petals for a glamorous, long-lasting effect." },
  { question: "How does the AI bouquet preview work?", answer: "Our custom bouquet builder uses AI (powered by Gemini) to generate a realistic preview of your bouquet before you order, based on your color, quantity and finish selections." },
  { question: "What flowers are best for birthdays?", answer: "For birthdays we recommend bright single-color bouquets like Hot Pink Blush, Radiant Sun or Orange Sunset, or a custom mixed bouquet in the recipient's favorite colors." },
  { question: "Can I schedule a delivery for a specific time?", answer: "Yes, you can request a preferred delivery window at checkout. Same-day delivery requires ordering before 3PM with a minimum 2-hour preparation time." },
];
