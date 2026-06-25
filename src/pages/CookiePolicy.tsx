import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import { Button } from "@/components/ui/button";
import { openCookiePreferences } from "@/hooks/useCookieConsent";
import { useTranslation } from "@/i18n/LanguageContext";

const EMAIL = "charls@charlsflowers.com";

const CookiePolicy = () => {
  const { t, tRaw } = useTranslation();
  const usedItems = tRaw("legal.cookie.usedItems") as { label: string; text: string }[];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={t("legal.cookie.seoTitle")} description={t("legal.cookie.seoDescription")} path="/cookie-policy" noindex />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-title-retro text-4xl text-primary text-center mb-8">{t("legal.cookie.title")}</h1>
          <div className="font-body text-sm text-muted-foreground space-y-4 leading-relaxed">
            <p><strong>{t("legal.lastUpdated")}</strong></p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.cookie.whoHeading")}</h2>
            <p>{t("legal.cookie.whoText")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.cookie.whatHeading")}</h2>
            <p>{t("legal.cookie.whatText")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.cookie.essentialHeading")}</h2>
            <p>{t("legal.cookie.essentialText")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.cookie.analyticsHeading")}</h2>
            <p>{t("legal.cookie.analyticsText")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.cookie.functionalHeading")}</h2>
            <p>{t("legal.cookie.functionalText")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.cookie.choicesHeading")}</h2>
            <p>{t("legal.cookie.choicesText")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.cookie.usedHeading")}</h2>
            <ul className="list-disc pl-5 space-y-1">
              {usedItems.map((it, i) => (
                <li key={i}><strong>{it.label}</strong>{it.text}</li>
              ))}
            </ul>

            <p>{t("legal.cookie.changeText")}</p>
            <Button variant="outline" size="sm" onClick={openCookiePreferences} className="mt-2">
              {t("legal.cookie.manageButton")}
            </Button>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.contactHeading")}</h2>
            <p>
              <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a><br/>
              {t("legal.cookie.contactAddress")}
            </p>

            <LegalDisclaimer />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
