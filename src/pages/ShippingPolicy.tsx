import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import { useTranslation } from "@/i18n/LanguageContext";

const ShippingPolicy = () => {
  const { t, tRaw } = useTranslation();
  const ratesItems = tRaw("legal.shipping.ratesItems") as { label: string; text: string }[];
  const prepItems = tRaw("legal.shipping.prepItems") as { label: string; text: string }[];
  const hoursItems = tRaw("legal.shipping.hoursItems") as { label: string; text: string }[];
  const importantItems = tRaw("legal.shipping.importantItems") as string[];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={t("legal.shipping.seoTitle")} description={t("legal.shipping.seoDescription")} path="/shipping-policy" />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-title-retro text-4xl text-primary text-center mb-8">{t("legal.shipping.title")}</h1>
          <div className="font-body text-sm text-muted-foreground space-y-4 leading-relaxed">
            <p>{t("legal.shipping.intro")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.shipping.ratesHeading")}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {ratesItems.map((it, i) => (
                <li key={i}><strong>{it.label}</strong>{it.text}</li>
              ))}
            </ul>
            <p className="italic">{t("legal.shipping.ratesExample")}</p>
            <p>{t("legal.shipping.taxes")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.shipping.prepHeading")}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {prepItems.map((it, i) => (
                <li key={i}>{it.label && <strong>{it.label}</strong>}{it.text}</li>
              ))}
            </ul>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.shipping.hoursHeading")}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {hoursItems.map((it, i) => (
                <li key={i}><strong>{it.label}</strong>{it.text}</li>
              ))}
            </ul>
            <p className="italic">{t("legal.shipping.hoursNote")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.shipping.importantHeading")}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {importantItems.map((it, i) => <li key={i}>{it}</li>)}
            </ul>

            <LegalDisclaimer />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;
