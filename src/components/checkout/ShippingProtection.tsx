import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useCartStore } from "@/stores/cartStore";
import { useTranslation } from "@/i18n/LanguageContext";
import {
  getShippingProtectionFallback,
  getShippingProtectionInfo,
  type ShippingProtectionInfo,
} from "@/lib/shippingProtection";

const ShippingProtection = () => {
  const { t } = useTranslation();
  const [info, setInfo] = useState<ShippingProtectionInfo>(getShippingProtectionFallback());
  const enabled = useCartStore((s) => s.shippingProtection);
  const setEnabled = useCartStore((s) => s.setShippingProtection);
  const itemCount = useCartStore((s) => s.items.length);

  useEffect(() => {
    let active = true;
    getShippingProtectionInfo().then((data) => {
      if (active && data) setInfo(data);
    });
    return () => {
      active = false;
    };
  }, []);

  if (itemCount === 0) return null;

  const price = info.amount;
  const imageUrl = info.imageUrl;
  const disabled = !info.available;

  useEffect(() => {
    if (disabled && enabled) {
      setEnabled(false);
    }
  }, [disabled, enabled, setEnabled]);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/[0.03] px-3 py-2.5">
      <div className="w-11 h-11 flex-shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={info.imageAlt || t("shippingProtection.label")}
            className="w-full h-full object-cover"
          />
        ) : (
          <ShieldCheck className="w-5 h-5 text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-body text-sm font-semibold text-foreground">
            {t("shippingProtection.label")}
          </p>
          <p className="font-body text-sm font-semibold text-primary">
            ${price.toFixed(2)}
          </p>
        </div>
        <p className="font-body text-[11px] leading-snug text-muted-foreground mt-0.5">
          {t("shippingProtection.description")}
        </p>
        {disabled && (
          <p className="font-body text-[11px] leading-snug text-muted-foreground mt-1">
            {t("shippingProtection.unavailable")}
          </p>
        )}
      </div>
      <Switch
        checked={!disabled && enabled}
        onCheckedChange={(v) => {
          if (disabled) return;
          setEnabled(!!v);
        }}
        disabled={disabled}
        aria-label={t("shippingProtection.label")}
      />
    </div>
  );
};

export default ShippingProtection;