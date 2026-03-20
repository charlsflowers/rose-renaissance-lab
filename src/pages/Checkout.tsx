import { useState } from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { fetchCartCheckoutUrl, updateCartBuyerIdentity, updateCartNote, addLineToShopifyCart, type ShippingAddress } from "@/lib/shopify";
import { buildAccessoryLineItems, DELIVERY_FEE_VARIANT_GID } from "@/lib/accessoryVariants";
import Navbar from "@/components/Navbar";
import type { DeliveryResult } from "@/components/DeliveryCalculator";
import { ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { motion } from "framer-motion";
import CheckoutOrderItem from "@/components/checkout/CheckoutOrderItem";
import CheckoutSummaryBlock from "@/components/checkout/CheckoutSummaryBlock";

const Checkout = () => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const cartId = useCartStore((state) => state.cartId);
  const checkoutUrl = useCartStore((state) => state.checkoutUrl);
  const isLoading = useCartStore((state) => state.isLoading);
  const isSyncing = useCartStore((state) => state.isSyncing);
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Use item.price (product + extras only, NO shipping) to avoid double-counting delivery
  const itemsSubtotal = parseFloat(items.reduce((sum, i) => sum + i.price, 0).toFixed(2));

  // Pre-populate delivery info from cart items if already provided
  const existingDeliveryItem = items.find((i) => i.deliveryMethod === "delivery" && i.deliveryAddress && i.deliveryAddress !== "Store pickup");

  const [checkoutDeliveryMethod, setCheckoutDeliveryMethod] = useState<"pickup" | "delivery">(
    existingDeliveryItem ? "delivery" : "pickup",
  );

  const [deliveryResult, setDeliveryResult] = useState<DeliveryResult | null>(
    existingDeliveryItem && existingDeliveryItem.deliveryMiles !== null
      ? {
          miles: existingDeliveryItem.deliveryMiles,
          cost: existingDeliveryItem.deliveryCost,
          address: existingDeliveryItem.deliveryAddress,
        }
      : null,
  );

  // Date & time — pre-populate from cart items
  const itemWithDate = items.find((i) => i.deliveryDate);
  const itemWithHour = items.find((i) => i.deliveryHour);
  const [deliveryDate, setDeliveryDate] = useState(itemWithDate?.deliveryDate || "");
  const [deliveryHour, setDeliveryHour] = useState(itemWithHour?.deliveryHour || "");

  const needsAddress = checkoutDeliveryMethod === "delivery";
  const deliveryCost = needsAddress && deliveryResult ? deliveryResult.cost : 0;
  const canCheckout = !needsAddress || deliveryResult !== null;

  const handleCheckout = async () => {
    if (!cartId) {
      toast.error("No se pudo iniciar el checkout. Vuelve atrás y añade el producto de nuevo.");
      return;
    }

    setIsCheckingOut(true);
    try {
      // 1. Add accessory line items for each cart item
      for (const item of items) {
        const vaseAddon = item.addons?.find(a => a.startsWith("Vase"));
        const vaseRosesMatch = vaseAddon?.match(/\((\d+)/);
        const accessories = buildAccessoryLineItems({
          glitter: item.glitter,
          rosesCount: item.roses,
          accessory: item.accessory,
          specialText: item.specialText,
          addVase: !!vaseAddon,
          vaseRoses: vaseRosesMatch ? parseInt(vaseRosesMatch[1]) : undefined,
          addCrown: !!item.crownSize,
          crownSize: item.crownSize,
          addRibbon: !!item.ribbonText,
        });
        for (const acc of accessories) {
          console.log(`📦 [Checkout] Adding accessory: variant=${acc.variantId}, qty=${acc.quantity}`);
          await addLineToShopifyCart(cartId, `gid://shopify/ProductVariant/${acc.variantId}`, acc.quantity);
        }
      }

      // 2. Add delivery fee line item if home delivery
      if (checkoutDeliveryMethod === "delivery" && deliveryCost > 0) {
        const deliveryQty = Math.round(deliveryCost * 10);
        console.log(`📦 [Checkout] Delivery fee: $${deliveryCost} → qty ${deliveryQty} × $0.10 = $${(deliveryQty * 0.1).toFixed(2)} (variant: ${DELIVERY_FEE_VARIANT_GID})`);
        const deliveryAddResult = await addLineToShopifyCart(cartId, DELIVERY_FEE_VARIANT_GID, deliveryQty);
        console.log("📦 [Checkout] Delivery fee add result:", JSON.stringify(deliveryAddResult));
        if (!deliveryAddResult.success) {
          console.error("Failed to add delivery fee to cart");
        }
      }

      // 3. If home delivery, update buyer identity with shipping address
      if (checkoutDeliveryMethod === "delivery") {
        // Try structured address from DeliveryCalculator result first, then from cart item
        const itemStructured = items[0]?.structuredAddress;
        const resultStructured = deliveryResult?.structuredAddress;
        const structured = resultStructured || itemStructured;

        const shippingAddress: ShippingAddress = structured
          ? {
              address1: structured.address1,
              city: structured.city,
              province: structured.province,
              zip: structured.zip,
              country: structured.country || "US",
            }
          : deliveryResult
            ? parseAddressFallback(deliveryResult.address, items[0]?.deliveryZip)
            : parseAddressFallback(items[0]?.deliveryAddress || "", items[0]?.deliveryZip);

        const identityResult = await updateCartBuyerIdentity(cartId, shippingAddress);
        if (!identityResult.success) {
          console.warn("Could not set shipping address on cart, proceeding anyway");
        }
      }

      // 4. Add order notes with ALL product details + delivery info
      const noteLines: string[] = [];
      noteLines.push(`delivery_type: ${checkoutDeliveryMethod === "delivery" ? "Home Delivery" : "Store Pickup"}`);
      
      // Format date for display but ensure it's never empty
      if (deliveryDate) {
        const dateObj = /^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)
          ? new Date(deliveryDate + "T00:00:00")
          : new Date(deliveryDate);
        const formattedDate = !isNaN(dateObj.getTime())
          ? format(dateObj, "PPP", { locale: enUS })
          : deliveryDate;
        noteLines.push(`delivery_date: ${formattedDate}`);
      }
      noteLines.push(`delivery_time: ${deliveryHour || "No especificada"}`);
      if (checkoutDeliveryMethod === "delivery" && deliveryResult) {
        noteLines.push(`Delivery address: ${deliveryResult.address}`);
      }
      noteLines.push("---");
      items.forEach((item, idx) => {
        noteLines.push(`[Item ${idx + 1}] ${item.productName || item.bouquetType} Bouquet`);
        if (item.color) noteLines.push(`  Bouquet color: ${item.color}`);
        if (item.roses) noteLines.push(`  Bouquet size: ${item.roses} roses`);
        if (item.paperColor) noteLines.push(`  Paper type: ${item.paperColor}`);
        noteLines.push(`  Glitter finish: ${item.glitter ? "Yes" : "No"}`);
        if (item.accessory && item.accessory !== "none") {
          const accLabel = item.accessory === "note" ? "Notes" : item.accessory === "card" ? "Card" : "Butterflies";
          noteLines.push(`  Accessory: ${accLabel}`);
        }
        if (item.accessoryText) noteLines.push(`  Card text: ${item.accessoryText}`);
        if (item.crownSize) noteLines.push(`  Crown: ${item.crownSize}`);
        if (item.ribbonText) noteLines.push(`  Ribbon text: ${item.ribbonText}`);
        if (item.specialText) noteLines.push(`  Letters or Numbers - Baby Breath: ${item.specialText}`);
        const vaseAddon = item.addons?.find(a => a.startsWith("Vase"));
        if (vaseAddon) noteLines.push(`  Vase: ${vaseAddon}`);
      });
      await updateCartNote(cartId, noteLines.join("\n"));

      // 5. Get fresh checkout URL and redirect
      const freshUrl = await fetchCartCheckoutUrl(cartId);
      const finalUrl = freshUrl || checkoutUrl;

      if (!finalUrl) {
        toast.error("Could not get checkout URL. Please try again.");
        return;
      }

      window.location.href = finalUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Error during checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
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
            {/* Single unified card */}
            <div className="bg-card border-2 border-primary/30 rounded-sm">
              {/* Order items inside the card */}
              <div className="p-6 space-y-6">
                {items.map((item, idx) => (
                  <CheckoutOrderItem key={item.id} item={item} index={idx} onRemove={removeItem} />
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Summary block: delivery method + address + date/time + totals */}
              <CheckoutSummaryBlock
                itemCount={items.length}
                itemsSubtotal={itemsSubtotal}
                deliveryMethod={checkoutDeliveryMethod}
                setDeliveryMethod={setCheckoutDeliveryMethod}
                deliveryResult={deliveryResult}
                setDeliveryResult={setDeliveryResult}
                deliveryDate={deliveryDate}
                setDeliveryDate={setDeliveryDate}
                deliveryHour={deliveryHour}
                setDeliveryHour={setDeliveryHour}
                canCheckout={canCheckout}
                isLoading={isLoading}
                isSyncing={isSyncing}
                isCheckingOut={isCheckingOut}
                onCheckout={handleCheckout}
              />
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
