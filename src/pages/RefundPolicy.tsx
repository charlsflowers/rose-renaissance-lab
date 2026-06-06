import ShopifyPolicyPage from "@/components/ShopifyPolicyPage";
import { useTranslation } from "@/i18n/LanguageContext";

const RefundPolicy = () => {
  const { t } = useTranslation();
  return (
    <ShopifyPolicyPage
      policyKey="refundPolicy"
      fallbackTitle={t("legal.refund.title")}
      seoTitle={t("legal.refund.seoTitle")}
      seoDescription={t("legal.refund.seoDescription")}
      path="/refund-policy"
    />
  );
};

export default RefundPolicy;
