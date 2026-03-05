import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format, addHours, isBefore, startOfDay } from "date-fns";
import { miamiHourNow, todayInMiami, isTodayInMiami } from "@/lib/miamiTime";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { categoryProducts } from "@/lib/catalogData";
import { ArrowLeft, Check, Store, Truck, CalendarIcon, Clock, MapPin, Search, Loader2, Type, Sparkles } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const CategoryProductDetail = () => {
  const { slug, productId } = useParams<{ slug: string; productId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const products = slug ? categoryProducts[slug] || [] : [];
  const product = products.find((p) => p.id === productId);

  const [selectedSizeIdx] = useState(0);
  const [noteText, setNoteText] = useState("");
  const [addNote, setAddNote] = useState(false);
  const [addCard, setAddCard] = useState(false);
  const [cardText, setCardText] = useState("");

  // Delivery state (reused from BouquetBuilder)
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
  const minDeliveryTime = new Date(nowInMiami().getTime() + minLeadHours * 60 * 60 * 1000);
  const getAvailableHours = (date: Date | undefined) => {
    if (!date) return [];
    const day = date.getDay();
    const closeHour = day === 0 ? 16 : day === 6 ? 17 : 19;
    const hours: string[] = [];
    for (let h = 8; h <= closeHour; h++) {
      const slotTime = new Date(date); slotTime.setHours(h, 0, 0, 0);
      if (isTodayInMiami(date) && isBefore(slotTime, minDeliveryTime)) continue;
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

  const selectedSize = product.sizes[selectedSizeIdx];
  const deliveryCost = deliveryMethod === "delivery" && deliveryMiles && !distanceTooFar ? deliveryMiles * 2 : 0;
  const totalPrice = selectedSize.price + deliveryCost;

  const handleAddToCart = (): boolean => {
    if (deliveryMethod === "delivery" && !selectedAddress) { toast.error("Selecciona una dirección de entrega."); return false; }
    if (deliveryMethod === "delivery" && (distanceTooFar || deliveryMiles === null)) { toast.error("La dirección no es válida o está fuera de rango."); return false; }
    if (!deliveryDate || !deliveryHour) { toast.error("Selecciona fecha y hora."); return false; }

    addItem({
      id: "",
      bouquetType: `${slug}-${product.name}`,
      color: selectedSize.label,
      roses: 0,
      price: selectedSize.price,
      deliveryCost,
      totalPrice,
      addons: [],
      accessory: addNote ? "note" : addCard ? "card" : "none",
      accessoryText: addNote ? noteText : addCard ? cardText : "",
      ribbonText: "",
      crownSize: "",
      specialText: "",
      heartColor: "",
      glitter: false,
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
    toast.success("¡Producto añadido al carrito!");
    return true;
  };

  const handlePayNow = () => {
    if (handleAddToCart()) navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to={`/categoria/${slug}`} className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>

          <div className="max-w-4xl mx-auto space-y-10">
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-sm aspect-[16/9] bg-muted">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-display text-6xl text-muted-foreground/20">🌹</span>
                </div>
              )}
            </div>

            <div className="text-center">
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">{product.name}</h1>
              <p className="text-muted-foreground font-body mt-2">{product.description}</p>
            </div>

            {/* Note & Card */}
            <Section title="Accesorios" step={1} subtitle="Gratis">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button onClick={() => { setAddNote(!addNote); if (!addNote) setAddCard(false); }}
                  className={`flex items-center justify-center gap-3 p-4 rounded-sm border-2 transition-all font-body text-sm ${addNote ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  <Type className="w-4 h-4" />
                  <span>Nota</span>
                  {addNote && <Check className="w-4 h-4 ml-auto" />}
                </button>
                <button onClick={() => { setAddCard(!addCard); if (!addCard) setAddNote(false); }}
                  className={`flex items-center justify-center gap-3 p-4 rounded-sm border-2 transition-all font-body text-sm ${addCard ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  <Sparkles className="w-4 h-4" />
                  <span>Tarjeta</span>
                  {addCard && <Check className="w-4 h-4 ml-auto" />}
                </button>
              </div>
              {addNote && (
                <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Escribe tu nota..."
                  className="w-full mt-2 bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none" maxLength={200} />
              )}
              {addCard && (
                <textarea value={cardText} onChange={(e) => setCardText(e.target.value)} placeholder="Escribe tu tarjeta..."
                  className="w-full mt-2 bg-card border border-border rounded-sm px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none" maxLength={200} />
              )}
            </Section>

            {/* Delivery */}
            <Section title="Envío" step={2}>
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
                        <iframe src={mapUrl} width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ruta de entrega" />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Date */}
              <div className="mb-4">
                <label className="text-sm font-body font-semibold text-foreground block mb-2">
                  <CalendarIcon className="w-4 h-4 inline mr-1" /> Fecha
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full md:w-auto flex items-center gap-2 px-4 py-3 rounded-sm border border-border bg-card font-body text-sm text-foreground hover:border-primary/30 transition-all">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      {deliveryDate ? format(deliveryDate, "PPP", { locale: es }) : "Selecciona una fecha"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={deliveryDate} onSelect={(d) => { setDeliveryDate(d); setDeliveryHour(""); }}
                      disabled={(date) => isBefore(startOfDay(date), startOfDay(todayInMiami()))} className="p-3 pointer-events-auto" locale={es} />
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
                    {product.name} · {selectedSize.label}
                    {addNote && " · Nota"}{addCard && " · Tarjeta"}
                    {deliveryMethod === "delivery" ? (deliveryMiles && !distanceTooFar ? ` · Envío ($${deliveryCost})` : " · Envío (pendiente)") : " · Recogida"}
                  </p>
                  <p className="font-display text-3xl font-bold text-foreground">${totalPrice} <span className="text-sm font-body text-muted-foreground font-normal">USD</span></p>
                </div>
                <button onClick={handleAddToCart}
                  className="w-full md:w-auto bg-primary text-primary-foreground px-10 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm">
                  Añadir al carrito
                </button>
                <button onClick={handlePayNow}
                  className="w-full md:w-auto border-2 border-primary text-primary px-10 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/10 transition-colors rounded-sm">
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

export default CategoryProductDetail;
