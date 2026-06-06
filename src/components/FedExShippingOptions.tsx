import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plane, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/LanguageContext";
import { format, parseISO } from "date-fns";
import { enUS, es as esLocale } from "date-fns/locale";
import { getMiamiTime } from "@/lib/miamiTime";
import type { StructuredAddress, DeliveryResult } from "@/components/DeliveryCalculator";

function mapBackendError(msg: string, t: (k: string) => string): string {
  if (!msg) return t("fedex.errorGeneric");
  if (/over 100 roses/i.test(msg)) return t("fedex.overRosesLimit");
  if (/only available within the US/i.test(msg)) return t("fedex.onlyUS");
  const stateMatch = msg.match(/not available for ([A-Z]{2})/);
  if (stateMatch) return t("fedex.blockedState").replace("{state}", stateMatch[1]);
  return msg;
}

export interface FedExAttrs {
  serviceCode: string;
  rosesCount: number;
  recipientAddress: string; // JSON
}

interface FedExOption {
  serviceCode: string;
  serviceLabel: string;
  amount: number;
  fedexAmount: number;
  boxPrice: number;
  serviceFee: number;
  currency: string;
  commit?: string | null;
}

interface Props {
  fullAddress: string;
  structuredAddress: StructuredAddress | null;
  miles: number;
  roses: number;
  deliveryDate: string;
  itemsCount: number;
  onSelect: (result: DeliveryResult, attrs: FedExAttrs) => void;
  onClear: () => void;
}

