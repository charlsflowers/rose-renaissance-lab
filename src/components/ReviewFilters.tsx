import { Lock } from "lucide-react";
import type { ReviewCategory } from "@/components/ReviewCard";
import { useTranslation } from "@/i18n/LanguageContext";

const comingSoonCategories: ReviewCategory[] = ["personalizados", "arreglos", "cajas", "cestas", "jarrones", "osos"];

interface ReviewFiltersProps {
  active: ReviewCategory;
  onChange: (category: ReviewCategory) => void;
}

const ReviewFilters = ({ active, onChange }: ReviewFiltersProps) => {
  const { t } = useTranslation();

  const filters: { label: string; value: ReviewCategory }[] = [
    { label: t("reviews.bouquets"), value: "bouquets" },
    { label: t("reviews.custom"), value: "personalizados" },
    { label: t("reviews.arrangements"), value: "arreglos" },
    { label: t("reviews.boxes"), value: "cajas" },
    { label: t("reviews.baskets"), value: "cestas" },
    { label: t("reviews.vases"), value: "jarrones" },
    { label: t("reviews.bears"), value: "osos" },
  ];

  return (
    <div className="flex md:flex-wrap md:justify-center gap-2 md:gap-3 mb-8 md:mb-12 overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide">
      {filters.map((f) => {
        const isLocked = comingSoonCategories.includes(f.value);
        return (
          <button
            key={f.value}
            onClick={() => !isLocked && onChange(f.value)}
            disabled={isLocked}
            className={`shrink-0 snap-start px-4 md:px-5 py-2 md:py-2.5 font-body text-[11px] md:text-xs tracking-widest uppercase rounded-lg transition-colors inline-flex items-center gap-1.5 ${
              isLocked
                ? "bg-muted text-muted-foreground/40 cursor-not-allowed border border-border"
                : active === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {isLocked && <Lock className="w-3 h-3" />}
            {f.label}
          </button>
        );
      })}
    </div>
  );
};

export default ReviewFilters;
