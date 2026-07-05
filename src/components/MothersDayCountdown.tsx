import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { getMothersDayWindow, isMothersDayPurchasable } from "@/lib/mothersDayPromo";
import { useTranslation } from "@/i18n/LanguageContext";

/** Human date, localized ("May 2, 2027" / "2 de mayo de 2027"). */
function fmtDate(d: Date, lang: string): string {
  return d.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Short date without year, for the range ("May 2" / "2 de mayo"). */
function fmtShort(d: Date, lang: string): string {
  return d.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    day: "numeric",
    month: "long",
  });
}

interface Unit {
  value: number;
  labelEn: string;
  labelEs: string;
}

/**
 * Countdown to the Mother's Day purchase mdWindow opening. Shown while the
 * collection is "locked" (coming soon). Pure UX/conversion — the SEO weight
 * lives in the page content, not the timer.
 */
const MothersDayCountdown = () => {
  const { language } = useTranslation();
  const isEs = language === "es";
  const mdWindow = getMothersDayWindow();
  const purchasable = isMothersDayPurchasable();

  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (purchasable) {
    return (
      <div className="inline-flex flex-col items-center gap-2 bg-primary/10 text-primary rounded-2xl px-6 py-4">
        <span className="font-body text-sm md:text-base font-semibold uppercase tracking-widest">
          {isEs ? "¡Ya disponible!" : "Available now!"}
        </span>
        <span className="font-body text-xs md:text-sm text-foreground/80">
          {isEs
            ? `Puedes comprar hasta el ${fmtDate(mdWindow.close, language)}`
            : `Order until ${fmtDate(mdWindow.close, language)}`}
        </span>
      </div>
    );
  }

  const diff = Math.max(0, mdWindow.open.getTime() - now);
  const totalSeconds = Math.floor(diff / 1000);
  const units: Unit[] = [
    { value: Math.floor(totalSeconds / 86400), labelEn: "Days", labelEs: "Días" },
    { value: Math.floor((totalSeconds % 86400) / 3600), labelEn: "Hours", labelEs: "Horas" },
    { value: Math.floor((totalSeconds % 3600) / 60), labelEn: "Minutes", labelEs: "Minutos" },
    { value: totalSeconds % 60, labelEn: "Seconds", labelEs: "Segundos" },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full">
        <Lock className="w-3.5 h-3.5" />
        <span className="font-body text-[11px] md:text-xs tracking-widest uppercase font-semibold">
          {isEs
            ? `Se abre del ${fmtShort(mdWindow.open, language)} al ${fmtDate(mdWindow.close, language)}`
            : `Opens ${fmtShort(mdWindow.open, language)} – ${fmtDate(mdWindow.close, language)}`}
        </span>
      </div>

      <div className="flex items-stretch gap-2 md:gap-3">
        {units.map((u) => (
          <div
            key={u.labelEn}
            className="flex flex-col items-center justify-center bg-foreground/[0.03] border border-border rounded-xl w-16 h-16 md:w-20 md:h-20"
          >
            <span className="font-display text-2xl md:text-3xl font-bold text-foreground tabular-nums">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="font-body text-[9px] md:text-[10px] uppercase tracking-wider text-muted-foreground">
              {isEs ? u.labelEs : u.labelEn}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MothersDayCountdown;
