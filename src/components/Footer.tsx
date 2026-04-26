import { Link } from "react-router-dom";
import { MapPin, Phone, Clock } from "lucide-react";
import JsonLd, { organizationSchema } from "@/components/JsonLd";
import { useTranslation } from "@/i18n/LanguageContext";
import charlsLogo from "@/assets/charls-logo.png";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Wave transition from white to red footer (same effect as the ticker) */}
      <div className="relative w-full h-[55px] overflow-hidden pointer-events-none -mb-px" aria-hidden="true">
        <svg className="h-full animate-wave-reverse" style={{ width: "200%", minWidth: "3840px" }} viewBox="0 0 2880 60" preserveAspectRatio="none">
          <path d="M0,0 C360,40 720,10 1080,30 C1440,50 1800,10 2160,35 C2520,55 2880,20 2880,20 L2880,60 L0,60 Z" fill="hsl(var(--primary))" opacity="0.3" />
          <path d="M0,0 C480,25 960,5 1440,20 C1920,35 2400,10 2880,25 L2880,60 L0,60 Z" fill="hsl(var(--primary))" opacity="0.55" />
          <path d="M0,0 C320,12 640,4 960,10 C1280,16 1600,6 1920,12 C2240,18 2560,8 2880,14 L2880,60 L0,60 Z" fill="hsl(var(--primary))" opacity="0.8" />
        </svg>
      </div>
      <footer className="relative bg-primary pt-8 pb-8 overflow-hidden">
        <JsonLd data={organizationSchema()} />
        <div className="container mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 — Info */}
          <div>
            <img src={charlsLogo} alt="Charls Flowers" className="h-10 w-auto mb-3 brightness-0 invert" width={120} height={40} />
            <div className="space-y-2 font-body text-xs text-primary-foreground/60">
              <p className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /> 7261 NW 12th Street, Miami, FL 33126</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" /> <a href="tel:9044424042" className="hover:text-primary transition-colors">904-442-4042</a></p>
              <div className="flex items-start gap-2"><Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <ul className="space-y-0.5">
                  <li>{t("footer.hoursLine1")}</li>
                  <li>{t("footer.hoursLine2")}</li>
                  <li>{t("footer.hoursLine3")}</li>
                </ul>
              </div>
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
    </>
  );
};

export default Footer;
