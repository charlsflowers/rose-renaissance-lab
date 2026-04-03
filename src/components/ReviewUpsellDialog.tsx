import { useEffect, useState, useCallback, useRef } from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { miamiHourNow, todayInMiami, isTodayInMiami } from "@/lib/miamiTime";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Crown, Ribbon, Store, Truck, ShoppingBag, CreditCard, Star, Loader2, CalendarIcon, Clock, MapPin, Search } from "lucide-react";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import { crownOptions, crownPrice, ribbonPrice, ribbonPresets } from "@/lib/productData";
import { calculateDeliveryCost, formatDeliveryCost } from "@/lib/deliveryPricing";
import { fetchVariantsByHandle, findVariantByRoses, type ShopifyHandleVariant } from "@/lib/shopifyVariants";
import { performApiCheckout } from "@/lib/checkout";
import { bouquetProducts } from "@/lib/catalogData";
import type { ReviewCartData } from "@/components/ReviewCard";
import { toast } from "sonner";
import { buildAccessoryLineItems } from "@/lib/accessoryVariants";
import glitterRoseImg from "@/assets/glitter-rose.png";
import crownSilverImg from "@/assets/crown-silver.png";
import crownGoldImg from "@/assets/crown-gold.png";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartData: ReviewCartData;
  productLabel: string;
  mode: "cart" | "buy";
}

