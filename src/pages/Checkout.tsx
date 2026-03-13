import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { buildCheckoutUrl, openCheckoutInNewTab } from "@/lib/checkout";
import Navbar from "@/components/Navbar";
import DeliveryCalculator from "@/components/DeliveryCalculator";
import { Trash2, ArrowLeft, Truck, Store, Globe, ExternalLink, Loader2 } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { motion } from "framer-motion";

const Checkout = () => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);

  const isLoading = useCartStore((state) => state.isLoading);
  const isSyncing = useCartStore((state) => state.isSyncing);
  const navigate = useNavigate();

  const cartTotal = items.reduce((sum, i) => sum + i.totalPrice, 0);

  // Pre-populate delivery info from cart items if already provided
  const existingDeliveryItem = items.find((i) => i.deliveryMethod === "delivery" && i.deliveryAddress && i.deliveryAddress !== "Store pickup");

  const [checkoutDeliveryMethod, setCheckoutDeliveryMethod] = useState<"pickup" | "delivery">(
    existingDeliveryItem ? "delivery" : "pickup",
  );

  const [deliveryResult, setDeliveryResult] = useState<{
    miles: number;
    cost: number;
    address: string;
    duration?: string;
  } | null>(
    existingDeliveryItem && existingDeliveryItem.deliveryMiles !== null
      ? {
          miles: existingDeliveryItem.deliveryMiles,
          cost: existingDeliveryItem.deliveryCost,
          address: existingDeliveryItem.deliveryAddress,
        }
      : null,
  );

  const needsAddress = checkoutDeliveryMethod === "delivery";
  const deliveryCost = needsAddress && deliveryResult ? deliveryResult.cost : 0;
  const grandTotal = cartTotal + deliveryCost;
  const canCheckout = !needsAddress || deliveryResult !== null;

  // Delivery fee product variant (SKU: DELIVERY-FEE, $0.01 each unit)
  const DELIVERY_FEE_VARIANT_NUMERIC_ID = "51629708935300";

  const handleCheckout = () => {
    const storeItems = useCartStore.getState().items;
    const lineItems = storeItems
      .filter((i) => i.shopifyVariantId)
      .map((i) => {
        const numericId = i.shopifyVariantId.split("/").pop();
        return `${numericId}:1`;
      });
    if (lineItems.length === 0) {
      toast.error("No se pudo iniciar el checkout. Vuelve atrás y añade el producto de nuevo.");
      return;
    }

    // If home delivery, add the delivery fee as line items ($0.01 × cents)
    const currentDeliveryResult = deliveryResult;
    if (checkoutDeliveryMethod === "delivery" && currentDeliveryResult && currentDeliveryResult.cost > 0) {
      const deliveryCents = Math.round(currentDeliveryResult.cost * 100);
      lineItems.push(`${DELIVERY_FEE_VARIANT_NUMERIC_ID}:${deliveryCents}`);
    }

    let checkoutUrl = `https://charls-flowers.myshopify.com/cart/${lineItems.join(",")}`;

    // Append shipping address if delivery was selected and address is available
    if (checkoutDeliveryMethod === "delivery" && currentDeliveryResult?.address) {
      const parts = currentDeliveryResult.address.split(",").map((p) => p.trim());
      const address1 = parts[0] || "";
      const city = parts[1] || "";
      // parts[2] might be "FL 33126" or "State ZIP"
      const stateZipPart = parts[2] || "";
      const stateZipMatch = stateZipPart.match(/^([A-Z]{2})\s+(\d{5}(-\d{4})?)$/);
      const zip = stateZipMatch ? stateZipMatch[2] : "";

      const params = new URLSearchParams();
      if (address1) params.set("checkout[shipping_address][address1]", address1);
      if (city) params.set("checkout[shipping_address][city]", city);
      if (zip) params.set("checkout[shipping_address][zip]", zip);
      params.set("checkout[shipping_address][country]", "US");

      checkoutUrl += `?${params.toString()}`;
    }

    window.location.href = checkoutUrl;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto px-6">
            <BrandLogo className="w-20 h-20 mx-auto mb-6" />
            <h1 className="font-display text-3xl font-semibold text-foreground mb-3">Your cart is empty</h1>
            <p className="text-muted-foreground font-body mb-8">Add a bouquet to continue.</p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-2">Checkout</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">Your Order</h1>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border rounded-sm p-6"
              >
                {item.image && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={item.image}
                      alt={`${item.bouquetType} bouquet`}
                      className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-sm border border-border"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {item.bouquetType === "classic"
                        ? "Classic"
                        : item.bouquetType === "heart"
                          ? "Heart"
                          : item.bouquetType === "letters"
                            ? "With Letters"
                            : item.bouquetType === "round"
                              ? "Round"
                              : "With Numbers"}{" "}
                      Bouquet
                    </h3>
                    <p className="text-sm font-body text-muted-foreground mt-1">
                      {item.roses} roses · {item.color}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    title="Remove"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-body">
                  {item.addons.length > 0 && (
                    <div>
                      <p className="text-muted-foreground mb-1">Extras:</p>
                      <p className="text-foreground">{item.addons.join(", ")}</p>
                    </div>
                  )}

                  {item.specialText && (
                    <div>
                      <p className="text-muted-foreground mb-1">Text:</p>
                      <p className="text-foreground font-semibold">{item.specialText}</p>
                    </div>
                  )}

                  {item.accessory !== "none" && item.accessory !== "" && (
                    <div>
                      <p className="text-muted-foreground mb-1">Accessory:</p>
                      <p className="text-foreground">
                        {item.accessory === "note" ? "Note" : item.accessory === "card" ? "Card" : "Butterflies"}
                        {item.accessoryText && `: "${item.accessoryText}"`}
                      </p>
                    </div>
                  )}

                  {item.ribbonText && (
                    <div>
                      <p className="text-muted-foreground mb-1">Ribbon:</p>
                      <p className="text-foreground">"{item.ribbonText}"</p>
                    </div>
                  )}

                  <div className="md:col-span-2 pt-3 border-t border-border mt-2">
                    <p className="text-muted-foreground mb-1">Delivery:</p>
                    <p className="text-foreground inline-flex items-center gap-2">
                      {item.deliveryMethod === "pickup" ? (
                        <>
                          <Store className="w-4 h-4" />
                          Store pickup
                        </>
                      ) : (
                        <>
                          <Truck className="w-4 h-4" />
                          Home delivery
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-4 pt-3 border-t border-border">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground font-body">Subtotal</p>
                    <p className="font-display text-2xl font-bold text-foreground">${item.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Delivery method selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border-2 border-primary/20 rounded-sm p-6 space-y-5"
            >
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-body text-xs tracking-widest uppercase">
                  <Globe className="w-3.5 h-3.5" />
                  Nationwide shipping across the USA
                </div>
              </div>

              <p className="font-body font-semibold text-foreground text-sm">Delivery method</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setCheckoutDeliveryMethod("pickup");
                    setDeliveryResult(null);
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all font-body text-xs ${
                    checkoutDeliveryMethod === "pickup"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <Store className="w-5 h-5" />
                  Store pickup
                </button>
                <button
                  onClick={() => {
                    setCheckoutDeliveryMethod("delivery");
                    setDeliveryResult(null);
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all font-body text-xs ${
                    checkoutDeliveryMethod === "delivery"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <Truck className="w-5 h-5" />
                  <span>Home delivery</span>
                  <span className="text-[10px] text-muted-foreground font-normal">From $20</span>
                </button>
              </div>

              {checkoutDeliveryMethod === "pickup" && (
                <p className="font-body text-sm text-muted-foreground">
                  📍 Pickup at: <span className="font-semibold text-foreground">7255 NW 12th St, Miami, FL 33126</span>
                </p>
              )}

              {checkoutDeliveryMethod === "delivery" && deliveryResult && (
                <div className="space-y-2">
                  <p className="font-body text-sm text-muted-foreground">
                    📍 Deliver to: <span className="font-semibold text-foreground">{deliveryResult.address}</span>
                  </p>
                  <p className="font-body text-sm text-muted-foreground">
                    Shipping: <span className="font-semibold text-foreground">${deliveryResult.cost}</span>
                    <span className="text-xs ml-2">({deliveryResult.miles.toFixed(1)} miles)</span>
                  </p>
                  <button
                    onClick={() => setDeliveryResult(null)}
                    className="text-xs font-body text-primary underline hover:text-primary/80"
                  >
                    Change address
                  </button>
                </div>
              )}

              {checkoutDeliveryMethod === "delivery" && !deliveryResult && <DeliveryCalculator onResult={setDeliveryResult} />}
            </motion.div>

            {/* Total + CTA */}
            <div className="bg-card border-2 border-primary/30 rounded-sm p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-body text-sm text-muted-foreground">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                  <div className="space-y-1">
                    <p className="font-body text-sm text-muted-foreground">
                      Subtotal: <span className="text-foreground font-semibold">${cartTotal}</span>
                    </p>
                    {needsAddress && (
                      <p className="font-body text-sm text-muted-foreground">
                        Shipping:{" "}
                        <span className="text-foreground font-semibold">
                          {deliveryResult ? `$${deliveryCost}` : "Pending"}
                        </span>
                      </p>
                    )}
                    <p className="font-display text-3xl font-bold text-foreground">
                      ${grandTotal} <span className="text-sm font-body text-muted-foreground font-normal">USD</span>
                    </p>
                  </div>
                </div>
                <button
                  disabled={!canCheckout || isLoading || isSyncing}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCheckout}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Complete order
                    </>
                  )}
                </button>
              </div>

              {!canCheckout && (
                <p className="text-xs font-body text-muted-foreground mt-3">
                  ⚠️ Enter a valid delivery address to continue.
                </p>
              )}
            </div>

            {/* Continue shopping */}
            <div className="text-center pt-4">
              <Link
                to="/bouquets"
                className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
