import { useEffect, useState, useCallback, useRef } from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { miamiHourNow, todayInMiami, isTodayInMiami } from "@/lib/miamiTime";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ShoppingBag, CreditCard, Loader2, Store, Truck, CalendarIcon, Clock, MapPin, Search } from "lucide-react";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import { letterNumberExtraPrice, ribbonPrice } from "@/lib/productData";
import { calculateDeliveryCost, formatDeliveryCost } from "@/lib/deliveryPricing";
import { fetchVariantsByHandle, findVariantByRoses, toShopifyHandle, type ShopifyHandleVariant } from "@/lib/shopifyVariants";
import { performApiCheckout } from "@/lib/checkout";
import { buildAccessoryLineItems } from "@/lib/accessoryVariants";
import type { VideoProduct } from "@/components/ClientVideos";
import { toast } from "sonner";

interface Props {
  video: VideoProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoOrderDialog = ({ video, open, onOpenChange }: Props) => {
  const addItem = useCartStore(state => state.addItem);
  
  const [customValues, setCustomValues] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [variants, setVariants] = useState<ShopifyHandleVariant[]>([]);

  // Delivery state
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [deliveryHour, setDeliveryHour] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [deliveryMiles, setDeliveryMiles] = useState<number | null>(null);
  const [deliveryZip, setDeliveryZip] = useState("");
  const [deliveryDuration, setDeliveryDuration] = useState("");
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [distanceError, setDistanceError] = useState("");
  const [distanceTooFar, setDistanceTooFar] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [predictions, setPredictions] = useState<Array<{ placeId: string; description: string; mainText: string; secondaryText: string }>>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) setShowPredictions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPredictionsHandler = useCallback(async (input: string) => {
    if (input.length < 3) { setPredictions([]); return; }
    setAutocompleteLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("places-autocomplete", { body: { input } });
      if (!error && data?.predictions) { setPredictions(data.predictions); setShowPredictions(true); }
    } catch {} finally { setAutocompleteLoading(false); }
  }, []);

  const handleAddressInput = useCallback((value: string) => {
    setAddressQuery(value); setSelectedAddress(""); setDeliveryMiles(null); setMapUrl(""); setDistanceError("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictionsHandler(value), 350);
  }, [fetchPredictionsHandler]);

  const handleSelectPrediction = useCallback((prediction: { description: string; mainText: string; secondaryText: string }) => {
    setAddressQuery(prediction.description); setSelectedAddress(prediction.description); setShowPredictions(false); setPredictions([]);
    const fullText = prediction.description + " " + (prediction.secondaryText || "");
    const zipMatch = fullText.match(/\b(\d{5})\b/);
    if (zipMatch) setDeliveryZip(zipMatch[1]);
    (async () => {
      setDistanceLoading(true); setDistanceError(""); setDistanceTooFar(false); setDeliveryMiles(null);
      try {
        const { data, error } = await supabase.functions.invoke("calculate-distance", { body: { fullAddress: prediction.description } });
        if (error) throw new Error("Connection error");
        if (data.error) { setDistanceError(data.error); if (data.tooFar) { setDistanceTooFar(true); setDeliveryMiles(data.miles); } }
        else { setDeliveryMiles(data.miles); setDeliveryDuration(data.duration); if (data.mapUrl) setMapUrl(data.mapUrl); }
      } catch (e: any) { setDistanceError(e.message || "Error calculating distance"); }
      finally { setDistanceLoading(false); }
    })();
  }, []);

  const minLeadHours = deliveryMethod === "delivery" ? 1.5 : 2;
  const minMiamiHour = miamiHourNow() + minLeadHours;
  const getAvailableHours = (date: Date | undefined) => {
    if (!date) return [];
    const day = date.getDay();
    if (day === 0) return []; // Sunday closed
    const closeHour = day === 6 ? 17 : 19;
    const hours: string[] = [];
    for (let h = 8; h <= closeHour; h++) {
      if (isTodayInMiami(date) && h < minMiamiHour) continue;
      hours.push(`${h.toString().padStart(2, "0")}:00`);
    }
    return hours;
  };
  const availableHours = getAvailableHours(deliveryDate);

  useEffect(() => {
    if (!open) return;
    let active = true;
    const loadVariants = async () => {
      setVariantsLoading(true);
      try {
        const loaded = await fetchVariantsByHandle(toShopifyHandle(video.title));
        if (active) setVariants(loaded);
      } catch (error) {
        console.error("Failed to load video product variants:", error);
        if (active) setVariants([]);
      } finally {
        if (active) setVariantsLoading(false);
      }
    };
    loadVariants();
    return () => { active = false; };
  }, [open, video.title]);

  const hasRibbon = video.customFields?.some(f => f.label.toLowerCase().includes("ribbon"));
  const hasLetterOrNumber = video.customFields?.some(f => f.label.toLowerCase().includes("letter") || f.label.toLowerCase().includes("number"));

  let extras = 0;
  if (video.glitter) extras += Math.ceil(video.roses / 25) * 8;
  if (hasRibbon && Object.values(customValues).some(v => v)) extras += ribbonPrice;
  if (hasLetterOrNumber) {
    const charCount = Object.entries(customValues)
      .filter(([key]) => {
        const field = video.customFields?.find(f => f.label === key);
        return field && (field.label.toLowerCase().includes("letter") || field.label.toLowerCase().includes("number"));
      })
      .reduce((acc, [, val]) => acc + val.length, 0);
    extras += charCount * letterNumberExtraPrice;
  }

  const deliveryCost = deliveryMethod === "delivery" && deliveryMiles && !distanceTooFar ? calculateDeliveryCost(deliveryMiles) : 0;
  const totalPrice = video.basePrice + extras + deliveryCost;

  const isDeliveryInfoComplete = deliveryDate && deliveryHour && (deliveryMethod === "pickup" || (selectedAddress && deliveryMiles !== null && !distanceTooFar));

  const handleConfirm = async (mode: "cart" | "buy") => {
    if (variantsLoading) { toast.error("We are still loading product variants."); return; }
    if (!deliveryDate || !deliveryHour) { toast.error("Please select a delivery date and time before continuing."); return; }
    if (deliveryMethod === "delivery" && !selectedAddress) { toast.error("Please select a delivery address."); return; }
    if (deliveryMethod === "delivery" && (distanceTooFar || deliveryMiles === null)) { toast.error("The address is invalid or out of range."); return; }

    setIsAdding(true);
    try {
      const variant = findVariantByRoses(variants, video.roses);
      if (!variant) {
        toast.error("Could not resolve product variant for this bouquet.");
        setIsAdding(false);
        return;
      }

      const addons: string[] = [];
      if (video.glitter) addons.push("Glitter");

      const ribbonText = video.customFields
        ?.filter(f => f.label.toLowerCase().includes("ribbon"))
        .map(f => customValues[f.label] || "")
        .filter(Boolean)
        .join(", ") || "";

      const specialText = video.customFields
        ?.filter(f => f.label.toLowerCase().includes("letter") || f.label.toLowerCase().includes("number"))
        .map(f => customValues[f.label] || "")
        .filter(Boolean)
        .join("") || "";

      if (ribbonText) addons.push("Custom ribbon");
      if (specialText) addons.push(`Letters/Numbers: ${specialText}`);

      const item: Omit<CartItem, 'shopifyLineId'> = {
        id: "",
        productName: "Video Bouquet",
        bouquetType: "round",
        color: video.color,
        roses: video.roses,
        price: video.basePrice,
        deliveryCost,
        totalPrice,
        addons,
        accessory: "",
        accessoryText: "",
        ribbonText,
        crownSize: "",
        specialText,
        heartColor: "",
        glitter: video.glitter || false,
        deliveryMethod,
        deliveryName: "",
        deliveryPhone: "",
        deliveryEmail: "",
        deliveryAddress: deliveryMethod === "delivery" ? selectedAddress : "Store pickup",
        deliveryZip: deliveryMethod === "delivery" ? deliveryZip : "",
        deliveryDate: deliveryDate ? format(deliveryDate, "PPP", { locale: enUS }) : "",
        deliveryHour,
        deliveryMiles: deliveryMethod === "delivery" ? deliveryMiles : null,
        paperColor: video.paperColor || "White",
        image: video.productImage,
        shopifyVariantId: variant.id,
      };

      await addItem(item);
      onOpenChange(false);

      if (mode === "buy") {
        const accessories = buildAccessoryLineItems({
          glitter: video.glitter || false,
          rosesCount: video.roses,
          accessory: "",
          specialText,
          addVase: false,
          addCrown: false,
          crownSize: "",
          addRibbon: !!ribbonText,
        });

        const noteLines: string[] = [];
        noteLines.push("DATOS DEL ENVÍO");
        noteLines.push(`- 🚚 Tipo: ${deliveryMethod === "delivery" ? "Home Delivery" : "Store Pickup"}`);
        if (deliveryDate) noteLines.push(`- 📅 Fecha: ${format(deliveryDate, "PPP", { locale: enUS })}`);
        if (deliveryHour) noteLines.push(`- ⏰ Hora: ${deliveryHour}`);
        if (deliveryMethod === "delivery" && selectedAddress) noteLines.push(`- 📍 Dirección: ${selectedAddress}`);
        noteLines.push("");
        noteLines.push("DATOS DEL PRODUCTO 1");
        noteLines.push(`- 🌹 Producto: ${video.color} Roses`);
        noteLines.push(`- 📄 Paper color: ${video.paperColor || "White"}`);
        noteLines.push(`- 🌹 Roses: ${video.roses}`);
        if (video.glitter) noteLines.push(`- ✨ Glitter finish: Yes`);
        if (ribbonText) noteLines.push(`- 🎀 Custom ribbon: ${ribbonText}`);
        if (specialText) noteLines.push(`- 🔤 Letters or numbers (Baby Breath): ${specialText}`);

        const cartTotalForFee = video.basePrice + deliveryCost;

        const checkoutUrl = await performApiCheckout({
          deliveryMethod,
          deliveryCost,
          serviceFeeBase: cartTotalForFee,
          deliveryAddress: deliveryMethod === "delivery" ? selectedAddress : undefined,
          deliveryZip: deliveryMethod === "delivery" ? deliveryZip : undefined,
          accessories,
          note: noteLines.join("\n"),
        });

        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          toast.error("Could not get checkout URL.");
        }
        toast.success("Added to cart!", {
          description: `${video.roses} ${video.color} roses`,
        });
      }
    } catch (error) {
      toast.error("Failed to add to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {video.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-body">
            {video.roses} roses · {video.color} · Base price: ${video.basePrice}
          </p>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {video.hasCustomText && video.customFields && (
            <div className="space-y-4">
              <p className="font-body text-sm font-semibold text-foreground">Customize your bouquet</p>
              {video.customFields.map((field) => (
                <div key={field.label}>
                  <label className="text-xs text-muted-foreground font-body block mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={customValues[field.label] || ""}
                    onChange={(e) => setCustomValues(prev => ({ ...prev, [field.label]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    maxLength={field.label.toLowerCase().includes("ribbon") ? 50 : 4}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {video.glitter && (
              <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-body">
                ✨ Glitter finish
              </span>
            )}
            {video.paperColor && (
              <span className="bg-muted text-muted-foreground px-3 py-1.5 rounded-full text-xs font-body">
                Paper: {video.paperColor}
              </span>
            )}
          </div>

          {/* Delivery method */}
          <div>
            <p className="font-body text-sm font-semibold text-foreground mb-3">Delivery method <span className="text-destructive">*</span></p>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: "pickup" as const, label: "Store pickup", icon: Store },
                { value: "delivery" as const, label: "Home delivery", icon: Truck },
              ]).map(({ value, label, icon: Icon }) => (
                <button key={value} onClick={() => setDeliveryMethod(value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all font-body text-xs ${
                    deliveryMethod === value ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                  }`}>
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery address */}
          {deliveryMethod === "delivery" && (
            <div className="space-y-3">
              <p className="font-body font-semibold text-foreground text-sm">Delivery address</p>
              <div ref={autocompleteRef} className="relative">
                <div className="relative">
                  <input type="text" value={addressQuery} onChange={(e) => handleAddressInput(e.target.value)}
                    onFocus={() => predictions.length > 0 && setShowPredictions(true)}
                    placeholder="Start typing the address..."
                    className="w-full bg-background border border-border rounded-sm px-3 py-2.5 pr-10 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {autocompleteLoading || distanceLoading ? <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" /> : <Search className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
                {showPredictions && predictions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-sm shadow-lg max-h-60 overflow-y-auto">
                    {predictions.map((p) => (
                      <button key={p.placeId} onClick={() => handleSelectPrediction(p)} className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors border-b border-border last:border-b-0">
                        <p className="font-body text-sm font-medium text-foreground">{p.mainText}</p>
                        <p className="font-body text-xs text-muted-foreground">{p.secondaryText}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedAddress && (
                <div className="bg-primary/5 border border-primary/20 rounded-sm p-3">
                  <p className="font-body text-xs text-muted-foreground">Selected address:</p>
                  <p className="font-body text-sm text-foreground font-medium">{selectedAddress}</p>
                </div>
              )}
              {distanceError && <p className="text-sm font-body text-destructive">{distanceError}</p>}
              {deliveryMiles !== null && !distanceTooFar && (
                <div className="bg-primary/5 border border-primary/20 rounded-sm p-3">
                  <p className="font-body text-sm text-foreground">📍 Distance: <span className="font-semibold">{deliveryMiles} miles</span>{deliveryDuration && <span className="text-muted-foreground"> (~{deliveryDuration})</span>}</p>
                  <p className="font-body text-sm text-primary font-semibold mt-1">Shipping cost: {formatDeliveryCost(deliveryCost)}</p>
                </div>
              )}
              {mapUrl && (
                <div className="rounded-sm overflow-hidden border border-border">
                  <iframe src={mapUrl} width="100%" height="200" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Route" />
                </div>
              )}
            </div>
          )}

          {deliveryMethod === "pickup" && (
            <p className="font-body text-sm text-muted-foreground">
              📍 Pickup at: <span className="font-semibold text-foreground">7261 NW 12th St, Miami, FL 33126</span>
            </p>
          )}

          {/* Date */}
          <div>
            <label className="text-sm font-body font-semibold text-foreground block mb-2">
              <CalendarIcon className="w-4 h-4 inline mr-1" /> Date <span className="text-destructive">*</span>
            </label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button type="button" className="w-full flex items-center gap-2 px-4 py-3 rounded-sm border border-border bg-card font-body text-sm text-foreground hover:border-primary/30 transition-all">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  {deliveryDate ? format(deliveryDate, "PPP", { locale: enUS }) : "Select a date"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={deliveryDate} onSelect={(d) => { if (d) { setDeliveryDate(d); setDeliveryHour(""); setCalendarOpen(false); } }}
                  disabled={(date) => isBefore(startOfDay(date), startOfDay(todayInMiami())) || date.getDay() === 0 || (date >= new Date(2026, 3, 27) && date <= new Date(2026, 4, 12))} className="p-3 pointer-events-auto" locale={enUS} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          {deliveryDate && (
            <div>
              <label className="text-sm font-body font-semibold text-foreground block mb-2">
                <Clock className="w-4 h-4 inline mr-1" /> Time <span className="text-destructive">*</span>
              </label>
              {availableHours.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {availableHours.map((hour) => (
                    <button key={hour} onClick={() => setDeliveryHour(hour)}
                      className={`px-3 py-1.5 rounded-sm border-2 text-xs font-body transition-all ${deliveryHour === hour ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                      {hour}
                    </button>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground font-body">No available hours. Select another day.</p>}
            </div>
          )}

          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-display text-lg font-semibold text-foreground">${totalPrice}</span>
            </div>

            {!isDeliveryInfoComplete && (
              <p className="text-xs text-destructive font-body text-center">
                ⚠️ Please select delivery method, date and time to continue.
              </p>
            )}

            <button
              onClick={() => handleConfirm("cart")}
              disabled={isAdding || variantsLoading}
              className="inline-flex items-center gap-2 w-full justify-center bg-primary text-primary-foreground px-4 py-3 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-50"
            >
              {isAdding || variantsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShoppingBag className="w-4 h-4" /> Add to cart</>}
            </button>
            <button
              onClick={() => handleConfirm("buy")}
              disabled={isAdding || variantsLoading || !isDeliveryInfoComplete}
              className="inline-flex items-center gap-2 w-full justify-center border border-primary text-primary px-4 py-3 font-body text-sm tracking-widest uppercase hover:bg-primary/10 transition-colors rounded-sm disabled:opacity-50"
            >
              {isAdding || variantsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Order & pay</>}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoOrderDialog;
