import { useState } from "react";
import { ChevronDown, Truck, BadgeDollarSign } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

const ProductTrustBlock = () => {
  const { tRaw } = useTranslation();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const faqs = tRaw("trustBlock.faqs") as Array<{ q: string; a: string }>;
  const sameDayLabel = tRaw("trustBlock.sameDayLocal") as string;
  const bestPriceLabel = tRaw("trustBlock.bestPrice") as string;

  return (
    <div className="space-y-5 pt-2">
      {/* Trust badges */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border-2 border-primary/30 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <p className="font-body text-sm font-semibold text-foreground leading-tight">
            {sameDayLabel}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border-2 border-primary/30 flex items-center justify-center shrink-0">
            <BadgeDollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="font-body text-sm font-semibold text-foreground leading-tight">
            {bestPriceLabel}
          </p>
        </div>
      </div>

      {/* FAQ accordion */}
      <div className="border-t border-border">
        {faqs.map((faq, i) => {
          const open = openIdx === i;
          return (
            <div key={i} className="border-b border-border">
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                className="w-full flex items-center justify-between py-4 text-left"
                aria-expanded={open}
              >
                <span className="font-body text-sm font-semibold text-foreground pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <div className="pb-4 font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductTrustBlock;
