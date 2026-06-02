import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import { useTranslation } from "@/i18n/LanguageContext";

const TermsOfService = () => {
  const { t, tRaw } = useTranslation();
  const sections = tRaw("legal.terms.sections") as { heading: string; text: string }[];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={t("legal.terms.seoTitle")} description={t("legal.terms.seoDescription")} path="/terms-of-service" />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-title-retro text-4xl text-primary text-center mb-8">{t("legal.terms.title")}</h1>
          <div className="font-body text-sm text-muted-foreground space-y-4 leading-relaxed">
            <h2 className="font-display text-lg font-semibold text-foreground">{t("legal.terms.overviewHeading")}</h2>
            <p>{t("legal.terms.overviewText")}</p>

            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-display text-lg font-semibold text-foreground pt-4">{s.heading}</h2>
                <p>{s.text}</p>
              </div>
            ))}

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.terms.contactHeading")}</h2>
            <p>{t("legal.terms.contactText")} <a href="mailto:charls@charlsflowers.com" className="text-primary hover:underline">charls@charlsflowers.com</a>.</p>

            <LegalDisclaimer />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
