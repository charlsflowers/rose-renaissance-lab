import { Link } from "react-router-dom";
import { Flower2, MapPin, Phone, Clock } from "lucide-react";
import JsonLd, { organizationSchema } from "@/components/JsonLd";
import { useTranslation } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-foreground pt-16 pb-8">
      <JsonLd data={organizationSchema()} />
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 — Info */}
          <div>
            <Flower2 className="w-6 h-6 text-primary mb-3 fill-primary" />
            <p className="font-display text-lg text-primary-foreground mb-3">Charls Flowers</p>
            <div className="space-y-2 font-body text-xs text-primary-foreground/60">
              <p className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /> 7261 NW 12th Street, Miami, FL 33126</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" /> <a href="tel:9044424042" className="hover:text-primary transition-colors">904-442-4042</a></p>
              <p className="flex items-start gap-2"><Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {t("footer.hours").split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br/>}</span>)}</p>
            </div>
            <p className="font-body text-[10px] text-primary-foreground/40 mt-3 italic">{t("footer.sameDayDelivery")}</p>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-primary-foreground/80 mb-4">{t("footer.navigation")}</p>
            <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground/60">
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
                { to: "/sitemap", label: t("nav.sitemap") },
              ].map(link => (
                <Link key={link.to} to={link.to} className="hover:text-primary transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Col 3 — Legal */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-primary-foreground/80 mb-4">{t("footer.legal")}</p>
            <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground/60">
              {[
                { to: "/privacy-policy", label: t("footer.privacyPolicy") },
                { to: "/terms-of-service", label: t("footer.termsOfService") },
                { to: "/refund-policy", label: t("footer.refundPolicy") },
                { to: "/shipping-policy", label: t("footer.shippingPolicy") },
                { to: "/cookie-policy", label: t("footer.cookiePolicy") },
              ].map(link => (
                <Link key={link.to} to={link.to} className="hover:text-primary transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Col 4 — Social & Payments */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-primary-foreground/80 mb-4">{t("footer.followUs")}</p>
            <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground/60 mb-6">
              <a href="https://www.instagram.com/charlsflowers_?igsh=MzAzc3l1dGdkZWV2" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
              <a href="https://www.facebook.com/charlsflowers" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Facebook</a>
              <a href="https://www.tiktok.com/@charlsflowers" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">TikTok</a>
            </div>
            <p className="font-body text-[10px] text-primary-foreground/40">{t("footer.payments")}</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/10 pt-6 text-center">
          <p className="font-body text-[10px] text-primary-foreground/40">{t("footer.copyright")}</p>
          <p className="font-body text-[10px] text-primary-foreground/30 mt-1">{t("footer.tagline")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
