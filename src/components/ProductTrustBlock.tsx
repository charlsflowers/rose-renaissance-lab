import { useState } from "react";
import { ChevronDown, Truck, BadgeDollarSign } from "lucide-react";

interface FAQ {
  q: string;
  a: React.ReactNode;
}

const FAQS: FAQ[] = [
  {
    q: "Do you really deliver the same day in Miami?",
    a: (
      <>
        Yes. Place your order before <strong>3:00 PM</strong> (Miami time) Monday through Saturday and we will hand-craft and deliver your bouquet the same day, anywhere up to <strong>87 miles</strong> from our Miami shop. Orders placed after 3:00 PM are scheduled for the next available day.
      </>
    ),
  },
  {
    q: "Why are your prices lower than other Miami florists?",
    a: (
      <>
        We work directly with our growers and skip the middlemen, so you pay for the roses and the craftsmanship — not for inflated retail markups. We firmly believe top-quality flowers should be accessible, not a luxury you only get on special occasions.
      </>
    ),
  },
  {
    q: "How fresh are the roses?",
    a: (
      <>
        Every bouquet is assembled to order using premium roses received fresh weekly. Stems are hydrated and conditioned the same day they leave our shop, which is why we offer same-day local delivery — your flowers arrive at peak freshness.
      </>
    ),
  },
  {
    q: "Can I customize the bouquet?",
    a: (
      <>
        Absolutely. You can pick the number of roses (50–200), add a glitter finish, include a handwritten note or butterflies, and even build a fully custom bouquet from scratch with our Bouquet Builder. Color combinations, paper and extras are all up to you.
      </>
    ),
  },
  {
    q: "Shipping & Delivery",
    a: (
      <ul className="list-disc pl-5 space-y-1.5">
        <li><strong>Home Delivery:</strong> $25 flat for the first 5 miles, then $1.60 per additional mile (up to 87 miles).</li>
        <li><strong>Store Pickup:</strong> Free, ready 2 hours after your order is placed.</li>
        <li><strong>Hours:</strong> Mon–Fri 8AM–7PM · Sat 8AM–6PM · Sun 8AM–5PM (Miami time).</li>
        <li>Orders placed before 3:00 PM qualify for <strong>same-day delivery</strong>.</li>
      </ul>
    ),
  },
  {
    q: "Return & Refund Policy",
    a: (
      <>
        Because every bouquet is <strong>customized, personalized and perishable</strong>, cancellations and refunds are generally not available once the order is placed. If you contact us within <strong>1 hour</strong> of ordering at <a href="mailto:charlsflowerscorp@gmail.com" className="text-primary hover:underline">charlsflowerscorp@gmail.com</a>, we can usually issue a full refund (preparation has not yet started). If anything arrives damaged or incorrect, reach out the same day and we will make it right.
      </>
    ),
  },
];

const ProductTrustBlock = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-5 pt-2">
      {/* Trust badges */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border-2 border-primary/30 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <p className="font-body text-sm font-semibold text-foreground leading-tight">
            Same-Day Local Delivery
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border-2 border-primary/30 flex items-center justify-center shrink-0">
            <BadgeDollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="font-body text-sm font-semibold text-foreground leading-tight">
            Best Price in Miami
          </p>
        </div>
      </div>

      {/* FAQ accordion */}
      <div className="border-t border-border">
        {FAQS.map((faq, i) => {
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
                <div className="pb-4 font-body text-sm text-muted-foreground leading-relaxed">
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
