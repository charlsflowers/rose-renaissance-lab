import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import { useTranslation } from "@/i18n/LanguageContext";

const PrivacyPolicy = () => {
  const { t, tRaw } = useTranslation();
  const collectItems = tRaw("legal.privacy.collectItems") as { label: string; text: string }[];
  const useItems = tRaw("legal.privacy.useItems") as { label: string; text: string }[];
  const rightsItems = tRaw("legal.privacy.rightsItems") as { label: string; text: string }[];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={t("legal.privacy.seoTitle")} description={t("legal.privacy.seoDescription")} path="/privacy-policy" />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-title-retro text-4xl text-primary text-center mb-8">{t("legal.privacy.title")}</h1>
          <div className="font-body text-sm text-muted-foreground space-y-4 leading-relaxed">
            <p><strong>{t("legal.lastUpdated")}</strong></p>
            <p>{t("legal.privacy.intro")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.privacy.collectHeading")}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {collectItems.map((it, i) => (
                <li key={i}><strong>{it.label}</strong> {it.text}</li>
              ))}
            </ul>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.privacy.useHeading")}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {useItems.map((it, i) => (
                <li key={i}><strong>{it.label}</strong> {it.text}</li>
              ))}
            </ul>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.privacy.rightsHeading")}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {rightsItems.map((it, i) => (
                <li key={i}><strong>{it.label}</strong> {it.text}</li>
              ))}
            </ul>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.contactHeading")}</h2>
            <p>{t("legal.privacy.contactText")} <a href="mailto:charlsflowerscorp@gmail.com" className="text-primary hover:underline">charlsflowerscorp@gmail.com</a>.</p>
            <p style={{ whiteSpace: "pre-line" }}>{t("legal.address")}</p>

            <LegalDisclaimer />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
