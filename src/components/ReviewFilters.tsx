import type { ReviewCategory } from "@/components/ReviewCard";

const filters: { label: string; value: ReviewCategory }[] = [
  { label: "Bouquets", value: "bouquets" },
  { label: "Arreglos", value: "arreglos" },
  { label: "Cajas", value: "cajas" },
  { label: "Cestas", value: "cestas" },
  { label: "Jarrones", value: "jarrones" },
  { label: "Osos", value: "osos" },
];

interface ReviewFiltersProps {
  active: ReviewCategory;
  onChange: (category: ReviewCategory) => void;
}

const ReviewFilters = ({ active, onChange }: ReviewFiltersProps) => (
  <div className="flex flex-wrap justify-center gap-3 mb-12">
    {filters.map((f) => (
      <button
        key={f.value}
        onClick={() => onChange(f.value)}
        className={`px-5 py-2.5 font-body text-xs tracking-widest uppercase rounded-sm transition-colors ${
          active === f.value
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"
        }`}
      >
        {f.label}
      </button>
    ))}
  </div>
);

export default ReviewFilters;
