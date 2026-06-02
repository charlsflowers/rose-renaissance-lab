import { useTranslation } from "@/i18n/LanguageContext";
import { CheckCircle2 } from "lucide-react";

export const StorePickupAlert = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-3 rounded-lg border border-green-600/40 bg-green-50 p-4 text-green-800 dark:bg-green-950/30 dark:text-green-200">
      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
      <p className="font-body text-sm leading-relaxed">{t("product.storePickupAlert")}</p>
    </div>
  );
};
