import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format, isBefore, startOfDay } from "date-fns";
import { miamiHourNow, todayInMiami, isTodayInMiami } from "@/lib/miamiTime";
import { enUS } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentIcons from "@/components/PaymentIcons";
import ProductTrustBlock from "@/components/ProductTrustBlock";
import { useTranslation } from "@/i18n/LanguageContext";
import { roomDecorPackages, roomDecorBouquetColors } from "@/lib/roomDecorData";
import { calculateRoomDecorDeliveryCost, formatDeliveryCost } from "@/lib/deliveryPricing";
import { trackMetaEvent } from "@/lib/metaPixel";
import { seoData } from "@/lib/seoData";
import SeoHead from "@/components/SeoHead";
import JsonLd, { productSchema, breadcrumbSchema } from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  ArrowLeft, Check, Truck, CalendarIcon, Clock, MapPin, Search, Loader2, Heart, ChevronDown, ChevronUp,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const RoomDecorDetail = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const { t, language } = useTranslation();
  const addItem = useCartStore(state => state.addItem);
  const pkg = roomDecorPackages.find(p => p.id === packageId);

  const [selectedBouquetColor, setSelectedBouquetColor] = useState(roomDecorBouquetColors[0].name);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [addRibbon, setAddRibbon] = useState(false);
  const [ribbonText, setRibbonText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [includesOpen, setIncludesOpen] = useState(false);

  // Delivery state
  const deliveryMethod = "delivery" as const;
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [deliveryHour, setDeliveryHour] = useState("");
  const [desktopCalendarOpen, setDesktopCalendarOpen] = useState(false);
  const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);
  const [deliveryMiles, setDeliveryMiles] = useState<number | null>(null);
  const [deliveryZip, setDeliveryZip] = useState("");
  const [structuredAddress, setStructuredAddress] = useState<{ address1: string; city: string; province: string; zip: string; country: string } | undefined>(undefined);
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

  const seo = pkg ? seoData[pkg.shopifyHandle] : undefined;
  useEffect(() => { window.scrollTo(0, 0); }, [pkg]);

  // GA4 + Meta: view_item / ViewContent
  useEffect(() => {
    if (!pkg) return;
    (window as any).gtag?.('event', 'view_item', {
      currency: 'USD',
      value: pkg.price,
      items: [{
        item_id: pkg.shopifyHandle,
        item_name: pkg.name,
        item_category: 'room-decor',
        price: pkg.price,
        quantity: 1,
      }],
    });
    trackMetaEvent('ViewContent', {
      content_ids: [pkg.shopifyHandle],
      content_name: pkg.name,
      content_type: 'product',
      value: pkg.price,
      currency: 'USD',
    });
  }, [pkg?.shopifyHandle]);

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
    setStructuredAddress(undefined);
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
        else {
          setDeliveryMiles(data.miles); setDeliveryDuration(data.duration); if (data.mapUrl) setMapUrl(data.mapUrl);
          if (data.structuredAddress) {
            setStructuredAddress(data.structuredAddress);
            if (data.structuredAddress.zip) setDeliveryZip(data.structuredAddress.zip);
          }
        }
      } catch (e: any) { setDistanceError(e.message || "Error calculating distance"); }
      finally { setDistanceLoading(false); }
    })();
  }, []);

  const minLeadHours = 1.5;
  const minMiamiHour = miamiHourNow() + minLeadHours;
  const getAvailableHours = (date: Date | undefined) => {
    if (!date) return [];
    const day = date.getDay();
    if (day === 0) return []; // Sunday closed
    const closeHour = day === 6 ? 17 : 19;
    const hours: string[] = [];
    for (let h = 10; h <= closeHour; h++) {
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
      if (prev.length >= pkg.maxAddons) {
        toast.error(t("roomDecors.maxAddonsReached"));
        return prev;
      }
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

      // GA4 + Meta: add_to_cart / AddToCart
      const itemPrice = pkg.price + addonsCost + ribbonCost;
      (window as any).gtag?.('event', 'add_to_cart', {
        currency: 'USD',
        value: itemPrice,
        items: [{
          item_id: pkg.shopifyHandle,
          item_name: pkg.name,
          item_category: 'room-decor',
          price: itemPrice,
          quantity: 1,
        }],
      });
      trackMetaEvent('AddToCart', {
        content_ids: [pkg.shopifyHandle],
        content_name: pkg.name,
        value: itemPrice,
        currency: 'USD',
      });

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
        structuredAddress: deliveryMethod === "delivery" ? structuredAddress : undefined,
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

  let step = 1;

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={seo?.seoTitle || `${pkg.name} Miami | Room Decoration – Charls Flowers`} description={seo?.seoDescription || pkg.description} path={`/room-decors/${pkg.id}`} image={pkg.image} />
      <JsonLd data={[productSchema(pkg.name, seo?.seoDescription || pkg.description, pkg.price, pkg.image), breadcrumbSchema([{ name: "Home", url: "https://www.charlsflowers.com" }, { name: "Room Decors", url: "https://www.charlsflowers.com/room-decors" }, { name: pkg.name, url: `https://www.charlsflowers.com/room-decors/${pkg.id}` }])]} />
      <Navbar />
      <div className="pt-16 md:pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Room Decors", to: "/room-decors" }, { label: pkg.name }]} />

          {/* ===== DESKTOP: two-column layout ===== */}
          <div className="hidden lg:grid lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] gap-8 max-w-6xl mx-auto">
            {/* Left column — sticky image */}
            <div className="sticky top-24 self-start space-y-3 min-w-0">
              <div className="relative overflow-hidden rounded-lg bg-muted flex items-center justify-center aspect-square">
                 <img src={pkg.image} alt={`${pkg.name} Miami Room Decoration – Charls Flowers`} width={600} height={600} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Right column — product details & options */}
            <div className="min-w-0 space-y-5 lg:space-y-7">
              <div>
                <h1 className="font-display text-2xl lg:text-4xl font-semibold text-foreground">{pkg.name}</h1>
                <p className="text-muted-foreground font-body text-sm lg:text-base mt-1 lg:mt-2">{language === "es" && pkg.descriptionEs ? pkg.descriptionEs : pkg.description}</p>
                <p className="font-display text-xl lg:text-3xl font-bold text-foreground mt-2 lg:mt-3">${pkg.price} <span className="text-xs lg:text-sm font-body text-muted-foreground font-normal">USD</span></p>
              </div>

              {/* What's included */}
              <Section title={t("roomDecors.whatsIncluded")} step={step++}>
                <button
                  type="button"
                  onClick={() => setIncludesOpen(o => !o)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10 text-left hover:bg-primary/10 transition-colors"
                  aria-expanded={includesOpen}
                >
                  <span className="font-body text-sm font-semibold text-foreground">
                    {includesOpen ? t("roomDecors.hide") : t("roomDecors.show")} ({(language === "es" && pkg.includesEs ? pkg.includesEs : pkg.includes).length})
                  </span>
                  {includesOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
                </button>
                {includesOpen && (
                  <div className="space-y-2 mt-3">
                    {(language === "es" && pkg.includesEs ? pkg.includesEs : pkg.includes).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <Heart className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 fill-primary" />
                        <p className="font-body text-sm text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                )}
                {pkg.bouquetIncluded?.restrictionsApply && (
                  <p className="text-xs text-muted-foreground font-body mt-3 italic">{t("roomDecors.restrictionsApply")}</p>
                )}
              </Section>

              {/* Bouquet color selection */}
              {pkg.bouquetIncluded && (
                <Section title={t("roomDecors.bouquetColor")} step={step++} subtitle={t("roomDecors.included")}>
                  <p className="text-xs text-muted-foreground font-body mb-4">
                    {t("roomDecors.chooseColorFor")} {pkg.bouquetIncluded.roses} {t("roomDecors.roseBouquet")}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {roomDecorBouquetColors.map(color => {
                      const isActive = selectedBouquetColor === color.name;
                      return (
                        <button
                          key={color.name}
                          onClick={() => setSelectedBouquetColor(color.name)}
                          className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                            isActive ? "border-primary shadow-md" : "border-border hover:border-primary/30"
                          }`}
                        >
                          <div className="aspect-square bg-muted">
                            <img src={color.image} alt={`${color.name} rose bouquet`} loading="lazy" className="w-full h-full object-cover" />
                          </div>
                          <div className={`px-2 py-1.5 font-body text-[11px] text-center ${isActive ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}>
                            {color.name}
                          </div>
                          {isActive && <Check className="absolute top-1.5 right-1.5 w-4 h-4 text-primary-foreground bg-primary rounded-full p-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {/* Ribbon option (Overly Romantic) */}
              {pkg.ribbonOption && (
                <Section title={t("roomDecors.bouquetRibbon")} step={step++} subtitle={`+$${pkg.ribbonOption.price}`}>
                  <button
                    onClick={() => setAddRibbon(!addRibbon)}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                      addRibbon ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="text-left flex-1">
                      <p className="font-body font-semibold text-foreground text-sm">{t("roomDecors.addRibbon")}</p>
                      <p className="text-xs text-muted-foreground font-body">+${pkg.ribbonOption.price}</p>
                    </div>
                    {addRibbon && <Check className="w-5 h-5 text-primary" />}
                  </button>
                  {addRibbon && (
                    <input
                      type="text"
                      value={ribbonText}
                      onChange={(e) => setRibbonText(e.target.value)}
                      placeholder={t("roomDecors.writeRibbonText")}
                      maxLength={40}
                      className="w-full mt-3 bg-card border border-border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  )}
                </Section>
              )}

              {/* Complementary add-ons */}
              {pkg.addons.length > 0 && (
                <Section title={t("roomDecors.complementaryAddons")} step={step++} subtitle={`${t("roomDecors.choose")} ${pkg.maxAddons}`}>
                  <p className="text-xs text-muted-foreground font-body mb-4">
                    {t("roomDecors.youMayChoose")} {pkg.maxAddons} {pkg.maxAddons > 1 ? t("roomDecors.addons") : t("roomDecors.addon")}
                  </p>
                  <div className="space-y-2">
                    {pkg.addons.map((addon, idx) => {
                      const selected = selectedAddons.includes(idx);
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleAddon(idx)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                            selected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <div className="flex-1">
                            <p className="font-body text-sm text-foreground">{language === "es" && addon.labelEs ? addon.labelEs : addon.label}</p>
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

              {/* Shipping */}
              <Section title="Shipping" step={step++}>
                <div className="space-y-3 p-4 rounded-lg border border-border bg-card mb-4">
                      <p className="font-body font-semibold text-foreground text-sm">Delivery address</p>
                      <p className="font-body text-xs text-muted-foreground mb-2">
                        🎁 Free delivery within 10 miles · $1.60/mile after
                      </p>
                      <div ref={autocompleteRef} className="relative">
                        <label className="text-xs text-muted-foreground font-body block mb-1"><MapPin className="w-3 h-3 inline mr-1" />Address <span className="text-destructive">*</span></label>
                        <div className="relative">
                          <input type="text" value={addressQuery} onChange={(e) => handleAddressInput(e.target.value)} onFocus={() => predictions.length > 0 && setShowPredictions(true)}
                            placeholder="Start typing the address..."
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 pr-10 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {autocompleteLoading || distanceLoading ? <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" /> : <Search className="w-4 h-4 text-muted-foreground" />}
                          </div>
                        </div>
                        {showPredictions && predictions.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                          <p className="font-body text-xs text-muted-foreground">Selected address:</p>
                          <p className="font-body text-sm text-foreground font-medium">{selectedAddress}</p>
                        </div>
                      )}
                      {distanceError && <p className="text-sm font-body text-destructive">{distanceError}</p>}
                      {deliveryMiles !== null && !distanceTooFar && (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                          <p className="font-body text-sm text-foreground">📍 Distance: <span className="font-semibold">{deliveryMiles} miles</span>{deliveryDuration && <span className="text-muted-foreground"> (~{deliveryDuration})</span>}</p>
                          <p className="font-body text-sm text-primary font-semibold mt-1">
                            Shipping: {deliveryCost === 0 ? 'Free ✨' : formatDeliveryCost(deliveryCost)}
                          </p>
                        </div>
                      )}
                      {mapUrl && (
                        <div className="rounded-lg overflow-hidden border border-border">
                          <iframe src={mapUrl} width="100%" height="250" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Route" />
                        </div>
                      )}
                </div>

                {/* Date */}
                <div className="mb-4">
                  <label className="text-sm font-body font-semibold text-foreground block mb-2"><CalendarIcon className="w-4 h-4 inline mr-1" /> Date</label>
                  <Popover open={desktopCalendarOpen} onOpenChange={setDesktopCalendarOpen}>
                    <PopoverTrigger asChild>
                      <button type="button" className="w-full md:w-auto flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-card font-body text-sm text-foreground hover:border-primary/30 transition-all">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        {deliveryDate ? format(deliveryDate, "PPP", { locale: enUS }) : "Select a date"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={deliveryDate} onSelect={(d) => { if (d) { setDeliveryDate(d); setDeliveryHour(""); setDesktopCalendarOpen(false); } }}
                        disabled={(date) => isBefore(startOfDay(date), startOfDay(todayInMiami())) || (date >= new Date(2026, 4, 1) && date <= new Date(2026, 4, 12))} className="p-3 pointer-events-auto" locale={enUS} />
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
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-body transition-all ${deliveryHour === hour ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>{hour}</button>
                        ))}
                      </div>
                    ) : <p className="text-sm text-muted-foreground font-body">No available hours. Select another day.</p>}
                  </div>
                )}
              </Section>

              {/* Desktop sticky bottom bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-body text-xs lg:text-sm text-muted-foreground leading-tight flex-1 line-clamp-1 pr-3">
                    {pkg.name}
                    {pkg.bouquetIncluded && ` · ${selectedBouquetColor} bouquet`}
                    {addRibbon && " · Ribbon"}
                    {selectedAddons.length > 0 && ` · ${selectedAddons.length} add-on${selectedAddons.length > 1 ? 's' : ''}`}
                  </p>
                  <p className="font-display text-xl lg:text-2xl font-bold text-foreground whitespace-nowrap">
                    ${parseFloat(totalPrice.toFixed(2))}
                  </p>
                </div>
                <button onClick={handleAddToCart} disabled={isAdding}
                  className="w-full bg-primary text-primary-foreground py-4 lg:py-5 font-body text-sm lg:text-base tracking-[0.25em] uppercase font-semibold hover:bg-primary/90 transition-colors rounded-lg disabled:opacity-50">
                  {isAdding ? "..." : t("product.orderAndPay")}
                </button>
                <PaymentIcons size={22} className="pt-1" />
                <ProductTrustBlock />
              </div>
            </div>
          </div>

          {/* ===== MOBILE: stacked layout ===== */}
          <div className="lg:hidden space-y-5 max-w-lg mx-auto">
            {/* Image */}
            <div className="relative overflow-hidden rounded-lg bg-muted flex items-center justify-center aspect-square">
              <img src={pkg.image} alt={`${pkg.name} Miami Room Decoration – Charls Flowers`} width={600} height={600} className="w-full h-full object-cover" />
            </div>

            <div className="text-center">
              <h1 className="font-display text-3xl font-semibold text-foreground">{pkg.name}</h1>
              <p className="text-muted-foreground font-body mt-2 text-left">{language === "es" && pkg.descriptionEs ? pkg.descriptionEs : pkg.description}</p>
            </div>

            {/* What's included */}
            <Section title={t("roomDecors.whatsIncluded")} step={1}>
              <button
                type="button"
                onClick={() => setIncludesOpen(o => !o)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10 text-left hover:bg-primary/10 transition-colors"
                aria-expanded={includesOpen}
              >
                <span className="font-body text-sm font-semibold text-foreground">
                  {includesOpen ? t("roomDecors.hide") : t("roomDecors.show")} ({(language === "es" && pkg.includesEs ? pkg.includesEs : pkg.includes).length})
                </span>
                {includesOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
              </button>
              {includesOpen && (
                <div className="space-y-2 mt-3">
                  {(language === "es" && pkg.includesEs ? pkg.includesEs : pkg.includes).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <Heart className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 fill-primary" />
                      <p className="font-body text-sm text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              )}
              {pkg.bouquetIncluded?.restrictionsApply && (
                <p className="text-xs text-muted-foreground font-body mt-3 italic">{t("roomDecors.restrictionsApply")}</p>
              )}
            </Section>

            {/* Bouquet color selection */}
            {pkg.bouquetIncluded && (
              <Section title={t("roomDecors.bouquetColor")} step={2} subtitle={t("roomDecors.included")}>
                <p className="text-xs text-muted-foreground font-body mb-4">
                  {t("roomDecors.chooseColorFor")} {pkg.bouquetIncluded.roses} {t("roomDecors.roseBouquet")}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {roomDecorBouquetColors.map(color => {
                    const isActive = selectedBouquetColor === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedBouquetColor(color.name)}
                        className={`relative rounded-lg border-2 overflow-hidden transition-all ${
                          isActive ? "border-primary shadow-md" : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="aspect-square bg-muted">
                          <img src={color.image} alt={`${color.name} rose bouquet`} loading="lazy" className="w-full h-full object-cover" />
                        </div>
                        <div className={`px-2 py-1.5 font-body text-[11px] text-center ${isActive ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}>
                          {color.name}
                        </div>
                        {isActive && <Check className="absolute top-1.5 right-1.5 w-4 h-4 text-primary-foreground bg-primary rounded-full p-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </Section>
            )}

            {/* Ribbon option */}
            {pkg.ribbonOption && (
              <Section title={t("roomDecors.bouquetRibbon")} step={pkg.bouquetIncluded ? 3 : 2} subtitle={`+$${pkg.ribbonOption.price}`}>
                <button
                  onClick={() => setAddRibbon(!addRibbon)}
                  className={`w-full p-5 rounded-lg border-2 transition-all flex items-center gap-4 ${
                    addRibbon ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="text-left flex-1">
                    <p className="font-body font-semibold text-foreground">{t("roomDecors.addRibbon")}</p>
                    <p className="text-xs text-muted-foreground font-body">+${pkg.ribbonOption.price}</p>
                  </div>
                  {addRibbon && <Check className="w-5 h-5 text-primary" />}
                </button>
                {addRibbon && (
                  <input
                    type="text"
                    value={ribbonText}
                    onChange={(e) => setRibbonText(e.target.value)}
                    placeholder={t("roomDecors.writeRibbonText")}
                    maxLength={40}
                    className="w-full mt-3 bg-card border border-border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                )}
              </Section>
            )}

            {/* Complementary add-ons */}
            {pkg.addons.length > 0 && (
              <Section title={t("roomDecors.complementaryAddons")} step={step} subtitle={`${t("roomDecors.choose")} ${pkg.maxAddons}`}>
                <p className="text-xs text-muted-foreground font-body mb-4">
                  {t("roomDecors.youMayChoose")} {pkg.maxAddons} {pkg.maxAddons > 1 ? t("roomDecors.addons") : t("roomDecors.addon")}
                </p>
                <div className="space-y-2">
                  {pkg.addons.map((addon, idx) => {
                    const selected = selectedAddons.includes(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleAddon(idx)}
                        className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="flex-1">
                          <p className="font-body text-sm text-foreground">{language === "es" && addon.labelEs ? addon.labelEs : addon.label}</p>
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

            {/* Shipping */}
            <Section title="Shipping" step={step + 1}>
              <div className="space-y-4 p-5 rounded-lg border border-border bg-card mb-6">
                    <p className="font-body font-semibold text-foreground text-sm">Delivery address</p>
                    <p className="font-body text-xs text-muted-foreground mb-2">
                      🎁 Free delivery within 10 miles · $1.60/mile after
                    </p>
                    <div ref={autocompleteRef} className="relative">
                      <label className="text-xs text-muted-foreground font-body block mb-1"><MapPin className="w-3 h-3 inline mr-1" />Address <span className="text-destructive">*</span></label>
                      <div className="relative">
                        <input type="text" value={addressQuery} onChange={(e) => handleAddressInput(e.target.value)} onFocus={() => predictions.length > 0 && setShowPredictions(true)}
                          placeholder="Start typing the address..."
                          className="w-full bg-background border border-border rounded-lg px-3 py-2.5 pr-10 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {autocompleteLoading || distanceLoading ? <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" /> : <Search className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>
                      {showPredictions && predictions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="font-body text-xs text-muted-foreground">Selected address:</p>
                        <p className="font-body text-sm text-foreground font-medium">{selectedAddress}</p>
                      </div>
                    )}
                    {distanceError && <p className="text-sm font-body text-destructive">{distanceError}</p>}
                    {deliveryMiles !== null && !distanceTooFar && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <p className="font-body text-sm text-foreground">📍 Distance: <span className="font-semibold">{deliveryMiles} miles</span>{deliveryDuration && <span className="text-muted-foreground"> (~{deliveryDuration})</span>}</p>
                        <p className="font-body text-sm text-primary font-semibold mt-1">
                          Shipping: {deliveryCost === 0 ? 'Free ✨' : formatDeliveryCost(deliveryCost)}
                        </p>
                      </div>
                    )}
                    {mapUrl && (
                      <div className="rounded-lg overflow-hidden border border-border">
                        <iframe src={mapUrl} width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Route" />
                      </div>
                    )}
              </div>

              {/* Date */}
              <div className="mb-4">
                <label className="text-sm font-body font-semibold text-foreground block mb-2"><CalendarIcon className="w-4 h-4 inline mr-1" /> Date</label>
                <Popover open={mobileCalendarOpen} onOpenChange={setMobileCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button type="button" className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-card font-body text-sm text-foreground hover:border-primary/30 transition-all">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      {deliveryDate ? format(deliveryDate, "PPP", { locale: enUS }) : "Select a date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={deliveryDate} onSelect={(d) => { if (d) { setDeliveryDate(d); setDeliveryHour(""); setMobileCalendarOpen(false); } }}
                      disabled={(date) => isBefore(startOfDay(date), startOfDay(todayInMiami())) || (date >= new Date(2026, 4, 1) && date <= new Date(2026, 4, 12))} className="p-3 pointer-events-auto" locale={enUS} />
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
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-body transition-all ${deliveryHour === hour ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>{hour}</button>
                      ))}
                    </div>
                  ) : <p className="text-sm text-muted-foreground font-body">No available hours. Select another day.</p>}
                </div>
              )}
            </Section>

            {/* Mobile sticky bottom bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-body text-[10px] text-muted-foreground leading-tight flex-1 line-clamp-1 pr-3">
                  {pkg.name}
                  {pkg.bouquetIncluded && ` · ${selectedBouquetColor} bouquet`}
                  {addRibbon && " · Ribbon"}
                  {selectedAddons.length > 0 && ` · ${selectedAddons.length} add-on${selectedAddons.length > 1 ? 's' : ''}`}
                </p>
                <p className="font-display text-lg font-bold text-foreground whitespace-nowrap">
                  ${parseFloat(totalPrice.toFixed(2))}
                </p>
              </div>
              <button onClick={handleAddToCart} disabled={isAdding}
                className="w-full bg-primary text-primary-foreground py-4 font-body text-sm tracking-[0.25em] uppercase font-semibold hover:bg-primary/90 transition-colors rounded-lg disabled:opacity-50">
                {isAdding ? "..." : t("product.orderAndPay")}
              </button>
              <PaymentIcons size={22} className="pt-1" />
              <ProductTrustBlock />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Section = ({ title, step, subtitle, children }: { title: string; step: number; subtitle?: string; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-xs font-semibold">{step}</span>
      <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
      {subtitle && <span className="bg-secondary text-secondary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-body">{subtitle}</span>}
    </div>
    {children}
  </div>
);

export default RoomDecorDetail;