const FedExShippingOptions = ({
  fullAddress,
  structuredAddress,
  miles,
  roses,
  deliveryDate,
  itemsCount,
  onSelect,
  onClear,
}: Props) => {
  const { t, language } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [options, setOptions] = useState<FedExOption[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>("");

  // Validate structured address has what we need
  const hasAddress =
    !!structuredAddress?.zip &&
    !!structuredAddress?.province &&
    !!structuredAddress?.address1;

  // Date availability rules (mirrors Flowers Point):
  //  - 11:00 AM Miami cutoff: after cutoff (or on weekends), first ship day
  //    is the next business day; otherwise today.
  //  - Earliest delivery = first ship day + 1.
  //  - FedEx does not pick up on weekends: a delivery whose ship day
  //    (delivery − 1) is Sat/Sun is not available.
  const availability = computeFedexDateAvailability(deliveryDate);
  const datesValid = !!deliveryDate && !availability.tooEarly && !availability.shipWeekend;

  useEffect(() => {
    let cancelled = false;
    const fetchRates = async () => {
      if (itemsCount > 1 || !hasAddress || !roses || !deliveryDate) return;
      if (!datesValid) return;
      setLoading(true);
      setError("");
      setOptions([]);
      setSelectedCode("");
      onClear();
      try {
        const { data, error: invokeError } = await supabase.functions.invoke(
          "calculate-fedex-shipping",
          {
            body: {
              recipient: {
                streetLines: [structuredAddress!.address1].filter(Boolean),
                city: structuredAddress!.city,
                stateOrProvinceCode: structuredAddress!.province,
                postalCode: structuredAddress!.zip,
                countryCode: structuredAddress!.country || "US",
                residential: true,
              },
              roses,
              deliveryDate,
            },
          },
        );
        if (cancelled) return;
        if (invokeError) {
          setError(t("fedex.errorGeneric"));
        } else if (data?.error) {
          setError(mapBackendError(data.error, t));
        } else if (Array.isArray(data?.options) && data.options.length > 0) {
          setOptions(data.options as FedExOption[]);
        } else {
          setError(t("fedex.noOptions"));
        }
      } catch {
        if (!cancelled) setError(t("fedex.errorConnection"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchRates();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAddress, structuredAddress?.zip, roses, deliveryDate, itemsCount, datesValid]);

  // Block when more than 1 bouquet — early return AFTER all hooks
  if (itemsCount > 1) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
        <p className="font-body text-sm text-foreground flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <span>{t("fedex.multiBouquetBlock")}</span>
        </p>
      </div>
    );
  }

  if (!hasAddress) {
    return (
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
        <p className="font-body text-sm text-destructive flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          {t("fedex.missingAddress")}
        </p>
      </div>
    );
  }

  if (!deliveryDate) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p className="font-body text-sm text-foreground">
          {t("fedex.needDate")}
        </p>
      </div>
    );
  }

  if (availability.tooEarly) {
    const niceDate = formatDeliveryDate(availability.minDeliveryISO, language);
    return (
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
        <p className="font-body text-sm text-destructive flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t("fedex.tooEarly").replace("{date}", niceDate)}</span>
        </p>
      </div>
    );
  }

  if (availability.shipWeekend) {
    return (
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
        <p className="font-body text-sm text-destructive flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t("fedex.shipWeekend")}</span>
        </p>
      </div>
    );
  }

  const handlePick = (opt: FedExOption) => {
    setSelectedCode(opt.serviceCode);
    const recipient = {
      address1: structuredAddress!.address1,
      city: structuredAddress!.city,
      province: structuredAddress!.province,
      zip: structuredAddress!.zip,
      country: structuredAddress!.country || "US",
    };
    onSelect(
      {
        miles,
        cost: opt.amount,
        address: fullAddress,
        structuredAddress: recipient,
      },
      {
        serviceCode: opt.serviceCode,
        rosesCount: roses,
        recipientAddress: JSON.stringify(recipient),
      },
    );
  };

  return (
    <div className="space-y-3">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
        <p className="font-body text-sm text-foreground flex items-center gap-2">
          <Plane className="w-4 h-4 text-primary" />
          {t("fedex.addressBanner").replace("{miles}", String(miles))}
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          {t("fedex.loadingRates")}
        </div>
      )}

      {error && !loading && (
        <div className="flex items-start gap-2 text-sm font-body text-destructive">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && options.length > 0 && (
        <div className="space-y-2">
          <p className="font-body text-xs text-muted-foreground">
            {t("fedex.selectService")}
          </p>
          {options.map((opt) => {
            const isSelected = selectedCode === opt.serviceCode;
            const windowLabel = getServiceWindow(opt, t);
            const deliveryLabel = formatDeliveryDate(opt.commit || deliveryDate, language);
            return (
              <button
                key={opt.serviceCode}
                type="button"
                onClick={() => handlePick(opt)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 rounded-lg border-2 px-4 py-3 text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40",
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-border shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground">
                      FedEx {opt.serviceLabel}
                      {windowLabel && (
                        <span className="font-normal text-muted-foreground"> ({windowLabel})</span>
                      )}
                    </p>
                    {deliveryLabel && (
                      <p className="font-body text-xs text-muted-foreground mt-0.5">
                        {t("fedex.deliveryOn").replace("{date}", deliveryLabel)}
                      </p>
                    )}
                  </div>
                </div>
                <p className="font-body text-base font-bold text-primary shrink-0">
                  ${opt.amount.toFixed(2)}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FedExShippingOptions;

// ---- helpers ----

function formatDeliveryDate(raw: string, lang: "en" | "es"): string {
  if (!raw) return "";
  // raw may be "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ss"
  const datePart = raw.slice(0, 10);
  try {
    const d = parseISO(datePart);
    return format(d, "MMM d", { locale: lang === "es" ? esLocale : enUS });
  } catch {
    return datePart;
  }
}

// Parse a "HH:mm" out of a commit dayFormat string if present
function extractTime(raw?: string | null): string {
  if (!raw || raw.length < 16) return "";
  const m = raw.match(/T(\d{2}):(\d{2})/);
  if (!m) return "";
  let h = parseInt(m[1], 10);
  const min = m[2];
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${min} ${ampm}`;
}

function getServiceWindow(opt: FedExOption, t: (k: string) => string): string {
  const commitTime = extractTime(opt.commit);
  // Standard fallbacks per service code
  const code = opt.serviceCode;
  let descKey = "";
  let fallback = "";
  if (code === "FIRST_OVERNIGHT") { descKey = "fedex.windowEarlyMorning"; fallback = "8:00 AM"; }
  else if (code === "PRIORITY_OVERNIGHT") { descKey = "fedex.windowMidMorning"; fallback = "10:30 AM"; }
  else if (code === "STANDARD_OVERNIGHT") { descKey = "fedex.windowAfternoon"; fallback = "5:00 PM"; }
  else if (code === "FEDEX_2_DAY_AM") { descKey = "fedex.windowMidMorning"; fallback = "10:30 AM"; }
  else if (code === "FEDEX_2_DAY" || code === "FEDEX_EXPRESS_SAVER" || code === "FEDEX_GROUND" || code === "GROUND_HOME_DELIVERY") {
    descKey = "fedex.windowEndOfDay"; fallback = "8:00 PM";
  } else {
    return commitTime ? `${t("fedex.byTime").replace("{time}", commitTime)}` : "";
  }
  const desc = t(descKey);
  const time = commitTime || fallback;
  return `${desc} · ${t("fedex.byTime").replace("{time}", time)}`;
}