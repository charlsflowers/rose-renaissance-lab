import { Info } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

/**
 * Renders a subtle disclaimer note ONLY when the active language is Spanish.
 * Used at the bottom of legal pages to clarify that the EN version is the
 * legally binding one.
 */
const LegalDisclaimer = () => {
  const { t, language } = useTranslation();
  if (language !== "es") return null;
  return (
    <div className="mt-8 flex gap-3 items-start rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
      <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
      <p className="font-body leading-relaxed">{t("legal.disclaimer")}</p>
    </div>
  );
};

export default LegalDisclaimer;
