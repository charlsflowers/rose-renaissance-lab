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
  const hasHomeDelivery = useCartStore((s) =>
    s.items.some(
      (i) =>
        i.deliveryMethod === "delivery" &&
        i.deliveryAddress &&
        i.deliveryAddress !== "Store pickup",
    ),
  );

  useEffect(() => {
    let active = true;
    getShippingProtectionInfo().then((data) => {
      if (active && data) setInfo(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const price = info.amount;
  const imageUrl = info.imageUrl;
  const disabled = !info.available;

  useEffect(() => {
    if (disabled && enabled) {
      setEnabled(false);
    }
  }, [disabled, enabled, setEnabled]);

  // Auto-enable by default whenever Home Delivery is present and the product is available.
  useEffect(() => {
    if (hasHomeDelivery && !disabled && !enabled) {
      setEnabled(true);
    }
    // Turn it off automatically if the cart switches to Store Pickup.
    if (!hasHomeDelivery && enabled) {
      setEnabled(false);
    }
  }, [hasHomeDelivery, disabled, enabled, setEnabled]);

  if (itemCount === 0) return null;
  // Only show for Home Delivery — hide entirely on Store Pickup.
  if (!hasHomeDelivery) return null;

  return (
    <div className="relative flex items-center gap-2.5 sm:gap-3.5 rounded-lg border border-primary/20 bg-primary/[0.03] px-2.5 py-2 sm:px-3.5 sm:py-3">
      {!disabled && !enabled && (
        <span className="absolute -top-2.5 right-3 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-body font-semibold uppercase tracking-wider leading-none shadow-sm">
          {t("shippingProtection.recommended")}
        </span>
      )}
      <div className="w-8 h-8 sm:w-11 sm:h-11 flex-shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={info.imageAlt || t("shippingProtection.label")}
            className="w-full h-full object-cover"
          />
        ) : (
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-body text-xs sm:text-sm font-semibold text-foreground">
            {t("shippingProtection.label")}
          </p>
          <p className="font-body text-xs sm:text-sm font-semibold text-primary">
            ${price.toFixed(2)}
          </p>
        </div>
        <p className="font-body text-[10px] sm:text-xs leading-snug text-muted-foreground mt-0.5 line-clamp-2">
          {t("shippingProtection.description")}
        </p>
        {disabled && (
          <p className="font-body text-[10px] sm:text-xs leading-snug text-muted-foreground mt-1">
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