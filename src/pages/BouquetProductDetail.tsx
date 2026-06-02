import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "@/i18n/LocalizedRouter";
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
import { useShopifyProductDescription } from "@/hooks/useShopifyProductDescription";
import { performApiCheckout } from "@/lib/checkout";
import { calculateDeliveryCost, formatDeliveryCost } from "@/lib/deliveryPricing";
import { trackMetaEvent } from "@/lib/metaPixel";
import { toast } from "sonner";
import { buildAccessoryLineItems } from "@/lib/accessoryVariants";
import Navbar from "@/components/Navbar";
import PaperColorPicker from "@/components/PaperColorPicker";
import PaymentIcons from "@/components/PaymentIcons";
import ProductTrustBlock from "@/components/ProductTrustBlock";
import { StorePickupAlert } from "@/components/StorePickupAlert";
import CollectionFAQ, { useBouquetFAQs } from "@/components/CollectionFAQ";
import { bouquetProducts, bouquetSizeOptions } from "@/lib/catalogData";
import { useMothersDayBouquetByHandle } from "@/lib/mothersDayProducts";
import { isMothersDayPromoActive, isMothersDayHandle } from "@/lib/mothersDayPromo";
import {
  crownOptions, ribbonPresets, crownPrice, ribbonPrice, letterNumberExtraPrice, vaseOptions, getPrice,
} from "@/lib/productData";
import {
  ArrowLeft, Check, Store, Truck, CalendarIcon, Clock, MapPin, Search, Loader2,
  Type, Sparkles, Star, Hash,
} from "lucide-react";
import glitterRoseImg from "@/assets/glitter-rose.webp";
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

  // Mother's Day virtual catalog (live from Shopify) — used when type === "mothers-day"
  // or when the productId handle ends with "-mothers-day-edition".
  const isMothersDayContext = type === "mothers-day" || isMothersDayHandle(productId);
  const { product: mothersDayProduct, loading: mothersDayLoading } =
    useMothersDayBouquetByHandle(isMothersDayContext ? productId : undefined);

  const standardProduct = bouquetProducts.find(
    (b) => b.shopifyHandle === productId || b.id === productId
  );
  const product = isMothersDayContext ? mothersDayProduct : standardProduct;

  // Block purchase in two scenarios:
  // 1) Promo ACTIVE + standard product (not a Mother's Day item) → blocked during promo.
  // 2) Promo INACTIVE + Mother's Day product → page still live (SEO) but Add to Cart disabled.
  const promoActive = isMothersDayPromoActive();
  const purchaseBlocked =
    (promoActive && !isMothersDayContext) ||
    (!promoActive && isMothersDayContext);

  const bouquetFAQs = useBouquetFAQs();

  // Live Shopify images (1st = primary, 2nd = secondary). Fallback to local data while loading.
  const liveImages = useShopifyProductImages(product?.shopifyHandle);
  const primaryImage = liveImages.primary || product?.image;
  const secondaryImage = liveImages.secondary || product?.image2;
  // All Shopify images (up to 10). Used by gallery UI on PDP.
  const allImages: string[] = (liveImages.all && liveImages.all.length > 0)
    ? liveImages.all
    : [primaryImage, secondaryImage].filter(Boolean) as string[];
  // Desktop gallery: top image is swappable via thumbnails; bottom image is fixed (photo 5).
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  // Hovered thumb index (preview only — does not "lock" the active image).
  const [hoverImageIdx, setHoverImageIdx] = useState<number | null>(null);
  useEffect(() => { setActiveImageIdx(0); setHoverImageIdx(null); }, [product?.shopifyHandle]);
  const displayedIdx = hoverImageIdx ?? activeImageIdx;
  const desktopMainImage = allImages[displayedIdx] || primaryImage;
  // Bottom big image on desktop = last photo available:
  //   6+ photos → photo 6 (index 5); exactly 5 → photo 5 (index 4); otherwise last; fallback secondary.
  const bottomIdx = allImages.length >= 6 ? 5 : allImages.length - 1;
  const desktopBottomImage = allImages[bottomIdx] || secondaryImage;
  // Thumbnails column on desktop = all images EXCEPT the one currently shown as bottom big image.
  // No cap: show every remaining photo so nothing is hidden when Shopify has 6+ images.
  const desktopThumbs: Array<{ url: string; idx: number }> = allImages
    .map((url, idx) => ({ url, idx }))
    .filter(({ url }) => url && url !== desktopBottomImage);

  // GA4: view_item event
  useEffect(() => {
    if (product) {
      const firstPrice = product.customSizes?.[0]?.price ?? getPrice(product.pricingTier, product.pricingTier === 'mix3red' ? 75 : 50);
      (window as any).gtag?.('event', 'view_item', {
        currency: 'USD',
        value: firstPrice,
        items: [{ item_id: product.shopifyHandle, item_name: product.name }],
      });
      trackMetaEvent('ViewContent', {
        content_ids: [product.shopifyHandle],
        content_name: product.name,
        content_type: 'product',
        value: firstPrice,
        currency: 'USD',
      });
    }
  }, [product?.shopifyHandle]);

  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  // Note and butterfly are now independent — users can pick both at the same time.
  const [addNote, setAddNote] = useState(false);
  const [addButterfly, setAddButterfly] = useState(false);
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
    const targets = [desktopEl, mobileEl].filter(Boolean) as HTMLElement[];
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

  // Live Shopify description + SEO (single source of truth). Falls back to hardcoded
  // values while loading or if Shopify returns nothing for a given field.
  const { data: shopifyDesc } = useShopifyProductDescription(product?.shopifyHandle);

  // Resolved description for UI (cascade: ES metafield → hardcoded ES → Shopify EN → hardcoded EN)
  const resolvedDescription = (() => {
    if (!product) return "";
    if (language === "es") {
      return shopifyDesc.descriptionEs || product.descriptionEs || shopifyDesc.description || product.description;
    }
    return shopifyDesc.description || product.description;
  })();

  // Resolved SEO (cascade: Shopify ES metafield → hardcoded seoData → Shopify EN native → fallback)
  const resolvedSeoTitle =
    (language === "es" ? shopifyDesc.seoTitleEs : undefined) ||
    shopifyDesc.seoTitle ||
    seo?.seoTitle ||
    (product ? `${product.name} Miami | Charls Flowers` : "");
  const resolvedSeoDescription =
    (language === "es" ? shopifyDesc.seoDescriptionEs : undefined) ||
    shopifyDesc.seoDescription ||
    seo?.seoDescription ||
    (product?.description ?? "");

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

  // Mother's Day: default the crown finish to "silver" (instead of the standard "small").
  useEffect(() => {
    if (isMothersDayContext && crownSize !== "silver" && crownSize !== "gold") {
      setCrownSize("silver");
    }
  }, [isMothersDayContext]);

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
    // While the Mother's Day collection is loading, show a spinner instead of "Product not found"
    if (isMothersDayContext && mothersDayLoading) {
      return (
        <div className="min-h-screen bg-background"><Navbar />
          <div className="pt-32 flex justify-center">
            <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      );
    }
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
  const glitterCost = !isMothersDayContext && addGlitter === true ? Math.ceil(selectedSize.roses / 25) * 8 : 0;
  const vaseCost = !isMothersDayContext && addVase ? vaseOptions[selectedVaseIdx].price : 0;
  // Note add-on costs $3 for BOTH standard and Mother's Day products.
  // Butterflies are bundled for MD; only standard products charge $3 for them.
  const accessoryCost =
    (addNote ? 3 : 0) + (!isMothersDayContext && addButterfly ? 3 : 0);
  const deliveryCost = deliveryMethod === "delivery" && deliveryMiles && !distanceTooFar ? calculateDeliveryCost(deliveryMiles) : 0;
  // Mother's Day: Crown + Butterflies + Ribbon are bundled in the Shopify variant price.
  // The optional Note add-on is still charged separately ($3).
  // Standard products: all addons are charged on top of the base size price.
  const basePrice = isMothersDayContext
    ? sizePrice + accessoryCost
    : sizePrice + (addCrown ? crownPrice : 0) + (addRibbon ? ribbonPrice : 0) + glitterCost + vaseCost + accessoryCost;
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
      if (!isMothersDayContext && addGlitter === true) addons.push("Glitter");
      if (!isMothersDayContext && addVase) addons.push(`Vase (${vaseOptions[selectedVaseIdx].label})`);
      if (!isMothersDayContext && addButterfly) addons.push("Butterflies");

      // GA4: add_to_cart event
      (window as any).gtag?.('event', 'add_to_cart', {
        currency: 'USD',
        value: basePrice,
        items: [{ item_id: product.shopifyHandle, item_name: product.name, quantity: 1 }],
      });
      trackMetaEvent('AddToCart', {
        content_ids: [product.shopifyHandle],
        content_name: product.name,
        value: basePrice,
        currency: 'USD',
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
        // In Mother's Day mode the only optional add-on is the card "note".
        // Note + butterflies are now independent. The cart "accessory" field
        // still tracks the note (so the textarea content stays linked to it);
        // butterflies are pushed as a regular addon string above.
        accessory: addNote ? "note" : "none",
        accessoryText: addNote ? accessoryText : "",
        ribbonText: isMothersDayContext ? ribbonText : ribbonText,
        crownSize: isMothersDayContext ? crownSize : (addCrown ? crownSize : ""),
        specialText: isMothersDayContext ? "" : specialText,
        heartColor: product.type === "heart" ? (product.color === "Rosa" ? "pink" : "red") : "",
        glitter: !isMothersDayContext && addGlitter === true,
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
        isMothersDay: isMothersDayContext,
        structuredAddress: deliveryMethod === "delivery" ? structuredAddress : undefined,
        shopifyVariantId: variant.id,
        shopifyHandle: product.shopifyHandle,
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
          <p className="text-[11px] text-muted-foreground font-body">{t("product.glitterDesc")} · {selectedSize.roses} roses = +${Math.ceil(selectedSize.roses / 25) * 8}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setAddGlitter(true)}
          className={`flex-1 py-2.5 rounded-full border text-center transition-all font-body text-sm ${addGlitter === true ? "border-primary bg-primary/15 text-foreground" : "border-primary/30 text-foreground hover:bg-primary/5"}`}>
          {t("product.yes")}
        </button>
        <button onClick={() => setAddGlitter(false)}
          className={`flex-1 py-2.5 rounded-full border text-center transition-all font-body text-sm ${addGlitter === false ? "border-primary bg-primary/15 text-foreground" : "border-primary/30 text-foreground hover:bg-primary/5"}`}>
          {t("product.no")}
        </button>
      </div>
    </Section>
  );

  const renderAccessoriesSection = (isMobile = false) => (
    <Section title={t("product.accessories")} step={step++}>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setAddNote((v) => !v)}
          className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg border-2 transition-all font-body text-sm ${addNote ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
          <img src={noteImg} alt="Note accessory" className="w-16 h-16 md:w-12 md:h-12 object-contain rounded-lg" /> {t("product.note")} <span className="text-[10px] text-secondary">$3</span>
        </button>
        <button onClick={() => setAddButterfly((v) => !v)}
          className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg border-2 transition-all font-body text-sm ${addButterfly ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
          <img src={butterflyImg} alt="Butterfly accessory" className="w-16 h-16 md:w-12 md:h-12 object-contain" /> {t("product.butterflies")} <span className="text-[10px] text-secondary">$3</span>
        </button>
      </div>
      {addNote && (
        <textarea value={accessoryText} onChange={(e) => setAccessoryText(e.target.value)} placeholder={t("product.writeNote")}
          className="w-full mt-3 bg-card border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px] resize-none" maxLength={200} />
      )}
    </Section>
  );

  // ─── Mother's Day: Accessories Included (Crown + Butterflies + Ribbon bundled) ───
  const renderMothersDayAccessoriesSection = () => (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
          Accessories Included
        </h2>
        <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-body font-semibold tracking-wider">
          INCLUDED
        </span>
      </div>
      <p className="font-body text-xs text-muted-foreground mb-4">
        The following accessories are included in the price:
      </p>

      <div className="space-y-4">
        {/* Crown — required choice between Silver / Gold */}
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2 mb-3">
            <p className="font-body font-semibold text-foreground text-sm flex-1">Crown</p>
            <span className="text-[10px] text-muted-foreground font-body">Choose finish</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCrownSize("silver")}
              className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg border-2 transition-all font-body text-sm ${
                crownSize === "silver"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              <img src={crownSilverImg} alt="Silver crown" className="w-16 h-16 object-contain" />
              Silver
            </button>
            <button
              type="button"
              onClick={() => setCrownSize("gold")}
              className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg border-2 transition-all font-body text-sm ${
                crownSize === "gold"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              <img src={crownGoldImg} alt="Gold crown" className="w-16 h-16 object-contain" />
              Gold
            </button>
          </div>
        </div>

        {/* Butterflies — fixed */}
        <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
          <img src={butterflyImg} alt="Gold butterfly" className="w-14 h-14 object-contain flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-body font-semibold text-foreground text-sm">Butterflies</p>
            <p className="text-xs text-muted-foreground font-body">Included: 1 Gold Butterfly</p>
          </div>
          <Check className="w-5 h-5 text-primary flex-shrink-0" />
        </div>

        {/* Personalized Ribbon — text input */}
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="font-body font-semibold text-foreground text-sm mb-2">Personalized Ribbon</p>
          <input
            type="text"
            value={ribbonText}
            onChange={(e) => setRibbonText(e.target.value)}
            placeholder="Write the text for your ribbon (e.g. Happy Mother's Day)"
            maxLength={60}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="text-[11px] text-muted-foreground font-body mt-1">
            Leave empty if you prefer no text on the ribbon.
          </p>
        </div>
      </div>
    </div>
  );

  // ─── Mother's Day: Optional Add-ons (only Notes / card message) ───
  const renderMothersDayOptionalSection = () => (
    <Section title="Optional Add-ons" step={step++}>
      <button
        type="button"
        onClick={() => setAddNote((v) => !v)}
        className={`w-full flex items-center gap-3 py-2 px-3 rounded-lg border-2 transition-all font-body text-sm ${
          addNote
            ? "border-primary bg-primary/5 text-primary"
            : "border-border text-muted-foreground hover:border-primary/30"
        }`}
      >
        <img src={noteImg} alt="Note card" className="w-12 h-12 object-contain rounded-lg" />
        <span className="flex-1 text-left">
          <span className="block font-semibold text-foreground">
            Add a note <span className="text-secondary font-normal">+$3</span>
          </span>
          <span className="block text-[11px] text-muted-foreground">Personalized message card with your bouquet</span>
        </span>
        {addNote && <Check className="w-4 h-4 text-primary" />}
      </button>
      {addNote && (
        <textarea
          value={accessoryText}
          onChange={(e) => setAccessoryText(e.target.value)}
          placeholder={t("product.writeNote")}
          className="w-full mt-3 bg-card border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px] resize-none"
          maxLength={200}
        />
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
              disabled={(date) => {
                const day = startOfDay(date);
                const today = startOfDay(todayInMiami());
                if (isBefore(day, today)) return true;
                const promoStart = new Date(2026, 4, 1);
                const promoEnd = new Date(2026, 4, 12);
                if (isMothersDayContext) {
                  // Mother's Day product pages: ONLY allow May 1–12, 2026
                  return day < promoStart || day > promoEnd;
                }
                // Standard product pages: BLOCK May 1–12 window
                return day >= promoStart && day <= promoEnd;
              }} className="p-3 pointer-events-auto" locale={enUS}
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
      <SeoHead title={resolvedSeoTitle} description={resolvedSeoDescription} path={`/bouquets/all/${product.shopifyHandle}`} image={primaryImage} />
      <JsonLd data={[productSchema(product.name, resolvedSeoDescription, dynamicMinPrice ?? (hasCustomSizes ? product.customSizes![0].price : getPrice(product.pricingTier, product.pricingTier === 'mix3red' ? 75 : 50)), primaryImage), breadcrumbSchema([{ name: "Home", url: "https://www.charlsflowers.com" }, { name: "Bouquets", url: "https://www.charlsflowers.com/bouquets" }, { name: product.name, url: `https://www.charlsflowers.com/bouquets/all/${product.shopifyHandle}` }])]} />
      <Navbar />
      <div className="pt-20 md:pt-28 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Bouquets", to: "/bouquets" }, { label: product.name }]} />

          {/* ===== DESKTOP: two-column layout ===== */}
          <div className="hidden lg:grid lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] gap-10 lg:gap-16 max-w-7xl mx-auto">
            {/* Left column — sticky gallery (thumbnails + main + bottom big) */}
            <div className="sticky top-28 self-start space-y-3 min-w-0">
              <div className="flex gap-3 min-w-0">
                {/* Vertical thumbnails column */}
                {desktopThumbs.length > 0 && (
                  <div className="flex flex-col gap-3 w-20 flex-none">
                    {desktopThumbs.map(({ url, idx }) => (
                      <button
                        key={`${idx}-${url}`}
                        type="button"
                        onClick={() => setActiveImageIdx(idx)}
                        onMouseEnter={() => setHoverImageIdx(idx)}
                        onMouseLeave={() => setHoverImageIdx(null)}
                        aria-label={`View image ${idx + 1}`}
                        className={`relative overflow-hidden rounded-md bg-muted aspect-square border-2 transition-colors ${activeImageIdx === idx ? "border-primary" : "border-transparent hover:border-primary/40"}`}
                      >
                        <img src={url} alt={`${product.name} thumbnail ${idx + 1}`} loading="lazy" width={120} height={120} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                {/* Main (top) image — swappable via thumbnails */}
                <div className="relative overflow-hidden rounded-lg bg-muted flex items-center justify-center aspect-square flex-1 min-w-0">
                  {desktopMainImage ? (
                    <img src={desktopMainImage} alt={`${product.name} Miami – Charls Flowers`} width={600} height={600} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><span className="font-display text-6xl text-muted-foreground/20">🌹</span></div>
                  )}
                </div>
              </div>
              {/* Bottom big image — always photo 5 (or fallback to secondary). Sits below the main image, aligned with it. */}
              {desktopBottomImage && (
                <div className={`${desktopThumbs.length > 0 ? "ml-[5.75rem]" : ""}`}>
                  <div className="relative overflow-hidden rounded-lg bg-muted flex items-center justify-center aspect-square">
                    <img src={desktopBottomImage} alt={`${product.name} alternate – Charls Flowers`} loading="lazy" width={600} height={600} className="w-full h-full object-cover" />
                  </div>
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
                  {replaceDescriptionPrice(resolvedDescription).split('\n').map((line, i) => (
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

              {isMothersDayContext ? (
                <>
                  {renderMothersDayAccessoriesSection()}
                  {renderMothersDayOptionalSection()}
                </>
              ) : (
                <>
                  {renderGlitterSection(false)}
                  {renderAccessoriesSection(false)}
                </>
              )}
              {renderShippingSection(false, autocompleteDesktopRef)}

              {/* Desktop bottom bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-body text-[10px] lg:text-xs text-muted-foreground leading-tight flex-1 line-clamp-1">
                    {product.name} · {selectedSize.roses} {t("product.roses")}
                    {!isMothersDayContext && addGlitter === true && " · Glitter"}
                    {addNote && ` · ${t("product.note")}`}
                    {!isMothersDayContext && addButterfly && ` · ${t("product.butterflies")}`}
                  </p>
                  <p className="font-display text-lg lg:text-2xl font-bold text-foreground whitespace-nowrap">${parseFloat(totalPrice.toFixed(2))}</p>
                </div>
                {deliveryMethod === "pickup" && <StorePickupAlert />}
                <button ref={orderButtonsDesktopRef} onClick={handleOrderNow} disabled={isAdding || variantsLoading}
                  className="w-full bg-primary text-primary-foreground py-4 lg:py-5 font-body text-sm lg:text-base tracking-[0.25em] uppercase font-semibold hover:bg-primary/90 transition-colors rounded-lg disabled:opacity-50"
                  hidden={purchaseBlocked}>
                  {isAdding ? "..." : variantsLoading ? "..." : t("product.orderAndPay")}
                </button>
                {purchaseBlocked && <PurchaseBlockedNotice promoActive={promoActive} isMothersDayContext={isMothersDayContext} />}
                <PaymentIcons size={22} className="pt-1" />
                <ProductTrustBlock />
              </div>

            </div>
          </div>

          {/* ===== MOBILE: stacked layout ===== */}
          <div className="lg:hidden max-w-4xl mx-auto space-y-8">
            {/* Mobile images — swipeable carousel with ALL product images */}
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-2 -mx-6 px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {allImages.length === 0 ? (
                <div className="w-[88%] flex-none snap-start relative overflow-hidden rounded-lg bg-muted flex items-center justify-center aspect-square">
                  <span className="font-display text-6xl text-muted-foreground/20">🌹</span>
                </div>
              ) : (
                allImages.map((url, idx) => (
                  <div key={`${idx}-${url}`} className="w-[88%] flex-none snap-start relative overflow-hidden rounded-lg bg-muted flex items-center justify-center aspect-square">
                    <img
                      src={url}
                      alt={`${product.name} ${idx === 0 ? "Miami" : `view ${idx + 1}`} – Charls Flowers`}
                      loading={idx === 0 ? "eager" : "lazy"}
                      width={600}
                      height={600}
                      className={`w-full h-full ${idx === 0 ? "object-contain" : "object-cover"} pointer-events-none`}
                    />
                  </div>
                ))
              )}
            </div>

            <div className="text-center">
              <h1 className="font-display text-2xl font-semibold text-foreground">{product.name}</h1>
              <div className="text-muted-foreground font-body text-sm mt-2 space-y-1 text-left">
                {replaceDescriptionPrice(resolvedDescription).split('\n').map((line, i) => (
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
            {isMothersDayContext ? (
              <>
                {renderMothersDayAccessoriesSection()}
                {renderMothersDayOptionalSection()}
              </>
            ) : (
              <>
                {renderGlitterSection(true)}
                {renderAccessoriesSection(true)}
              </>
            )}
            {renderShippingSection(true, autocompleteMobileRef)}

            {/* Mobile inline buttons after customer notes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-body text-[10px] text-muted-foreground leading-tight flex-1 line-clamp-1">
                  {product.name} · {selectedSize.roses} {t("product.roses")}
                  {!isMothersDayContext && addGlitter === true && " · Glitter"}
                  {addNote && ` · ${t("product.note")}`}
                  {!isMothersDayContext && addButterfly && ` · ${t("product.butterflies")}`}
                </p>
                <p className="font-display text-lg font-bold text-foreground whitespace-nowrap">${parseFloat(totalPrice.toFixed(2))}</p>
              </div>
              {deliveryMethod === "pickup" && <StorePickupAlert />}
              <button ref={orderButtonsMobileRef} onClick={handleOrderNow} disabled={isAdding || variantsLoading}
                className="w-full bg-primary text-primary-foreground py-4 font-body text-sm tracking-[0.25em] uppercase font-semibold hover:bg-primary/90 transition-colors rounded-lg disabled:opacity-50"
                hidden={purchaseBlocked}>
                {isAdding ? "..." : variantsLoading ? "..." : t("product.orderAndPay")}
              </button>
              {purchaseBlocked && <PurchaseBlockedNotice promoActive={promoActive} isMothersDayContext={isMothersDayContext} />}
              <PaymentIcons size={22} className="pt-1" />
              <ProductTrustBlock />
            </div>
          </div>

          {/* Cross-links — related products (above FAQs) */}
          <YouMightAlsoLove currentProductId={product.id} />

          {/* FAQs (shared desktop + mobile, after related products) */}
          <CollectionFAQ faqs={bouquetFAQs} />
        </div>
      </div>

      {/* Sticky Order Now bar — appears when the inline button leaves the viewport */}
      {showStickyBar && !purchaseBlocked && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border shadow-lg">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs text-muted-foreground truncate">
                {product.name} · {selectedSize.roses} {t("product.roses")}
                {!isMothersDayContext && addGlitter === true && " · Glitter"}
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

const PurchaseBlockedNotice = ({
  promoActive,
  isMothersDayContext,
}: {
  promoActive: boolean;
  isMothersDayContext: boolean;
}) => {
  // Case A: promo active + standard product → invite to Mother's Day collection
  // Case B: promo ended + Mother's Day product → "see you next year"
  const promoEnded = !promoActive && isMothersDayContext;

  return (
    <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 space-y-2">
      <p className="font-body text-sm font-semibold text-foreground text-center">
        {promoEnded
          ? "Mother's Day promo ended — see you next year"
          : "Available again on May 13, 2026"}
      </p>
      <p className="font-body text-xs text-muted-foreground text-center">
        {promoEnded
          ? "Our Mother's Day Special Edition runs May 1 – May 12 every year. This collection will be available for purchase again next May."
          : "During our Mother's Day Special Edition (May 1 – May 12), only the Mother's Day collection is available for purchase."}
      </p>
      {!promoEnded && (
        <Link
          to="/mothers-day"
          className="block text-center text-primary hover:underline font-body text-xs tracking-wider uppercase font-semibold pt-1"
        >
          Check out our Mother's Day Collection →
        </Link>
      )}
    </div>
  );
};

export default BouquetProductDetail;
