import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Crown, Ribbon, Store, Truck, ShoppingBag, CreditCard, Star, Loader2 } from "lucide-react";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import { crownOptions, crownPrice, ribbonPrice, ribbonPresets } from "@/lib/productData";
import { fetchVariantsByHandle, findVariantByRoses, type ShopifyHandleVariant } from "@/lib/shopifyVariants";
import type { ReviewCartData } from "@/components/ReviewCard";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartData: ReviewCartData;
  productLabel: string;
  mode: "cart" | "buy";
}

const ReviewUpsellDialog = ({ open, onOpenChange, cartData, productLabel, mode }: Props) => {
  const addItem = useCartStore(state => state.addItem);
  

  const [addGlitter, setAddGlitter] = useState(false);
  const [addCrown, setAddCrown] = useState(false);
  const [crownSize, setCrownSize] = useState("small");
  const [addRibbon, setAddRibbon] = useState(false);
  const [ribbonType, setRibbonType] = useState<"names" | "congratulations">("names");
  const [ribbonText, setRibbonText] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [isAdding, setIsAdding] = useState(false);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [variants, setVariants] = useState<ShopifyHandleVariant[]>([]);

  useEffect(() => {
    if (!open) return;

    let active = true;

    const loadVariants = async () => {
      setVariantsLoading(true);
      try {
        const loaded = await fetchVariantsByHandle(productLabel);
        if (active) setVariants(loaded);
      } catch (error) {
        console.error("Failed to load review product variants:", error);
        if (active) setVariants([]);
      } finally {
        if (active) setVariantsLoading(false);
      }
    };

    loadVariants();

    return () => {
      active = false;
    };
  }, [open, productLabel]);

  const glitterCost = addGlitter ? Math.ceil(cartData.roses / 25) * 8 : 0;
  const extrasTotal =
    glitterCost + (addCrown ? crownPrice : 0) + (addRibbon ? ribbonPrice : 0);
  const finalPrice = cartData.price + extrasTotal;

  const handleConfirm = async () => {
    if (variantsLoading) {
      toast.error("We are still loading product variants.");
      return;
    }

    setIsAdding(true);
    try {
      const variant = findVariantByRoses(variants, cartData.roses);
      if (!variant) {
        toast.error("Could not resolve product variant for this bouquet.");
        setIsAdding(false);
        return;
      }

      const addons: string[] = [];
      if (addGlitter) addons.push("Glitter");
      if (addCrown) addons.push(`Crown (${crownSize})`);
      if (addRibbon) addons.push("Ribbon");

      const item: Omit<CartItem, 'shopifyLineId'> = {
        id: "",
        bouquetType: cartData.bouquetType,
        color: cartData.color,
        roses: cartData.roses,
        price: cartData.price,
        deliveryCost: 0,
        totalPrice: finalPrice,
        addons,
        accessory: "",
        accessoryText: "",
        ribbonText: addRibbon ? ribbonText : "",
        crownSize: addCrown ? crownSize : "",
        specialText: "",
        heartColor: "",
        glitter: addGlitter,
        deliveryMethod,
        deliveryName: "",
        deliveryPhone: "",
        deliveryEmail: "",
        deliveryAddress: "",
        deliveryZip: "",
        deliveryDate: "",
        deliveryHour: "",
        deliveryMiles: null,
        paperColor: "Blanco",
        image: cartData.productImage,
        shopifyVariantId: variant.id,
      };
      await addItem(item);
      onOpenChange(false);

      if (mode === "buy") {
        const checkoutUrl = await useCartStore.getState().createCheckoutUrl();
        if (!checkoutUrl) {
          toast.error("Could not start Shopify checkout. Please try again.");
          return;
        }

        const link = document.createElement('a');
        link.href = checkoutUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Added to cart!", {
          description: `${productLabel} — ${cartData.roses} roses`,
        });
      }
    } catch (error) {
      toast.error("Failed to add to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {productLabel} · {cartData.roses} roses
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-body">Base price: ${cartData.price}</p>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Delivery method */}
          <div>
            <p className="font-body text-sm font-semibold text-foreground mb-3">Delivery method</p>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: "pickup" as const, label: "Store pickup", icon: Store },
                { value: "delivery" as const, label: "Home delivery", icon: Truck },
              ]).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setDeliveryMethod(value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all font-body text-xs ${
                    deliveryMethod === value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Glitter */}
          <button
            onClick={() => setAddGlitter(!addGlitter)}
            className={`w-full flex items-center gap-3 p-4 rounded-sm border-2 transition-all font-body text-sm ${
              addGlitter
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            <Star className={`w-5 h-5 shrink-0 ${addGlitter ? "text-yellow-400 fill-yellow-400" : ""}`} />
            <div className="text-left flex-1">
              <p className="font-semibold">✨ Glitter</p>
              <p className="text-xs">Glitter finish on the roses</p>
            </div>
            <span className="text-xs font-semibold">+${glitterCost || Math.ceil(cartData.roses / 25) * 8}</span>
          </button>

          {/* Crown */}
          <div>
            <button
              onClick={() => setAddCrown(!addCrown)}
              className={`w-full flex items-center gap-3 p-4 rounded-sm border-2 transition-all font-body text-sm ${
                addCrown
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              <Crown className="w-5 h-5 shrink-0" />
              <div className="text-left flex-1">
                <p className="font-semibold">Crown</p>
                <p className="text-xs">Add a decorative crown</p>
              </div>
              <span className="text-xs font-semibold">+${crownPrice}</span>
            </button>

            {addCrown && (
              <div className="flex gap-2 mt-3 pl-2">
                {crownOptions.map((opt) => (
                  <button
                    key={opt.size}
                    onClick={() => setCrownSize(opt.size)}
                    className={`px-4 py-2 rounded-sm border text-xs font-body transition-all ${
                      crownSize === opt.size
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ribbon */}
          <div>
            <button
              onClick={() => {
                setAddRibbon(!addRibbon);
                if (addRibbon) setRibbonText("");
              }}
              className={`w-full flex items-center gap-3 p-4 rounded-sm border-2 transition-all font-body text-sm ${
                addRibbon
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              <Ribbon className="w-5 h-5 shrink-0" />
              <div className="text-left flex-1">
                <p className="font-semibold">Custom ribbon</p>
                <p className="text-xs">With any text you want</p>
              </div>
              <span className="text-xs font-semibold">+${ribbonPrice}</span>
            </button>

            {addRibbon && (
              <div className="mt-3 pl-2 space-y-3">
                <div className="flex gap-2">
                  {(["names", "congratulations"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setRibbonType(t); setRibbonText(""); }}
                      className={`px-4 py-2 rounded-sm border text-xs font-body transition-all ${
                        ribbonType === t
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {t === "names" ? "Names" : "Congratulations"}
                    </button>
                  ))}
                </div>

                {ribbonType === "congratulations" && (
                  <div className="flex flex-wrap gap-2">
                    {ribbonPresets.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setRibbonText(preset)}
                        className={`px-3 py-1.5 rounded-sm border text-xs font-body transition-all ${
                          ribbonText === preset
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/30"
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
                  placeholder={ribbonType === "names" ? "e.g. Ana & Carlos" : "e.g. Happy Birthday"}
                  className="w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}
          </div>

          {/* Total + CTA */}
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-display text-lg font-semibold text-foreground">${finalPrice}</span>
            </div>

            <button
              onClick={handleConfirm}
              disabled={isAdding || variantsLoading}
              className="inline-flex items-center gap-2 w-full justify-center bg-primary text-primary-foreground px-4 py-3 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-50"
            >
              {isAdding || variantsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "buy" ? (
                <>
                  <CreditCard className="w-4 h-4" />
                  Order & pay
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add to cart
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewUpsellDialog;
