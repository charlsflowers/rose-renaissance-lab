import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, addHours, isBefore, startOfDay } from "date-fns";
import { miamiHourNow, todayInMiami, isTodayInMiami } from "@/lib/miamiTime";
import { supabase } from "@/integrations/supabase/client";
import { enUS } from "date-fns/locale";
import { useTranslation } from "@/i18n/LanguageContext";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { performApiCheckout } from "@/lib/checkout";
import { calculateDeliveryCost, formatDeliveryCost } from "@/lib/deliveryPricing";
import { buildAccessoryLineItems, CUSTOM_BOUQUET_VARIANT_ID } from "@/lib/accessoryVariants";
import { resolveCustomBouquetVariantId, getCustomBouquetType } from "@/lib/customBouquetVariants";
import { storefrontApiRequest } from "@/lib/shopify";

import Navbar from "@/components/Navbar";
import PaperColorPicker from "@/components/PaperColorPicker";
import heroBouquet from "@/assets/hero-cover.webp";
import glitterRoseImg from "@/assets/glitter-rose.png";
import crownSilverImg from "@/assets/crown-silver.webp";
import crownGoldImg from "@/assets/crown-gold.webp";
import butterflyImg from "@/assets/butterfly-gold.webp";
import noteImg from "@/assets/accessory-note.webp";
import lettersImg from "@/assets/letters-babybreathe.png";
import vase50Img from "@/assets/vase-50.webp";
import vase75Img from "@/assets/vase-75.webp";
import vase100Img from "@/assets/vase-100.webp";
import ribbonImg from "@/assets/ribbon.webp";
import {
  colorOptions,
  sizeOptions,
  pricingTable,
  getFinishPrice,
  crownOptions,
  ribbonPresets,
  letterNumberExtraPrice,
  crownPrice,
  ribbonPrice,
  vaseOptions,
  type ColorOption,
  type AccessoryType,
} from "@/lib/productData";
import { Sparkles, Crown, Type, Hash, Check, Bug, Star, Truck, Store, CalendarIcon, Clock, MapPin, Search, Loader2, Eye } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const BouquetBuilder = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const [selectedColors, setSelectedColors] = useState<ColorOption[]>([]);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [accessory, setAccessory] = useState<AccessoryType>("none");
  const [accessoryText, setAccessoryText] = useState("");
  const [addCrown, setAddCrown] = useState(false);
  const [crownSize, setCrownSize] = useState("small");
  const [addRibbon, setAddRibbon] = useState(false);
  const [ribbonType, setRibbonType] = useState<"names" | "congratulations">("names");
  const [ribbonText, setRibbonText] = useState("");
  const [addLettersNumbers, setAddLettersNumbers] = useState(false);
  const [lettersNumbersType, setLettersNumbersType] = useState<"letters" | "numbers">("letters");
  const [specialText, setSpecialText] = useState("");
  const [addVase, setAddVase] = useState(false);
  const [selectedVaseIdx, setSelectedVaseIdx] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [deliveryHour, setDeliveryHour] = useState<string>("");
  const [deliveryMiles, setDeliveryMiles] = useState<number | null>(null);
  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryStreet, setDeliveryStreet] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
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
  const [paperColor, setPaperColor] = useState("");

  const STORE_MAP_URL = `https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent("7261 NW 12th St, Miami, FL 33126")}`;

  // Scroll direction detection for sticky bar
  const [showStickyBar, setShowStickyBar] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShowStickyBar(currentY > lastScrollY.current || currentY < 50);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setShowPredictions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPredictions = useCallback(async (input: string) => {
    if (input.length < 3) {
      setPredictions([]);
      return;
    }
    setAutocompleteLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("places-autocomplete", {
        body: { input },
      });
      if (!error && data?.predictions) {
        setPredictions(data.predictions);
        setShowPredictions(true);
      }
    } catch {
      // silently fail
    } finally {
      setAutocompleteLoading(false);
    }
  }, []);

  const handleAddressInput = useCallback((value: string) => {
    setAddressQuery(value);
    setSelectedAddress("");
    setDeliveryMiles(null);
    setMapUrl("");
    setDistanceError("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(value), 350);
  }, [fetchPredictions]);

  const handleSelectPrediction = useCallback((prediction: { description: string; mainText: string; secondaryText: string }) => {
    setAddressQuery(prediction.description);
    setSelectedAddress(prediction.description);
    setShowPredictions(false);
    setPredictions([]);

    const parts = prediction.description.split(", ");
    const street = prediction.mainText || parts[0] || "";
    const city = parts[1] || "";
    const fullText = prediction.description + " " + (prediction.secondaryText || "");
    const zipMatch = fullText.match(/\b(\d{5})\b/);
    const zip = zipMatch ? zipMatch[1] : "";

    setDeliveryStreet(street);
    setDeliveryCity(city);
    if (zip) setDeliveryZip(zip);

    if (street && city) {
      (async () => {
        setDistanceLoading(true);
        setDistanceError("");
        setDistanceTooFar(false);
        setDeliveryMiles(null);
        try {
          const { data, error } = await supabase.functions.invoke("calculate-distance", {
            body: { fullAddress: prediction.description },
          });
          if (error) throw new Error("Connection error");
          if (data.error) {
            setDistanceError(data.error);
            if (data.tooFar) {
              setDistanceTooFar(true);
              setDeliveryMiles(data.miles);
            }
          } else {
            setDeliveryMiles(data.miles);
            setDeliveryDuration(data.duration);
            if (data.mapUrl) setMapUrl(data.mapUrl);
          }
        } catch (e: any) {
          setDistanceError(e.message || "Error calculating distance");
        } finally {
          setDistanceLoading(false);
        }
      })();
    }
  }, []);

  // ─── Shopify Storefront API: fetch all variants for "custom-bouquet" once ───
  interface ShopifyCustomVariant {
    id: string;
    price: { amount: string };
    selectedOptions: Array<{ name: string; value: string }>;
  }
  const [shopifyVariants, setShopifyVariants] = useState<ShopifyCustomVariant[]>([]);
  const [variantsLoading, setVariantsLoading] = useState(true);

  useEffect(() => {
    const QUERY = `
      query {
        productByHandle(handle: "custom-bouquet") {
          variants(first: 100) {
            edges {
              node {
                id
                price { amount }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    `;
    (async () => {
      try {
        const data = await storefrontApiRequest(QUERY);
        const edges = data?.data?.productByHandle?.variants?.edges ?? [];
        setShopifyVariants(edges.map((e: { node: ShopifyCustomVariant }) => e.node));
      } catch (err) {
        console.error("Failed to load custom-bouquet variants:", err);
      } finally {
        setVariantsLoading(false);
      }
    })();
  }, []);

  // Find the matching Shopify variant based on Mix Type + Roses
  const matchedVariant = useMemo(() => {
    if (shopifyVariants.length === 0 || selectedColors.length === 0) return null;
    const mixType = getCustomBouquetType(selectedColors);
    const rosesStr = String(pricingTable[selectedSizeIdx].roses);
    if (!mixType) return null;
    return shopifyVariants.find(v =>
      v.selectedOptions.some(o => o.name === "Mix Type" && o.value === mixType) &&
      v.selectedOptions.some(o => o.name === "Roses" && o.value === rosesStr)
    ) ?? null;
  }, [shopifyVariants, selectedColors, selectedSizeIdx]);

  const customBouquetVariantGid = matchedVariant?.id
    ?? `gid://shopify/ProductVariant/${resolveCustomBouquetVariantId(selectedColors, pricingTable[selectedSizeIdx].roses) || CUSTOM_BOUQUET_VARIANT_ID}`;

  const minRoses = selectedColors.length >= 3 ? 75 : 50;

  // Auto-bump size when 3 colors selected and current size is 50
  useEffect(() => {
    if (selectedColors.length >= 3 && pricingTable[selectedSizeIdx].roses < 75) {
      const idx75 = pricingTable.findIndex(s => s.roses >= 75);
      if (idx75 >= 0) setSelectedSizeIdx(idx75);
    }
  }, [selectedColors.length]);

  const lettersNumbersCost = specialText.length > 0 ? specialText.length * letterNumberExtraPrice : 0;

  // Price: use Shopify variant price when available, fall back to local table
  const basePrice = useMemo(() => {
    if (matchedVariant) return parseFloat(matchedVariant.price.amount);
    const roses = pricingTable[selectedSizeIdx].roses;
    return getFinishPrice(selectedColors, roses);
  }, [matchedVariant, selectedSizeIdx, selectedColors]);

  const deliveryCost = deliveryMethod === "delivery" && deliveryMiles && !distanceTooFar ? calculateDeliveryCost(deliveryMiles) : 0;

  const minLeadHours = deliveryMethod === "delivery" ? 1.5 : 2;
  const minMiamiHour = miamiHourNow() + minLeadHours;

  const getAvailableHours = (date: Date | undefined) => {
    if (!date) return [];
    const day = date.getDay();
    let startHour: number, closeHour: number;
    if (deliveryMethod === "pickup") {
      startHour = 9; // 9:30 rounded to 10:00 first slot
      closeHour = day === 0 ? 17 : day === 6 ? 18 : 19;
    } else {
      startHour = 10;
      closeHour = day === 0 ? 17 : day === 6 ? 18 : 19;
    }
    const hours: string[] = [];
    const firstSlot = deliveryMethod === "pickup" ? 9.5 : 10;
    // Generate half-hour start then full hours
    if (deliveryMethod === "pickup") {
      // 9:30 AM first
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

  const rosesCount = pricingTable[selectedSizeIdx].roses;

  const [addGlitter, setAddGlitter] = useState<boolean | null>(null);
  const glitterCost = addGlitter === true ? Math.ceil(rosesCount / 25) * 8 : 0;
  const vaseCost = addVase ? vaseOptions[selectedVaseIdx].price : 0;

  const crownCost = addCrown ? crownPrice : 0;
  const ribbonCost = addRibbon ? ribbonPrice : 0;
  const accessoryCost = accessory === "note" ? 3 : accessory === "butterfly" ? 3 : 0;

  const totalPrice = useMemo(() => {
    let total = basePrice + lettersNumbersCost;
    total += glitterCost;
    total += crownCost;
    total += ribbonCost;
    total += vaseCost;
    total += accessoryCost;
    total += deliveryCost;
    return total;
  }, [basePrice, lettersNumbersCost, glitterCost, crownCost, ribbonCost, vaseCost, accessoryCost, deliveryCost]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [hasGeneratedPreview, setHasGeneratedPreview] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleGeneratePreview = useCallback(async () => {
    setPreviewLoading(true);
    setPreviewError("");
    setPreviewUrl(null);
    try {
      const rosesCount = pricingTable[selectedSizeIdx].roses;
      const bouquetConfig: Record<string, string> = {
        bouquetType: "classic",
        color: selectedColors.map(c => c.name).join(", "),
        paperColor: paperColor,
        roses: String(rosesCount),
        glitter: String(addGlitter),
      };
      if (specialText) bouquetConfig.specialText = specialText;
      if (addCrown) { bouquetConfig.crown = "true"; bouquetConfig.crownSize = crownSize; }
      if (addRibbon && ribbonText) { bouquetConfig.ribbon = "true"; bouquetConfig.ribbonText = ribbonText; }

      const baseImageUrl = `https://urcocghysdjfawmfitzj.supabase.co/storage/v1/object/public/bouquet-previews/reference/ref-${rosesCount}.png`;

      const { data, error } = await supabase.functions.invoke("generate-bouquet-preview", {
        body: { bouquetConfig, baseImageUrl },
      });

      if (error) throw new Error("Connection error");
      if (data?.error) {
        setPreviewError(data.error);
      } else if (data?.imageUrl) {
        setPreviewUrl(data.imageUrl);
        setHasGeneratedPreview(true);
      }
    } catch (e: any) {
      setPreviewError(e.message || "Error generating preview");
    } finally {
      setPreviewLoading(false);
    }
  }, [selectedColors, rosesCount, addGlitter, specialText, addCrown, crownSize, addRibbon, ribbonText]);

  const validateBuilder = () => {
    if (deliveryMethod === "delivery" && !selectedAddress) { toast.error("Please select a delivery address."); return false; }
    if (deliveryMethod === "delivery" && (distanceTooFar || deliveryMiles === null)) { toast.error("The address is invalid or out of range."); return false; }
    if (!deliveryDate || !deliveryHour) { toast.error("Please select a date and time."); return false; }
    if (variantsLoading) { toast.error("We are still loading product variants."); return false; }
    return true;
  };

  const buildCartItem = () => {
    const addons: string[] = [];
    if (addCrown) addons.push(`Crown Tiara (${crownSize})`);
    if (addRibbon) addons.push("Ribbon");
    if (addGlitter) addons.push("Glitter");
    if (addVase) addons.push(`Vase (${vaseOptions[selectedVaseIdx].label})`);
    if (specialText) addons.push(`${lettersNumbersType === "letters" ? "Letters" : "Numbers"}: ${specialText}`);
    return {
      id: "",
      productName: "Custom Bouquet",
      bouquetType: "custom" as const,
      color: selectedColors.map(c => c.nameEn).join(', '),
      roses: rosesCount,
      price: basePrice + lettersNumbersCost + crownCost + ribbonCost + glitterCost + vaseCost + accessoryCost,
      deliveryCost,
      totalPrice,
      addons,
      accessory,
      accessoryText,
      ribbonText,
      crownSize: addCrown ? crownSize : "",
      specialText,
      heartColor: "",
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
      shopifyVariantId: customBouquetVariantGid,
    };
  };

  const handleBuilderAddToCart = async () => {
    if (!validateBuilder()) return;
    setIsAdding(true);
    try {
      await addItem(buildCartItem());
      toast.success("Bouquet added to cart!");
      navigate("/checkout");
    } catch { toast.error("Failed to add to cart."); }
    finally { setIsAdding(false); }
  };

  const handleBuilderPayNow = async () => {
    if (!validateBuilder()) return;
    setIsAdding(true);
    try {
      await addItem(buildCartItem());
      toast.success("Bouquet added to cart!");

      const accessories = buildAccessoryLineItems({
        glitter: addGlitter,
        rosesCount,
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
      if (deliveryHour) noteLines.push(`- ⏰ Hora: ${deliveryHour}`);
      if (deliveryMethod === "delivery" && selectedAddress) noteLines.push(`- 📍 Dirección: ${selectedAddress}`);
      noteLines.push("");
      noteLines.push("DATOS DEL PRODUCTO 1");
      noteLines.push(`- 🌹 Producto: Custom Bouquet`);
      if (selectedColors.length > 0) selectedColors.forEach((c, ci) => noteLines.push(`- 🌸 Colour ${ci + 1}: ${c.nameEn}`));
      if (paperColor) noteLines.push(`- 📄 Paper color: ${paperColor}`);
      if (rosesCount) noteLines.push(`- 🌹 Roses: ${rosesCount}`);
      if (addGlitter) noteLines.push(`- ✨ Glitter finish: Yes`);
      if (addCrown && crownSize) noteLines.push(`- 👑 Crown: ${crownSize}`);
      if (accessory && accessory !== "none") noteLines.push(`- 🦋 Accessory: ${accessory === "note" ? "Notes" : "Butterflies"}`);
      if (accessoryText) noteLines.push(`- 💌 Card text: ${accessoryText}`);
      if (addRibbon && ribbonText) noteLines.push(`- 🎀 Custom ribbon: ${ribbonText}`);
      if (specialText) noteLines.push(`- 🔤 Letters or numbers (Baby Breath): ${specialText}`);
      if (addVase) noteLines.push(`- 🏺 Vase: ${vaseOptions[selectedVaseIdx].label}`);

      const cartTotalForFee = (basePrice + lettersNumbersCost + crownCost + ribbonCost + glitterCost + vaseCost + accessoryCost) + deliveryCost;

      const checkoutUrl = await performApiCheckout({
        deliveryMethod,
        deliveryCost,
        serviceFeeBase: cartTotalForFee,
        deliveryAddress: deliveryMethod === "delivery" ? selectedAddress : undefined,
        deliveryZip: deliveryMethod === "delivery" ? deliveryZip : undefined,
        accessories,
        note: noteLines.join("\n"),
      });

      if (checkoutUrl) window.location.href = checkoutUrl;
      else toast.error("Could not get checkout URL.");
    } catch { toast.error("Failed to add to cart."); }
    finally { setIsAdding(false); }
  };

  const colorCategories = [
    { key: "natural" as const, label: t("builder.natural") },
    { key: "painted" as const, label: t("builder.painted") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-2">{t("builder.customize")}</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              {t("builder.title")}
            </h1>
          </div>

          <div className="max-w-4xl mx-auto space-y-10">
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-sm aspect-[16/9] mb-2">
              <img
                src={heroBouquet}
                alt="Custom bouquet"
                className="w-full h-full object-cover"
              />
            </div>

            {/* 1. Color */}
            <Section title={t("builder.chooseColors")} step={1}>
              <p className="text-xs text-muted-foreground font-body mb-4">{t("builder.colorsHint")}</p>
              {colorCategories.map(({ key, label }) => {
                const colors = colorOptions.filter((c) => c.category === key);
                return (
                  <div key={key} className="mb-5">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-3">
                      {label}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {colors.map((color) => {
                        const isSelected = selectedColors.some(c => c.name === color.name);
                        return (
                          <button
                            key={color.name}
                            onClick={() => {
                          if (isSelected) {
                            setSelectedColors(prev => prev.filter(c => c.name !== color.name));
                          } else if (selectedColors.length < 3) {
                                setSelectedColors(prev => [...prev, color]);
                              }
                            }}
                            className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                              isSelected
                                ? "border-primary scale-110 shadow-lg"
                                : selectedColors.length >= 3
                                  ? "border-border opacity-40 cursor-not-allowed"
                                  : "border-border hover:scale-105"
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                            disabled={!isSelected && selectedColors.length >= 3}
                          >
                            {isSelected && (
                              <Check className={`w-4 h-4 absolute inset-0 m-auto ${
                                ["Negro", "Azul", "Morado"].includes(color.name) ? "text-primary-foreground" : "text-foreground"
                              }`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <p className="text-sm font-body text-muted-foreground">
                {t("builder.selected")} <span className="text-foreground font-semibold">{selectedColors.length > 0 ? selectedColors.map(c => c.nameEn).join(', ') : t("builder.none")}</span>
              </p>
            </Section>

            {/* Paper Color */}
            <Section title={t("builder.paperColor")} step={2}>
              <p className="text-xs text-muted-foreground font-body mb-4">{t("builder.paperHint")}</p>
              <PaperColorPicker selected={paperColor} onChange={setPaperColor} />
              <p className="text-sm font-body text-muted-foreground mt-3">
                {t("builder.selected")} <span className="text-foreground font-semibold">{paperColor}</span>
              </p>
            </Section>

            {/* 2. Size */}
            <Section title={t("product.numberOfRoses")} step={3}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {pricingTable.map((size, idx) => {
                  const tooFewRoses = size.roses < minRoses;
                  const letterDisabled = specialText.length > 0 && (size.roses < 75 || (specialText.length >= 3 && lettersNumbersType === "letters" && size.roses < 100));
                  const disabled = tooFewRoses || letterDisabled;
                  // Use Shopify price if available, otherwise local table
                  const mixType = getCustomBouquetType(selectedColors);
                  const shopifyMatch = mixType ? shopifyVariants.find(v =>
                    v.selectedOptions.some(o => o.name === "Mix Type" && o.value === mixType) &&
                    v.selectedOptions.some(o => o.name === "Roses" && o.value === String(size.roses))
                  ) : null;
                  const price = shopifyMatch ? parseFloat(shopifyMatch.price.amount) : getFinishPrice(selectedColors, size.roses);
                  return (
                    <button
                      key={size.roses}
                      onClick={() => !disabled && setSelectedSizeIdx(idx)}
                      disabled={disabled}
                      className={`p-4 rounded-sm border-2 text-center transition-all ${
                        selectedSizeIdx === idx
                          ? "border-primary bg-primary/5"
                          : disabled
                          ? "border-border opacity-40 cursor-not-allowed"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="font-display text-2xl font-semibold text-foreground">{size.roses}</p>
                      <p className="text-xs text-muted-foreground font-body">{t("builder.roses")}</p>
                      <p className="text-sm font-body font-semibold text-primary mt-1">
                        ${price}
                      </p>
                      {tooFewRoses && <p className="text-[10px] text-destructive font-body mt-1">{t("product.min")} {minRoses} {t("builder.roses")}</p>}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* 3. Glitter */}
            <Section title={t("builder.glitterFinishTitle")} step={4}>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="w-32 h-32 flex-shrink-0 mx-auto md:mx-0">
                  <img src={glitterRoseImg} alt="Glitter rose example" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-body font-semibold text-foreground mb-1">{t("builder.glitterFinishDesc")}</p>
                  <p className="text-xs text-muted-foreground font-body mb-3">
                    {t("builder.glitterPer25")} · <span className="text-primary font-semibold">+${glitterCost}</span> {t("builder.glitterCostFor")} {rosesCount} {t("builder.roses")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAddGlitter(true)}
                  className={`p-4 rounded-sm border-2 text-center transition-all font-body text-sm ${
                    addGlitter === true ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {t("builder.yes")}
                  {addGlitter === true && <Check className="w-4 h-4 text-primary mx-auto mt-1" />}
                </button>
                <button
                  onClick={() => setAddGlitter(false)}
                  className={`p-4 rounded-sm border-2 text-center transition-all font-body text-sm ${
                    addGlitter === false ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {t("builder.no")}
                  {addGlitter === false && <Check className="w-4 h-4 text-primary mx-auto mt-1" />}
                </button>
              </div>
            </Section>

            {/* 4. Accessories */}
            <Section title={t("builder.accessories")} step={5}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setAccessory(accessory === "note" ? "none" : "note")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all font-body text-sm ${
                    accessory === "note"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <img src={noteImg} alt="Note accessory" className="w-16 h-16 md:w-14 md:h-14 object-contain rounded-sm" />
                  {t("builder.note")}
                  <span className="text-xs text-secondary">$3</span>
                </button>
                <button
                  onClick={() => setAccessory(accessory === "butterfly" ? "none" : "butterfly")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all font-body text-sm ${
                    accessory === "butterfly"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <img src={butterflyImg} alt="Butterfly accessory" className="w-16 h-16 md:w-14 md:h-14 object-contain" />
                  {t("builder.butterflies")}
                  <span className="text-xs text-secondary">$3</span>
                </button>
              </div>
              {accessory === "note" && (
                <textarea
                  value={accessoryText}
                  onChange={(e) => setAccessoryText(e.target.value)}
                  placeholder={t("builder.writeNote")}
                  className="w-full mt-4 bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none"
                  maxLength={200}
                />
              )}
            </Section>

            {/* 5. Letras o Números */}
            <Section title={t("builder.lettersNumbers")} step={6} subtitle={t("builder.optional")}>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="w-32 h-32 rounded-sm overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                  <img src={lettersImg} alt="Letters in Baby Breath example" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-body font-semibold text-foreground mb-1">{t("builder.lettersNumbersDesc")}</p>
                  <p className="text-xs text-muted-foreground font-body mb-3">${letterNumberExtraPrice} {t("builder.lettersNumbersHint")}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => { setLettersNumbersType("letters"); setSpecialText(""); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${
                      lettersNumbersType === "letters" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <Type className="w-4 h-4" /> {t("builder.letters")}
                  </button>
                  <button
                    onClick={() => { setLettersNumbersType("numbers"); setSpecialText(""); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${
                      lettersNumbersType === "numbers" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <Hash className="w-4 h-4" /> {t("builder.numbers")}
                  </button>
                </div>
                <input
                  type="text"
                  value={specialText}
                  onChange={(e) => {
                    const val = lettersNumbersType === "numbers"
                      ? e.target.value.replace(/[^0-9]/g, "")
                      : e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
                    setSpecialText(val);
                    if (val.length > 0) {
                      const minRoses75Idx = sizeOptions.findIndex(s => s.roses >= 75);
                      if (selectedSizeIdx < minRoses75Idx) setSelectedSizeIdx(minRoses75Idx);
                      if (lettersNumbersType === "letters" && val.length >= 3) {
                        const minIdx = sizeOptions.findIndex(s => s.roses >= 100);
                        if (selectedSizeIdx < minIdx) setSelectedSizeIdx(minIdx);
                      }
                    }
                  }}
                  placeholder={lettersNumbersType === "letters" ? t("builder.typeLetters") : t("builder.typeNumbers")}
                  className="w-full max-w-xs bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  maxLength={4}
                />
                <p className="text-xs text-muted-foreground font-body">{t("builder.minRosesLetters")}</p>
                {lettersNumbersType === "letters" && (
                  <p className="text-xs text-muted-foreground font-body">{t("builder.from3Letters")}</p>
                )}
                {specialText.length > 0 && (
                  <div className="bg-card border border-border rounded-sm p-4">
                    <p className="font-body text-sm text-muted-foreground">
                      {specialText.length} {lettersNumbersType === "letters" ? t("builder.letters").toLowerCase() : t("builder.numbers").toLowerCase()} × ${letterNumberExtraPrice} ={" "}
                      <span className="text-primary font-semibold">+${lettersNumbersCost}</span>
                    </p>
                  </div>
                )}
              </div>
            </Section>

            {/* 6. Vase */}
            <Section title={t("builder.vase")} step={7} subtitle={t("builder.optional")}>
              <div className="grid grid-cols-3 gap-3">
                {vaseOptions.map((v, idx) => {
                  const vaseImg = idx === 0 ? vase50Img : idx === 1 ? vase75Img : vase100Img;
                  return (
                    <button
                      key={v.roses}
                      onClick={() => { setAddVase(!addVase || selectedVaseIdx !== idx); setSelectedVaseIdx(idx); if (addVase && selectedVaseIdx === idx) setAddVase(false); }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all ${
                        addVase && selectedVaseIdx === idx ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      }`}
                    >
                      <img src={vaseImg} alt={v.label} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                      <p className="font-display text-lg font-semibold text-foreground">{v.roses}</p>
                      <p className="text-xs text-muted-foreground font-body">{t("builder.roses")}</p>
                      <p className="text-sm font-body font-semibold text-primary">${v.price}</p>
                      {addVase && selectedVaseIdx === idx && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* 7. Extras */}
            <Section title={t("builder.extras")} step={8} subtitle={t("builder.optional")}>
              <div className="space-y-4">
                {/* Crown */}
                <div>
                  <button onClick={() => setAddCrown(!addCrown)}
                    className={`w-full flex items-center gap-3 p-4 rounded-sm border-2 transition-all font-body text-sm ${
                      addCrown ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                    }`}>
                    <Crown className="w-5 h-5 shrink-0" />
                    <div className="text-left flex-1">
                      <p className="font-semibold">{t("builder.crown")}</p>
                      <p className="text-xs">{t("builder.crownDesc")}</p>
                    </div>
                    <span className="text-xs font-semibold">+${crownPrice}</span>
                    {addCrown && <Check className="w-4 h-4 text-primary" />}
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
                          {opt.size === "silver" ? t("builder.crownSilver") : t("builder.crownGold")}
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
                    <img src={ribbonImg} alt="Custom ribbon" className="w-12 h-12 object-contain shrink-0 rounded-sm" />
                    <div className="text-left flex-1">
                      <p className="font-semibold">{t("builder.customRibbon")}</p>
                      <p className="text-xs">{t("builder.ribbonDesc")}</p>
                    </div>
                    <span className="text-xs font-semibold">+${ribbonPrice}</span>
                    {addRibbon && <Check className="w-4 h-4 text-primary" />}
                  </button>
                  {addRibbon && (
                    <div className="mt-3 pl-2 space-y-3">
                      <div className="flex gap-2">
                        {(["names", "congratulations"] as const).map((rt) => (
                          <button key={rt} onClick={() => { setRibbonType(rt); setRibbonText(""); }}
                            className={`px-4 py-2 rounded-sm border text-xs font-body transition-all ${
                              ribbonType === rt ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                            }`}>
                            {rt === "names" ? t("builder.ribbonNames") : t("builder.ribbonCongrats")}
                          </button>
                        ))}
                      </div>
                      {ribbonType === "congratulations" && (
                        <div className="flex flex-wrap gap-2">
                          {ribbonPresets.map((preset) => (
                            <button key={preset} onClick={() => setRibbonText(preset)}
                              className={`px-3 py-1.5 rounded-sm border text-xs font-body transition-all ${
                                ribbonText === preset ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                              }`}>{preset}</button>
                          ))}
                        </div>
                      )}
                      <input type="text" value={ribbonText} onChange={(e) => setRibbonText(e.target.value)}
                        placeholder={ribbonType === "names" ? t("builder.ribbonNamesPlaceholder") : t("builder.ribbonCongratsPlaceholder")}
                        className="w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  )}
                </div>
              </div>
            </Section>

            {/* 8. AI Preview */}
            <Section title={t("builder.aiPreview")} step={9} subtitle={t("builder.optional")}>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground font-body">{t("builder.aiPreviewDesc")}</p>
                {selectedColors.length === 0 && <p className="text-sm text-destructive font-body">{t("builder.selectColorFirst")}</p>}
                {selectedColors.length > 0 && !paperColor && <p className="text-sm text-destructive font-body">{t("builder.selectPaperFirst")}</p>}
                <button onClick={handleGeneratePreview} disabled={previewLoading || hasGeneratedPreview || selectedColors.length === 0 || !paperColor}
                  className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {previewLoading ? (<><Loader2 className="w-4 h-4 animate-spin" />{t("builder.generating")}</>) : hasGeneratedPreview ? (<><Eye className="w-4 h-4" />{t("builder.previewGenerated")}</>) : (<><Eye className="w-4 h-4" />{t("builder.generatePreview")}</>)}
                </button>
                {hasGeneratedPreview && <p className="text-xs text-muted-foreground">{t("builder.previewOnce")}</p>}
                {previewError && <div className="bg-destructive/10 border border-destructive/20 rounded-sm p-4"><p className="text-sm font-body text-destructive">{previewError}</p></div>}
                {previewUrl && (
                  <div className="space-y-2">
                    <div className="relative overflow-hidden rounded-sm border border-border"><img src={previewUrl} alt="Preview" className="w-full h-auto object-contain max-h-[500px]" /></div>
                    <p className="text-xs text-muted-foreground font-body text-center italic">{t("builder.previewDisclaimer")}</p>
                  </div>
                )}
              </div>
            </Section>

            {/* 9. Delivery */}
            <Section title={t("builder.shipping")} step={10}>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`flex flex-col items-center gap-3 p-5 rounded-sm border-2 transition-all font-body ${
                    deliveryMethod === "pickup"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Store className="w-6 h-6" />
                   <div className="text-center">
                     <p className="font-semibold text-sm text-foreground">{t("builder.storePickup")}</p>
                     <p className="text-xs text-muted-foreground mt-1">{t("builder.free")}</p>
                   </div>
                  {deliveryMethod === "pickup" && <Check className="w-4 h-4 text-primary" />}
                </button>
                <button
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`flex flex-col items-center gap-3 p-5 rounded-sm border-2 transition-all font-body ${
                    deliveryMethod === "delivery"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Truck className="w-6 h-6" />
                   <div className="text-center">
                     <p className="font-semibold text-sm text-foreground">{t("builder.homeDelivery")}</p>
                     <p className="text-xs text-muted-foreground mt-1">{t("builder.fromPrice")}</p>
                  </div>
                  {deliveryMethod === "delivery" && <Check className="w-4 h-4 text-primary" />}
                </button>
              </div>

              {/* Delivery Data */}
              <div className="space-y-4 p-5 rounded-sm border border-border bg-card mb-6">
                {deliveryMethod === "pickup" ? (
                  <p className="font-body text-sm text-muted-foreground">
                    {t("builder.pickupAt")} <span className="font-semibold text-foreground">7261 NW 12th St, Miami, FL 33126</span>
                  </p>
                ) : (
                  <>
                <p className="font-body font-semibold text-foreground text-sm">{t("builder.deliveryAddress")}</p>

                {deliveryMethod === "delivery" && (
                  <>
                    <div ref={autocompleteRef} className="relative">
                       <label className="text-xs text-muted-foreground font-body block mb-1">
                         <MapPin className="w-3 h-3 inline mr-1" />
                         Delivery address <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={addressQuery}
                          onChange={(e) => handleAddressInput(e.target.value)}
                          onFocus={() => predictions.length > 0 && setShowPredictions(true)}
                          placeholder="Start typing the address..."
                          className="w-full bg-background border border-border rounded-sm px-3 py-2.5 pr-10 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {autocompleteLoading || distanceLoading ? (
                            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                          ) : (
                            <Search className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {showPredictions && predictions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-sm shadow-lg max-h-60 overflow-y-auto">
                          {predictions.map((p) => (
                            <button
                              key={p.placeId}
                              onClick={() => handleSelectPrediction(p)}
                              className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors border-b border-border last:border-b-0"
                            >
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

                    {distanceError && (
                      <p className="text-sm font-body text-destructive">{distanceError}</p>
                    )}

                    {deliveryMiles !== null && !distanceTooFar && (
                      <div className="bg-primary/5 border border-primary/20 rounded-sm p-4">
                        <p className="font-body text-sm text-foreground">
                           📍 Distance: <span className="font-semibold">{deliveryMiles} miles</span>
                           {deliveryDuration && <span className="text-muted-foreground"> (~{deliveryDuration})</span>}
                         </p>
                         <p className="font-body text-sm text-primary font-semibold mt-1">
                           Shipping cost: {formatDeliveryCost(deliveryCost)}
                         </p>
                      </div>
                    )}

                    {mapUrl ? (
                      <div className="rounded-sm overflow-hidden border border-border">
                        <iframe
                          src={mapUrl}
                          width="100%"
                          height="300"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                           title="Delivery route"
                         />
                      </div>
                    ) : (
                      <div className="rounded-sm overflow-hidden border border-border bg-muted flex items-center justify-center h-48">
                        <div className="text-center">
                          <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="font-body text-sm text-muted-foreground">
                            Enter an address to see the map
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                  </>
                )}
              </div>

              {/* Date picker */}
              <div className="mb-4">
                <label className="text-sm font-body font-semibold text-foreground block mb-2">
                  <CalendarIcon className="w-4 h-4 inline mr-1" /> {deliveryMethod === "pickup" ? "Pickup" : "Delivery"} date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full md:w-auto flex items-center gap-2 px-4 py-3 rounded-sm border border-border bg-card font-body text-sm text-foreground hover:border-primary/30 transition-all">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      {deliveryDate ? format(deliveryDate, "PPP", { locale: enUS }) : "Select a date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deliveryDate}
                      onSelect={(date) => {
                        setDeliveryDate(date);
                        setDeliveryHour("");
                      }}
                      disabled={(date) => isBefore(startOfDay(date), startOfDay(todayInMiami()))}
                      className="p-3 pointer-events-auto"
                      locale={enUS}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time picker */}
              {deliveryDate && (
                <div>
                  <label className="text-sm font-body font-semibold text-foreground block mb-2">
                    <Clock className="w-4 h-4 inline mr-1" /> {deliveryMethod === "pickup" ? "Pickup" : "Delivery"} time
                  </label>
                  {availableHours.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {availableHours.map((hour) => (
                        <button
                          key={hour}
                          onClick={() => setDeliveryHour(hour)}
                          className={`px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${
                            deliveryHour === hour
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          {hour}
                        </button>
                      ))}
                    </div>
                  ) : (
                     <p className="text-sm text-muted-foreground font-body">
                       No available hours for today (minimum 2 hours in advance). Select another day.
                     </p>
                  )}
                </div>
              )}
            </Section>

            {/* Desktop: inline buttons after customer notes area */}
            <div className="hidden md:block">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-body text-[10px] text-muted-foreground leading-tight flex-1 line-clamp-1">
                    {rosesCount} roses · {selectedColors.length > 0 ? selectedColors.map(c => c.nameEn).join(', ') : 'No color'}
                    {paperColor && ` · ${paperColor}`}
                    {addGlitter === true && " · Glitter"}
                    {accessory !== "none" && ` · ${accessory === "note" ? "Note" : "Butterflies"}`}
                  </p>
                  <p className="font-display text-xl font-bold text-foreground whitespace-nowrap">${parseFloat(totalPrice.toFixed(2))}</p>
                </div>
                <div className="bg-primary rounded-sm overflow-hidden">
                  <button
                    disabled={isAdding || variantsLoading}
                    onClick={handleBuilderAddToCart}
                    className="w-full py-3 font-body text-xs tracking-[0.2em] uppercase text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                    {isAdding ? "..." : variantsLoading ? "..." : t("product.addToCart").toUpperCase()}
                  </button>
                </div>
                <button
                  disabled={isAdding || variantsLoading}
                  onClick={handleBuilderPayNow}
                  className="w-full border-2 border-primary text-primary py-2.5 font-body text-[10px] tracking-widest uppercase hover:bg-primary/10 transition-colors rounded-sm disabled:opacity-50">
                  {isAdding ? "..." : t("product.orderAndPay")}
                </button>
              </div>
            </div>

            {/* Mobile: fixed bottom bar */}
            <div className="h-20 md:hidden" />
            <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}>
              <div className="bg-card/95 backdrop-blur-md border-t border-border p-2.5 shadow-xl">
                <div className="flex items-center justify-between gap-2 container mx-auto px-4">
                  <p className="font-display text-lg font-bold text-foreground whitespace-nowrap">
                    ${parseFloat(totalPrice.toFixed(2))}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={handleBuilderAddToCart} disabled={isAdding || variantsLoading}
                      className="bg-primary text-primary-foreground px-4 py-2 font-body text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-50 whitespace-nowrap">
                      {isAdding ? "..." : t("product.addToCart")}
                    </button>
                    <button onClick={handleBuilderPayNow} disabled={isAdding || variantsLoading}
                      className="border-2 border-primary text-primary px-3 py-2 font-body text-[10px] tracking-widest uppercase hover:bg-primary/10 transition-colors rounded-sm whitespace-nowrap disabled:opacity-50">
                      {isAdding ? "..." : t("product.orderAndPay")}
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

const Section = ({
  title,
  step,
  subtitle,
  children,
}: {
  title: string;
  step: number;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-sm font-semibold">
        {step}
      </span>
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      {subtitle && (
        <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full font-body">
          {subtitle}
        </span>
      )}
    </div>
    {children}
  </div>
);

export default BouquetBuilder;
