import ShopifyPolicyPage from "@/components/ShopifyPolicyPage";
import { useTranslation } from "@/i18n/LanguageContext";

const ShippingPolicy = () => {
  const { t } = useTranslation();
  return (
    <ShopifyPolicyPage
      policyKey="shippingPolicy"
      fallbackTitle={t("legal.shipping.title")}
      seoTitle={t("legal.shipping.seoTitle")}
      seoDescription={t("legal.shipping.seoDescription")}
      path="/shipping-policy"
    />
  );
};

export default ShippingPolicy;
