import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, addHours, isBefore, startOfDay } from "date-fns";
import { miamiHourNow, todayInMiami, isTodayInMiami } from "@/lib/miamiTime";
import { supabase } from "@/integrations/supabase/client";
import { enUS } from "date-fns/locale";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import PaperColorPicker from "@/components/PaperColorPicker";
import heroBouquet from "@/assets/hero-bouquet.jpg";
import {
  colorOptions,
  sizeOptions,
  pricingTable,
  determinePricingTier,
  getPrice,
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
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [selectedColors, setSelectedColors] = useState<ColorOption[]>([colorOptions[6]]); // Red default
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
  const [paperColor, setPaperColor] = useState("Blanco");

  const STORE_MAP_URL = `https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent("7255 NW 12th St, Miami, FL 33126")}`;

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

  const pricingTier = useMemo(() => determinePricingTier(selectedColors), [selectedColors]);
  const minRoses = pricingTier === 'mix3red' ? 75 : 50;

  const lettersNumbersCost = addLettersNumbers ? specialText.length * letterNumberExtraPrice : 0;

  const basePrice = useMemo(() => {
    const size = pricingTable[selectedSizeIdx];
    return getPrice(pricingTier, size.roses);
  }, [selectedSizeIdx, pricingTier]);

  const deliveryCost = deliveryMethod === "delivery" && deliveryMiles && !distanceTooFar ? deliveryMiles * 2 : 0;

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

  const rosesCount = pricingTable[selectedSizeIdx].roses;

  const [addGlitter, setAddGlitter] = useState(false);
  const glitterCost = addGlitter ? Math.ceil(rosesCount / 25) * 8 : 0;
  const vaseCost = addVase ? vaseOptions[selectedVaseIdx].price : 0;

  const totalPrice = useMemo(() => {
    let total = basePrice + lettersNumbersCost;
    if (addCrown) total += crownPrice;
    if (addRibbon) total += ribbonPrice;
    total += glitterCost;
    total += vaseCost;
    total += deliveryCost;
    return total;
  }, [basePrice, lettersNumbersCost, addCrown, addRibbon, glitterCost, vaseCost, deliveryCost]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [hasGeneratedPreview, setHasGeneratedPreview] = useState(false);

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
      if (addLettersNumbers && specialText) bouquetConfig.specialText = specialText;
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
  }, [selectedColors, rosesCount, addGlitter, addLettersNumbers, specialText, addCrown, crownSize, addRibbon, ribbonText]);

  const colorCategories = [
    { key: "natural" as const, label: "Natural" },
    { key: "painted" as const, label: "Painted" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-2">Customize</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Build Your Bouquet
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
            <Section title="Rose Color" step={1}>
              <p className="text-xs text-muted-foreground font-body mb-4">Select up to 3 colors for your bouquet</p>
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
                                if (selectedColors.length > 1) {
                                  setSelectedColors(prev => prev.filter(c => c.name !== color.name));
                                }
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
                Selected: <span className="text-foreground font-semibold">{selectedColors.map(c => c.name).join(', ')}</span>
              </p>
            </Section>

            {/* Paper Color */}
            <Section title="Paper Color" step={2}>
              <p className="text-xs text-muted-foreground font-body mb-4">Choose the wrapping paper color</p>
              <PaperColorPicker selected={paperColor} onChange={setPaperColor} />
              <p className="text-sm font-body text-muted-foreground mt-3">
                Selected: <span className="text-foreground font-semibold">{paperColor}</span>
              </p>
            </Section>

            {/* 2. Size */}
            <Section title="Number of Roses" step={3}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {pricingTable.map((size, idx) => {
                  const tooFewRoses = size.roses < minRoses;
                  const letterDisabled = addLettersNumbers && (size.roses < 75 || (specialText.length >= 3 && lettersNumbersType === "letters" && size.roses < 100));
                  const disabled = tooFewRoses || letterDisabled;
                  const price = getPrice(pricingTier, size.roses);
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
                      <p className="text-xs text-muted-foreground font-body">roses</p>
                      <p className="text-sm font-body font-semibold text-primary mt-1">
                        ${price}
                      </p>
                      {tooFewRoses && <p className="text-[10px] text-destructive font-body mt-1">Min. {minRoses} roses</p>}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* 3. Glitter */}
            <Section title="Glitter Finish" step={4}>
              <button
                onClick={() => setAddGlitter(!addGlitter)}
                className={`relative w-full p-6 rounded-sm border-2 transition-all overflow-hidden ${
                  addGlitter
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                {addGlitter && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 via-white/30 to-pink-200/20 animate-pulse" />
                    <div className="absolute top-2 left-6 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
                    <div className="absolute top-8 right-10 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
                    <div className="absolute bottom-4 left-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
                    <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-yellow-200 rounded-full animate-ping" style={{ animationDelay: '0.9s' }} />
                    <div className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: '1.2s' }} />
                  </div>
                )}
                <div className="flex items-center gap-4 relative z-10">
                  <Star className={`w-6 h-6 transition-colors ${addGlitter ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                  <div className="text-left">
                     <p className="font-body font-semibold text-foreground">
                       ✨ Glitter Finish ✨
                     </p>
                     <p className="text-xs text-muted-foreground font-body">
                       $8 per 25 roses · <span className="text-primary font-semibold">+${glitterCost}</span> for {rosesCount} roses
                     </p>
                  </div>
                  {addGlitter && (
                    <Check className="w-5 h-5 text-primary ml-auto" />
                  )}
                </div>
              </button>
            </Section>

            {/* 4. Accessories */}
            <Section title="Accessories" step={5} subtitle="Free">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {([
                  { type: "none" as const, label: "No accessory", icon: null },
                  { type: "note" as const, label: "Note", icon: Type },
                  { type: "card" as const, label: "Card", icon: Sparkles },
                  { type: "butterfly" as const, label: "Butterflies", icon: Bug },
                ] as const).map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setAccessory(type)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all font-body text-sm ${
                      accessory === type
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {label}
                    <span className="text-xs text-secondary">Free</span>
                  </button>
                ))}
              </div>
              {(accessory === "note" || accessory === "card") && (
                <textarea
                  value={accessoryText}
                  onChange={(e) => setAccessoryText(e.target.value)}
                  placeholder={`Write your ${accessory === "note" ? "note" : "card"}...`}
                  className="w-full mt-4 bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none"
                  maxLength={200}
                />
              )}
            </Section>

            {/* 5. Letras o Números */}
            <Section title="Letters or Numbers (Baby Breath)" step={6} subtitle="Optional">
              <div className={`p-5 rounded-sm border-2 transition-all ${addLettersNumbers ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Type className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-body font-semibold text-foreground">Add Letters or Numbers in Baby Breath</p>
                      <p className="text-xs text-muted-foreground font-body">${letterNumberExtraPrice} per letter/number · Max. 4 · Minimum 75 roses</p>
                    </div>
                  </div>
                  <button onClick={() => { if (!addLettersNumbers) { const minIdx = sizeOptions.findIndex(s => s.roses >= 75); if (selectedSizeIdx < minIdx) setSelectedSizeIdx(minIdx); } else { setSpecialText(""); } setAddLettersNumbers(!addLettersNumbers); }} className={`w-12 h-7 rounded-full transition-all relative ${addLettersNumbers ? "bg-primary" : "bg-muted"}`}>
                    <div className={`w-5 h-5 rounded-full bg-primary-foreground absolute top-1 transition-all ${addLettersNumbers ? "left-6" : "left-1"}`} />
                  </button>
                </div>
                {addLettersNumbers && (
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setLettersNumbersType("letters"); setSpecialText(""); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${
                          lettersNumbersType === "letters" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <Type className="w-4 h-4" /> Letters
                      </button>
                      <button
                        onClick={() => { setLettersNumbersType("numbers"); setSpecialText(""); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${
                          lettersNumbersType === "numbers" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <Hash className="w-4 h-4" /> Numbers
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
                        const minRoses75Idx = sizeOptions.findIndex(s => s.roses >= 75);
                        if (selectedSizeIdx < minRoses75Idx) setSelectedSizeIdx(minRoses75Idx);
                        if (lettersNumbersType === "letters" && val.length >= 3) {
                          const minIdx = sizeOptions.findIndex(s => s.roses >= 100);
                          if (selectedSizeIdx < minIdx) setSelectedSizeIdx(minIdx);
                        }
                      }}
                      placeholder={lettersNumbersType === "letters" ? "E.g.: LOVE" : "E.g.: 2025"}
                      className="w-full max-w-xs bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      maxLength={4}
                    />
                    <p className="text-xs text-muted-foreground font-body">Minimum 75 roses to add letters or numbers.</p>
                    {lettersNumbersType === "letters" && (
                      <p className="text-xs text-muted-foreground font-body">From 3 letters, the minimum is 100 roses.</p>
                    )}
                    {specialText.length > 0 && (
                      <div className="bg-card border border-border rounded-sm p-4">
                        <p className="font-body text-sm text-muted-foreground">
                          {specialText.length} {lettersNumbersType === "letters" ? "letras" : "números"} × ${letterNumberExtraPrice} ={" "}
                          <span className="text-primary font-semibold">+${lettersNumbersCost}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Section>

            {/* 6. Vase */}
            <Section title="Jarrón" step={7} subtitle="Opcional">
              <div className={`p-5 rounded-sm border-2 transition-all ${addVase ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏺</span>
                    <div>
                      <p className="font-body font-semibold text-foreground">Añadir Jarrón</p>
                      <p className="text-xs text-muted-foreground font-body">Para poner tu ramo</p>
                    </div>
                  </div>
                  <button onClick={() => {
                    const newVal = !addVase;
                    setAddVase(newVal);
                    if (newVal) {
                      const roses = sizeOptions[selectedSizeIdx].roses;
                      const bestIdx = roses <= 50 ? 0 : roses <= 75 ? 1 : 2;
                      setSelectedVaseIdx(bestIdx);
                    }
                  }} className={`w-12 h-7 rounded-full transition-all relative ${addVase ? "bg-primary" : "bg-muted"}`}>
                    <div className={`w-5 h-5 rounded-full bg-primary-foreground absolute top-1 transition-all ${addVase ? "left-6" : "left-1"}`} />
                  </button>
                </div>
                {addVase && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {vaseOptions.map((v, idx) => (
                      <button key={v.roses} onClick={() => setSelectedVaseIdx(idx)}
                        className={`p-4 rounded-sm border-2 text-center transition-all ${selectedVaseIdx === idx ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                        <p className="font-display text-lg font-semibold text-foreground">{v.roses}</p>
                        <p className="text-xs text-muted-foreground font-body">rosas</p>
                        <p className="text-sm font-body font-semibold text-primary mt-1">${v.price}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Section>

            {/* 7. Extras */}
            <Section title="Extras" step={8}>
              {/* Crown */}
              <div className={`p-5 rounded-sm border-2 transition-all mb-4 ${
                addCrown ? "border-primary bg-primary/5" : "border-border"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-gold" />
                    <div>
                      <p className="font-body font-semibold text-foreground">Corona Tiara</p>
                      <p className="text-xs text-muted-foreground font-body">+${crownPrice}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAddCrown(!addCrown)}
                    className={`w-12 h-7 rounded-full transition-all relative ${
                      addCrown ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-primary-foreground absolute top-1 transition-all ${
                      addCrown ? "left-6" : "left-1"
                    }`} />
                  </button>
                </div>
                {addCrown && (
                  <div className="mt-4 flex gap-3">
                    {crownOptions.map((c) => (
                      <button
                        key={c.size}
                        onClick={() => setCrownSize(c.size)}
                        className={`px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${
                          crownSize === c.size ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ribbon */}
              <div className={`p-5 rounded-sm border-2 transition-all ${
                addRibbon ? "border-primary bg-primary/5" : "border-border"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-gold" />
                    <div>
                      <p className="font-body font-semibold text-foreground">Cinta Personalizada</p>
                      <p className="text-xs text-muted-foreground font-body">+${ribbonPrice}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAddRibbon(!addRibbon)}
                    className={`w-12 h-7 rounded-full transition-all relative ${
                      addRibbon ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-primary-foreground absolute top-1 transition-all ${
                      addRibbon ? "left-6" : "left-1"
                    }`} />
                  </button>
                </div>
                {addRibbon && (
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-3">
                      {(["names", "congratulations"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => { setRibbonType(t); setRibbonText(""); }}
                          className={`px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${
                            ribbonType === t ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          {t === "names" ? "Nombres" : "Felicitaciones"}
                        </button>
                      ))}
                    </div>
                    {ribbonType === "congratulations" && (
                      <div className="flex flex-wrap gap-2">
                        {ribbonPresets.map((preset) => (
                          <button
                            key={preset}
                            onClick={() => setRibbonText(preset)}
                            className={`px-3 py-1.5 rounded-full text-xs font-body transition-all ${
                              ribbonText === preset
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-primary/10"
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    )}
                    <input
                      type="text"
                      value={ribbonText}
                      onChange={(e) => setRibbonText(e.target.value)}
                      placeholder={ribbonType === "names" ? "Escribe los nombres..." : "O escribe tu texto personalizado..."}
                      className="w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      maxLength={50}
                    />
                  </div>
                )}
              </div>
            </Section>

            {/* 8. AI Preview */}
            <Section title="Vista Previa" step={9} subtitle="Opcional">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground font-body">
                  Genera una imagen aproximada de cómo quedará tu ramo con las opciones que has elegido.
                </p>
                <button
                  onClick={handleGeneratePreview}
                  disabled={previewLoading || hasGeneratedPreview}
                  className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {previewLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generando...
                    </>
                  ) : hasGeneratedPreview ? (
                    <>
                      <Eye className="w-4 h-4" />
                      Preview generado
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Ver preview de mi ramo
                    </>
                  )}
                </button>
                {hasGeneratedPreview && (
                  <p className="text-xs text-muted-foreground">Solo se permite una previsualización por personalización.</p>
                )}

                {previewError && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-sm p-4">
                    <p className="text-sm font-body text-destructive">{previewError}</p>
                  </div>
                )}

                {previewUrl && (
                  <div className="space-y-2">
                    <div className="relative overflow-hidden rounded-sm border border-border">
                      <img
                        src={previewUrl}
                        alt="Vista previa de tu bouquet personalizado"
                        className="w-full h-auto object-contain max-h-[500px]"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground font-body text-center italic">
                      * Imagen orientativa. El resultado final puede variar ligeramente.
                    </p>
                  </div>
                )}
              </div>
            </Section>

            {/* 9. Delivery */}
            <Section title="Envío" step={10}>
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
                    <p className="font-semibold text-sm text-foreground">Recoger en tienda</p>
                    <p className="text-xs text-muted-foreground mt-1">Gratis</p>
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
                    <p className="font-semibold text-sm text-foreground">Entrega a domicilio</p>
                    <p className="text-xs text-muted-foreground mt-1">$2 / milla</p>
                  </div>
                  {deliveryMethod === "delivery" && <Check className="w-4 h-4 text-primary" />}
                </button>
              </div>

              {/* Delivery Data */}
              <div className="space-y-4 p-5 rounded-sm border border-border bg-card mb-6">
                {deliveryMethod === "pickup" ? (
                  <p className="font-body text-sm text-muted-foreground">
                    📍 Recogida en: <span className="font-semibold text-foreground">7255 NW 12th St, Miami, FL 33126</span>
                  </p>
                ) : (
                  <>
                <p className="font-body font-semibold text-foreground text-sm">Dirección de entrega</p>

                {deliveryMethod === "delivery" && (
                  <>
                    <div ref={autocompleteRef} className="relative">
                      <label className="text-xs text-muted-foreground font-body block mb-1">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        Dirección de entrega <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={addressQuery}
                          onChange={(e) => handleAddressInput(e.target.value)}
                          onFocus={() => predictions.length > 0 && setShowPredictions(true)}
                          placeholder="Empieza a escribir la dirección..."
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
                        <p className="font-body text-xs text-muted-foreground">Dirección seleccionada:</p>
                        <p className="font-body text-sm text-foreground font-medium">{selectedAddress}</p>
                      </div>
                    )}

                    {distanceError && (
                      <p className="text-sm font-body text-destructive">{distanceError}</p>
                    )}

                    {deliveryMiles !== null && !distanceTooFar && (
                      <div className="bg-primary/5 border border-primary/20 rounded-sm p-4">
                        <p className="font-body text-sm text-foreground">
                          📍 Distancia: <span className="font-semibold">{deliveryMiles} millas</span>
                          {deliveryDuration && <span className="text-muted-foreground"> (~{deliveryDuration})</span>}
                        </p>
                        <p className="font-body text-sm text-primary font-semibold mt-1">
                          Costo de envío: ${deliveryMiles * 2}
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
                          title="Ruta de entrega"
                        />
                      </div>
                    ) : (
                      <div className="rounded-sm overflow-hidden border border-border bg-muted flex items-center justify-center h-48">
                        <div className="text-center">
                          <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="font-body text-sm text-muted-foreground">
                            Ingresa una dirección para ver el mapa
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
                  <CalendarIcon className="w-4 h-4 inline mr-1" /> Fecha de {deliveryMethod === "pickup" ? "recogida" : "entrega"}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full md:w-auto flex items-center gap-2 px-4 py-3 rounded-sm border border-border bg-card font-body text-sm text-foreground hover:border-primary/30 transition-all">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      {deliveryDate ? format(deliveryDate, "PPP", { locale: es }) : "Selecciona una fecha"}
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
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time picker */}
              {deliveryDate && (
                <div>
                  <label className="text-sm font-body font-semibold text-foreground block mb-2">
                    <Clock className="w-4 h-4 inline mr-1" /> Hora de {deliveryMethod === "pickup" ? "recogida" : "entrega"}
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
                      No hay horarios disponibles para hoy (mínimo 2 horas de anticipación). Selecciona otro día.
                    </p>
                  )}
                </div>
              )}
            </Section>

            {/* Summary */}
            <div className="pb-4" />
            <div className="sticky bottom-0 bg-card/95 backdrop-blur-md border border-border rounded-sm p-6 shadow-xl z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-body text-sm text-muted-foreground">
                    {rosesCount} rosas · {selectedColors.map(c => c.name).join(', ')}
                    {addLettersNumbers && specialText && ` · ${lettersNumbersType === "letters" ? "Letras" : "Números"}: ${specialText}`}
                    {addCrown && " · Corona"}
                    {addRibbon && " · Cinta"}
                    {accessory !== "none" && ` · ${accessory === "note" ? "Nota" : accessory === "card" ? "Tarjeta" : "Mariposas"}`}
                    {addGlitter && " · Brillos"}
                    {addVase && ` · Jarrón (${vaseOptions[selectedVaseIdx].label})`}
                    {deliveryMethod === "delivery" ? (deliveryMiles && !distanceTooFar ? ` · Envío ${deliveryMiles}mi ($${deliveryCost})` : " · Envío (pendiente)") : " · Recogida en tienda"}
                  </p>
                  <p className="font-display text-3xl font-bold text-foreground">
                    ${totalPrice} <span className="text-sm font-body text-muted-foreground font-normal">USD</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (deliveryMethod === "delivery" && !selectedAddress) {
                      toast.error("Selecciona una dirección de entrega.");
                      return;
                    }
                    if (deliveryMethod === "delivery" && (distanceTooFar || deliveryMiles === null)) {
                      toast.error("La dirección no es válida o está fuera de rango.");
                      return;
                    }
                    if (!deliveryDate || !deliveryHour) {
                      toast.error("Selecciona fecha y hora de entrega.");
                      return;
                    }

                    const addons: string[] = [];
                    if (addCrown) addons.push(`Corona Tiara (${crownSize})`);
                    if (addRibbon) addons.push("Cinta");
                    if (addGlitter) addons.push("Brillos");
                    if (addVase) addons.push(`Jarrón (${vaseOptions[selectedVaseIdx].label})`);
                    if (addLettersNumbers && specialText) addons.push(`${lettersNumbersType === "letters" ? "Letras" : "Números"}: ${specialText}`);

                    addItem({
                      id: "",
                      bouquetType: "classic",
                      color: selectedColors.map(c => c.name).join(', '),
                      roses: rosesCount,
                      price: basePrice + lettersNumbersCost + (addCrown ? crownPrice : 0) + (addRibbon ? ribbonPrice : 0),
                      deliveryCost,
                      totalPrice,
                      addons,
                      accessory,
                      accessoryText,
                      ribbonText,
                      crownSize: addCrown ? crownSize : "",
                      specialText: addLettersNumbers ? specialText : "",
                      heartColor: "",
                      glitter: addGlitter,
                      deliveryMethod,
                      deliveryName: "",
                      deliveryPhone: "",
                      deliveryEmail: "",
                      deliveryAddress: deliveryMethod === "delivery" ? selectedAddress : "Recoger en tienda",
                      deliveryZip: deliveryMethod === "delivery" ? deliveryZip : "",
                      deliveryDate: deliveryDate ? format(deliveryDate, "PPP", { locale: es }) : "",
                      deliveryHour,
                      deliveryMiles: deliveryMethod === "delivery" ? deliveryMiles : null,
                      paperColor,
                    });

                    toast.success("¡Bouquet añadido al carrito!");
                  }}
                  className="w-full md:w-auto bg-primary text-primary-foreground px-10 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm"
                >
                  Añadir al carrito
                </button>
                <button
                  onClick={() => {
                    if (deliveryMethod === "delivery" && !selectedAddress) {
                      toast.error("Selecciona una dirección de entrega.");
                      return;
                    }
                    if (deliveryMethod === "delivery" && (distanceTooFar || deliveryMiles === null)) {
                      toast.error("La dirección no es válida o está fuera de rango.");
                      return;
                    }
                    if (!deliveryDate || !deliveryHour) {
                      toast.error("Selecciona fecha y hora de entrega.");
                      return;
                    }

                    const addons: string[] = [];
                    if (addCrown) addons.push(`Corona Tiara (${crownSize})`);
                    if (addRibbon) addons.push("Cinta");
                    if (addGlitter) addons.push("Brillos");
                    if (addVase) addons.push(`Jarrón (${vaseOptions[selectedVaseIdx].label})`);
                    if (addLettersNumbers && specialText) addons.push(`${lettersNumbersType === "letters" ? "Letras" : "Números"}: ${specialText}`);

                    addItem({
                      id: "",
                      bouquetType: "classic",
                      color: selectedColors.map(c => c.name).join(', '),
                      roses: rosesCount,
                      price: basePrice + lettersNumbersCost + (addCrown ? crownPrice : 0) + (addRibbon ? ribbonPrice : 0),
                      deliveryCost,
                      totalPrice,
                      addons,
                      accessory,
                      accessoryText,
                      ribbonText,
                      crownSize: addCrown ? crownSize : "",
                      specialText: addLettersNumbers ? specialText : "",
                      heartColor: "",
                      glitter: addGlitter,
                      deliveryMethod,
                      deliveryName: "",
                      deliveryPhone: "",
                      deliveryEmail: "",
                      deliveryAddress: deliveryMethod === "delivery" ? selectedAddress : "Recoger en tienda",
                      deliveryZip: deliveryMethod === "delivery" ? deliveryZip : "",
                      deliveryDate: deliveryDate ? format(deliveryDate, "PPP", { locale: es }) : "",
                      deliveryHour,
                      deliveryMiles: deliveryMethod === "delivery" ? deliveryMiles : null,
                      paperColor,
                    });

                    toast.success("¡Bouquet añadido al carrito!");
                    navigate("/checkout");
                  }}
                  className="w-full md:w-auto border-2 border-primary text-primary px-10 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/10 transition-colors rounded-sm"
                >
                  Pagar ahora
                </button>
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
