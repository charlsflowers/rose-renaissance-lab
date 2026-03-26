import { useState, useEffect } from "react";
import { format, addHours, isBefore, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { miamiHourNow, todayInMiami, isTodayInMiami } from "@/lib/miamiTime";
import { Store, Truck, Loader2, CreditCard, CalendarIcon, Clock, Pencil } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import DeliveryCalculator, { type DeliveryResult } from "@/components/DeliveryCalculator";

interface Props {
  itemCount: number;
  itemsSubtotal: number;
  deliveryMethod: "pickup" | "delivery";
  setDeliveryMethod: (m: "pickup" | "delivery") => void;
  deliveryResult: DeliveryResult | null;
  setDeliveryResult: (r: DeliveryResult | null) => void;
  deliveryDate: string;
  setDeliveryDate: (d: string) => void;
  deliveryHour: string;
  setDeliveryHour: (h: string) => void;
  canCheckout: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  isCheckingOut: boolean;
  onCheckout: () => void;
}

// Hours will be dynamically filtered based on delivery method
const PICKUP_HOURS = [
  "9:30 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM",
];

const DELIVERY_HOURS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM",
];

const CheckoutSummaryBlock = ({
  itemCount, itemsSubtotal, deliveryMethod, setDeliveryMethod,
  deliveryResult, setDeliveryResult, deliveryDate, setDeliveryDate,
  deliveryHour, setDeliveryHour, canCheckout, isLoading, isSyncing,
  isCheckingOut, onCheckout,
}: Props) => {
  const needsAddress = deliveryMethod === "delivery";
  const deliveryCost = needsAddress && deliveryResult ? deliveryResult.cost : 0;
  const grandTotal = itemsSubtotal + deliveryCost;

  // Saved address so it persists when toggling methods
  const [savedResult, setSavedResult] = useState<DeliveryResult | null>(deliveryResult);
  const [showAddressEditor, setShowAddressEditor] = useState(!deliveryResult && deliveryMethod === "delivery");
  const [editingDateTime, setEditingDateTime] = useState(false);

  // Sync saved result
  useEffect(() => {
    if (deliveryResult) setSavedResult(deliveryResult);
  }, [deliveryResult]);

  const handleMethodChange = (method: "pickup" | "delivery") => {
    setDeliveryMethod(method);
    if (method === "delivery" && savedResult) {
      setDeliveryResult(savedResult);
      setShowAddressEditor(false);
    } else if (method === "delivery") {
      setShowAddressEditor(true);
    }
  };

  // Date filtering
  const today = todayInMiami();
  const disabledDays = { before: today };

  // Safely parse deliveryDate (could be yyyy-MM-dd or a display string like "March 20th, 2026")
  const parseDateSafe = (d: string): Date | null => {
    if (!d) return null;
    // Try yyyy-MM-dd first
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const parsed = new Date(d + "T00:00:00");
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    // Fallback: try native Date parse
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const parsedDate = parseDateSafe(deliveryDate);

  // Available hours based on date
  const availableHours = (() => {
    const baseHours = deliveryMethod === "pickup" ? PICKUP_HOURS : DELIVERY_HOURS;
    if (!parsedDate) return baseHours;
    // Filter by day of week closing time
    const day = parsedDate.getDay();
    const closeHour = day === 0 ? 17 : day === 6 ? 18 : 19;
    let filtered = baseHours.filter(h => {
      const match = h.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
      if (!match) return false;
      let hour24 = parseInt(match[1]);
      if (match[3] === "PM" && hour24 !== 12) hour24 += 12;
      if (match[3] === "AM" && hour24 === 12) hour24 = 0;
      return hour24 <= closeHour;
    });
    if (isTodayInMiami(parsedDate)) {
      const miamiNow = miamiHourNow();
      const cutoff = miamiNow + 3;
      filtered = filtered.filter(h => {
        const match = h.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
        if (!match) return false;
        let hour24 = parseInt(match[1]);
        if (match[3] === "PM" && hour24 !== 12) hour24 += 12;
        if (match[3] === "AM" && hour24 === 12) hour24 = 0;
        const minutes = parseInt(match[2]);
        return (hour24 + minutes / 60) > cutoff;
      });
    }
    return filtered;
  })();

  return (
    <div className="p-6 space-y-5">
      {/* Delivery method selector */}
      <div>
        <p className="font-body font-semibold text-foreground text-sm mb-3">Delivery method</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleMethodChange("pickup")}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all font-body text-xs",
              deliveryMethod === "pickup"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            <Store className="w-5 h-5" />
            Store pickup
          </button>
          <button
            onClick={() => handleMethodChange("delivery")}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all font-body text-xs",
              deliveryMethod === "delivery"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            <Truck className="w-5 h-5" />
            <span>Home delivery</span>
            <span className="text-[10px] text-muted-foreground font-normal">From $20</span>
          </button>
        </div>
      </div>

      {/* Pickup info */}
      {deliveryMethod === "pickup" && (
        <p className="font-body text-sm text-muted-foreground">
          📍 Pickup at: <span className="font-semibold text-foreground">7261 NW 12th St, Miami, FL 33126</span>
        </p>
      )}

      {/* Delivery address */}
      {deliveryMethod === "delivery" && deliveryResult && !showAddressEditor && (
        <div className="space-y-2">
          <p className="font-body text-sm text-muted-foreground">
            📍 Deliver to: <span className="font-semibold text-foreground">{deliveryResult.address}</span>
          </p>
          <p className="font-body text-sm text-muted-foreground">
            Shipping: <span className="font-semibold text-foreground">${deliveryResult.cost}</span>
            <span className="text-xs ml-2">({deliveryResult.miles.toFixed(1)} miles)</span>
          </p>
          <button
            onClick={() => setShowAddressEditor(true)}
            className="text-xs font-body text-primary underline hover:text-primary/80"
          >
            Change address
          </button>
        </div>
      )}

      {deliveryMethod === "delivery" && showAddressEditor && (
        <DeliveryCalculator
          onResult={(r) => {
            setDeliveryResult(r);
            if (r) {
              setSavedResult(r);
              setShowAddressEditor(false);
            }
          }}
        />
      )}

      {/* Date & time */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="font-body font-semibold text-foreground text-sm flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Delivery date & time
          </p>
          {(deliveryDate || deliveryHour) && !editingDateTime && (
            <button
              onClick={() => setEditingDateTime(true)}
              className="text-xs font-body text-primary underline hover:text-primary/80 inline-flex items-center gap-1"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
          )}
        </div>

        {(!deliveryDate && !deliveryHour) || editingDateTime ? (
          <div className="space-y-3">
            {/* Date picker */}
            <div>
              <label className="text-xs text-muted-foreground font-body block mb-1">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className={cn(
                    "w-full flex items-center gap-2 bg-background border border-border rounded-sm px-3 py-2.5 font-body text-sm text-left",
                    !deliveryDate && "text-muted-foreground"
                  )}>
                    <CalendarIcon className="w-4 h-4" />
                    {parsedDate ? format(parsedDate, "PPP", { locale: enUS }) : "Select date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parsedDate ?? undefined}
                    onSelect={(d) => {
                      if (d) {
                        setDeliveryDate(format(d, "yyyy-MM-dd"));
                      }
                    }}
                    disabled={disabledDays}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Hour picker */}
            <div>
              <label className="text-xs text-muted-foreground font-body block mb-1">
                <Clock className="w-3 h-3 inline mr-1" />
                Time
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableHours.map((h) => (
                  <button
                    key={h}
                    onClick={() => {
                      setDeliveryHour(h);
                      setEditingDateTime(false);
                    }}
                    className={cn(
                      "px-2 py-2 rounded-sm border text-xs font-body transition-all",
                      deliveryHour === h
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {editingDateTime && (
              <button
                onClick={() => setEditingDateTime(false)}
                className="text-xs font-body text-muted-foreground underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4 font-body text-sm">
            <span className="text-foreground">
              📅 {parsedDate ? format(parsedDate, "PPP", { locale: enUS }) : deliveryDate}
            </span>
            {deliveryHour && (
              <span className="text-foreground">
                🕐 {deliveryHour}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="border-t border-border pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-body text-sm text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
            <div className="space-y-1">
              <p className="font-body text-sm text-muted-foreground">
                Subtotal: <span className="text-foreground font-semibold">${itemsSubtotal}</span>
              </p>
              {needsAddress && (
                <p className="font-body text-sm text-muted-foreground">
                  Shipping:{" "}
                  <span className="text-foreground font-semibold">
                    {deliveryResult ? `$${deliveryCost}` : "Pending"}
                  </span>
                </p>
              )}
              <p className="font-display text-3xl font-bold text-foreground">
                ${parseFloat(grandTotal.toFixed(2))} <span className="text-sm font-body text-muted-foreground font-normal">USD</span>
              </p>
            </div>
          </div>
          <button
            disabled={!canCheckout || isLoading || isSyncing || isCheckingOut}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCheckout}
          >
            {isLoading || isSyncing || isCheckingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Complete order
              </>
            )}
          </button>
        </div>

        {!canCheckout && needsAddress && (
          <p className="text-xs font-body text-muted-foreground mt-3">
            ⚠️ Enter a valid delivery address to continue.
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckoutSummaryBlock;
