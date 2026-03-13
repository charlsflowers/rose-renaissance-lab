import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format, addHours, isBefore, startOfDay } from "date-fns";
import { miamiHourNow, todayInMiami, isTodayInMiami } from "@/lib/miamiTime";
import { enUS } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { fetchVariantsByHandle, findVariantByRoses, toShopifyHandle, type ShopifyHandleVariant } from "@/lib/shopifyVariants";
import { calculateDeliveryCost, formatDeliveryCost } from "@/lib/deliveryPricing";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import PaperColorPicker from "@/components/PaperColorPicker"; // keep import but won't use for standard bouquets
import { bouquetProducts, bouquetSizeOptions } from "@/lib/catalogData";
import {
  crownOptions, ribbonPresets, crownPrice, ribbonPrice, letterNumberExtraPrice, vaseOptions, getPrice,
// Note: crown, ribbon, letters, vase are used for custom bouquets only; standard bouquets won't show them
} from "@/lib/productData";
import {
  ArrowLeft, Check, Store, Truck, CalendarIcon, Clock, MapPin, Search, Loader2,
  Type, Sparkles, Bug, Crown, Star, Hash,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const BouquetProductDetail = () => {
  const { type, productId } = useParams<{ type: string; productId: string }>();
  const addItem = useCartStore(state => state.addItem);
  const product = bouquetProducts.find((b) => b.id === productId);

  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [accessory, setAccessory] = useState<"none" | "note" | "card" | "butterfly">("none");
  const [accessoryText, setAccessoryText] = useState("");
  const [addCrown, setAddCrown] = useState(false);
  const [crownSize, setCrownSize] = useState("small");
  const [addRibbon, setAddRibbon] = useState(false);
  const [ribbonType, setRibbonType] = useState<"names" | "congratulations">("names");
  const [ribbonText, setRibbonText] = useState("");
  const [addGlitter, setAddGlitter] = useState(false);
  const [addLetters, setAddLetters] = useState(false);
  const [addNumbers, setAddNumbers] = useState(false);
  const [specialText, setSpecialText] = useState("");
  const [addVase, setAddVase] = useState(false);
  const [selectedVaseIdx, setSelectedVaseIdx] = useState(0);
  const [paperColor, setPaperColor] = useState("Blanco");
  const [isAdding, setIsAdding] = useState(false);
  const [variantsLoading, setVariantsLoading] = useState(true);
  const [productVariants, setProductVariants] = useState<ShopifyHandleVariant[]>([]);

  // Delivery state
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [deliveryHour, setDeliveryHour] = useState("");
  const [deliveryMiles, setDeliveryMiles] = useState<number | null>(null);
  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryZip, setDeliveryZip] = useState("");
  const [deliveryEmail, setDeliveryEmail] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
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
    if (!product) return;

    let active = true;

    const loadVariants = async () => {
      setVariantsLoading(true);
      try {
        const variants = await fetchVariantsByHandle(toShopifyHandle(product.name));
        if (active) setProductVariants(variants);
      } catch (error) {
        console.error("Failed to load bouquet variants:", error);
        if (active) setProductVariants([]);
      } finally {
        if (active) setVariantsLoading(false);
      }
    };

    loadVariants();

    return () => {
      active = false;
    };
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground font-body">Product not found</p>
          <Link to="/" className="text-primary font-body underline mt-4 inline-block">Go back</Link>
        </div>
      </div>
    );
  }

  // Count how many distinct colors this bouquet has
  const colorCount = product.color.split(/,\s*|\s+y\s+/).length;
  const hasCustomSizes = product.customSizes && product.customSizes.length > 0;
  const sizeOptions = hasCustomSizes ? product.customSizes! : bouquetSizeOptions;
  const minSizeIdx = hasCustomSizes ? 0 : (colorCount >= 3 ? 1 : 0); // 3+ colors → minimum 75 roses (index 1)

  // If current selection is below minimum, bump it up
  const effectiveSizeIdx = selectedSizeIdx < minSizeIdx ? minSizeIdx : (selectedSizeIdx >= sizeOptions.length ? sizeOptions.length - 1 : selectedSizeIdx);
  const selectedSize = hasCustomSizes ? { roses: sizeOptions[effectiveSizeIdx].roses } : bouquetSizeOptions[effectiveSizeIdx];
  const sizePrice = hasCustomSizes ? (product.customSizes![effectiveSizeIdx]?.price || 0) : getPrice(product.pricingTier, selectedSize.roses);
  const lettersExtra = addLetters ? specialText.replace(/[^A-Z]/gi, "").length * letterNumberExtraPrice : 0;
  const numbersExtra = addNumbers ? specialText.replace(/[^0-9]/g, "").length * letterNumberExtraPrice : 0;
  const glitterCost = addGlitter ? Math.ceil(selectedSize.roses / 25) * 8 : 0;
  const vaseCost = addVase ? vaseOptions[selectedVaseIdx].price : 0;
  const deliveryCost = deliveryMethod === "delivery" && deliveryMiles && !distanceTooFar ? calculateDeliveryCost(deliveryMiles) : 0;
  const basePrice = sizePrice + (addCrown ? crownPrice : 0) + (addRibbon ? ribbonPrice : 0) + lettersExtra + numbersExtra + glitterCost + vaseCost;
  const totalPrice = basePrice + deliveryCost;

  let step = 1;

  const handleAddToCart = async (): Promise<boolean> => {
    if (deliveryMethod === "delivery" && !selectedAddress) { toast.error("Please select a delivery address."); return false; }
    if (deliveryMethod === "delivery" && (distanceTooFar || deliveryMiles === null)) { toast.error("The address is invalid or out of range."); return false; }
    if (!deliveryDate || !deliveryHour) { toast.error("Please select a date and time."); return false; }

    setIsAdding(true);
    try {
      const variant = await resolveVariantId(product.name, selectedSize.roses, product.pricingTier);
      if (!variant) {
        toast.error("Could not resolve product variant. Please try again.");
        return false;
      }

      const addons: string[] = [];
      if (addGlitter) addons.push("Glitter");

      await addItem({
        id: "",
        bouquetType: product.type === "heart" ? "heart" : "classic",
        color: product.color,
        roses: selectedSize.roses,
        price: basePrice,
        deliveryCost,
        totalPrice,
        addons,
        accessory,
        accessoryText,
        ribbonText,
        crownSize: addCrown ? crownSize : "",
        specialText,
        heartColor: product.type === "heart" ? (product.color === "Rosa" ? "pink" : "red") : "",
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
        paperColor,
        shopifyVariantId: variant.id,
      });
      toast.success("Bouquet added to cart!");
      return true;
    } catch (error) {
      toast.error("Failed to add to cart.");
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const handlePayNow = async () => {
    const success = await handleAddToCart();
    if (success) {
      const checkoutUrl = await useCartStore.getState().createCheckoutUrl();
      if (!checkoutUrl) {
        toast.error("Could not start Shopify checkout. Please try again.");
        return;
      }

      const link = document.createElement('a');
      link.href = checkoutUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 md:pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/bouquets" className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <div className="max-w-4xl mx-auto space-y-10">
            {/* Product Images */}
            {/* Desktop: Grid */}
            <div className="hidden md:grid grid-cols-2 gap-3 max-w-3xl mx-auto">
              <div className="relative overflow-hidden rounded-sm bg-muted flex items-center justify-center aspect-square">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-6xl text-muted-foreground/20">🌹</span>
                  </div>
                )}
              </div>
              {product.image2 && (
                <div className="relative overflow-hidden rounded-sm bg-muted flex items-center justify-center aspect-square">
                  <img src={product.image2} alt={`${product.name} - view 2`} className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Mobile: Swipeable flex container */}
            <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-2 w-full">
              <div className="w-full flex-none snap-center relative overflow-hidden rounded-sm bg-muted flex items-center justify-center aspect-square">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain pointer-events-none" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-6xl text-muted-foreground/20">🌹</span>
                  </div>
                )}
              </div>
              {product.image2 && (
                <div className="w-full flex-none snap-center relative overflow-hidden rounded-sm bg-muted flex items-center justify-center aspect-square">
                  <img src={product.image2} alt={`${product.name} - view 2`} className="w-full h-full object-cover pointer-events-none" />
                </div>
              )}
            </div>

            {product.image2 && (
              <p className="md:hidden text-center text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">
                Swipe to see more
              </p>
            )}

            <div className="text-center">
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">{product.name}</h1>
              <p className="text-muted-foreground font-body mt-2">{product.description}</p>
            </div>

            {/* Paper Color - hidden for standard bouquets, shown only for custom */}
            {/* 
            <Section title="Color del Papel" step={step++}>
              <p className="text-xs text-muted-foreground font-body mb-4">Elige el color del papel de envoltura</p>
              <PaperColorPicker selected={paperColor} onChange={setPaperColor} />
            </Section>
            */}


            {/* 1. Size */}
            <Section title="Number of Roses" step={step++}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sizeOptions.map((size, idx) => {
                  const disabled = idx < minSizeIdx;
                  const price = hasCustomSizes ? (size as any).price : getPrice(product.pricingTier, size.roses);
                  const label = hasCustomSizes && (size as any).label ? (size as any).label : `${size.roses} roses`;
                  return (
                    <button key={size.roses} onClick={() => !disabled && setSelectedSizeIdx(idx)}
                      disabled={disabled}
                      className={`p-4 rounded-sm border-2 text-center transition-all ${disabled ? "opacity-40 cursor-not-allowed border-border" : effectiveSizeIdx === idx ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                      <p className="font-body text-foreground">
                        <span className="font-display text-2xl font-semibold">{size.roses}</span>
                        <span className="text-xs text-muted-foreground ml-1">{hasCustomSizes && (size as any).label ? (size as any).label : 'roses'}</span>
                      </p>
                      <p className="text-sm font-body font-semibold text-primary mt-1">${price}</p>
                      {disabled && <p className="text-[10px] text-destructive font-body mt-1">Min. {sizeOptions[minSizeIdx].roses} for {colorCount} colors</p>}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* 2. Glitter */}
            <Section title="Glitter Finish" step={step++} subtitle={`+$${Math.ceil(selectedSize.roses / 25) * 8}`}>
              <button onClick={() => setAddGlitter(!addGlitter)}
                className={`relative w-full p-6 rounded-sm border-2 transition-all overflow-hidden ${addGlitter ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                <div className="flex items-center gap-4 relative z-10">
                  <Star className={`w-6 h-6 transition-colors ${addGlitter ? "text-gold fill-gold" : "text-muted-foreground"}`} />
                  <div className="text-left">
                     <p className="font-body font-semibold text-foreground">✨ Add Glitter ✨</p>
                     <p className="text-xs text-muted-foreground font-body">$8 per 25 roses · {selectedSize.roses} roses = +${Math.ceil(selectedSize.roses / 25) * 8}</p>
                  </div>
                  {addGlitter && <Check className="w-5 h-5 text-primary ml-auto" />}
                </div>
              </button>
            </Section>

            {/* Letters/Numbers - only for custom bouquets */}


            {/* 4. Accessories */}
            <Section title="Accessories" step={step++} subtitle="Free">
              <div className="grid grid-cols-3 gap-3">
                {([
                  { type: "none" as const, label: "No accessory", icon: null },
                  { type: "note" as const, label: "Note", icon: Type },
                  { type: "card" as const, label: "Card", icon: Sparkles },
                ]).map(({ type: t, label, icon: Icon }) => (
                  <button key={t} onClick={() => setAccessory(t)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all font-body text-sm ${accessory === t ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                    {Icon && <Icon className="w-4 h-4" />}
                    {label}
                  </button>
                ))}
              </div>
              {(accessory === "note" || accessory === "card") && (
                <textarea value={accessoryText} onChange={(e) => setAccessoryText(e.target.value)} placeholder={`Write your ${accessory === "note" ? "note" : "card"}...`}
                  className="w-full mt-4 bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none" maxLength={200} />
              )}
            </Section>



            {/* 6. Delivery */}
            <Section title="Shipping" step={step++}>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={() => setDeliveryMethod("pickup")}
                  className={`flex items-center gap-3 p-5 rounded-sm border-2 transition-all font-body ${deliveryMethod === "pickup" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                  <Store className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm text-foreground">Store pickup</p>
                    <p className="text-xs text-muted-foreground">Free</p>
                  </div>
                  {deliveryMethod === "pickup" && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                </button>
                <button onClick={() => setDeliveryMethod("delivery")}
                  className={`flex items-center gap-3 p-5 rounded-sm border-2 transition-all font-body ${deliveryMethod === "delivery" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                  <Truck className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm text-foreground">Home delivery</p>
                    <p className="text-xs text-muted-foreground">From $20</p>
                  </div>
                  {deliveryMethod === "delivery" && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                </button>
              </div>

              <div className="space-y-4 p-5 rounded-sm border border-border bg-card mb-6">
                {deliveryMethod === "pickup" ? (
                  <p className="font-body text-sm text-muted-foreground">
                    📍 Pickup at: <span className="font-semibold text-foreground">7255 NW 12th St, Miami, FL 33126</span>
                  </p>
                ) : (
                  <>
                    <p className="font-body font-semibold text-foreground text-sm">Delivery address</p>
                    <div ref={autocompleteRef} className="relative">
                      <label className="text-xs text-muted-foreground font-body block mb-1"><MapPin className="w-3 h-3 inline mr-1" />Address <span className="text-destructive">*</span></label>
                      <div className="relative">
                        <input type="text" value={addressQuery} onChange={(e) => handleAddressInput(e.target.value)} onFocus={() => predictions.length > 0 && setShowPredictions(true)}
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
                      <div className="bg-primary/5 border border-primary/20 rounded-sm p-4">
                         <p className="font-body text-sm text-foreground">📍 Distance: <span className="font-semibold">{deliveryMiles} miles</span>{deliveryDuration && <span className="text-muted-foreground"> (~{deliveryDuration})</span>}</p>
                         <p className="font-body text-sm text-primary font-semibold mt-1">Shipping cost: {formatDeliveryCost(deliveryCost)}</p>
                      </div>
                    )}
                    {mapUrl && (
                      <div className="rounded-sm overflow-hidden border border-border">
                        <iframe src={mapUrl} width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Route" />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Date */}
              <div className="mb-4">
                <label className="text-sm font-body font-semibold text-foreground block mb-2"><CalendarIcon className="w-4 h-4 inline mr-1" /> Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full md:w-auto flex items-center gap-2 px-4 py-3 rounded-sm border border-border bg-card font-body text-sm text-foreground hover:border-primary/30 transition-all">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      {deliveryDate ? format(deliveryDate, "PPP", { locale: enUS }) : "Select a date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                     <Calendar mode="single" selected={deliveryDate} onSelect={(d) => { setDeliveryDate(d); setDeliveryHour(""); }}
                       disabled={(date) => isBefore(startOfDay(date), startOfDay(todayInMiami()))} className="p-3 pointer-events-auto" locale={enUS} />
                  </PopoverContent>
                </Popover>
              </div>
              {deliveryDate && (
                <div>
                  <label className="text-sm font-body font-semibold text-foreground block mb-2"><Clock className="w-4 h-4 inline mr-1" /> Time</label>
                  {availableHours.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {availableHours.map((hour) => (
                        <button key={hour} onClick={() => setDeliveryHour(hour)}
                          className={`px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${deliveryHour === hour ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>{hour}</button>
                      ))}
                    </div>
                  ) : <p className="text-sm text-muted-foreground font-body">No available hours. Select another day.</p>}
                </div>
              )}
            </Section>

            {/* Summary */}
            <div className="pb-4" />
            <div className="sticky bottom-0 bg-card/95 backdrop-blur-md border border-border rounded-sm p-3 md:p-4 shadow-xl z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                {/* Description and Price - Mobile Layout (Row 1) */}
                <div className="flex md:hidden justify-between items-center gap-3">
                  <p className="font-body text-[10px] text-muted-foreground leading-tight flex-1 line-clamp-1">
                    {product.name} · {selectedSize.roses} roses
                    {addGlitter && " · Glitter"}
                    {accessory !== "none" && ` · ${accessory === "note" ? "Note" : "Card"}`}
                  </p>
                  <p className="font-display text-lg font-bold text-foreground whitespace-nowrap">
                    ${totalPrice}
                  </p>
                </div>

                {/* Description - Desktop (Left side) */}
                <div className="hidden md:block flex-1 pr-4">
                  <p className="font-body text-xs text-muted-foreground leading-tight">
                    {product.name} · {selectedSize.roses} roses
                    {addGlitter && " · Glitter"}
                    {accessory !== "none" && ` · ${accessory === "note" ? "Note" : "Card"}`}
                    {deliveryMethod === "delivery" ? (deliveryMiles && !distanceTooFar ? ` · Shipping ($${deliveryCost})` : " · Shipping (pending)") : " · Pickup"}
                  </p>
                </div>

                {/* Price and Buttons - Desktop (Right side) / Buttons - Mobile (Row 2) */}
                <div className="flex flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
                  <p className="hidden md:block font-display text-2xl font-bold text-foreground whitespace-nowrap">
                    ${totalPrice} <span className="text-xs font-body text-muted-foreground font-normal">USD</span>
                  </p>
                  <div className="flex w-full md:w-auto gap-2">
                    <button onClick={handleAddToCart} disabled={isAdding}
                      className="flex-1 md:flex-none bg-primary text-primary-foreground px-4 md:px-6 py-2.5 md:py-3 font-body text-[10px] md:text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-50">
                      {isAdding ? "Adding..." : "Add to cart"}
                    </button>
                    <button onClick={handlePayNow} disabled={isAdding}
                      className="flex-1 md:flex-none border-2 border-primary text-primary px-4 md:px-6 py-2.5 md:py-3 font-body text-[10px] md:text-xs tracking-widest uppercase hover:bg-primary/10 transition-colors rounded-sm whitespace-nowrap disabled:opacity-50">
                      {isAdding ? "Adding..." : "Pay now"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, step, subtitle, children }: { title: string; step: number; subtitle?: string; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-sm font-semibold">{step}</span>
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      {subtitle && <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full font-body">{subtitle}</span>}
    </div>
    {children}
  </div>
);

export default BouquetProductDetail;
