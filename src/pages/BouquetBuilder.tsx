import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { format, addHours, isBefore, startOfDay, isToday } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { es } from "date-fns/locale";

import Navbar from "@/components/Navbar";
import heroBouquet from "@/assets/hero-bouquet.jpg";
import heartBouquet from "@/assets/heart-bouquet.jpg";
import letterBouquet from "@/assets/letter-bouquet.jpg";
import numberBouquet from "@/assets/number-bouquet.jpg";
import {
  colorOptions,
  sizeOptions,
  crownOptions,
  ribbonPresets,
  specialBouquetPrice,
  specialBouquetRoses,
  letterNumberExtraPrice,
  crownPrice,
  ribbonPrice,
  type ColorOption,
  type AccessoryType,
  type BouquetType,
} from "@/lib/productData";
import { Heart, Sparkles, Crown, Type, Hash, Check, Bug, Star, Truck, Store, CalendarIcon, Clock, MapPin, Search, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const BouquetBuilder = () => {
  const [bouquetType, setBouquetType] = useState<BouquetType>("classic");
  const [selectedColor, setSelectedColor] = useState<ColorOption>(colorOptions[5]); // Red default
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [accessory, setAccessory] = useState<AccessoryType>("none");
  const [accessoryText, setAccessoryText] = useState("");
  const [addCrown, setAddCrown] = useState(false);
  const [crownSize, setCrownSize] = useState("small");
  const [addRibbon, setAddRibbon] = useState(false);
  const [ribbonType, setRibbonType] = useState<"names" | "congratulations">("names");
  const [ribbonText, setRibbonText] = useState("");
  const [specialText, setSpecialText] = useState("");
  const [heartColor, setHeartColor] = useState<"pink" | "red">("red");
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

  // Store address for default map
  const STORE_MAP_URL = `https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent("7255 NW 12th St, Miami, FL 33126")}`;

  // Close predictions dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setShowPredictions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced autocomplete fetch
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

    // Parse address parts from the description
    const parts = prediction.description.split(", ");
    const street = prediction.mainText || parts[0] || "";
    const city = parts[1] || "";
    // Search for zip code across all parts of the address
    const fullText = prediction.description + " " + (prediction.secondaryText || "");
    const zipMatch = fullText.match(/\b(\d{5})\b/);
    const zip = zipMatch ? zipMatch[1] : "";

    setDeliveryStreet(street);
    setDeliveryCity(city);
    if (zip) setDeliveryZip(zip);

    // Auto-calculate distance
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
          if (error) throw new Error("Error de conexión");
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
          setDistanceError(e.message || "Error al calcular distancia");
        } finally {
          setDistanceLoading(false);
        }
      })();
    }
  }, []);

  const calculateDistance = useCallback(async () => {
    if (!deliveryStreet || !deliveryCity || !deliveryZip) return;
    setDistanceLoading(true);
    setDistanceError("");
    setDistanceTooFar(false);
    setDeliveryMiles(null);
    try {
      const { data, error } = await supabase.functions.invoke("calculate-distance", {
        body: { street: deliveryStreet, city: deliveryCity, zip: deliveryZip },
      });
      if (error) throw new Error("Error de conexión");
      if (data.error) {
        setDistanceError(data.error);
        if (data.tooFar) {
          setDistanceTooFar(true);
          setDeliveryMiles(data.miles);
        }
      } else {
        setDeliveryMiles(data.miles);
        setDeliveryDuration(data.duration);
      }
    } catch (e: any) {
      setDistanceError(e.message || "Error al calcular distancia");
    } finally {
      setDistanceLoading(false);
    }
  }, [deliveryStreet, deliveryCity, deliveryZip]);

  const isRed = selectedColor.name === "Rojo";
  const isSpecial = bouquetType !== "classic";

  const basePrice = useMemo(() => {
    if (isSpecial) {
      const charCount = specialText.length;
      return specialBouquetPrice + charCount * letterNumberExtraPrice;
    }
    const size = sizeOptions[selectedSizeIdx];
    return isRed ? size.priceRed : size.priceRegular;
  }, [isSpecial, specialText, selectedSizeIdx, isRed]);

  const deliveryCost = deliveryMethod === "delivery" && deliveryMiles && !distanceTooFar ? deliveryMiles * 2 : 0;

  const totalPrice = useMemo(() => {
    let total = basePrice;
    if (addCrown) total += crownPrice;
    if (addRibbon) total += ribbonPrice;
    total += deliveryCost;
    return total;
  }, [basePrice, addCrown, addRibbon, deliveryCost]);

  const minDeliveryTime = addHours(new Date(), 2);

  const getAvailableHours = (date: Date | undefined) => {
    if (!date) return [];
    const hours: string[] = [];
    const now = new Date();
    for (let h = 8; h <= 20; h++) {
      const slotTime = new Date(date);
      slotTime.setHours(h, 0, 0, 0);
      if (isToday(date)) {
        if (isBefore(slotTime, minDeliveryTime)) continue;
      }
      hours.push(`${h.toString().padStart(2, "0")}:00`);
    }
    return hours;
  };

  const availableHours = getAvailableHours(deliveryDate);

  const rosesCount = isSpecial ? specialBouquetRoses : sizeOptions[selectedSizeIdx].roses;

  const [addGlitter, setAddGlitter] = useState(false);

  const colorCategories = [
    { key: "natural" as const, label: "Naturales" },
    { key: "painted" as const, label: "Pintados" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-2">Personaliza</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Crea tu Bouquet
            </h1>
          </div>

          <div className="max-w-4xl mx-auto space-y-10">
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-sm aspect-[16/9] mb-2">
              <img
                src={
                  bouquetType === "heart" ? heartBouquet
                    : bouquetType === "letters" ? letterBouquet
                    : bouquetType === "numbers" ? numberBouquet
                    : heroBouquet
                }
                alt={`Bouquet ${bouquetType}`}
                className="w-full h-full object-cover transition-opacity duration-500"
                key={bouquetType}
              />
            </div>

            {/* 1. Bouquet Type */}
            <Section title="Tipo de Bouquet" step={1}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {([
                  { type: "classic" as const, label: "Clásico", icon: Sparkles },
                  { type: "heart" as const, label: "Corazón", icon: Heart },
                  { type: "letters" as const, label: "Con Letras", icon: Type },
                  { type: "numbers" as const, label: "Con Números", icon: Hash },
                ]).map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setBouquetType(type)}
                    className={`flex flex-col items-center gap-2 p-5 rounded-sm border-2 transition-all font-body text-sm ${
                      bouquetType === type
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Heart color */}
              {bouquetType === "heart" && (
                <div className="mt-4 flex gap-3">
                  <p className="text-sm text-muted-foreground font-body mr-2 self-center">Color:</p>
                  {(["red", "pink"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setHeartColor(c)}
                      className={`px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${
                        heartColor === c ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      {c === "red" ? "Rojo" : "Rosa"}
                    </button>
                  ))}
                </div>
              )}

              {/* Letters/Numbers input */}
              {(bouquetType === "letters" || bouquetType === "numbers") && (
                <div className="mt-4">
                  <label className="text-sm text-muted-foreground font-body block mb-2">
                    {bouquetType === "letters" ? "Escribe las letras" : "Escribe los números"}{" "}
                    <span className="text-primary">(+${letterNumberExtraPrice} c/u)</span>
                  </label>
                  <input
                    type={bouquetType === "numbers" ? "text" : "text"}
                    value={specialText}
                    onChange={(e) => setSpecialText(
                      bouquetType === "numbers"
                        ? e.target.value.replace(/[^0-9]/g, "")
                        : e.target.value.toUpperCase().replace(/[^A-Z]/g, "")
                    )}
                    placeholder={bouquetType === "letters" ? "Ej: LOVE" : "Ej: 25"}
                    className="w-full max-w-xs bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    maxLength={10}
                  />
                </div>
              )}
            </Section>

            {/* 2. Color (only for classic) */}
            {!isSpecial && (
              <Section key="color-section" title="Color de las Rosas" step={2}>
                {colorCategories.map(({ key, label }) => {
                  const colors = colorOptions.filter((c) => c.category === key);
                  return (
                    <div key={key} className="mb-5">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-3">
                        {label}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color)}
                            className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                              selectedColor.name === color.name
                                ? "border-primary scale-110 shadow-lg"
                                : "border-border hover:scale-105"
                            } ${color.category === "glitter" ? "overflow-hidden" : ""}`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          >
                            {color.category === "glitter" && (
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-transparent animate-pulse" />
                            )}
                            {selectedColor.name === color.name && (
                              <Check className={`w-4 h-4 absolute inset-0 m-auto ${
                                ["Negro", "Azul", "Morado", "Morado Brillos"].includes(color.name) ? "text-primary-foreground" : "text-foreground"
                              }`} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <p className="text-sm font-body text-muted-foreground">
                  Seleccionado: <span className="text-foreground font-semibold">{selectedColor.name}</span>
                  {isRed && <span className="text-primary ml-2">(Precio especial rojo)</span>}
                </p>
              </Section>
            )}

            {/* 3. Size (only classic) */}
            {!isSpecial && (
              <Section key="size-section" title="Cantidad de Rosas" step={3}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {sizeOptions.map((size, idx) => (
                    <button
                      key={size.roses}
                      onClick={() => setSelectedSizeIdx(idx)}
                      className={`p-4 rounded-sm border-2 text-center transition-all ${
                        selectedSizeIdx === idx
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="font-display text-2xl font-semibold text-foreground">{size.roses}</p>
                      <p className="text-xs text-muted-foreground font-body">rosas</p>
                      <p className="text-sm font-body font-semibold text-primary mt-1">
                        ${isRed ? size.priceRed : size.priceRegular}
                      </p>
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {/* Special info */}
            {isSpecial && (
              <Section key="special-section" title="Detalles" step={2}>
                <div className="bg-card border border-border rounded-sm p-5">
                  <p className="font-body text-sm text-muted-foreground">
                    <span className="text-foreground font-semibold">{specialBouquetRoses} rosas</span> · Precio base:{" "}
                    <span className="text-primary font-semibold">${specialBouquetPrice}</span>
                    {specialText.length > 0 && (
                      <>
                        {" "}+ {specialText.length} {bouquetType === "letters" ? "letras" : "números"} × ${letterNumberExtraPrice} ={" "}
                        <span className="text-primary font-semibold">
                          ${specialBouquetPrice + specialText.length * letterNumberExtraPrice}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </Section>
            )}

            {/* Glitter option */}
            <Section title="Acabado Brillante" step={isSpecial ? 3 : 4}>
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
                      ✨ Añadir Brillos ✨
                    </p>
                    <p className="text-xs text-muted-foreground font-body">
                      Dale un toque mágico con acabado brillante
                    </p>
                  </div>
                  {addGlitter && (
                    <Check className="w-5 h-5 text-primary ml-auto" />
                  )}
                </div>
              </button>
            </Section>

            {/* 5. Accessories */}
            <Section title="Accesorios" step={isSpecial ? 4 : 5} subtitle="Gratis">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {([
                  { type: "none" as const, label: "Sin accesorio", icon: null },
                  { type: "note" as const, label: "Nota", icon: Type },
                  { type: "card" as const, label: "Tarjeta", icon: Sparkles },
                  { type: "butterfly" as const, label: "Mariposas", icon: Bug },
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
                    <span className="text-xs text-secondary">Gratis</span>
                  </button>
                ))}
              </div>
              {(accessory === "note" || accessory === "card") && (
                <textarea
                  value={accessoryText}
                  onChange={(e) => setAccessoryText(e.target.value)}
                  placeholder={`Escribe tu ${accessory === "note" ? "nota" : "tarjeta"}...`}
                  className="w-full mt-4 bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none"
                  maxLength={200}
                />
              )}
            </Section>

            {/* 5. Upsells */}
            <Section title="Extras" step={isSpecial ? 5 : 6}>
              {/* Crown */}
              <div className={`p-5 rounded-sm border-2 transition-all mb-4 ${
                addCrown ? "border-primary bg-primary/5" : "border-border"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-gold" />
                    <div>
                      <p className="font-body font-semibold text-foreground">Corona</p>
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
                          onClick={() => setRibbonType(t)}
                          className={`px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${
                            ribbonType === t ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          {t === "names" ? "Nombres" : "Felicitaciones"}
                        </button>
                      ))}
                    </div>
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
                    <input
                      type="text"
                      value={ribbonText}
                      onChange={(e) => setRibbonText(e.target.value)}
                      placeholder="O escribe tu texto personalizado..."
                      className="w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      maxLength={50}
                    />
                  </div>
                )}
              </div>
            </Section>

            {/* Delivery */}
            <Section title="Envío" step={isSpecial ? 6 : 7}>
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

              {/* Contact & Delivery Data — always visible */}
              <div className="space-y-4 p-5 rounded-sm border border-border bg-card mb-6">
                <p className="font-body font-semibold text-foreground text-sm">Datos de entrega</p>

                {/* Name */}
                <div>
                  <label className="text-xs text-muted-foreground font-body block mb-1">
                    Nombre completo <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={deliveryName}
                    onChange={(e) => setDeliveryName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className="w-full bg-background border border-border rounded-sm px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    maxLength={100}
                    required
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-body block mb-1">
                      Teléfono <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="tel"
                      value={deliveryPhone}
                      onChange={(e) => setDeliveryPhone(e.target.value.replace(/[^0-9+\-() ]/g, ""))}
                      placeholder="Ej: (305) 555-1234"
                      className="w-full bg-background border border-border rounded-sm px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      maxLength={20}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-body block mb-1">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      value={deliveryEmail}
                      onChange={(e) => setDeliveryEmail(e.target.value)}
                      placeholder="Ej: cliente@email.com"
                      className="w-full bg-background border border-border rounded-sm px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      maxLength={255}
                      required
                    />
                  </div>
                </div>

                {/* Address Autocomplete — only for delivery */}
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

                      {/* Predictions dropdown */}
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

                    {/* Selected address details */}
                    {selectedAddress && (
                      <div className="bg-primary/5 border border-primary/20 rounded-sm p-3">
                        <p className="font-body text-xs text-muted-foreground">Dirección seleccionada:</p>
                        <p className="font-body text-sm text-foreground font-medium">{selectedAddress}</p>
                      </div>
                    )}

                    {/* Zip code */}
                    <div className="max-w-xs">
                      <label className="text-xs text-muted-foreground font-body block mb-1">
                        Código Postal <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={deliveryZip}
                        onChange={(e) => setDeliveryZip(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="Ej: 33126"
                        className="w-full bg-background border border-border rounded-sm px-3 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        maxLength={10}
                        required
                      />
                    </div>

                    {/* Distance result */}
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

                    {/* Map */}
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
                      disabled={(date) => isBefore(startOfDay(date), startOfDay(new Date()))}
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
            <div className="sticky bottom-0 bg-card/95 backdrop-blur-md border border-border rounded-sm p-6 shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-body text-sm text-muted-foreground">
                    {rosesCount} rosas · {isSpecial ? (bouquetType === "heart" ? "Corazón" : bouquetType === "letters" ? "Letras" : "Números") : selectedColor.name}
                    {addCrown && " · Corona"}
                    {addRibbon && " · Cinta"}
                    {accessory !== "none" && ` · ${accessory === "note" ? "Nota" : accessory === "card" ? "Tarjeta" : "Mariposas"}`}
                    {addGlitter && " · Brillos"}
                    {deliveryMethod === "delivery" ? (deliveryMiles && !distanceTooFar ? ` · Envío ${deliveryMiles}mi ($${deliveryCost})` : " · Envío (pendiente)") : " · Recogida en tienda"}
                  </p>
                  <p className="font-display text-3xl font-bold text-foreground">
                    ${totalPrice} <span className="text-sm font-body text-muted-foreground font-normal">USD</span>
                  </p>
                </div>
                <button className="w-full md:w-auto bg-primary text-primary-foreground px-10 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm">
                  Añadir al carrito
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
