import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plane, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StructuredAddress, DeliveryResult } from "@/components/DeliveryCalculator";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [options, setOptions] = useState<FedExOption[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>("");

  // Block when more than 1 bouquet
  if (itemsCount > 1) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
        <p className="font-body text-sm text-foreground flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <span>
            La dirección está a <strong>{miles} millas</strong> (envío FedEx). Para envíos
            FedEx con más de un ramo, contáctanos por <strong>WhatsApp</strong> para
            coordinar el envío manualmente.
          </span>
        </p>
      </div>
    );
  }

  // Validate structured address has what we need
  const hasAddress =
    !!structuredAddress?.zip &&
    !!structuredAddress?.province &&
    !!structuredAddress?.address1;

  useEffect(() => {
    let cancelled = false;
    const fetchRates = async () => {
      if (!hasAddress || !roses || !deliveryDate) return;
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
          setError("No pudimos calcular el envío FedEx. Intenta de nuevo.");
        } else if (data?.error) {
          setError(data.error);
        } else if (Array.isArray(data?.options) && data.options.length > 0) {
          setOptions(data.options as FedExOption[]);
        } else {
          setError("Sin opciones de envío FedEx disponibles para esta dirección.");
        }
      } catch {
        if (!cancelled) setError("Error de conexión con FedEx. Intenta de nuevo.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchRates();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAddress, structuredAddress?.zip, roses, deliveryDate]);

  if (!hasAddress) {
    return (
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
        <p className="font-body text-sm text-destructive flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          No pudimos leer la dirección completa (ZIP / estado). Selecciona la dirección
          de nuevo desde la lista de sugerencias.
        </p>
      </div>
    );
  }

  if (!deliveryDate) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p className="font-body text-sm text-foreground">
          Selecciona primero la <strong>fecha de entrega</strong> para ver tarifas FedEx.
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
          Dirección a <strong>{miles} millas</strong> — envío nacional vía
          <strong className="ml-1">FedEx</strong>
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Consultando tarifas FedEx...
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
            Selecciona un servicio de envío:
          </p>
          {options.map((opt) => {
            const isSelected = selectedCode === opt.serviceCode;
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
                    <p className="font-body text-sm font-semibold text-foreground truncate">
                      FedEx {opt.serviceLabel}
                    </p>
                    <p className="font-body text-[11px] text-muted-foreground">
                      Tarifa FedEx ${opt.fedexAmount.toFixed(2)} + caja ${opt.boxPrice} +
                      servicio ${opt.serviceFee}
                    </p>
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