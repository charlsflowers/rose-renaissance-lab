import { useTranslation } from "@/i18n/LanguageContext";
import { AlertTriangle } from "lucide-react";

export const StorePickupAlert = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/10 p-4 text-primary">
      <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
      <p className="font-body text-sm leading-relaxed">{t("product.storePickupAlert")}</p>
    </div>
  );
};
