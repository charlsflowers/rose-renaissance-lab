import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format, addHours, isBefore, startOfDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { bouquetProducts, bouquetSizeOptions } from "@/lib/catalogData";
import {
  crownOptions, ribbonPresets, crownPrice, ribbonPrice, letterNumberExtraPrice,
} from "@/lib/productData";
import {
  ArrowLeft, Check, Store, Truck, CalendarIcon, Clock, MapPin, Search, Loader2,
  Type, Sparkles, Bug, Crown, Star, Hash,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const BouquetProductDetail = () => {
  const { type, productId } = useParams<{ type: string; productId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
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
      } catch (e: any) { setDistanceError(e.message || "Error al calcular distancia"); }
      finally { setDistanceLoading(false); }
    })();
  }, []);

  const minLeadHours = deliveryMethod === "delivery" ? 1.5 : 2;
  const minDeliveryTime = new Date(Date.now() + minLeadHours * 60 * 60 * 1000);
  const getAvailableHours = (date: Date | undefined) => {
    if (!date) return [];
    const hours: string[] = [];
    for (let h = 8; h <= 20; h++) {
      const slotTime = new Date(date); slotTime.setHours(h, 0, 0, 0);
      if (isToday(date) && isBefore(slotTime, minDeliveryTime)) continue;
      hours.push(`${h.toString().padStart(2, "0")}:00`);
    }
    return hours;
  };
  const availableHours = getAvailableHours(deliveryDate);

  if (!product) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground font-body">Producto no encontrado</p>
          <Link to="/" className="text-primary font-body underline mt-4 inline-block">Volver</Link>
        </div>
      </div>
    );
  }

  const selectedSize = bouquetSizeOptions[selectedSizeIdx];
  const lettersExtra = addLetters ? specialText.replace(/[^A-Z]/gi, "").length * letterNumberExtraPrice : 0;
  const numbersExtra = addNumbers ? specialText.replace(/[^0-9]/g, "").length * letterNumberExtraPrice : 0;
  const deliveryCost = deliveryMethod === "delivery" && deliveryMiles && !distanceTooFar ? deliveryMiles * 2 : 0;
  const basePrice = selectedSize.price + (addCrown ? crownPrice : 0) + (addRibbon ? ribbonPrice : 0) + lettersExtra + numbersExtra;
  const totalPrice = basePrice + deliveryCost;

  let step = 1;

  const handleAddToCart = () => {
    if (deliveryMethod === "delivery" && !selectedAddress) { toast.error("Selecciona una dirección de entrega."); return; }
    if (deliveryMethod === "delivery" && (distanceTooFar || deliveryMiles === null)) { toast.error("La dirección no es válida o fuera de rango."); return; }
    if (deliveryMethod === "delivery" && (distanceTooFar || deliveryMiles === null)) { toast.error("La dirección no es válida o fuera de rango."); return; }
    if (!deliveryDate || !deliveryHour) { toast.error("Selecciona fecha y hora."); return; }

    const addons: string[] = [];
    if (addCrown) addons.push(`Corona (${crownSize})`);
    if (addRibbon) addons.push("Cinta");
    if (addGlitter) addons.push("Brillos");
    if (addLetters || addNumbers) addons.push(`Texto: ${specialText}`);

    addItem({
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
      deliveryAddress: deliveryMethod === "delivery" ? selectedAddress : "Recoger en tienda",
      deliveryZip: deliveryMethod === "delivery" ? deliveryZip : "",
      deliveryDate: deliveryDate ? format(deliveryDate, "PPP", { locale: es }) : "",
      deliveryHour,
      deliveryMiles: deliveryMethod === "delivery" ? deliveryMiles : null,
    });
    toast.success("¡Bouquet añadido al carrito!");
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to={`/bouquets/${type}`} className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>

          <div className="max-w-4xl mx-auto space-y-10">
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-sm aspect-[16/9] bg-muted">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-6xl text-muted-foreground/20">{product.type === "heart" ? "💐" : "🌹"}</span>
                </div>
              )}
            </div>

            <div className="text-center">
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">{product.name}</h1>
              <p className="text-muted-foreground font-body mt-2">{product.description}</p>
            </div>

            {/* 1. Size */}
            <Section title="Cantidad de Rosas" step={step++}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {bouquetSizeOptions.map((size, idx) => (
                  <button key={size.roses} onClick={() => setSelectedSizeIdx(idx)}
                    className={`p-4 rounded-sm border-2 text-center transition-all ${selectedSizeIdx === idx ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                    <p className="font-display text-2xl font-semibold text-foreground">{size.roses}</p>
                    <p className="text-xs text-muted-foreground font-body">rosas</p>
                    <p className="text-sm font-body font-semibold text-primary mt-1">${size.price}</p>
                  </button>
                ))}
              </div>
            </Section>

            {/* 2. Glitter */}
            <Section title="Acabado Brillante" step={step++}>
              <button onClick={() => setAddGlitter(!addGlitter)}
                className={`relative w-full p-6 rounded-sm border-2 transition-all overflow-hidden ${addGlitter ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                {addGlitter && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 via-white/30 to-pink-200/20 animate-pulse" />
                  </div>
                )}
                <div className="flex items-center gap-4 relative z-10">
                  <Star className={`w-6 h-6 transition-colors ${addGlitter ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                  <div className="text-left">
                    <p className="font-body font-semibold text-foreground">✨ Añadir Brillos ✨</p>
                    <p className="text-xs text-muted-foreground font-body">Dale un toque mágico con acabado brillante</p>
                  </div>
                  {addGlitter && <Check className="w-5 h-5 text-primary ml-auto" />}
                </div>
              </button>
            </Section>

            {/* 3. Letters/Numbers */}
            <Section title="Letras o Números" step={step++} subtitle={`+$${letterNumberExtraPrice} c/u`}>
              <div className="flex gap-3 mb-4">
                <button onClick={() => { setAddLetters(!addLetters); if (addNumbers) setAddNumbers(false); setSpecialText(""); }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-sm border-2 font-body text-sm transition-all ${addLetters ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  <Type className="w-4 h-4" /> Letras
                </button>
                <button onClick={() => { setAddNumbers(!addNumbers); if (addLetters) setAddLetters(false); setSpecialText(""); }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-sm border-2 font-body text-sm transition-all ${addNumbers ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  <Hash className="w-4 h-4" /> Números
                </button>
              </div>
              {(addLetters || addNumbers) && (
                <input type="text" value={specialText}
                  onChange={(e) => setSpecialText(addNumbers ? e.target.value.replace(/[^0-9]/g, "") : e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
                  placeholder={addLetters ? "Ej: LOVE" : "Ej: 25"}
                  className="w-full max-w-xs bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" maxLength={10} />
              )}
            </Section>

            {/* 4. Accessories */}
            <Section title="Accesorios" step={step++} subtitle="Gratis">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {([
                  { type: "none" as const, label: "Sin accesorio", icon: null },
                  { type: "note" as const, label: "Nota", icon: Type },
                  { type: "card" as const, label: "Tarjeta", icon: Sparkles },
                  { type: "butterfly" as const, label: "Mariposas", icon: Bug },
                ]).map(({ type: t, label, icon: Icon }) => (
                  <button key={t} onClick={() => setAccessory(t)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all font-body text-sm ${accessory === t ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                    {Icon && <Icon className="w-4 h-4" />}
                    {label}
                    <span className="text-xs text-secondary">Gratis</span>
                  </button>
                ))}
              </div>
              {(accessory === "note" || accessory === "card") && (
                <textarea value={accessoryText} onChange={(e) => setAccessoryText(e.target.value)} placeholder={`Escribe tu ${accessory === "note" ? "nota" : "tarjeta"}...`}
                  className="w-full mt-4 bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none" maxLength={200} />
              )}
            </Section>

            {/* 5. Extras */}
            <Section title="Extras" step={step++}>
              {/* Crown */}
              <div className={`p-5 rounded-sm border-2 transition-all mb-4 ${addCrown ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-gold" />
                    <div><p className="font-body font-semibold text-foreground">Corona</p><p className="text-xs text-muted-foreground font-body">+${crownPrice}</p></div>
                  </div>
                  <button onClick={() => setAddCrown(!addCrown)} className={`w-12 h-7 rounded-full transition-all relative ${addCrown ? "bg-primary" : "bg-muted"}`}>
                    <div className={`w-5 h-5 rounded-full bg-primary-foreground absolute top-1 transition-all ${addCrown ? "left-6" : "left-1"}`} />
                  </button>
                </div>
                {addCrown && (
                  <div className="mt-4 flex gap-3">
                    {crownOptions.map((c) => (
                      <button key={c.size} onClick={() => setCrownSize(c.size)}
                        className={`px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${crownSize === c.size ? "border-primary bg-primary/5" : "border-border"}`}>{c.label}</button>
                    ))}
                  </div>
                )}
              </div>
              {/* Ribbon */}
              <div className={`p-5 rounded-sm border-2 transition-all ${addRibbon ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-gold" />
                    <div><p className="font-body font-semibold text-foreground">Cinta Personalizada</p><p className="text-xs text-muted-foreground font-body">+${ribbonPrice}</p></div>
                  </div>
                  <button onClick={() => setAddRibbon(!addRibbon)} className={`w-12 h-7 rounded-full transition-all relative ${addRibbon ? "bg-primary" : "bg-muted"}`}>
                    <div className={`w-5 h-5 rounded-full bg-primary-foreground absolute top-1 transition-all ${addRibbon ? "left-6" : "left-1"}`} />
                  </button>
                </div>
                {addRibbon && (
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-3">
                      {(["names", "congratulations"] as const).map((t) => (
                        <button key={t} onClick={() => setRibbonType(t)}
                          className={`px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${ribbonType === t ? "border-primary bg-primary/5" : "border-border"}`}>
                          {t === "names" ? "Nombres" : "Felicitaciones"}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ribbonPresets.map((preset) => (
                        <button key={preset} onClick={() => setRibbonText(preset)}
                          className={`px-3 py-1.5 rounded-full text-xs font-body transition-all ${ribbonText === preset ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}>{preset}</button>
                      ))}
                    </div>
                    <input type="text" value={ribbonText} onChange={(e) => setRibbonText(e.target.value)} placeholder="O escribe tu texto personalizado..."
                      className="w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" maxLength={50} />
                  </div>
                )}
              </div>
            </Section>

            {/* 6. Delivery */}
            <Section title="Envío" step={step++}>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={() => setDeliveryMethod("pickup")}
                  className={`flex flex-col items-center gap-3 p-5 rounded-sm border-2 transition-all font-body ${deliveryMethod === "pickup" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                  <Store className="w-6 h-6" /><p className="font-semibold text-sm text-foreground">Recoger en tienda</p><p className="text-xs text-muted-foreground">Gratis</p>
                  {deliveryMethod === "pickup" && <Check className="w-4 h-4 text-primary" />}
                </button>
                <button onClick={() => setDeliveryMethod("delivery")}
                  className={`flex flex-col items-center gap-3 p-5 rounded-sm border-2 transition-all font-body ${deliveryMethod === "delivery" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                  <Truck className="w-6 h-6" /><p className="font-semibold text-sm text-foreground">Entrega a domicilio</p><p className="text-xs text-muted-foreground">$2 / milla</p>
                  {deliveryMethod === "delivery" && <Check className="w-4 h-4 text-primary" />}
                </button>
              </div>

              <div className="space-y-4 p-5 rounded-sm border border-border bg-card mb-6">
                {deliveryMethod === "pickup" ? (
                  <p className="font-body text-sm text-muted-foreground">
                    📍 Recogida en: <span className="font-semibold text-foreground">7255 NW 12th St, Miami, FL 33126</span>
                  </p>
                ) : (
                  <>
                    <p className="font-body font-semibold text-foreground text-sm">Dirección de entrega</p>
                    <div ref={autocompleteRef} className="relative">
                      <label className="text-xs text-muted-foreground font-body block mb-1"><MapPin className="w-3 h-3 inline mr-1" />Dirección <span className="text-destructive">*</span></label>
                      <div className="relative">
                        <input type="text" value={addressQuery} onChange={(e) => handleAddressInput(e.target.value)} onFocus={() => predictions.length > 0 && setShowPredictions(true)}
                          placeholder="Empieza a escribir la dirección..."
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
                        <p className="font-body text-xs text-muted-foreground">Dirección seleccionada:</p>
                        <p className="font-body text-sm text-foreground font-medium">{selectedAddress}</p>
                      </div>
                    )}
                    {distanceError && <p className="text-sm font-body text-destructive">{distanceError}</p>}
                    {deliveryMiles !== null && !distanceTooFar && (
                      <div className="bg-primary/5 border border-primary/20 rounded-sm p-4">
                        <p className="font-body text-sm text-foreground">📍 Distancia: <span className="font-semibold">{deliveryMiles} millas</span>{deliveryDuration && <span className="text-muted-foreground"> (~{deliveryDuration})</span>}</p>
                        <p className="font-body text-sm text-primary font-semibold mt-1">Costo de envío: ${deliveryMiles * 2}</p>
                      </div>
                    )}
                    {mapUrl && (
                      <div className="rounded-sm overflow-hidden border border-border">
                        <iframe src={mapUrl} width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ruta" />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Date */}
              <div className="mb-4">
                <label className="text-sm font-body font-semibold text-foreground block mb-2"><CalendarIcon className="w-4 h-4 inline mr-1" /> Fecha</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full md:w-auto flex items-center gap-2 px-4 py-3 rounded-sm border border-border bg-card font-body text-sm text-foreground hover:border-primary/30 transition-all">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      {deliveryDate ? format(deliveryDate, "PPP", { locale: es }) : "Selecciona una fecha"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={deliveryDate} onSelect={(d) => { setDeliveryDate(d); setDeliveryHour(""); }}
                      disabled={(date) => isBefore(startOfDay(date), startOfDay(new Date()))} className="p-3 pointer-events-auto" locale={es} />
                  </PopoverContent>
                </Popover>
              </div>
              {deliveryDate && (
                <div>
                  <label className="text-sm font-body font-semibold text-foreground block mb-2"><Clock className="w-4 h-4 inline mr-1" /> Hora</label>
                  {availableHours.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {availableHours.map((hour) => (
                        <button key={hour} onClick={() => setDeliveryHour(hour)}
                          className={`px-4 py-2 rounded-sm border-2 text-sm font-body transition-all ${deliveryHour === hour ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>{hour}</button>
                      ))}
                    </div>
                  ) : <p className="text-sm text-muted-foreground font-body">No hay horarios disponibles. Selecciona otro día.</p>}
                </div>
              )}
            </Section>

            {/* Summary */}
            <div className="sticky bottom-0 bg-card/95 backdrop-blur-md border border-border rounded-sm p-6 shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-body text-sm text-muted-foreground">
                    {product.name} · {selectedSize.roses} rosas
                    {addCrown && " · Corona"}{addRibbon && " · Cinta"}{addGlitter && " · Brillos"}
                    {(addLetters || addNumbers) && specialText && ` · ${specialText}`}
                    {accessory !== "none" && ` · ${accessory === "note" ? "Nota" : accessory === "card" ? "Tarjeta" : "Mariposas"}`}
                    {deliveryMethod === "delivery" ? (deliveryMiles && !distanceTooFar ? ` · Envío ($${deliveryCost})` : " · Envío (pendiente)") : " · Recogida"}
                  </p>
                  <p className="font-display text-3xl font-bold text-foreground">${totalPrice} <span className="text-sm font-body text-muted-foreground font-normal">USD</span></p>
                </div>
                <button onClick={handleAddToCart}
                  className="w-full md:w-auto bg-primary text-primary-foreground px-10 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm">
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
