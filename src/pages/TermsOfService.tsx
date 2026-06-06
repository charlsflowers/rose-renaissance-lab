import ShopifyPolicyPage from "@/components/ShopifyPolicyPage";
import { useTranslation } from "@/i18n/LanguageContext";

const TermsOfService = () => {
  const { t } = useTranslation();
  return (
    <ShopifyPolicyPage
      policyKey="termsOfService"
      fallbackTitle={t("legal.terms.title")}
      seoTitle={t("legal.terms.seoTitle")}
      seoDescription={t("legal.terms.seoDescription")}
      path="/terms-of-service"
    />
  );
};

export default TermsOfService;
