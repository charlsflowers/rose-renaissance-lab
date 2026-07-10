import { Link } from "@/i18n/LocalizedRouter";
import { MapPin, Phone, Clock } from "lucide-react";
import JsonLd, { organizationSchema } from "@/components/JsonLd";
import { useTranslation } from "@/i18n/LanguageContext";
import charlsLogo from "@/assets/charls-logo.webp";
import PaymentIcons from "@/components/PaymentIcons";
import { openCookiePreferences } from "@/hooks/useCookieConsent";
import { occasionsByTier } from "@/lib/occasionPagesData";
import { flowerTypesByTier } from "@/lib/flowerTypePagesData";

const Footer = () => {
  const { t, language } = useTranslation();
  // Nationwide city index uses different slugs per language — bypass auto-localization.
  const nationwidePath = language === "es" ? "/es/envio-de-flores" : "/flower-delivery";
  // Occasion collection URLs are native per language; build the language-correct path here
  // and bypass auto-localization on the Link.
  const occasionsIndexPath = language === "es" ? "/es/collections/ocasiones" : "/collections/occasions";
  const occasionPath = (slug: string, slugEs: string) =>
    language === "es" ? `/es/collections/${slugEs}` : `/collections/${slug}`;
  // Tier 2 + 3 in the footer (Tier 1 lives in the top menu).
  const footerOccasions = [...occasionsByTier(2), ...occasionsByTier(3)];
  const stripCity = (h1: string) =>
    h1
      .replace(/ — Miami Delivery$/, "")
      .replace(/ (in|en) Miami$/, "")
      .replace(/ Miami$/, "");
  // Flower-type pages: Tier 1 is also in the top menu; surface Tier 2 in the
  // footer so all 16 are reachable in ≤3 clicks (Home → Footer → Flower).
  const flowerTypesIndexPath = language === "es" ? "/es/collections/flores" : "/collections/flowers";
  const flowerTypePath = (slug: string, slugEs: string) =>
    language === "es" ? `/es/collections/${slugEs}` : `/collections/${slug}`;
  const footerFlowerTypes = [...flowerTypesByTier(2), ...flowerTypesByTier(3)];

  return (
    <div className="relative mt-[-1px]">
      <div className="absolute -top-[50px] left-0 w-full h-[55px] z-10 overflow-hidden pointer-events-none">
        <svg className="h-full animate-wave" style={{ width: "200%", minWidth: "3840px" }} viewBox="0 0 2880 60" preserveAspectRatio="none">
          <path d="M0,60 C360,20 720,50 1080,30 C1440,10 1800,50 2160,25 C2520,5 2880,40 2880,40 L2880,60 Z" fill="hsl(var(--primary))" opacity="0.3" />
          <path d="M0,60 C480,35 960,55 1440,40 C1920,25 2400,50 2880,35 L2880,60 Z" fill="hsl(var(--primary))" opacity="0.55" />
          <path d="M0,60 C320,48 640,56 960,50 C1280,44 1600,54 1920,48 C2240,42 2560,52 2880,46 L2880,60 Z" fill="hsl(var(--primary))" opacity="0.8" />
        </svg>
      </div>
      <footer className="relative bg-primary pt-12 pb-8 overflow-hidden">
        <JsonLd data={organizationSchema()} />
        <div className="container mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 — Info */}
          <div>
            <img src={charlsLogo} alt="Charls Flowers" className="h-10 w-auto mb-3 brightness-0 invert" width={90} height={40} />
            <div className="space-y-2 font-body text-xs text-primary-foreground">
              <p className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /> 7261 NW 12th St, Miami, FL 33126</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" /> <a href="tel:9044424042" className="inline-block py-1 hover:text-primary transition-colors">904-442-4042</a></p>
              <div className="flex items-start gap-2"><Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <ul className="space-y-0.5">
                  <li>{t("footer.hoursLine1")}</li>
                  <li>{t("footer.hoursLine2")}</li>
                  <li>{t("footer.hoursLine3")}</li>
                </ul>
              </div>
            </div>
            <p className="font-body text-[10px] text-primary-foreground/80 mt-3 italic">{t("footer.sameDayDelivery")}</p>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-primary-foreground mb-4">{t("footer.navigation")}</p>
            <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground">
              {[
                { to: "/", label: t("nav.home") },
                { to: "/bouquets", label: t("nav.bouquets") },
                { to: "/bouquets/personalizar", label: t("nav.customBouquets") },
                { to: "/room-decors", label: t("nav.roomDecors") },
                { to: "/delivery", label: t("nav.delivery") },
                { to: "/about", label: t("nav.about") },
                { to: "/contact", label: t("nav.contact") },
                { to: "/faq", label: t("nav.faq") },
                { to: "/blog", label: t("nav.blog") },
                { to: nationwidePath, label: t("footer.nationwideDelivery"), noLocalize: true },
                { to: "/sitemap", label: t("nav.sitemap") },
              ].map(link => (
                <Link key={link.to} to={link.to} noLocalize={link.noLocalize} className="inline-block py-1 hover:text-primary transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Col 3 — Legal */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-primary-foreground mb-4">{t("footer.legal")}</p>
            <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground">
              {[
                { to: "/privacy-policy", label: t("footer.privacyPolicy") },
                { to: "/terms-of-service", label: t("footer.termsOfService") },
                { to: "/refund-policy", label: t("footer.refundPolicy") },
                { to: "/shipping-policy", label: t("footer.shippingPolicy") },
                { to: "/cookie-policy", label: t("footer.cookiePolicy") },
              ].map(link => (
                <Link key={link.to} to={link.to} className="inline-block py-1 hover:text-primary transition-colors">{link.label}</Link>
              ))}
              <button
                type="button"
                onClick={openCookiePreferences}
                className="text-left inline-block py-1 hover:text-primary transition-colors"
              >
                {t("footer.cookiePreferences")}
              </button>
            </div>
          </div>

          {/* Col 4 — Social & Payments */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-primary-foreground mb-4">{t("footer.followUs")}</p>
            <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground mb-6">
              <a href="https://www.instagram.com/charlsflowers_?igsh=MzAzc3l1dGdkZWV2" target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-primary transition-colors">Instagram</a>
              <a href="https://www.facebook.com/charlsflowersmiami" target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-primary transition-colors">Facebook</a>
              <a href="https://www.tiktok.com/@charlsflowers_?_r=1&_t=ZN-96sa6qDFByA" target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-primary transition-colors">TikTok</a>
            </div>
            <PaymentIcons size={20} />
          </div>
        </div>

          {/* Shop by Occasion — Tier 2 + Tier 3 pages reachable in ≤3 clicks
              (Home → Footer → Occasion). Tier 1 is already in the top menu. */}
          <div className="border-t border-primary-foreground/15 pt-8 mb-8">
            <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
              <p className="font-body text-xs tracking-widest uppercase text-primary-foreground">
                {t("footer.shopByOccasion")}
              </p>
              <Link
                to={occasionsIndexPath}
                noLocalize
                className="font-body text-[11px] tracking-widest uppercase text-primary-foreground/90 hover:text-primary-foreground underline-offset-2 hover:underline"
              >
                {t("footer.viewAllOccasions")} →
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 font-body text-xs text-primary-foreground/95">
              {footerOccasions.map((o) => (
                <Link
                  key={o.slug}
                  to={occasionPath(o.slug, o.slugEs)}
                  noLocalize
                  className="inline-block py-1 hover:text-primary transition-colors"
                >
                  {stripCity(language === "es" ? o.h1.es : o.h1.en)}
                </Link>
              ))}
            </div>
          </div>

          {/* Shop by Flower Type — Tier 2 (+ 3 if any). Tier 1 is in the top menu. */}
          <div className="border-t border-primary-foreground/15 pt-8 mb-8">
            <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
              <p className="font-body text-xs tracking-widest uppercase text-primary-foreground">
                {t("footer.shopByFlower")}
              </p>
              <Link
                to={flowerTypesIndexPath}
                noLocalize
                className="font-body text-[11px] tracking-widest uppercase text-primary-foreground/90 hover:text-primary-foreground underline-offset-2 hover:underline"
              >
                {t("footer.viewAllFlowers")} →
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 font-body text-xs text-primary-foreground/95">
              {footerFlowerTypes.map((f) => (
                <Link
                  key={f.slug}
                  to={flowerTypePath(f.slug, f.slugEs)}
                  noLocalize
                  className="inline-block py-1 hover:text-primary transition-colors"
                >
                  {stripCity(language === "es" ? f.h1.es : f.h1.en)}
                </Link>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-primary-foreground/20 pt-6 text-center">
            <p className="font-body text-[10px] text-primary-foreground/80">{t("footer.copyright")}</p>
            <p className="font-body text-[10px] text-primary-foreground/80 mt-1">{t("footer.tagline")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
