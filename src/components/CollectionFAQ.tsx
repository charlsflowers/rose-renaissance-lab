import { useState } from "react";
import { ChevronDown } from "lucide-react";
import JsonLd, { faqSchema } from "@/components/JsonLd";
import { useTranslation } from "@/i18n/LanguageContext";

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQItem[];
}

const CollectionFAQ = ({ faqs }: Props) => {
  const { t } = useTranslation();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-12 max-w-3xl mx-auto">
      <JsonLd data={faqSchema(faqs.map(f => ({ question: f.question, answer: f.answer })))} />
      <h2 className="font-display text-xl font-semibold text-foreground text-center mb-8">{t("collectionFaq.title")}</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors"
            >
              <span className="font-body text-sm font-medium text-foreground pr-4">{faq.question}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === i && (
              <div className="px-5 pb-4">
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionFAQ;

export function useBouquetFAQs(): FAQItem[] {
  const { t } = useTranslation();
  return [
    { question: t("bouquetFaq.q1"), answer: t("bouquetFaq.a1") },
    { question: t("bouquetFaq.q2"), answer: t("bouquetFaq.a2") },
    { question: t("bouquetFaq.q3"), answer: t("bouquetFaq.a3") },
    { question: t("bouquetFaq.q4"), answer: t("bouquetFaq.a4") },
    { question: t("bouquetFaq.q5"), answer: t("bouquetFaq.a5") },
  ];
}

export const bouquetFAQs: FAQItem[] = [
  { question: "How many roses can I order in one bouquet?", answer: "Our bouquets range from 50 to 200 roses. Choose any quantity in increments of 25 during checkout." },
  { question: "What finishes are available?", answer: "We offer three finishes: natural (fresh roses), glitter (sparkle-coated petals), and painted (custom color roses like blue, black, or green)." },
  { question: "Do you offer same-day delivery for bouquets?", answer: "Yes! Order before 3PM for same-day delivery across Miami, up to 87 miles from our shop." },
  { question: "Can I mix different rose colors in one bouquet?", answer: "Absolutely! Browse our mixed-color collection or use the Custom Bouquet Builder to pick your exact color combination." },
  { question: "What's the difference between single color and mixed bouquets?", answer: "Single color bouquets feature one rose color for an elegant, uniform look. Mixed bouquets combine 2-4 colors for a vibrant, eye-catching arrangement." },
];

export const roomDecorFAQs: FAQItem[] = [
  { question: "What's included in a room decoration package?", answer: "Each package includes rose petals, candles, balloons, and a fresh bouquet. The Deluxe Love Package adds extra romantic elements like LED lights and premium accessories." },
  { question: "Do you set up the room decoration?", answer: "Yes! Our team handles the full setup. Delivery and installation are included up to 10 miles from our Miami location." },
  { question: "How far in advance should I book?", answer: "We recommend booking at least 24 hours in advance, though same-day setups may be available. Contact us for availability." },
  { question: "Can I customize the decoration?", answer: "Yes, you can choose your bouquet color and select from complementary add-ons included with your package." },
];

export const zodiacFAQs: FAQItem[] = [
  { question: "What makes zodiac bouquets special?", answer: "Each zodiac bouquet features a unique color palette and design inspired by your astrological sign, with the zodiac glyph incorporated into the arrangement using baby's breath." },
  { question: "Can I order a zodiac bouquet as a gift?", answer: "Absolutely! Zodiac bouquets make perfect personalized gifts. We offer same-day delivery across Miami." },
];
