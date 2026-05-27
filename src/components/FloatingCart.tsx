import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import BrandLogo from "@/components/BrandLogo";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Trash2, Loader2, X } from "lucide-react";
import PaymentIcons from "@/components/PaymentIcons";
import { performApiCheckout } from "@/lib/checkout";
import { buildAccessoryLineItems } from "@/lib/accessoryVariants";
import { getPaperForCartItem } from "@/lib/paperHelper";
import stickerBestValue from "@/assets/sticker-best-value.webp";
import stickerFreshness from "@/assets/sticker-freshness.webp";
import stickerSameDay from "@/assets/sticker-same-day.webp";

const FloatingCart = () => {
  const { t } = useTranslation();
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const isLoading = useCartStore(state => state.isLoading);
  const open = useCartStore(state => state.isOpen);
  const setOpen = useCartStore(state => state.setOpen);
  const totalItems = items.length;
  const cartTotal = items.reduce((sum, i) => sum + i.totalPrice, 0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const itemsSubtotal = parseFloat(items.reduce((sum, i) => sum + i.price, 0).toFixed(2));
  const deliveryItem = items.find((i) => i.deliveryMethod === "delivery" && i.deliveryAddress && i.deliveryAddress !== "Store pickup");
  const checkoutDeliveryMethod: "pickup" | "delivery" = deliveryItem ? "delivery" : "pickup";
  const deliveryCost = deliveryItem ? (deliveryItem.deliveryCost || 0) : 0;

  // GA4: view_cart fires only on the closed→open transition
  const wasOpenRef = useRef(open);
  useEffect(() => {
    if (!wasOpenRef.current && open) {
      (window as any).gtag?.('event', 'view_cart', {
        currency: 'USD',
        value: parseFloat(cartTotal.toFixed(2)),
        items: items.map(i => ({
          item_id: i.shopifyVariantId || i.bouquetType,
          item_name: i.productName || i.bouquetType,
          item_category: i.bouquetType,
          price: parseFloat(i.price.toFixed(2)),
          quantity: 1,
        })),
      });
    }
    wasOpenRef.current = open;
  }, [open]);

  // GA4: remove_from_cart wrapper around the store action
  const handleRemoveItem = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      (window as any).gtag?.('event', 'remove_from_cart', {
        currency: 'USD',
        value: parseFloat(item.price.toFixed(2)),
        items: [{
          item_id: item.shopifyVariantId || item.bouquetType,
          item_name: item.productName || item.bouquetType,
          price: parseFloat(item.price.toFixed(2)),
          quantity: 1,
        }],
      });
    }
    removeItem(id);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    try {
      const itemWithDate = items.find((i) => i.deliveryDate);
      const itemWithHour = items.find((i) => i.deliveryHour);
      const deliveryDate = itemWithDate?.deliveryDate || "";
      const deliveryHour = itemWithHour?.deliveryHour || "";

      const noteLines: string[] = [];
      noteLines.push("DATOS DEL ENVÍO");
      noteLines.push(`- 🚚 Tipo: ${checkoutDeliveryMethod === "delivery" ? "Home Delivery" : "Store Pickup"}`);

      if (deliveryDate) {
        const dateObj = /^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)
          ? new Date(deliveryDate + "T00:00:00")
          : new Date(deliveryDate);
        const formattedDate = !isNaN(dateObj.getTime())
          ? format(dateObj, "PPP", { locale: enUS })
          : deliveryDate;
        noteLines.push(`- 📅 Fecha: ${formattedDate}`);
      }
      if (deliveryHour) noteLines.push(`- ⏰ Hora: ${deliveryHour}`);
      if (checkoutDeliveryMethod === "delivery" && deliveryItem) {
        noteLines.push(`- 📍 Dirección: ${deliveryItem.deliveryAddress}`);
      }

      for (let idx = 0; idx < items.length; idx++) {
        const item = items[idx];
        noteLines.push("");
        noteLines.push(`DATOS DEL PRODUCTO ${idx + 1}`);
        noteLines.push(`- 🌹 Producto: ${item.productName || item.bouquetType}`);

        if (item.bouquetType === "custom" && item.color) {
          const colors = item.color.split(",").map(c => c.trim()).filter(Boolean);
          colors.forEach((c, ci) => {
            noteLines.push(`- 🌸 Colour ${ci + 1}: ${c}`);
          });
        } else if (item.color) {
          noteLines.push(`- 🌸 Color: ${item.color}`);
        }

        const catalogPaper = await getPaperForCartItem(item.productName, item.bouquetType);
        const paperToShow = catalogPaper || item.paperColor;
        if (paperToShow) noteLines.push(`- 📄 Paper color: ${paperToShow}`);
        if (item.roses) noteLines.push(`- 🌹 Roses: ${item.roses}`);
        if (item.glitter) noteLines.push(`- ✨ Glitter finish: Yes`);
        if (item.crownSize) noteLines.push(`- 👑 Crown: ${item.crownSize}`);
        if (item.accessory && item.accessory !== "none") {
          const accLabel = item.accessory === "note" ? "Notes" : item.accessory === "card" ? "Card" : "Butterflies";
          noteLines.push(`- 🦋 Accessory: ${accLabel}`);
        }
        if (item.accessoryText) noteLines.push(`- 💌 Card text: ${item.accessoryText}`);
        if (item.ribbonText) noteLines.push(`- 🎀 Custom ribbon: ${item.ribbonText}`);
        if (item.specialText) noteLines.push(`- 🔤 Letters or numbers (Baby Breath): ${item.specialText}`);
        const vaseAddon = item.addons?.find(a => a.startsWith("Vase"));
        if (vaseAddon) noteLines.push(`- 🏺 Vase: ${vaseAddon}`);
        if (item.customerNotes) {
          noteLines.push("");
          noteLines.push("NOTAS DEL CLIENTE");
          noteLines.push(`📝 Nota del cliente: ${item.customerNotes}`);
        }
      }

      const accessoryLineItems = items.flatMap((item) => {
        const vaseAddon = item.addons?.find(a => a.startsWith("Vase"));
        const vaseRosesMatch = vaseAddon?.match(/\((\d+)/);
        return buildAccessoryLineItems({
          glitter: item.glitter,
          rosesCount: item.roses,
          accessory: item.accessory,
          specialText: item.specialText,
          addVase: !!vaseAddon,
          vaseRoses: vaseRosesMatch ? parseInt(vaseRosesMatch[1], 10) : undefined,
          addCrown: !!item.crownSize,
          crownSize: item.crownSize,
          addRibbon: !!item.ribbonText,
        });
      });

      const cartTotalForFee = itemsSubtotal + deliveryCost;

      const checkoutUrl = await performApiCheckout({
        deliveryMethod: checkoutDeliveryMethod,
        deliveryCost,
        serviceFeeBase: cartTotalForFee,
        deliveryAddress: checkoutDeliveryMethod === "delivery" ? deliveryItem?.deliveryAddress : undefined,
        deliveryZip: checkoutDeliveryMethod === "delivery" ? deliveryItem?.deliveryZip : undefined,
        structuredAddress: checkoutDeliveryMethod === "delivery" ? deliveryItem?.structuredAddress : undefined,
        accessories: accessoryLineItems,
        note: noteLines.join("\n"),
      });

      if (!checkoutUrl) {
        toast.error("Could not get checkout URL. Please try again.");
        return;
      }

      setOpen(false);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Error during checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Bottom floating cart pill removed — navbar cart icon already shows the badge */}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 flex flex-col [&>button.absolute]:hidden"
        >
          <SheetHeader className="px-6 pt-12 pb-4 border-b">
            <div className="flex items-center justify-between gap-3">
              <SheetTitle className="font-display text-xl text-foreground flex items-center gap-2.5 m-0">
                <BrandLogo className="w-7 h-7" />
                <span>
                  {t("floatingCart.yourCart")} ({totalItems})
                </span>
              </SheetTitle>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="-mr-1 w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-muted active:bg-muted transition-colors"
              >
                <X className="w-6 h-6" strokeWidth={2.4} />
              </button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {totalItems === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="font-body text-sm text-muted-foreground">{t("floatingCart.empty")}</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 pb-4 border-b last:border-b-0">
                    <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.productName || item.bouquetType} className="w-full h-full object-cover" />
                      ) : (
                        <BrandLogo className="w-6 h-6" color="hsl(var(--primary))" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-base font-semibold text-foreground truncate">
                        {item.productName || item.bouquetType}
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">
                        {item.roses} {t("product.roses")}
                        {item.color ? ` · ${item.color}` : ""}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="font-body text-base font-semibold text-foreground">
                          ${parseFloat(item.totalPrice.toFixed(2))}
                        </p>
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label={t("floatingCart.remove")}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {totalItems > 0 && (
            <div className="border-t px-6 py-4 space-y-3 bg-background">
              {/* Trust stickers */}
              <div className="flex items-center justify-center gap-3 pb-1">
                <img src={stickerSameDay} alt="Same Day Delivery" className="w-16 h-16 object-contain" loading="lazy" />
                <img src={stickerFreshness} alt="Freshness 100% Guaranteed" className="w-16 h-16 object-contain" loading="lazy" />
                <img src={stickerBestValue} alt="The Best Value" className="w-16 h-16 object-contain" loading="lazy" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-muted-foreground">
                  {t("floatingCart.subtotal")}
                </span>
                <span className="font-display text-lg font-semibold text-foreground">
                  ${parseFloat(cartTotal.toFixed(2))}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut || isLoading}
                className="flex items-center justify-center gap-2 w-full text-center bg-primary text-primary-foreground py-3 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isCheckingOut && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("floatingCart.viewCart")}
              </button>
              <PaymentIcons className="pt-1" size={22} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="block w-full text-center font-body text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {t("floatingCart.continueShopping")}
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FloatingCart;