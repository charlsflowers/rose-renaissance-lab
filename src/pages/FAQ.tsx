import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import JsonLd, { faqSchema } from "@/components/JsonLd";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

const FAQ = () => {
  const { t, tRaw } = useTranslation();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const faqs = tRaw("faqPage.faqs") as Array<{ q: string; a: string }>;

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
          <h1 className="font-title-retro text-4xl md:text-5xl text-primary text-center mb-10">{t("faqPage.title")}</h1>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
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
