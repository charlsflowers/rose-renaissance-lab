import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format, isBefore, startOfDay } from "date-fns";
import { miamiHourNow, todayInMiami, isTodayInMiami } from "@/lib/miamiTime";
import { enUS } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { format, isBefore, startOfDay } from "date-fns";
import { DELIVERY_FEE_VARIANT_GID } from "@/lib/accessoryVariants";
import Navbar from "@/components/Navbar";
import { roomDecorPackages, roomDecorBouquetColors } from "@/lib/roomDecorData";
import { calculateRoomDecorDeliveryCost, formatDeliveryCost } from "@/lib/deliveryPricing";
import { applySeo } from "@/lib/seoData";
import { buildCheckoutUrl } from "@/lib/checkout";
import { buildAccessoryLineItems } from "@/lib/accessoryVariants";
import {
  ArrowLeft, Check, Store, Truck, CalendarIcon, Clock, MapPin, Search, Loader2, Heart,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const RoomDecorDetail = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const addItem = useCartStore(state => state.addItem);
  const pkg = roomDecorPackages.find(p => p.id === packageId);

  const [selectedBouquetColor, setSelectedBouquetColor] = useState(roomDecorBouquetColors[0]);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [addRibbon, setAddRibbon] = useState(false);
  const [ribbonText, setRibbonText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Delivery state
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("delivery");
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

  useEffect(() => { window.scrollTo(0, 0); if (pkg) applySeo(pkg.shopifyHandle); }, [pkg]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) setShowPredictions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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
    const closeHour = day === 0 ? 17 : day === 6 ? 18 : 19;
    const hours: string[] = [];
    if (deliveryMethod === "pickup") {
      if (!isTodayInMiami(date) || 9.5 >= minMiamiHour) {
        hours.push("9:30 AM");
      }
    }
    const startH = deliveryMethod === "pickup" ? 10 : 10;
    for (let h = startH; h <= closeHour; h++) {
      if (isTodayInMiami(date) && h < minMiamiHour) continue;
      const ampm = h < 12 ? "AM" : "PM";
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      hours.push(`${h12}:00 ${ampm}`);
    }
    return hours;
  };
  const availableHours = getAvailableHours(deliveryDate);

  if (!pkg) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground font-body">Package not found</p>
          <Link to="/room-decors" className="text-primary font-body underline mt-4 inline-block">Go back</Link>
        </div>
      </div>
    );
  }

  const toggleAddon = (idx: number) => {
    setSelectedAddons(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx);
      if (prev.length >= pkg.maxAddons) return [...prev.slice(1), idx];
      return [...prev, idx];
    });
  };

  const addonsCost = selectedAddons.reduce((sum, idx) => sum + (pkg.addons[idx]?.price || 0), 0);
  const ribbonCost = addRibbon && pkg.ribbonOption ? pkg.ribbonOption.price : 0;
  const deliveryCost = deliveryMethod === "delivery" && deliveryMiles && !distanceTooFar
    ? calculateRoomDecorDeliveryCost(deliveryMiles) : 0;
  const totalPrice = pkg.price + addonsCost + ribbonCost + deliveryCost;

  const handleAddToCart = async (): Promise<boolean> => {
    if (deliveryMethod === "delivery" && !selectedAddress) { toast.error("Please select a delivery address."); return false; }
    if (deliveryMethod === "delivery" && (distanceTooFar || deliveryMiles === null)) { toast.error("The address is invalid or out of range."); return false; }
    if (!deliveryDate || !deliveryHour) { toast.error("Please select a date and time."); return false; }

    setIsAdding(true);
    try {
      const addons: string[] = [];
      selectedAddons.forEach(idx => addons.push(pkg.addons[idx].label));
      if (pkg.bouquetIncluded) addons.push(`Bouquet: ${selectedBouquetColor}`);
      if (addRibbon) addons.push(`Ribbon: "${ribbonText}"`);

      await addItem({
        id: "",
        productName: pkg.name,
        bouquetType: `room-decor`,
        color: pkg.name,
        roses: pkg.bouquetIncluded?.roses || 0,
        price: pkg.price + addonsCost + ribbonCost,
        deliveryCost,
        totalPrice,
        addons,
        accessory: "none",
        accessoryText: "",
        ribbonText: addRibbon ? ribbonText : "",
        crownSize: "",
        specialText: "",
        heartColor: "",
        glitter: false,
        deliveryMethod,
        deliveryName: "",
        deliveryPhone: "",
        deliveryEmail: "",
        deliveryAddress: deliveryMethod === "delivery" ? selectedAddress : "Store pickup",
        deliveryZip: deliveryMethod === "delivery" ? deliveryZip : "",
        deliveryDate: deliveryDate ? format(deliveryDate, "PPP", { locale: enUS }) : "",
        deliveryHour,
        deliveryMiles: deliveryMethod === "delivery" ? deliveryMiles : null,
        paperColor: "",
        shopifyVariantId: pkg.shopifyVariantId,
        image: pkg.image,
      });
      toast.success(`${pkg.name} added to cart!`);
      return true;
    } catch {
      toast.error("Failed to add to cart.");
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const handlePayNow = async () => {
    const success = await handleAddToCart();
    if (!success) return;

    try {
      const noteLines: string[] = [];
      noteLines.push("DATOS DEL ENVÍO");
      noteLines.push(`- 🚚 Tipo: ${deliveryMethod === "delivery" ? "Home Delivery" : "Store Pickup"}`);
      if (deliveryDate) noteLines.push(`- 📅 Fecha: ${format(deliveryDate, "PPP", { locale: enUS })}`);
      if (deliveryHour) noteLines.push(`- ⏰ Hora: ${deliveryHour}`);
      if (deliveryMethod === "delivery" && selectedAddress) noteLines.push(`- 📍 Dirección: ${selectedAddress}`);
      noteLines.push("");
      noteLines.push("DATOS DEL PRODUCTO 1");
      noteLines.push(`- 🌹 Producto: ${pkg.name}`);
      if (pkg.bouquetIncluded && selectedBouquetColor) noteLines.push(`- 🌸 Bouquet color: ${selectedBouquetColor}`);
      if (addRibbon && ribbonText) noteLines.push(`- 🎀 Custom ribbon: ${ribbonText}`);
      if (selectedAddons.length > 0) {
        const addonLabels = selectedAddons.map(idx => pkg.addons[idx]?.label).filter(Boolean);
        noteLines.push(`- 🎁 Add-ons: ${addonLabels.join(", ")}`);
      }

      const cartTotalForFee = (pkg.price + addonsCost + ribbonCost) + (deliveryMethod === "delivery" ? deliveryCost : 0);
      const serviceFeePrice = cartTotalForFee * 0.05;

      const finalUrl = buildCheckoutUrl(pkg.shopifyVariantId, {
        deliveryMethod,
        deliveryCost,
        serviceFee: serviceFeePrice,
        deliveryAddress: deliveryMethod === "delivery" ? selectedAddress : undefined,
        deliveryZip: deliveryMethod === "delivery" ? deliveryZip : undefined,
        deliveryDate: deliveryDate ? format(deliveryDate, "PPP", { locale: enUS }) : undefined,
        deliveryTime: deliveryHour || undefined,
        accessories: [],
        note: noteLines.join("\n"),
      });

      if (finalUrl) {
        window.location.href = finalUrl;
      } else {
        toast.error("Could not get checkout URL.");
      }
    } catch {
      toast.error("Checkout error. Please try again.");
    }
  };

  let step = 1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 md:pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/room-decors" className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <div className="max-w-4xl mx-auto space-y-10">
            {/* Image */}
            <div className="relative overflow-hidden rounded-sm bg-muted flex items-center justify-center aspect-video">
              <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
            </div>

            <div className="text-center">
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">{pkg.name}</h1>
              <p className="text-muted-foreground font-body mt-2">{pkg.description}</p>
              <p className="font-display text-4xl font-bold text-primary mt-4">${pkg.price}</p>
            </div>

            {/* What's included */}
            <Section title="What's Included" step={step++}>
              <div className="space-y-2">
                {pkg.includes.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-sm bg-primary/5 border border-primary/10">
                    <Heart className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 fill-primary" />
                    <p className="font-body text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
              {pkg.bouquetIncluded?.restrictionsApply && (
                <p className="text-xs text-muted-foreground font-body mt-3 italic">* Restrictions Apply</p>
              )}
            </Section>

            {/* Bouquet color selection */}
            {pkg.bouquetIncluded && (
              <Section title="Bouquet Color" step={step++} subtitle="Included">
                <p className="text-xs text-muted-foreground font-body mb-4">
                  Choose the color for your {pkg.bouquetIncluded.roses}-rose bouquet
                </p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {roomDecorBouquetColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedBouquetColor(color)}
                      className={`p-3 rounded-sm border-2 text-center transition-all font-body text-sm ${
                        selectedBouquetColor === color
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {color}
                      {selectedBouquetColor === color && <Check className="w-3 h-3 mx-auto mt-1 text-primary" />}
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {/* Ribbon option (Overly Romantic) */}
            {pkg.ribbonOption && (
              <Section title="Bouquet Ribbon" step={step++} subtitle={`+$${pkg.ribbonOption.price}`}>
                <button
                  onClick={() => setAddRibbon(!addRibbon)}
                  className={`w-full p-5 rounded-sm border-2 transition-all flex items-center gap-4 ${
                    addRibbon ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="text-left flex-1">
                    <p className="font-body font-semibold text-foreground">Add a ribbon to the bouquet</p>
                    <p className="text-xs text-muted-foreground font-body">+${pkg.ribbonOption.price}</p>
                  </div>
                  {addRibbon && <Check className="w-5 h-5 text-primary" />}
                </button>
                {addRibbon && (
                  <input
                    type="text"
                    value={ribbonText}
                    onChange={(e) => setRibbonText(e.target.value)}
                    placeholder="Write the ribbon text..."
                    maxLength={40}
                    className="w-full mt-3 bg-card border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                )}
              </Section>
            )}

            {/* Complementary add-ons */}
            {pkg.addons.length > 0 && (
              <Section title="Complementary Add-ons" step={step++} subtitle={`Choose ${pkg.maxAddons}`}>
                <p className="text-xs text-muted-foreground font-body mb-4">
                  You may choose {pkg.maxAddons} complementary add-on{pkg.maxAddons > 1 ? 's' : ''}
                </p>
                <div className="space-y-2">
                  {pkg.addons.map((addon, idx) => {
                    const selected = selectedAddons.includes(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleAddon(idx)}
                        className={`w-full flex items-center gap-3 p-4 rounded-sm border-2 transition-all text-left ${
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="flex-1">
                          <p className="font-body text-sm text-foreground">{addon.label}</p>
                          {addon.price > 0 && (
                            <p className="text-xs text-muted-foreground font-body">+${addon.price}</p>
                          )}
                        </div>
                        {selected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </Section>
            )}

            {/* Delivery */}
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
                    <p className="text-xs text-muted-foreground">Free up to 10 mi</p>
                  </div>
                  {deliveryMethod === "delivery" && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                </button>
              </div>

              <div className="space-y-4 p-5 rounded-sm border border-border bg-card mb-6">
                {deliveryMethod === "pickup" ? (
                  <p className="font-body text-sm text-muted-foreground">
                    📍 Pickup at: <span className="font-semibold text-foreground">7261 NW 12th St, Miami, FL 33126</span>
                  </p>
                ) : (
                  <>
                    <p className="font-body font-semibold text-foreground text-sm">Delivery address</p>
                    <p className="font-body text-xs text-muted-foreground mb-2">
                      🎁 Free delivery within 10 miles · $1.60/mile after
                    </p>
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
                        <p className="font-body text-sm text-primary font-semibold mt-1">
                          Shipping: {deliveryCost === 0 ? 'Free ✨' : formatDeliveryCost(deliveryCost)}
                        </p>
                      </div>
                    )}
                    {mapUrl && (
                      <div className="rounded-sm overflow-hidden border border-border">
                        <iframe src={mapUrl} width="100%" height="250" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Route" />
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
                <div className="flex md:hidden justify-between items-center gap-3">
                  <p className="font-body text-[10px] text-muted-foreground leading-tight flex-1 line-clamp-1">
                    {pkg.name}
                    {pkg.bouquetIncluded && ` · ${selectedBouquetColor} bouquet`}
                    {addRibbon && " · Ribbon"}
                    {selectedAddons.length > 0 && ` · ${selectedAddons.length} add-on${selectedAddons.length > 1 ? 's' : ''}`}
                  </p>
                  <p className="font-display text-lg font-bold text-foreground whitespace-nowrap">
                    ${totalPrice}
                  </p>
                </div>

                <div className="hidden md:block flex-1 pr-4">
                  <p className="font-body text-xs text-muted-foreground leading-tight">
                    {pkg.name}
                    {pkg.bouquetIncluded && ` · ${selectedBouquetColor} bouquet`}
                    {addRibbon && " · Ribbon"}
                    {selectedAddons.length > 0 && ` · ${selectedAddons.length} add-on${selectedAddons.length > 1 ? 's' : ''}`}
                    {deliveryMethod === "delivery" ? (deliveryMiles && !distanceTooFar ? ` · Shipping (${deliveryCost === 0 ? 'Free' : formatDeliveryCost(deliveryCost)})` : " · Shipping (pending)") : " · Pickup"}
                  </p>
                </div>

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

export default RoomDecorDetail;