const ReviewUpsellDialog = ({ open, onOpenChange, cartData, productLabel, mode }: Props) => {
  const addItem = useCartStore(state => state.addItem);

  const [addGlitter, setAddGlitter] = useState(false);
  const [addCrown, setAddCrown] = useState(false);
  const [crownSize, setCrownSize] = useState("small");
  const [addRibbon, setAddRibbon] = useState(false);
  const [ribbonType, setRibbonType] = useState<"names" | "congratulations">("names");
  const [ribbonText, setRibbonText] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [isAdding, setIsAdding] = useState(false);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [variants, setVariants] = useState<ShopifyHandleVariant[]>([]);

  // Delivery state
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [deliveryHour, setDeliveryHour] = useState("");
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

  const fetchPredictions = useCallback(async (input: string) => {
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
    debounceRef.current = setTimeout(() => fetchPredictions(value), 350);
  }, [fetchPredictions]);

  const handleSelectPrediction = useCallback((prediction: { description: string; mainText: string; secondaryText: string }) => {
    setAddressQuery(prediction.description); setSelectedAddress(prediction.description); setShowPredictions(false); setPredictions([]);
    const fullText = prediction.description + " " + (prediction.secondaryText || "");
    const zipMatch = fullText.match(/\b(\d{5})\b/);
    if (zipMatch) setDeliveryZip(zipMatch[1]);
    (async () => {
      setDistanceLoading(true); setDistanceError(""); setDistanceTooFar(false); setDeliveryMiles(null);
      try {
        const { data, error } = await supabase.functions.invoke("calculate-distance", { body: { fullAddress: prediction.description } });
        if (error) throw new Error("Error de conexión");
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
    const closeHour = day === 0 ? 16 : day === 6 ? 17 : 19;
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
        const catalogProduct = bouquetProducts.find(p => p.name === productLabel);
        const handle = catalogProduct?.shopifyHandle || productLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const loaded = await fetchVariantsByHandle(handle);
        if (active) setVariants(loaded);
      } catch (error) {
        console.error("Failed to load review product variants:", error);
        if (active) setVariants([]);
      } finally {
        if (active) setVariantsLoading(false);
      }
    };
    loadVariants();
    return () => { active = false; };
  }, [open, productLabel]);

  const glitterCost = addGlitter ? Math.ceil(cartData.roses / 25) * 8 : 0;
  const deliveryCost = deliveryMethod === "delivery" && deliveryMiles && !distanceTooFar ? calculateDeliveryCost(deliveryMiles) : 0;
  const extrasTotal = glitterCost + (addCrown ? crownPrice : 0) + (addRibbon ? ribbonPrice : 0);
  const finalPrice = cartData.price + extrasTotal + deliveryCost;

  const isDeliveryInfoComplete = deliveryDate && deliveryHour && (deliveryMethod === "pickup" || (selectedAddress && deliveryMiles !== null && !distanceTooFar));

  const handleConfirm = async () => {
    if (variantsLoading) { toast.error("We are still loading product variants."); return; }
    if (!deliveryDate || !deliveryHour) { toast.error("Please select a delivery date and time before continuing."); return; }
    if (deliveryMethod === "delivery" && !selectedAddress) { toast.error("Please select a delivery address."); return; }
    if (deliveryMethod === "delivery" && (distanceTooFar || deliveryMiles === null)) { toast.error("The address is invalid or out of range."); return; }

    setIsAdding(true);
    try {
      const variant = findVariantByRoses(variants, cartData.roses);
      if (!variant) { toast.error("Could not resolve product variant for this bouquet."); setIsAdding(false); return; }

      const addons: string[] = [];
      if (addGlitter) addons.push("Glitter");
      if (addCrown) addons.push(`Crown (${crownSize})`);
      if (addRibbon) addons.push("Ribbon");

      const item: Omit<CartItem, 'shopifyLineId'> = {
        id: "",
        productName: cartData.bouquetType + " Bouquet",
        bouquetType: cartData.bouquetType,
        color: cartData.color,
        roses: cartData.roses,
        price: cartData.price,
        deliveryCost,
        totalPrice: finalPrice,
        addons,
        accessory: "",
        accessoryText: "",
        ribbonText: addRibbon ? ribbonText : "",
        crownSize: addCrown ? crownSize : "",
        specialText: "",
        heartColor: "",
        glitter: addGlitter,
        deliveryMethod,
        deliveryName: "",
        deliveryPhone: "",
        deliveryEmail: "",
        deliveryAddress: deliveryMethod === "delivery" ? selectedAddress : "Store pickup",
        deliveryZip: deliveryMethod === "delivery" ? deliveryZip : "",
        deliveryDate: deliveryDate ? format(deliveryDate, "PPP", { locale: enUS }) : "",
        deliveryHour,
        deliveryMiles: deliveryMethod === "delivery" ? deliveryMiles : null,
        paperColor: "Blanco",
        image: cartData.productImage,
        shopifyVariantId: variant.id,
      };
      await addItem(item);
      onOpenChange(false);

      if (mode === "buy") {
        const accessories = buildAccessoryLineItems({
          glitter: addGlitter,
          rosesCount: cartData.roses,
          accessory: "",
          specialText: "",
          addVase: false,
          addCrown,
          crownSize,
          addRibbon,
        });

        const noteLines: string[] = [];
        noteLines.push("DATOS DEL ENVÍO");
        noteLines.push(`- 🚚 Tipo: ${deliveryMethod === "delivery" ? "Home Delivery" : "Store Pickup"}`);
        if (deliveryDate) noteLines.push(`- 📅 Fecha: ${format(deliveryDate, "PPP", { locale: enUS })}`);
        if (deliveryHour) noteLines.push(`- ⏰ Hora: ${deliveryHour}`);
        if (deliveryMethod === "delivery" && selectedAddress) noteLines.push(`- 📍 Dirección: ${selectedAddress}`);
        noteLines.push("");
        noteLines.push("DATOS DEL PRODUCTO 1");
        noteLines.push(`- 🌹 Producto: ${cartData.bouquetType}`);
        if (cartData.color) noteLines.push(`- 🌸 Color: ${cartData.color}`);
        noteLines.push(`- 🌹 Roses: ${cartData.roses}`);
        if (addGlitter) noteLines.push(`- ✨ Glitter finish: Yes`);
        if (addCrown && crownSize) noteLines.push(`- 👑 Crown: ${crownSize}`);
        if (addRibbon && ribbonText) noteLines.push(`- 🎀 Custom ribbon: ${ribbonText}`);

        const cartTotalForFee = cartData.price + deliveryCost;

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
        toast.success("Added to cart!", { description: `${productLabel} — ${cartData.roses} roses` });
      }
    } catch (error) {
      toast.error("Failed to add to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {productLabel} · {cartData.roses} roses
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-body">Base price: ${cartData.price}</p>
        </DialogHeader>

        <div className="space-y-5 pt-2">
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
                <button className="w-full flex items-center gap-2 px-4 py-3 rounded-sm border border-border bg-card font-body text-sm text-foreground hover:border-primary/30 transition-all">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  {deliveryDate ? format(deliveryDate, "PPP", { locale: enUS }) : "Select a date"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={deliveryDate} onSelect={(d) => { setDeliveryDate(d); setDeliveryHour(""); setCalendarOpen(false); }}
                  disabled={(date) => isBefore(startOfDay(date), startOfDay(todayInMiami()))} className="p-3 pointer-events-auto" locale={enUS} />
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

          {/* Glitter */}
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-sm overflow-hidden border border-border flex-shrink-0">
              <img src={glitterRoseImg} alt="Glitter" className="w-full h-full object-cover" />
            </div>
            <button onClick={() => setAddGlitter(!addGlitter)}
              className={`flex-1 flex items-center gap-3 p-4 rounded-sm border-2 transition-all font-body text-sm ${
                addGlitter ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
              }`}>
              <Star className={`w-5 h-5 shrink-0 ${addGlitter ? "text-yellow-400 fill-yellow-400" : ""}`} />
              <div className="text-left flex-1">
                <p className="font-semibold">✨ Glitter</p>
                <p className="text-xs">Glitter finish on the roses</p>
              </div>
              <span className="text-xs font-semibold">+${glitterCost || Math.ceil(cartData.roses / 25) * 8}</span>
            </button>
          </div>

          {/* Crown */}
          <div>
            <button onClick={() => setAddCrown(!addCrown)}
              className={`w-full flex items-center gap-3 p-4 rounded-sm border-2 transition-all font-body text-sm ${
                addCrown ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
              }`}>
              <Crown className="w-5 h-5 shrink-0" />
              <div className="text-left flex-1">
                <p className="font-semibold">Crown</p>
                <p className="text-xs">Add a decorative crown</p>
              </div>
              <span className="text-xs font-semibold">+${crownPrice}</span>
            </button>
            {addCrown && (
              <div className="flex gap-3 mt-3 pl-2">
                {crownOptions.map((opt) => (
                  <button key={opt.size} onClick={() => setCrownSize(opt.size)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-sm border-2 text-xs font-body transition-all ${
                      crownSize === opt.size ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                    }`}>
                    <div className="w-16 h-12 overflow-hidden rounded-sm">
                      <img src={opt.size === "silver" ? crownSilverImg : crownGoldImg} alt={opt.label} className="w-full h-full object-contain" />
                    </div>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ribbon */}
          <div>
            <button onClick={() => { setAddRibbon(!addRibbon); if (addRibbon) setRibbonText(""); }}
              className={`w-full flex items-center gap-3 p-4 rounded-sm border-2 transition-all font-body text-sm ${
                addRibbon ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
              }`}>
              <Ribbon className="w-5 h-5 shrink-0" />
              <div className="text-left flex-1">
                <p className="font-semibold">Custom ribbon</p>
                <p className="text-xs">With any text you want</p>
              </div>
              <span className="text-xs font-semibold">+${ribbonPrice}</span>
            </button>
            {addRibbon && (
              <div className="mt-3 pl-2 space-y-3">
                <div className="flex gap-2">
                  {(["names", "congratulations"] as const).map((t) => (
                    <button key={t} onClick={() => { setRibbonType(t); setRibbonText(""); }}
                      className={`px-4 py-2 rounded-sm border text-xs font-body transition-all ${
                        ribbonType === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                      }`}>
                      {t === "names" ? "Names" : "Congratulations"}
                    </button>
                  ))}
                </div>
                {ribbonType === "congratulations" && (
                  <div className="flex flex-wrap gap-2">
                    {ribbonPresets.map((preset) => (
                      <button key={preset} onClick={() => setRibbonText(preset)}
                        className={`px-3 py-1.5 rounded-sm border text-xs font-body transition-all ${
                          ribbonText === preset ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                        }`}>
                        {preset}
                      </button>
                    ))}
                  </div>
                )}
                <input type="text" value={ribbonText} onChange={(e) => setRibbonText(e.target.value)}
                  placeholder={ribbonType === "names" ? "e.g. Ana & Carlos" : "e.g. Happy Birthday"}
                  className="w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            )}
          </div>

          {/* Total + CTA */}
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-display text-lg font-semibold text-foreground">${finalPrice}</span>
            </div>

            {!isDeliveryInfoComplete && (
              <p className="text-xs text-destructive font-body text-center">
                ⚠️ Please select delivery method, date and time to continue.
              </p>
            )}

            <button onClick={handleConfirm} disabled={isAdding || variantsLoading || !isDeliveryInfoComplete}
              className="inline-flex items-center gap-2 w-full justify-center bg-primary text-primary-foreground px-4 py-3 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-50">
              {isAdding || variantsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "buy" ? (
                <><CreditCard className="w-4 h-4" />Order & pay</>
              ) : (
                <><ShoppingBag className="w-4 h-4" />Add to cart</>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewUpsellDialog;
