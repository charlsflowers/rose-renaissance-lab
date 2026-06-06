import ShopifyPolicyPage from "@/components/ShopifyPolicyPage";
import { useTranslation } from "@/i18n/LanguageContext";

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  return (
    <ShopifyPolicyPage
      policyKey="privacyPolicy"
      fallbackTitle={t("legal.privacy.title")}
      seoTitle={t("legal.privacy.seoTitle")}
      seoDescription={t("legal.privacy.seoDescription")}
      path="/privacy-policy"
    />
  );
};

export default PrivacyPolicy;
