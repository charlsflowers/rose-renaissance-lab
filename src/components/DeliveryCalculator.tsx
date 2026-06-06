import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { calculateDeliveryCost, formatDeliveryCost } from "@/lib/deliveryPricing";
import { MapPin, Search, Loader2, Truck, Store, AlertTriangle } from "lucide-react";

interface Prediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
}

export interface StructuredAddress {
  address1: string;
  city: string;
  province: string;
  zip: string;
  country: string;
}

export interface DeliveryResult {
  miles: number;
  cost: number;
  address: string;
  duration?: string;
  structuredAddress?: StructuredAddress;
}

interface Props {
  onResult: (result: DeliveryResult | null) => void;
  onTooFar?: (info: { fullAddress: string; structuredAddress: StructuredAddress | null; miles: number }) => void;
}

const DeliveryCalculator = ({ onResult, onTooFar }: Props) => {
  const [addressQuery, setAddressQuery] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [deliveryMiles, setDeliveryMiles] = useState<number | null>(null);
  const [deliveryDuration, setDeliveryDuration] = useState("");
  const [distanceError, setDistanceError] = useState("");
  const [distanceTooFar, setDistanceTooFar] = useState(false);
  const [mapUrl, setMapUrl] = useState("");
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setShowPredictions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchPredictions = useCallback(async (input: string) => {
    if (input.length < 3) { setPredictions([]); return; }
    setAutocompleteLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("places-autocomplete", {
        body: { input },
      });
      if (!error && data?.predictions) {
        setPredictions(data.predictions);
        setShowPredictions(true);
      }
    } catch {} finally {
      setAutocompleteLoading(false);
    }
  }, []);

  const handleAddressInput = useCallback((value: string) => {
    setAddressQuery(value);
    setSelectedAddress("");
    setDeliveryMiles(null);
    setMapUrl("");
    setDistanceError("");
    setDistanceTooFar(false);
    onResult(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(value), 300);
  }, [fetchPredictions, onResult]);

  const handleSelectPrediction = useCallback(async (prediction: Prediction) => {
    setAddressQuery(prediction.description);
    setSelectedAddress(prediction.description);
    setShowPredictions(false);
    setPredictions([]);
    setDistanceLoading(true);
    setDistanceError("");
    setDistanceTooFar(false);
    setDeliveryMiles(null);
    onResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("calculate-distance", {
        body: { fullAddress: prediction.description, placeId: prediction.placeId },
      });
      if (error) {
        setDistanceError("Error calculating distance.");
      } else if (data.error) {
        if (data.tooFar) {
          setDistanceTooFar(true);
          setDeliveryMiles(data.miles);
          if (onTooFar) {
            onTooFar({
              fullAddress: prediction.description,
              structuredAddress: data.structuredAddress || null,
              miles: data.miles,
            });
          } else {
            setDistanceError(data.error);
          }
        } else {
          setDistanceError(data.error);
        }
      } else {
        setDeliveryMiles(data.miles);
        setDeliveryDuration(data.duration);
        if (data.mapUrl) setMapUrl(data.mapUrl);
        onResult({
          miles: data.miles,
          cost: calculateDeliveryCost(data.miles),
          address: prediction.description,
          duration: data.duration,
          structuredAddress: data.structuredAddress || undefined,
        });
      }
    } catch {
      setDistanceError("Connection error.");
    } finally {
      setDistanceLoading(false);
    }
  }, [onResult]);

  return (
    <div className="space-y-4">
      <p className="font-body font-semibold text-foreground text-sm flex items-center gap-2">
        <Truck className="w-4 h-4" />
        Delivery address
      </p>

      <div ref={autocompleteRef} className="relative">
        <label className="text-xs text-muted-foreground font-body block mb-1">
          <MapPin className="w-3 h-3 inline mr-1" />
          Address <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={addressQuery}
            onChange={(e) => handleAddressInput(e.target.value)}
            onFocus={() => predictions.length > 0 && setShowPredictions(true)}
            placeholder="Start typing the address..."
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 pr-10 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
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
          <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <p className="font-body text-xs text-muted-foreground">Selected address:</p>
          <p className="font-body text-sm text-foreground font-medium">{selectedAddress}</p>
        </div>
      )}

      {distanceError && (
        <div className="flex items-center gap-2 text-sm font-body text-destructive">
          <AlertTriangle className="w-4 h-4" />
          {distanceError}
        </div>
      )}

      {deliveryMiles !== null && !distanceTooFar && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="font-body text-sm text-foreground">
            📍 Distance: <span className="font-semibold">{deliveryMiles} miles</span>
            {deliveryDuration && <span className="text-muted-foreground"> (~{deliveryDuration})</span>}
          </p>
          <p className="font-body text-sm text-primary font-semibold mt-1">
            Shipping cost: {formatDeliveryCost(calculateDeliveryCost(deliveryMiles))}
          </p>
        </div>
      )}

      {mapUrl && (
        <div className="rounded-lg overflow-hidden border border-border">
          <iframe
            src={mapUrl}
            width="100%"
            style={{ border: 0, height: "320px" }}
            className="w-full md:!h-[280px]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Delivery route"
          />
        </div>
      )}
    </div>
  );
};

export default DeliveryCalculator;
