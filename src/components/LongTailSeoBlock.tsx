import { Link } from "@/i18n/LocalizedRouter";
import { useTranslation } from "@/i18n/LanguageContext";
import { getLongTail, type LongTailContent } from "@/lib/longTailSeo";

/**
 * Long-tail on-page SEO renderer for existing collection pages.
 *
 * Two pieces:
 *  - `<LongTailIntro seoKey />` — short 1-2 line paragraph placed under the
 *    existing H1 ("mirror" effect for the searcher).
 *  - `<LongTailBody seoKey />` — H2/H3 + copy block placed at the END of the
 *    page (above the FAQ / CTA), including the internal-link sentence with
 *    EXACT anchor text ordered low → high search volume.
 *
 * Nothing here changes the H1, prices, checkout, cart or tracking.
 */

interface Props {
  seoKey?: string;
}

const useContent = (seoKey?: string): LongTailContent | undefined => {
  const { language } = useTranslation();
  return getLongTail(seoKey, language === "es" ? "es" : "en");
};

export const LongTailIntro = ({ seoKey }: Props) => {
  const c = useContent(seoKey);
  if (!c) return null;
  return (
    <p className="font-body text-sm md:text-base text-foreground/80 max-w-3xl mx-auto text-center mt-3 leading-relaxed">
      {c.intro}
    </p>
  );
};

/**
 * Splits `closing` on `{{n}}` placeholders and injects the matching internal
 * link. Keeps the anchor text exactly equal to the configured keyword.
 */
const renderClosing = (c: LongTailContent) => {
  const parts = c.closing.split(/(\{\{\d+\}\})/g);
  return parts.map((part, i) => {
    const m = /^\{\{(\d+)\}\}$/.exec(part);
    if (!m) return <span key={i}>{part}</span>;
    const link = c.links[Number(m[1])];
    if (!link) return null;
    return (
      <Link key={i} to={link.to} className="text-primary hover:underline">
        {link.anchor}
      </Link>
    );
  });
};

export const LongTailBody = ({ seoKey }: Props) => {
  const c = useContent(seoKey);
  if (!c) return null;
  return (
    <section className="container mx-auto px-6 max-w-3xl py-10 md:py-14">
      <div className="space-y-8">
        {c.sections.map((s, i) => (
          <div key={i}>
            <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-3">{s.h2}</h2>
            <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">{s.body}</p>
          </div>
        ))}
        <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
          {renderClosing(c)}
        </p>
      </div>
    </section>
  );
};

export default LongTailBody;