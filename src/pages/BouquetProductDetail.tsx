import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "@/i18n/LanguageContext";
import YouMightAlsoLove from "@/components/YouMightAlsoLove";
import Footer from "@/components/Footer";
import { format, addHours, isBefore, startOfDay } from "date-fns";
import { miamiHourNow, todayInMiami, isTodayInMiami } from "@/lib/miamiTime";
import { seoData } from "@/lib/seoData";
import SeoHead from "@/components/SeoHead";
import JsonLd, { productSchema, breadcrumbSchema } from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { enUS } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { fetchVariantsByHandle, findVariantByRoses, getShopifyPrice, buildShopifySizeOptions, type ShopifyHandleVariant } from "@/lib/shopifyVariants";
import { useShopifyProductImages } from "@/hooks/useShopifyProductImages";
import { performApiCheckout } from "@/lib/checkout";
import { calculateDeliveryCost, formatDeliveryCost } from "@/lib/deliveryPricing";
import { toast } from "sonner";
import { buildAccessoryLineItems } from "@/lib/accessoryVariants";
import Navbar from "@/components/Navbar";
import PaperColorPicker from "@/components/PaperColorPicker";
import PaymentIcons from "@/components/PaymentIcons";
import ProductTrustBlock from "@/components/ProductTrustBlock";
import CollectionFAQ, { useBouquetFAQs } from "@/components/CollectionFAQ";
import { bouquetProducts, bouquetSizeOptions } from "@/lib/catalogData";
import {
  crownOptions, ribbonPresets, crownPrice, ribbonPrice, letterNumberExtraPrice, vaseOptions, getPrice,
} from "@/lib/productData";
import {
  ArrowLeft, Check, Store, Truck, CalendarIcon, Clock, MapPin, Search, Loader2,
  Type, Sparkles, Star, Hash,
} from "lucide-react";
import glitterRoseImg from "@/assets/glitter-rose.png";
import crownSilverImg from "@/assets/crown-silver.webp";
import crownGoldImg from "@/assets/crown-gold.webp";
import butterflyImg from "@/assets/butterfly-gold.webp";
import noteImg from "@/assets/accessory-note.webp";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const BouquetProductDetail = () => {
  const { t, language } = useTranslation();
  const { type, productId } = useParams<{ type: string; productId: string }>();
  const addItem = useCartStore(state => state.addItem);
  const setCartOpen = useCartStore(state => state.setOpen);
  const cartItems = useCartStore(state => state.items);
  const product = bouquetProducts.find((b) => b.shopifyHandle === productId || b.id === productId);
  const bouquetFAQs = useBouquetFAQs();

  // Live Shopify images (1st = primary, 2nd = secondary). Fallback to local data while loading.
  const liveImages = useShopifyProductImages(product?.shopifyHandle);
  const primaryImage = liveImages.primary || product?.image;
  const secondaryImage = liveImages.secondary || product?.image2;

  // GA4: view_item event
  useEffect(() => {
    if (product) {
      const firstPrice = product.customSizes?.[0]?.price ?? getPrice(product.pricingTier, product.pricingTier === 'mix3red' ? 75 : 50);
      (window as any).gtag?.('event', 'view_item', {
        currency: 'USD',
        value: firstPrice,
        items: [{ item_id: product.shopifyHandle, item_name: product.name }],
      });
    }
  }, [product?.shopifyHandle]);

  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [accessory, setAccessory] = useState<"none" | "note" | "card" | "butterfly">("none");
  const [accessoryText, setAccessoryText] = useState("");
  const [addCrown, setAddCrown] = useState(false);
  const [crownSize, setCrownSize] = useState("small");
  const [addRibbon, setAddRibbon] = useState(false);
  const [ribbonType, setRibbonType] = useState<"names" | "congratulations">("names");
  const [ribbonText, setRibbonText] = useState("");
  const [addGlitter, setAddGlitter] = useState<boolean | null>(null); // null = not yet selected
  const [addLetters, setAddLetters] = useState(false);
  const [addNumbers, setAddNumbers] = useState(false);
  const [specialText, setSpecialText] = useState("");
  const [addVase, setAddVase] = useState(false);
  const [selectedVaseIdx, setSelectedVaseIdx] = useState(0);
  const [paperColor, setPaperColor] = useState("Blanco");
  const [isAdding, setIsAdding] = useState(false);
  const [variantsLoading, setVariantsLoading] = useState(true);
  const [productVariants, setProductVariants] = useState<ShopifyHandleVariant[]>([]);
  const [customerNotes, setCustomerNotes] = useState("");

  // Delivery state — auto-fill from existing cart items
  const existingDeliveryItem = cartItems.find(i => i.deliveryMethod === "delivery" && i.deliveryAddress && i.deliveryAddress !== "Store pickup");
  const hasExistingDelivery = !!existingDeliveryItem;

  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">(hasExistingDelivery ? "delivery" : "pickup");
  const [desktopCalendarOpen, setDesktopCalendarOpen] = useState(false);
  const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date>(() => {
    const existing = cartItems.find(i => i.deliveryDate);
    if (existing?.deliveryDate) {
      const d = new Date(existing.deliveryDate + "T00:00:00");
      return !isNaN(d.getTime()) ? d : undefined as any;
    }
    return undefined as any;
  });
  const [deliveryHour, setDeliveryHour] = useState(() => cartItems.find(i => i.deliveryHour)?.deliveryHour || "");
  const [deliveryMiles, setDeliveryMiles] = useState<number | null>(existingDeliveryItem?.deliveryMiles ?? null);
  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryZip, setDeliveryZip] = useState(existingDeliveryItem?.deliveryZip || "");
  const [deliveryEmail, setDeliveryEmail] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [deliveryDuration, setDeliveryDuration] = useState("");
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [distanceError, setDistanceError] = useState("");
  const [distanceTooFar, setDistanceTooFar] = useState(false);
  const [addressQuery, setAddressQuery] = useState(existingDeliveryItem?.deliveryAddress || "");
  const [predictions, setPredictions] = useState<Array<{ placeId: string; description: string; mainText: string; secondaryText: string }>>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(existingDeliveryItem?.deliveryAddress || "");
  const [mapUrl, setMapUrl] = useState("");
  const [structuredAddress, setStructuredAddress] = useState<{ address1: string; city: string; province: string; zip: string; country: string } | undefined>(existingDeliveryItem?.structuredAddress);
  const autocompleteDesktopRef = useRef<HTMLDivElement>(null);
  const autocompleteMobileRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sticky bar visibility — show when main "Order Now" button leaves viewport
  const [showStickyBar, setShowStickyBar] = useState(false);
  const orderButtonsDesktopRef = useRef<HTMLButtonElement>(null);
  const orderButtonsMobileRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const desktopEl = orderButtonsDesktopRef.current;
    const mobileEl = orderButtonsMobileRef.current;
    const targets = [desktopEl, mobileEl].filter(Boolean) as HTMLDivElement[];
    if (targets.length === 0) return;
    // Track visibility per element; sticky shows only when ALL visible targets are out of view.
    const visibility = new WeakMap<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visibility.set(entry.target, entry.isIntersecting));
        // If any tracked target is currently visible (in its breakpoint), hide sticky.
        const anyVisible = targets.some((t) => visibility.get(t));
        setShowStickyBar(!anyVisible);
      },
      { threshold: 0, rootMargin: "0px 0px -10px 0px" }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [product?.shopifyHandle]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideDesktop = autocompleteDesktopRef.current?.contains(target);
      const insideMobile = autocompleteMobileRef.current?.contains(target);
      if (!insideDesktop && !insideMobile) setShowPredictions(false);
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
    } catch (e) { console.error("Predictions error:", e); } finally { setAutocompleteLoading(false); }
  }, []);

  const handleAddressInput = useCallback((value: string) => {
    setAddressQuery(value); setSelectedAddress(""); setDeliveryMiles(null); setMapUrl(""); setDistanceError("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(value), 350);
  }, [fetchPredictions]);

  const handleSelectPrediction = useCallback((prediction: { placeId: string; description: string; mainText: string; secondaryText: string }) => {
    setAddressQuery(prediction.description); setSelectedAddress(prediction.description); setShowPredictions(false); setPredictions([]);
    const fullText = prediction.description + " " + (prediction.secondaryText || "");
    const zipMatch = fullText.match(/\b(\d{5})\b/);
    if (zipMatch) setDeliveryZip(zipMatch[1]);
    setStructuredAddress(undefined);
    (async () => {
      setDistanceLoading(true); setDistanceError(""); setDistanceTooFar(false); setDeliveryMiles(null);
      try {
        const { data, error } = await supabase.functions.invoke("calculate-distance", { body: { fullAddress: prediction.description, placeId: prediction.placeId } });
        if (error) throw new Error("Error de conexión");
        if (data.error) { setDistanceError(data.error); if (data.tooFar) { setDistanceTooFar(true); setDeliveryMiles(data.miles); } }
        else {
          setDeliveryMiles(data.miles); setDeliveryDuration(data.duration);
          if (data.mapUrl) setMapUrl(data.mapUrl);
          if (data.structuredAddress) setStructuredAddress(data.structuredAddress);
        }
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
    if (deliveryMethod === "pickup") {
      if (!isTodayInMiami(date) || 9.5 >= minMiamiHour) {
        hours.push("9:30 AM");
      }
    }
    for (let h = 10; h <= closeHour; h++) {
      if (isTodayInMiami(date) && h < minMiamiHour) continue;
      const ampm = h < 12 ? "AM" : "PM";
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      hours.push(`${h12}:00 ${ampm}`);
    }
    return hours;
  };
  const availableHours = getAvailableHours(deliveryDate);

  const seo = product ? seoData[product.shopifyHandle] : undefined;

  useEffect(() => {
    if (!product) return;
    let active = true;
    const loadVariants = async () => {
      setVariantsLoading(true);
      try {
        const variants = await fetchVariantsByHandle(product.shopifyHandle);
        if (active) setProductVariants(variants);
      } catch (error) {
        if (active) setProductVariants([]);
      } finally {
        if (active) setVariantsLoading(false);
      }
    };
    loadVariants();
    return () => { active = false; };
  }, [product]);

  const shopifySizes = useMemo(() => product && productVariants.length > 0 ? buildShopifySizeOptions(productVariants) : [], [product, productVariants]);

  // Default selection: 200 Roses (maximize conversion). Falls back to last available size.
  useEffect(() => {
    if (!product) return;
    const hasCustom = product.customSizes && product.customSizes.length > 0;
    const useDynamic = shopifySizes.length > 0;
    const opts = useDynamic ? shopifySizes : (hasCustom ? product.customSizes! : bouquetSizeOptions);
    if (!opts.length) return;
    const idx200 = opts.findIndex((o: any) => o.roses === 200);
    setSelectedSizeIdx(idx200 >= 0 ? idx200 : opts.length - 1);
  }, [product?.shopifyHandle, shopifySizes.length]);

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

  const colorCount = product.color.split(/,\s*|\s+y\s+/).length;
  const hasCustomSizes = product.customSizes && product.customSizes.length > 0;
  const useDynamicSizes = shopifySizes.length > 0;
  const sizeOptions = useDynamicSizes ? shopifySizes : (hasCustomSizes ? product.customSizes! : bouquetSizeOptions);
  const minSizeIdx = useDynamicSizes ? 0 : (hasCustomSizes ? 0 : (colorCount >= 3 ? 1 : 0));

  const effectiveSizeIdx = selectedSizeIdx < minSizeIdx ? minSizeIdx : (selectedSizeIdx >= sizeOptions.length ? sizeOptions.length - 1 : selectedSizeIdx);
  const selectedSize = useDynamicSizes ? { roses: sizeOptions[effectiveSizeIdx].roses } : (hasCustomSizes ? { roses: sizeOptions[effectiveSizeIdx].roses } : bouquetSizeOptions[effectiveSizeIdx]);
  const sizePrice = useDynamicSizes
    ? (shopifySizes[effectiveSizeIdx]?.price ?? 0)
    : (hasCustomSizes ? (product.customSizes![effectiveSizeIdx]?.price || 0) : getPrice(product.pricingTier, selectedSize.roses));
  const glitterCost = addGlitter === true ? Math.ceil(selectedSize.roses / 25) * 8 : 0;
  const vaseCost = addVase ? vaseOptions[selectedVaseIdx].price : 0;
  const accessoryCost = accessory === "note" ? 3 : accessory === "butterfly" ? 3 : 0;
  const deliveryCost = deliveryMethod === "delivery" && deliveryMiles && !distanceTooFar ? calculateDeliveryCost(deliveryMiles) : 0;
  const basePrice = sizePrice + (addCrown ? crownPrice : 0) + (addRibbon ? ribbonPrice : 0) + glitterCost + vaseCost + accessoryCost;
  const totalPrice = basePrice + deliveryCost;

  // Replace "From $X" / "Desde $X" in description with dynamic Shopify price
  const dynamicMinPrice = useDynamicSizes && shopifySizes.length > 0 ? shopifySizes[0].price : null;
  const replaceDescriptionPrice = (text: string): string => {
    if (dynamicMinPrice === null) return text;
    return text
      .replace(/From \$\d+(\.\d+)?/i, () => `From $${dynamicMinPrice}`)
      .replace(/Desde \$\d+(\.\d+)?/i, () => `Desde $${dynamicMinPrice}`);
  };

  let step = 1;

  const handleAddToCart = async (skipNavigate = false): Promise<string | null> => {
    if (deliveryMethod === "delivery" && !selectedAddress) { toast.error("Please select a delivery address."); return null; }
    if (deliveryMethod === "delivery" && (distanceTooFar || deliveryMiles === null)) { toast.error("The address is invalid or out of range."); return null; }
    if (!deliveryDate || !deliveryHour) { toast.error("Please select a date and time."); return null; }
    if (variantsLoading) { toast.error("Loading variants. Please try again."); return null; }

    setIsAdding(true);
    try {
      let variant = findVariantByRoses(productVariants, selectedSize.roses);
      if (!variant && productVariants.length > 0) {
        const rosesStr = String(selectedSize.roses);
        variant = productVariants.find(v => v.selectedOptions.some(opt => opt.value === rosesStr)) || productVariants.find(v => v.title.includes(rosesStr)) || productVariants[0];
      }
      if (!variant) { toast.error("Could not resolve product variant."); return null; }

      const addons: string[] = [];
      if (addGlitter === true) addons.push("Glitter");
      if (addVase) addons.push(`Vase (${vaseOptions[selectedVaseIdx].label})`);

      // GA4: add_to_cart event
      (window as any).gtag?.('event', 'add_to_cart', {
        currency: 'USD',
        value: basePrice,
        items: [{ item_id: product.shopifyHandle, item_name: product.name, quantity: 1 }],
      });

      const addPromise = addItem({
        id: "",
        productName: product.name,
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
        glitter: addGlitter === true,
        deliveryMethod,
        deliveryName: "",
        deliveryPhone: "",
        deliveryEmail: "",
        deliveryAddress: deliveryMethod === "delivery" ? selectedAddress : "Store pickup",
        deliveryZip: deliveryMethod === "delivery" ? deliveryZip : "",
        deliveryDate: deliveryDate ? format(deliveryDate, "yyyy-MM-dd") : "",
        deliveryHour,
        deliveryMiles: deliveryMethod === "delivery" ? deliveryMiles : null,
        paperColor,
        image: primaryImage,
        customerNotes: customerNotes.trim() || undefined,
        structuredAddress: deliveryMethod === "delivery" ? structuredAddress : undefined,
        shopifyVariantId: variant.id,
      });

      const timeout = new Promise<void>((resolve) => setTimeout(resolve, 10000));
      await Promise.race([addPromise, timeout]);

      toast.success("Bouquet added to cart!");
      return variant.id;
    } catch (error) {
      toast.error("Failed to add to cart.");
      return null;
    } finally {
      setIsAdding(false);
    }
  };

  // Order Now: add to cart and open the side drawer (no redirect to checkout)
  const handleOrderNow = async () => {
    const variantId = await handleAddToCart(true);
    if (!variantId) return;
    setCartOpen(true);
  };

  // Shared rendering functions
  const renderGlitterSection = (isMobile = false) => (
    <Section title={t("product.glitterFinish")} step={step++} subtitle={`+$${Math.ceil(selectedSize.roses / 25) * 8}`}>
      <div className={`flex ${isMobile ? "flex-col" : ""} gap-3 mb-3`}>
        <div className={`${isMobile ? "w-20 h-20 mx-auto" : "w-14 h-14"} flex-shrink-0`}>
          <img src={glitterRoseImg} alt="Glitter finish rose" width={64} height={64} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1">
          <p className="font-body font-semibold text-foreground text-sm">{t("product.addGlitter")}</p>
          <p className="text-[11px] text-muted-foreground font-body">{t("product.glitterDesc")} · {selectedSize.roses} roses = +${Math.ceil(selectedSize.roses / 25) * 8}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setAddGlitter(false)}
          className={`flex-1 py-2.5 rounded-full border text-center transition-all font-body text-sm ${addGlitter === false ? "border-primary bg-primary/15 text-foreground" : "border-primary/30 text-foreground hover:bg-primary/5"}`}>
          {t("product.no")}
        </button>
        <button onClick={() => setAddGlitter(true)}
          className={`flex-1 py-2.5 rounded-full border text-center transition-all font-body text-sm ${addGlitter === true ? "border-primary bg-primary/15 text-foreground" : "border-primary/30 text-foreground hover:bg-primary/5"}`}>
          {t("product.yes")}
        </button>
      </div>
    </Section>
  );

  const renderAccessoriesSection = (isMobile = false) => (
    <Section title={t("product.accessories")} step={step++}>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setAccessory(accessory === "note" ? "none" : "note")}
          className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg border-2 transition-all font-body text-sm ${accessory === "note" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
          <img src={noteImg} alt="Note accessory" className="w-16 h-16 md:w-12 md:h-12 object-contain rounded-lg" /> {t("product.note")} <span className="text-[10px] text-secondary">$3</span>
        </button>
        <button onClick={() => setAccessory(accessory === "butterfly" ? "none" : "butterfly")}
          className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg border-2 transition-all font-body text-sm ${accessory === "butterfly" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
          <img src={butterflyImg} alt="Butterfly accessory" className="w-16 h-16 md:w-12 md:h-12 object-contain" /> {t("product.butterflies")} <span className="text-[10px] text-secondary">$3</span>
        </button>
      </div>
      {accessory === "note" && (
        <textarea value={accessoryText} onChange={(e) => setAccessoryText(e.target.value)} placeholder={t("product.writeNote")}
          className="w-full mt-3 bg-card border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px] resize-none" maxLength={200} />
      )}
    </Section>
  );

  const renderShippingSection = (isMobile = false, autocompleteRef: React.RefObject<HTMLDivElement>) => {
    const calendarOpen = isMobile ? mobileCalendarOpen : desktopCalendarOpen;
    const setCalendarOpen = isMobile ? setMobileCalendarOpen : setDesktopCalendarOpen;

    return (
    <Section title={t("product.shipping")} step={step++}>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button onClick={() => setDeliveryMethod("delivery")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full border transition-all font-body text-sm ${deliveryMethod === "delivery" ? "border-primary bg-primary/15 text-foreground" : "border-primary/30 text-foreground hover:bg-primary/5"}`}>
          <Truck className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">{t("product.homeDelivery")}</span>
        </button>
        <button onClick={() => setDeliveryMethod("pickup")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full border transition-all font-body text-sm ${deliveryMethod === "pickup" ? "border-primary bg-primary/15 text-foreground" : "border-primary/30 text-foreground hover:bg-primary/5"}`}>
          <Store className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">{t("product.storePickup")}</span>
        </button>
      </div>

      <div className="space-y-3 p-4 rounded-lg border border-border bg-card mb-4">
        {deliveryMethod === "pickup" ? (
          <p className="font-body text-sm text-muted-foreground">
            {t("product.pickupAt")} <span className="font-semibold text-foreground">7261 NW 12th St, Miami, FL 33126</span>
          </p>
        ) : (
          <>
            <p className="font-body font-semibold text-foreground text-sm">{t("product.deliveryAddress")}</p>
            <div ref={autocompleteRef} className="relative">
              <label className="text-xs text-muted-foreground font-body block mb-1"><MapPin className="w-3 h-3 inline mr-1" />{t("product.addressLabel")} <span className="text-destructive">*</span></label>
              <div className="relative">
                <input type="text" value={addressQuery} onChange={(e) => handleAddressInput(e.target.value)} onFocus={() => predictions.length > 0 && setShowPredictions(true)}
                  placeholder={t("product.startTyping")}
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
                <p className="font-body text-xs text-muted-foreground">{t("product.selectedAddress")}</p>
                <p className="font-body text-sm text-foreground font-medium">{selectedAddress}</p>
              </div>
            )}
            {distanceError && <p className="text-sm font-body text-destructive">{distanceError}</p>}
            {deliveryMiles !== null && !distanceTooFar && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="font-body text-sm text-foreground">{t("product.distance")} <span className="font-semibold">{deliveryMiles} {t("product.miles")}</span>{deliveryDuration && <span className="text-muted-foreground"> (~{deliveryDuration})</span>}</p>
                <p className="font-body text-sm text-primary font-semibold mt-1">{t("product.shippingCost")} {formatDeliveryCost(deliveryCost)}</p>
              </div>
            )}
            {mapUrl && (
              <div className="rounded-lg overflow-hidden border border-border">
                <iframe src={mapUrl} width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Route" />
              </div>
            )}
          </>
        )}
      </div>

      <div className="mb-4">
        <label className="text-sm font-body font-semibold text-foreground block mb-2"><CalendarIcon className="w-4 h-4 inline mr-1" /> {t("product.date")}</label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <button type="button" className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-card font-body text-sm text-foreground hover:border-primary/30 transition-all">
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              {deliveryDate ? format(deliveryDate, "PPP", { locale: enUS }) : t("product.selectDate")}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={deliveryDate} onSelect={(d) => { if (d) { setDeliveryDate(d); setDeliveryHour(""); setCalendarOpen(false); } }}
              disabled={(date) => isBefore(startOfDay(date), startOfDay(todayInMiami())) || date.getDay() === 0 || (date >= new Date(2026, 4, 1) && date <= new Date(2026, 4, 12))} className="p-3 pointer-events-auto" locale={enUS}
              classNames={{ day_outside: "text-foreground", day_disabled: "text-muted-foreground opacity-50 line-through" }} />
          </PopoverContent>
        </Popover>
      </div>
      {deliveryDate && (
        <div className="mb-4">
          <label className="text-sm font-body font-semibold text-foreground block mb-2"><Clock className="w-4 h-4 inline mr-1" /> {t("product.time")}</label>
          {availableHours.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableHours.map((hour) => (
                <button key={hour} onClick={() => setDeliveryHour(hour)}
                  className={`px-3 py-1.5 rounded-lg border-2 text-sm font-body transition-all ${deliveryHour === hour ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>{hour}</button>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground font-body">No available hours. Select another day.</p>}
        </div>
      )}

      <div>
        <label className="text-sm font-body font-semibold text-foreground block mb-2">{t("product.customerNotes")}</label>
        <textarea value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} placeholder={t("product.customerNotesPlaceholder")}
          className="w-full bg-card border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[60px] resize-none" maxLength={500} />
      </div>
    </Section>
  );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SeoHead title={seo?.seoTitle || `${product.name} Miami | Charls Flowers`} description={seo?.seoDescription || product.description} path={`/bouquets/all/${product.shopifyHandle}`} image={primaryImage} />
      <JsonLd data={[productSchema(product.name, seo?.seoDescription || product.description, dynamicMinPrice ?? (hasCustomSizes ? product.customSizes![0].price : getPrice(product.pricingTier, product.pricingTier === 'mix3red' ? 75 : 50)), primaryImage), breadcrumbSchema([{ name: "Home", url: "https://www.charlsflowers.com" }, { name: "Bouquets", url: "https://www.charlsflowers.com/bouquets" }, { name: product.name, url: `https://www.charlsflowers.com/bouquets/all/${product.shopifyHandle}` }])]} />
      <Navbar />
      <div className="pt-20 md:pt-28 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Bouquets", to: "/bouquets" }, { label: product.name }]} />

          {/* ===== DESKTOP: two-column layout ===== */}
          <div className="hidden lg:grid lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] gap-10 lg:gap-16 max-w-7xl mx-auto">
            {/* Left column — sticky images */}
            <div className="sticky top-28 self-start space-y-3 min-w-0">
              <div className="relative overflow-hidden rounded-lg bg-muted flex items-center justify-center aspect-square">
                {primaryImage ? (
                  <img src={primaryImage} alt={`${product.name} Miami – Charls Flowers`} width={600} height={600} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><span className="font-display text-6xl text-muted-foreground/20">🌹</span></div>
                )}
              </div>
              {secondaryImage && (
                <div className="relative overflow-hidden rounded-lg bg-muted flex items-center justify-center aspect-square">
                  <img src={secondaryImage} alt={`${product.name} alternate – Charls Flowers`} loading="lazy" width={600} height={600} className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="min-w-0 space-y-6 lg:space-y-8">
              <div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">{product.name}</h1>
                <p className="font-display text-3xl lg:text-4xl font-semibold text-foreground mt-3 lg:mt-4">${parseFloat(sizePrice.toFixed(2))}</p>
                <p className="font-body italic text-sm lg:text-base text-muted-foreground mt-1">Subtotal ${parseFloat(totalPrice.toFixed(2))}</p>
                <div className="text-muted-foreground font-body text-sm lg:text-base mt-3 lg:mt-4 leading-relaxed space-y-1">
                  {replaceDescriptionPrice(language === 'es' && product.descriptionEs ? product.descriptionEs : product.description).split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>

              {/* Size */}
              <Section title={t("product.numberOfRoses")} step={step++}>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size, idx) => {
                    const disabled = idx < minSizeIdx;
                    const price = useDynamicSizes ? (size as any).price : (hasCustomSizes ? (size as any).price : getPrice(product.pricingTier, size.roses));
                    return (
                      <button key={size.roses} onClick={() => !disabled && setSelectedSizeIdx(idx)} disabled={disabled}
                        className={`px-4 py-2 rounded-full border text-center transition-all font-body text-sm ${disabled ? "opacity-40 cursor-not-allowed border-border" : effectiveSizeIdx === idx ? "border-primary bg-primary/15 text-foreground" : "border-primary/30 text-foreground hover:bg-primary/5"}`}>
                        <span className="font-medium">{size.roses} {t("product.roses")}</span>
                        <span className="text-xs text-muted-foreground ml-1">·</span>
                        <span className="text-xs text-primary font-semibold ml-1">${price}</span>
                      </button>
                    );
                  })}
                </div>
              </Section>

              {renderGlitterSection(false)}
              {renderAccessoriesSection(false)}
              {renderShippingSection(false, autocompleteDesktopRef)}

              {/* Desktop bottom bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-body text-[10px] lg:text-xs text-muted-foreground leading-tight flex-1 line-clamp-1">
                    {product.name} · {selectedSize.roses} {t("product.roses")}
                    {addGlitter === true && " · Glitter"}
                    {accessory !== "none" && ` · ${accessory === "note" ? t("product.note") : t("product.butterflies")}`}
                  </p>
                  <p className="font-display text-lg lg:text-2xl font-bold text-foreground whitespace-nowrap">${parseFloat(totalPrice.toFixed(2))}</p>
                </div>
                <button ref={orderButtonsDesktopRef} onClick={handleOrderNow} disabled={isAdding || variantsLoading}
                  className="w-full bg-primary text-primary-foreground py-4 lg:py-5 font-body text-sm lg:text-base tracking-[0.25em] uppercase font-semibold hover:bg-primary/90 transition-colors rounded-lg disabled:opacity-50">
                  {isAdding ? "..." : variantsLoading ? "..." : t("product.orderAndPay")}
                </button>
                <PaymentIcons size={22} className="pt-1" />
                <ProductTrustBlock />
              </div>

            </div>
          </div>

          {/* ===== MOBILE: stacked layout ===== */}
          <div className="lg:hidden max-w-4xl mx-auto space-y-8">
            {/* Mobile images */}
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-2 -mx-6 px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="w-[88%] flex-none snap-start relative overflow-hidden rounded-lg bg-muted flex items-center justify-center aspect-square">
                {primaryImage ? (
                  <img src={primaryImage} alt={`${product.name} Miami – Charls Flowers`} width={600} height={600} className="w-full h-full object-contain pointer-events-none" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><span className="font-display text-6xl text-muted-foreground/20">🌹</span></div>
                )}
              </div>
              {secondaryImage && (
                <div className="w-[88%] flex-none snap-start relative overflow-hidden rounded-lg bg-muted flex items-center justify-center aspect-square">
                  <img src={secondaryImage} alt={`${product.name} alternate – Charls Flowers`} loading="lazy" width={600} height={600} className="w-full h-full object-cover pointer-events-none" />
                </div>
              )}
            </div>

            <div className="text-center">
              <h1 className="font-display text-2xl font-semibold text-foreground">{product.name}</h1>
              <div className="text-muted-foreground font-body text-sm mt-2 space-y-1">
                {replaceDescriptionPrice(language === 'es' && product.descriptionEs ? product.descriptionEs : product.description).split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            {/* Size */}
            <Section title={t("product.numberOfRoses")} step={1}>
              <div className="grid grid-cols-2 gap-2">
                {sizeOptions.map((size, idx) => {
                  const disabled = idx < minSizeIdx;
                  const price = useDynamicSizes ? (size as any).price : (hasCustomSizes ? (size as any).price : getPrice(product.pricingTier, size.roses));
                  return (
                    <button key={size.roses} onClick={() => !disabled && setSelectedSizeIdx(idx)} disabled={disabled}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${disabled ? "opacity-40 cursor-not-allowed border-border" : effectiveSizeIdx === idx ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                      <p className="font-body text-foreground"><span className="font-display text-xl font-semibold">{size.roses}</span><span className="text-xs text-muted-foreground ml-1">{t("product.roses")}</span></p>
                      <p className="text-sm font-body font-semibold text-primary mt-1">${price}</p>
                    </button>
                  );
                })}
              </div>
            </Section>

            {(() => { step = 2; return null; })()}
            {renderGlitterSection(true)}
            {renderAccessoriesSection(true)}
            {renderShippingSection(true, autocompleteMobileRef)}

            {/* Mobile inline buttons after customer notes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-body text-[10px] text-muted-foreground leading-tight flex-1 line-clamp-1">
                  {product.name} · {selectedSize.roses} {t("product.roses")}
                  {addGlitter === true && " · Glitter"}
                  {accessory !== "none" && ` · ${accessory === "note" ? t("product.note") : t("product.butterflies")}`}
                </p>
                <p className="font-display text-lg font-bold text-foreground whitespace-nowrap">${parseFloat(totalPrice.toFixed(2))}</p>
              </div>
              <button ref={orderButtonsMobileRef} onClick={handleOrderNow} disabled={isAdding || variantsLoading}
                className="w-full bg-primary text-primary-foreground py-4 font-body text-sm tracking-[0.25em] uppercase font-semibold hover:bg-primary/90 transition-colors rounded-lg disabled:opacity-50">
                {isAdding ? "..." : variantsLoading ? "..." : t("product.orderAndPay")}
              </button>
              <PaymentIcons size={22} className="pt-1" />
              <ProductTrustBlock />
            </div>
          </div>

          {/* FAQs (shared desktop + mobile, before related products) */}
          <CollectionFAQ faqs={bouquetFAQs} />

          {/* Cross-links — related products */}
          <YouMightAlsoLove currentProductId={product.id} />
        </div>
      </div>

      {/* Sticky Order Now bar — appears when the inline button leaves the viewport */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border shadow-lg">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs text-muted-foreground truncate">
                {product.name} · {selectedSize.roses} {t("product.roses")}
                {addGlitter === true && " · Glitter"}
              </p>
              <p className="font-display text-base font-bold text-foreground">${parseFloat(totalPrice.toFixed(2))}</p>
            </div>
            <button
              onClick={handleOrderNow}
              disabled={isAdding || variantsLoading}
              className="bg-primary text-primary-foreground px-6 py-3 font-body text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold hover:bg-primary/90 transition-colors rounded-lg disabled:opacity-50 whitespace-nowrap"
            >
              {isAdding ? "..." : t("product.orderAndPay")}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const Section = ({ title, step, subtitle, children }: { title: string; step: number; subtitle?: string; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <h2 className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">{title}</h2>
      {subtitle && <span className="bg-secondary text-secondary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-body">{subtitle}</span>}
    </div>
    {children}
  </div>
);

export default BouquetProductDetail;
