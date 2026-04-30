import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LandingFAQ as FAQItem } from "@/lib/landingPagesData";

interface Props {
  title: string;
  faqs: FAQItem[];
}

const LandingFAQ = ({ title, faqs }: Props) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section className="mb-16">
      <h2 className="font-display text-2xl font-semibold text-foreground mb-6">{title}</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              aria-expanded={openIdx === i}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors"
            >
              <h3 className="font-body text-sm font-medium text-foreground pr-4 m-0">{faq.question}</h3>
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

export default LandingFAQ;