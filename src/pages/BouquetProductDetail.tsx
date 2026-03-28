import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import YouMightAlsoLove from "@/components/YouMightAlsoLove";
import { format, addHours, isBefore, startOfDay } from "date-fns";
import { miamiHourNow, todayInMiami, isTodayInMiami } from "@/lib/miamiTime";
import { seoData } from "@/lib/seoData";
import SeoHead from "@/components/SeoHead";
import JsonLd, { productSchema, breadcrumbSchema } from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { enUS } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { fetchVariantsByHandle, findVariantByRoses, type ShopifyHandleVariant } from "@/lib/shopifyVariants";
import { buildCheckoutUrl } from "@/lib/checkout";
import { calculateDeliveryCost, formatDeliveryCost } from "@/lib/deliveryPricing";
import { toast } from "sonner";
import { buildAccessoryLineItems } from "@/lib/accessoryVariants";
import Navbar from "@/components/Navbar";
import PaperColorPicker from "@/components/PaperColorPicker"; // keep import but won't use for standard bouquets
import { bouquetProducts, bouquetSizeOptions } from "@/lib/catalogData";
import {
  crownOptions, ribbonPresets, crownPrice, ribbonPrice, letterNumberExtraPrice, vaseOptions, getPrice,
// Note: crown, ribbon, letters, vase are used for custom bouquets only; standard bouquets won't show them
} from "@/lib/productData";
import {
  ArrowLeft, Check, Store, Truck, CalendarIcon, Clock, MapPin, Search, Loader2,
  Type, Sparkles, Star, Hash,
} from "lucide-react";
import glitterRoseImg from "@/assets/glitter-rose.png";
import crownSilverImg from "@/assets/crown-silver.png";
import crownGoldImg from "@/assets/crown-gold.png";
import butterflyImg from "@/assets/butterfly-gold.png";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const BouquetProductDetail = () => {
  const { type, productId } = useParams<{ type: string; productId: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  // Support both old (id) and new (shopifyHandle) URLs
  const product = bouquetProducts.find((b) => b.shopifyHandle === productId || b.id === productId);

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
  const [structuredAddress, setStructuredAddress] = useState<{ address1: string; city: string; province: string; zip: string; country: string } | undefined>(undefined);
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

  const seo = product ? seoData[product.shopifyHandle] : undefined;

  useEffect(() => {
    if (!product) return;

    let active = true;

    const loadVariants = async () => {
      setVariantsLoading(true);
      const handle = product.shopifyHandle;
      console.log(`📦 [BouquetProductDetail] Loading variants for "${product.name}" → handle="${handle}"`);
      try {
        const variants = await fetchVariantsByHandle(handle);
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
  const accessoryCost = accessory === "note" ? 3 : 0;
  const deliveryCost = deliveryMethod === "delivery" && deliveryMiles && !distanceTooFar ? calculateDeliveryCost(deliveryMiles) : 0;
  const basePrice = sizePrice + (addCrown ? crownPrice : 0) + (addRibbon ? ribbonPrice : 0) + lettersExtra + numbersExtra + glitterCost + vaseCost + accessoryCost;
  const totalPrice = basePrice + deliveryCost;

  let step = 1;

  const handleAddToCart = async (skipNavigate = false): Promise<string | null> => {
    if (deliveryMethod === "delivery" && !selectedAddress) { toast.error("Please select a delivery address."); return null; }
    if (deliveryMethod === "delivery" && (distanceTooFar || deliveryMiles === null)) { toast.error("The address is invalid or out of range."); return null; }
    if (!deliveryDate || !deliveryHour) { toast.error("Please select a date and time."); return null; }

    if (variantsLoading) {
      toast.error("We are still loading product variants. Please try again in a moment.");
      return null;
    }

    setIsAdding(true);
    try {
      console.log(`🛒 [BouquetProductDetail] Add to cart clicked — roses=${selectedSize.roses}, productVariants count=${productVariants.length}, handle="${product.shopifyHandle}"`);;
      let variant = findVariantByRoses(productVariants, selectedSize.roses);
      // Fallback: use first available variant if Roses option doesn't exist
      if (!variant && productVariants.length > 0) {
        const rosesStr = String(selectedSize.roses);
        variant = productVariants.find(v =>
          v.selectedOptions.some(opt => opt.value === rosesStr)
        ) || productVariants.find(v =>
          v.title.includes(rosesStr)
        ) || productVariants[0];
      }
      if (!variant) {
        toast.error("Could not resolve product variant. Please try again.");
        return null;
      }

      const addons: string[] = [];
      if (addGlitter) addons.push("Glitter");
      if (addVase) addons.push(`Vase (${vaseOptions[selectedVaseIdx].label})`);

      // Add to cart with a timeout to prevent hanging
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
        glitter: addGlitter,
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
        image: product.image,
        structuredAddress: deliveryMethod === "delivery" ? structuredAddress : undefined,
        shopifyVariantId: variant.id,
      });

      // Race between addItem and a 10s timeout — navigate either way
      const timeout = new Promise<void>((resolve) => setTimeout(resolve, 10000));
      await Promise.race([addPromise, timeout]);

      toast.success("Bouquet added to cart!");
      if (!skipNavigate) navigate("/checkout");
      return variant.id;
    } catch (error) {
      toast.error("Failed to add to cart.");
      return null;
    } finally {
      if (!skipNavigate) setIsAdding(false);
    }
  };

  const handlePayNow = async () => {
    const variantId = await handleAddToCart(true); // skip navigate to /checkout
    if (!variantId) {
      setIsAdding(false);
      return;
    }

    try {
      const accessories = buildAccessoryLineItems({
        glitter: addGlitter,
        rosesCount: selectedSize.roses,
        accessory,
        specialText,
        addVase,
        vaseRoses: addVase ? vaseOptions[selectedVaseIdx].roses : undefined,
        addCrown,
        crownSize,
        addRibbon,
      });

      const noteLines: string[] = [];
      noteLines.push("DATOS DEL ENVÍO");
      noteLines.push(`- 🚚 Tipo: ${deliveryMethod === "delivery" ? "Home Delivery" : "Store Pickup"}`);
      if (deliveryDate) noteLines.push(`- 📅 Fecha: ${format(deliveryDate, "PPP", { locale: enUS })}`);
      noteLines.push(`- ⏰ Hora: ${deliveryHour || "No especificada"}`);
      if (deliveryMethod === "delivery" && selectedAddress) noteLines.push(`- 📍 Dirección: ${selectedAddress}`);

      noteLines.push("");
      noteLines.push("DATOS DEL PRODUCTO 1");
      noteLines.push(`- 🌹 Producto: ${product.name}`);
      if (product.color) noteLines.push(`- 🌸 Color: ${product.color}`);
      if (paperColor) noteLines.push(`- 📄 Paper color: ${paperColor}`);
      noteLines.push(`- 🌹 Roses: ${selectedSize.roses}`);
      if (addGlitter) noteLines.push(`- ✨ Glitter finish: Yes`);
      if (addCrown && crownSize) noteLines.push(`- 👑 Crown: ${crownSize}`);
      if (accessory && accessory !== "none") {
        const accLabel = accessory === "note" ? "Notes" : accessory === "card" ? "Card" : "Butterflies";
        noteLines.push(`- 🦋 Accessory: ${accLabel}`);
      }
      if (accessoryText) noteLines.push(`- 💌 Card text: ${accessoryText}`);
      if (ribbonText) noteLines.push(`- 🎀 Custom ribbon: ${ribbonText}`);
      if (specialText) noteLines.push(`- 🔤 Letters or numbers (Baby Breath): ${specialText}`);
      const vaseAddon = addVase ? vaseOptions[selectedVaseIdx] : null;
      if (vaseAddon) noteLines.push(`- 🏺 Vase: ${vaseAddon.label}`);

      const cartTotalForFee = basePrice + deliveryCost;
      const serviceFeePrice = cartTotalForFee * 0.05;
      const finalUrl = buildCheckoutUrl(variantId, {
        deliveryMethod,
        deliveryCost,
        serviceFee: serviceFeePrice,
        deliveryAddress: deliveryMethod === "delivery" ? selectedAddress : undefined,
        deliveryZip: deliveryMethod === "delivery" ? deliveryZip : undefined,
        deliveryDate: deliveryDate ? format(deliveryDate, "PPP", { locale: enUS }) : undefined,
        deliveryTime: deliveryHour || undefined,
        accessories,
        note: noteLines.join("\n"),
      });

      if (finalUrl) {
        window.location.href = finalUrl;
      } else {
        toast.error("Could not get checkout URL.");
      }
    } catch (error) {
      console.error("Pay now error:", error);
      toast.error("Checkout error. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={seo?.seoTitle || `${product.name} Miami | Charls Flowers`} description={seo?.seoDescription || product.description} path={`/bouquets/all/${product.shopifyHandle}`} image={product.image} />
      <JsonLd data={[productSchema(product.name, seo?.seoDescription || product.description, hasCustomSizes ? product.customSizes![0].price : getPrice(product.pricingTier, product.pricingTier === 'mix3red' ? 75 : 50), product.image), breadcrumbSchema([{ name: "Home", url: "https://www.charlsflowers.com" }, { name: "Bouquets", url: "https://www.charlsflowers.com/bouquets" }, { name: product.name, url: `https://www.charlsflowers.com/bouquets/all/${product.shopifyHandle}` }])]} />
      <Navbar />
      <div className="pt-16 md:pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Bouquets", to: "/bouquets" }, { label: product.name }]} />
          <p className="text-primary font-body text-xs font-semibold text-center mb-6">⏰ Order before 3PM for same-day delivery today</p>
          {/* ===== DESKTOP: two-column layout ===== */}
          <div className="hidden md:grid md:grid-cols-[1fr_1fr] lg:grid-cols-[55%_45%] gap-8 max-w-6xl mx-auto">
            {/* Left column — sticky images */}
            <div className="sticky top-24 self-start space-y-3">
              <div className="relative overflow-hidden rounded-sm bg-muted flex items-center justify-center aspect-square">
                {product.image ? (
                  <img src={product.image} alt={`${product.name} Miami – Charls Flowers`} width={600} height={600} className="w-full h-full object-contain" />
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

            {/* Right column — product details & options */}
            <div className="space-y-5">
              <div>
                <h1 className="font-display text-2xl font-semibold text-foreground">{product.name}</h1>
                <p className="text-muted-foreground font-body text-sm mt-1">{product.description}</p>
                <p className="font-display text-xl font-bold text-foreground mt-2">${parseFloat(sizePrice.toFixed(2))} <span className="text-xs font-body text-muted-foreground font-normal">USD</span></p>
              </div>

              {/* 1. Size */}
              <Section title="Number of Roses" step={step++}>
                <div className="grid grid-cols-4 gap-2">
                  {sizeOptions.map((size, idx) => {
                    const disabled = idx < minSizeIdx;
                    const price = hasCustomSizes ? (size as any).price : getPrice(product.pricingTier, size.roses);
                    return (
                      <button key={size.roses} onClick={() => !disabled && setSelectedSizeIdx(idx)}
                        disabled={disabled}
                        className={`p-2 rounded-sm border-2 text-center transition-all ${disabled ? "opacity-40 cursor-not-allowed border-border" : effectiveSizeIdx === idx ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                        <p className="font-body text-foreground">
                          <span className="font-display text-lg font-semibold">{size.roses}</span>
                          <span className="text-[10px] text-muted-foreground ml-0.5">{hasCustomSizes && (size as any).label ? (size as any).label : 'roses'}</span>
                        </p>
                        <p className="text-xs font-body font-semibold text-primary">${price}</p>
                        {disabled && <p className="text-[9px] text-destructive font-body mt-0.5">Min. {sizeOptions[minSizeIdx].roses}</p>}
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* 2. Glitter */}
              <Section title="Glitter Finish" step={step++} subtitle={`+$${Math.ceil(selectedSize.roses / 25) * 8}`}>
                <div className="flex gap-3 mb-3">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img src={glitterRoseImg} alt="Glitter rose example" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="font-body font-semibold text-foreground text-sm">✨ Add Glitter ✨</p>
                    <p className="text-[11px] text-muted-foreground font-body">$8 per 25 roses · {selectedSize.roses} roses = +${Math.ceil(selectedSize.roses / 25) * 8}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setAddGlitter(true)}
                    className={`p-2.5 rounded-sm border-2 text-center transition-all font-body text-sm ${addGlitter ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                    Yes {addGlitter && <Check className="w-3 h-3 text-primary mx-auto mt-0.5" />}
                  </button>
                  <button onClick={() => setAddGlitter(false)}
                    className={`p-2.5 rounded-sm border-2 text-center transition-all font-body text-sm ${!addGlitter ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                    No {!addGlitter && <Check className="w-3 h-3 text-primary mx-auto mt-0.5" />}
                  </button>
                </div>
              </Section>

              {/* 3. Accessories */}
              <Section title="Accessories" step={step++}>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setAccessory("note")}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-sm border-2 transition-all font-body text-sm ${accessory === "note" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                    <Type className="w-3.5 h-3.5" /> Note <span className="text-[10px] text-secondary">$3</span>
                  </button>
                </div>
                {accessory === "note" && (
                  <textarea value={accessoryText} onChange={(e) => setAccessoryText(e.target.value)} placeholder="Write your note..."
                    className="w-full mt-3 bg-card border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px] resize-none" maxLength={200} />
                )}
              </Section>

              {/* 4. Shipping */}
              <Section title="Shipping" step={step++}>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button onClick={() => setDeliveryMethod("pickup")}
                    className={`flex items-center gap-2 p-3 rounded-sm border-2 transition-all font-body ${deliveryMethod === "pickup" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                    <Store className="w-4 h-4 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <p className="font-semibold text-xs text-foreground">Store pickup</p>
                      <p className="text-xs text-muted-foreground">Free</p>
                    </div>
                    {deliveryMethod === "pickup" && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </button>
                  <button onClick={() => setDeliveryMethod("delivery")}
                    className={`flex items-center gap-2 p-3 rounded-sm border-2 transition-all font-body ${deliveryMethod === "delivery" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                    <Truck className="w-4 h-4 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <p className="font-semibold text-xs text-foreground">Home delivery</p>
                      <p className="text-xs text-muted-foreground">From $25</p>
                    </div>
                    {deliveryMethod === "delivery" && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </button>
                </div>

                <div className="space-y-3 p-4 rounded-sm border border-border bg-card mb-4">
                  {deliveryMethod === "pickup" ? (
                    <p className="font-body text-sm text-muted-foreground">
                      📍 Pickup at: <span className="font-semibold text-foreground">7261 NW 12th St, Miami, FL 33126</span>
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
                      <button className="w-full flex items-center gap-2 px-4 py-3 rounded-sm border border-border bg-card font-body text-sm text-foreground hover:border-primary/30 transition-all">
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

              {/* Desktop sticky bottom bar */}
              <div className="sticky bottom-0 bg-card/95 backdrop-blur-md border border-border rounded-sm p-3 shadow-xl z-10">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-body text-[11px] text-muted-foreground leading-tight">
                      {product.name} · {selectedSize.roses} roses
                      {addGlitter && " · Glitter"}
                      {accessory !== "none" && ` · ${accessory === "note" ? "Note" : "Accessory"}`}
                      {deliveryMethod === "delivery" ? (deliveryMiles && !distanceTooFar ? ` · Shipping ($${deliveryCost})` : " · Shipping (pending)") : " · Pickup"}
                    </p>
                  </div>
                  <p className="font-display text-lg font-bold text-foreground whitespace-nowrap">
                    ${parseFloat(totalPrice.toFixed(2))} <span className="text-[10px] font-body text-muted-foreground font-normal">USD</span>
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => handleAddToCart()} disabled={isAdding || variantsLoading}
                      className="bg-primary text-primary-foreground px-4 py-2 font-body text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-50">
                      {isAdding ? "Adding..." : variantsLoading ? "Loading..." : "Add to cart"}
                    </button>
                    <button onClick={handlePayNow} disabled={isAdding || variantsLoading}
                      className="border-2 border-primary text-primary px-4 py-2 font-body text-[10px] tracking-widest uppercase hover:bg-primary/10 transition-colors rounded-sm whitespace-nowrap disabled:opacity-50">
                      {isAdding ? "Adding..." : variantsLoading ? "Loading..." : "Pay now"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== MOBILE: stacked layout ===== */}
          <div className="md:hidden max-w-4xl mx-auto space-y-10">
            {/* Mobile images */}
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-2 w-full">
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

            <div className="text-center">
              <h1 className="font-display text-3xl font-semibold text-foreground">{product.name}</h1>
              <p className="text-muted-foreground font-body mt-2">{product.description}</p>
            </div>

            {/* 1. Size */}
            <Section title="Number of Roses" step={1}>
              <div className="grid grid-cols-2 gap-3">
                {sizeOptions.map((size, idx) => {
                  const disabled = idx < minSizeIdx;
                  const price = hasCustomSizes ? (size as any).price : getPrice(product.pricingTier, size.roses);
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
            <Section title="Glitter Finish" step={2} subtitle={`+$${Math.ceil(selectedSize.roses / 25) * 8}`}>
              <div className="flex flex-col gap-4 mb-4">
                <div className="w-28 h-28 flex-shrink-0 mx-auto">
                  <img src={glitterRoseImg} alt="Glitter rose example" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-body font-semibold text-foreground">✨ Add Glitter ✨</p>
                  <p className="text-xs text-muted-foreground font-body">$8 per 25 roses · {selectedSize.roses} roses = +${Math.ceil(selectedSize.roses / 25) * 8}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setAddGlitter(true)}
                  className={`p-4 rounded-sm border-2 text-center transition-all font-body text-sm ${addGlitter ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  Yes {addGlitter && <Check className="w-4 h-4 text-primary mx-auto mt-1" />}
                </button>
                <button onClick={() => setAddGlitter(false)}
                  className={`p-4 rounded-sm border-2 text-center transition-all font-body text-sm ${!addGlitter ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  No {!addGlitter && <Check className="w-4 h-4 text-primary mx-auto mt-1" />}
                </button>
              </div>
            </Section>

            {/* 3. Accessories */}
            <Section title="Accessories" step={3}>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setAccessory("note")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all font-body text-sm ${accessory === "note" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  <Type className="w-4 h-4" /> Note <span className="text-xs text-secondary">$3</span>
                </button>
              </div>
              {accessory === "note" && (
                <textarea value={accessoryText} onChange={(e) => setAccessoryText(e.target.value)} placeholder="Write your note..."
                  className="w-full mt-4 bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none" maxLength={200} />
              )}
            </Section>

            {/* 4. Shipping */}
            <Section title="Shipping" step={4}>
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
                    <p className="text-xs text-muted-foreground">From $25</p>
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
                    <button className="w-full flex items-center gap-2 px-4 py-3 rounded-sm border border-border bg-card font-body text-sm text-foreground hover:border-primary/30 transition-all">
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

            {/* Mobile sticky bottom bar */}
            <div className="pb-4" />
            <div className="sticky bottom-0 bg-card/95 backdrop-blur-md border border-border rounded-sm p-3 shadow-xl z-10">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center gap-3">
                  <p className="font-body text-[10px] text-muted-foreground leading-tight flex-1 line-clamp-1">
                    {product.name} · {selectedSize.roses} roses
                    {addGlitter && " · Glitter"}
                    {addCrown && ` · Crown (${crownSize === "gold" ? "Gold" : "Silver"})`}
                    {accessory !== "none" && ` · ${accessory === "note" ? "Note" : "Accessory"}`}
                    {deliveryMethod === "delivery" ? (deliveryMiles && !distanceTooFar ? ` · Shipping ($${parseFloat(deliveryCost.toFixed(2))})` : " · Shipping (pending)") : " · Pickup"}
                  </p>
                  <p className="font-display text-lg font-bold text-foreground whitespace-nowrap">
                    ${parseFloat(totalPrice.toFixed(2))}
                  </p>
                </div>
                <div className="flex w-full gap-2">
                  <button onClick={() => handleAddToCart()} disabled={isAdding || variantsLoading}
                    className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 font-body text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-50">
                    {isAdding ? "Adding..." : variantsLoading ? "Loading..." : "Add to cart"}
                  </button>
                  <button onClick={handlePayNow} disabled={isAdding || variantsLoading}
                    className="flex-1 border-2 border-primary text-primary px-4 py-2.5 font-body text-[10px] tracking-widest uppercase hover:bg-primary/10 transition-colors rounded-sm whitespace-nowrap disabled:opacity-50">
                    {isAdding ? "Adding..." : variantsLoading ? "Loading..." : "Pay now"}
                  </button>
                </div>
              </div>
            </div>

            {/* Cross-links */}
            <YouMightAlsoLove currentProductId={product.id} />
          </div>
        </div>
      </div>
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

export default BouquetProductDetail;
