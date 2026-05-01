import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import { useTranslation } from "@/i18n/LanguageContext";

const EMAIL = "charlsflowerscorp@gmail.com";

const RefundPolicy = () => {
  const { t, tRaw } = useTranslation();
  const introItems = tRaw("legal.refund.introItems") as { label: string; text: string }[];
  const exceptionsItems = tRaw("legal.refund.exceptionsItems") as string[];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={t("legal.refund.seoTitle")} description={t("legal.refund.seoDescription")} path="/refund-policy" />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-title-retro text-4xl text-primary text-center mb-8">{t("legal.refund.title")}</h1>
          <div className="font-body text-sm text-muted-foreground space-y-4 leading-relaxed">
            <p>
              {t("legal.refund.introBefore")}
              <strong>{t("legal.refund.introBrand")}</strong>
              {t("legal.refund.introAfter")}
              <strong>{t("legal.refund.introStrong")}</strong>
              {t("legal.refund.introEnd")}
            </p>
            <ul className="list-disc pl-5 space-y-2">
              {introItems.map((it, i) => (
                <li key={i}><strong>{it.label}</strong>{it.text}</li>
              ))}
            </ul>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.refund.cancelHeading")}</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                {t("legal.refund.cancelItem1Before")}
                <strong>{t("legal.refund.cancelItem1Strong1")}</strong>
                {t("legal.refund.cancelItem1Mid")}
                <strong>{t("legal.refund.cancelItem1Strong2")}</strong>
                {t("legal.refund.cancelItem1End")}
              </li>
              <li>
                {t("legal.refund.cancelItem2Before")}
                <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>
                {t("legal.refund.cancelItem2End")}
              </li>
            </ul>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.refund.damagesHeading")}</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                {t("legal.refund.damagesItem1Before")}
                <strong>{t("legal.refund.damagesItem1Strong")}</strong>
                {t("legal.refund.damagesItem1End")}
              </li>
              <li>
                {t("legal.refund.damagesItem2Before")}
                <strong>{t("legal.refund.damagesItem2Strong")}</strong>
                {t("legal.refund.damagesItem2Mid")}
                <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>
                {t("legal.refund.damagesItem2End")}
              </li>
            </ul>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.refund.exceptionsHeading")}</h2>
            <ul className="list-disc pl-5 space-y-2">
              {exceptionsItems.map((it, i) => <li key={i}>{it}</li>)}
            </ul>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.refund.exchangesHeading")}</h2>
            <p>
              {t("legal.refund.exchangesBefore")}
              <strong>{t("legal.refund.exchangesStrong")}</strong>
              {t("legal.refund.exchangesEnd")}
            </p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.refund.contactHeading")}</h2>
            <p>{t("legal.refund.contactText")} <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>.</p>

            <LegalDisclaimer />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
