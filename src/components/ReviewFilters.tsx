import { Lock } from "lucide-react";
import type { ReviewCategory } from "@/components/ReviewCard";

const comingSoonCategories: ReviewCategory[] = ["personalizados", "arreglos", "cajas", "cestas", "jarrones", "osos"];

const filters: { label: string; value: ReviewCategory }[] = [
  { label: "Bouquets", value: "bouquets" },
  { label: "Custom", value: "personalizados" },
  { label: "Arrangements", value: "arreglos" },
  { label: "Boxes", value: "cajas" },
  { label: "Baskets", value: "cestas" },
  { label: "Vases", value: "jarrones" },
  { label: "Bears", value: "osos" },
];

interface ReviewFiltersProps {
  active: ReviewCategory;
  onChange: (category: ReviewCategory) => void;
}

const ReviewFilters = ({ active, onChange }: ReviewFiltersProps) => (
  <div className="flex flex-wrap justify-center gap-3 mb-12">
    {filters.map((f) => {
      const isLocked = comingSoonCategories.includes(f.value);
      return (
        <button
          key={f.value}
          onClick={() => !isLocked && onChange(f.value)}
          disabled={isLocked}
          className={`px-5 py-2.5 font-body text-xs tracking-widest uppercase rounded-sm transition-colors inline-flex items-center gap-1.5 ${
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

export default ReviewFilters;
