import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import JsonLd, { faqSchema } from "@/components/JsonLd";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "Do you offer same-day flower delivery in Miami?", a: "Yes! We offer same-day delivery across Miami up to 87 miles. Order before 3PM and your bouquet will be delivered today. Minimum 2 hours preparation time." },
  { q: "How much does flower delivery cost in Miami?", a: "$20 flat rate for 0-5 miles. $1.60 per mile from 5 to 87 miles. Free in-store pickup available at 7261 NW 12th Street, Miami FL 33126." },
  { q: "Can I customize my bouquet?", a: "Yes! Use our custom bouquet builder to choose color, paper, quantity (50-200 roses), finish (natural, glitter, painted) and accessories. AI preview shows exactly what you'll receive." },
  { q: "What is the difference between glitter and natural bouquets?", a: "Natural bouquets use fresh roses in their original color. Glitter bouquets have a premium glitter coating applied to the petals for a glamorous, long-lasting effect." },
  { q: "How does the AI bouquet preview work?", a: "Our custom bouquet builder uses AI to generate a realistic preview of your bouquet before you order, based on your color, quantity and finish selections." },
  { q: "What flowers are best for birthdays?", a: "For birthdays we recommend bright single-color bouquets like Hot Pink Blush, Radiant Sun or Orange Sunset, or a custom mixed bouquet in the recipient's favorite colors." },
  { q: "Can I schedule a delivery for a specific time?", a: "Yes, you can request a preferred delivery window at checkout. Same-day delivery requires ordering before 3PM with a minimum 2-hour preparation time." },
  { q: "What flowers are best for quinceañeras?", a: "Popular choices include Hot Pink Blush, Soft Pink, and mixed bouquets like Pink Symphony. We offer custom bouquets where you choose the exact colors to match the theme." },
  { q: "Do you offer wedding flowers in Miami?", a: "Wedding bouquets are coming soon! In the meantime, our custom bouquet builder lets you design stunning arrangements perfect for wedding events." },
  { q: "Can I order 100 roses in one bouquet?", a: "Absolutely! We offer bouquets with 50, 75, 100, 150, and 200 roses. You can choose any color combination and finish." },
  { q: "Do you deliver to Coral Gables, Doral, Hialeah, Kendall, Brickell?", a: "Yes! We deliver to all Miami neighborhoods and surrounding areas up to 87 miles, including Coral Gables, Doral, Hialeah, Kendall, Brickell, Wynwood, Miami Beach, and Aventura." },
  { q: "Is there a minimum order for delivery?", a: "No minimum order for delivery. Any bouquet or product can be delivered. Delivery starts at $20 for 0-5 miles." },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Frequently Asked Questions – Charls Flowers Miami"
        description="Find answers about flower delivery, custom bouquets, pricing, and more at Charls Flowers Miami. Same-day delivery, free pickup, AI preview."
        path="/faq"
      />
      <JsonLd data={faqSchema(faqs.map(f => ({ question: f.q, answer: f.a })))} />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-title-retro text-4xl md:text-5xl text-primary text-center mb-10">Frequently Asked Questions</h1>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-sm overflow-hidden">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-cream/50 transition-colors"
                >
                  <p className="font-body text-sm font-semibold text-foreground pr-4">{faq.q}</p>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${openIdx === i ? "rotate-180" : ""}`} />
                </button>
                {openIdx === i && (
                  <div className="px-5 pb-5">
                    <p className="font-body text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
