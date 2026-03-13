import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingBag, CreditCard, Loader2 } from "lucide-react";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import { letterNumberExtraPrice, ribbonPrice } from "@/lib/productData";
import { resolveVariantId } from "@/lib/shopify";
import { inferTierFromColor } from "@/lib/tierUtils";
import type { VideoProduct } from "@/components/ClientVideos";
import { toast } from "sonner";

interface Props {
  video: VideoProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoOrderDialog = ({ video, open, onOpenChange }: Props) => {
  const addItem = useCartStore(state => state.addItem);
  const navigate = useNavigate();
  const [customValues, setCustomValues] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);

  const hasRibbon = video.customFields?.some(f => f.label.toLowerCase().includes("ribbon"));
  const hasLetterOrNumber = video.customFields?.some(f => f.label.toLowerCase().includes("letter") || f.label.toLowerCase().includes("number"));

  let extras = 0;
  if (video.glitter) extras += Math.ceil(video.roses / 25) * 8;
  if (hasRibbon && Object.values(customValues).some(v => v)) extras += ribbonPrice;
  if (hasLetterOrNumber) {
    const charCount = Object.entries(customValues)
      .filter(([key]) => {
        const field = video.customFields?.find(f => f.label === key);
        return field && (field.label.toLowerCase().includes("letter") || field.label.toLowerCase().includes("number"));
      })
      .reduce((acc, [, val]) => acc + val.length, 0);
    extras += charCount * letterNumberExtraPrice;
  }

  const totalPrice = video.basePrice + extras;

  const handleConfirm = async (mode: "cart" | "buy") => {
    setIsAdding(true);
    try {
      const tier = video.pricingTier || inferTierFromColor(video.color);
      const variant = await resolveVariantId(video.title, video.roses);
      if (!variant) {
        toast.error("Could not resolve product. Please try again.");
        setIsAdding(false);
        return;
      }

      const addons: string[] = [];
      if (video.glitter) addons.push("Glitter");

      const ribbonText = video.customFields
        ?.filter(f => f.label.toLowerCase().includes("ribbon"))
        .map(f => customValues[f.label] || "")
        .filter(Boolean)
        .join(", ") || "";

      const specialText = video.customFields
        ?.filter(f => f.label.toLowerCase().includes("letter") || f.label.toLowerCase().includes("number"))
        .map(f => customValues[f.label] || "")
        .filter(Boolean)
        .join("") || "";

      if (ribbonText) addons.push("Custom ribbon");
      if (specialText) addons.push(`Letters/Numbers: ${specialText}`);

      const item: Omit<CartItem, 'shopifyLineId'> = {
        id: "",
        bouquetType: "round",
        color: video.color,
        roses: video.roses,
        price: video.basePrice,
        deliveryCost: 0,
        totalPrice,
        addons,
        accessory: "",
        accessoryText: "",
        ribbonText,
        crownSize: "",
        specialText,
        heartColor: "",
        glitter: video.glitter || false,
        deliveryMethod: "pickup",
        deliveryName: "",
        deliveryPhone: "",
        deliveryEmail: "",
        deliveryAddress: "",
        deliveryZip: "",
        deliveryDate: "",
        deliveryHour: "",
        deliveryMiles: null,
        paperColor: video.paperColor || "White",
        image: video.productImage,
        shopifyVariantId: variant.id,
      };

      await addItem(item);
      onOpenChange(false);

      if (mode === "buy") {
        const checkoutUrl = useCartStore.getState().checkoutUrl;
        if (checkoutUrl) {
          const link = document.createElement('a');
          link.href = checkoutUrl;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          navigate("/checkout");
        }
        toast.success("Added to cart!", {
          description: `${video.roses} ${video.color} roses`,
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
            {video.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-body">
            {video.roses} roses · {video.color} · Base price: ${video.basePrice}
          </p>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {video.hasCustomText && video.customFields && (
            <div className="space-y-4">
              <p className="font-body text-sm font-semibold text-foreground">Customize your bouquet</p>
              {video.customFields.map((field) => (
                <div key={field.label}>
                  <label className="text-xs text-muted-foreground font-body block mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={customValues[field.label] || ""}
                    onChange={(e) => setCustomValues(prev => ({ ...prev, [field.label]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    maxLength={field.label.toLowerCase().includes("ribbon") ? 50 : 4}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {video.glitter && (
              <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-body">
                ✨ Glitter finish
              </span>
            )}
            {video.paperColor && (
              <span className="bg-muted text-muted-foreground px-3 py-1.5 rounded-full text-xs font-body">
                Paper: {video.paperColor}
              </span>
            )}
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-display text-lg font-semibold text-foreground">${totalPrice}</span>
            </div>

            <button
              onClick={() => handleConfirm("cart")}
              disabled={isAdding}
              className="inline-flex items-center gap-2 w-full justify-center bg-primary text-primary-foreground px-4 py-3 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm disabled:opacity-50"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShoppingBag className="w-4 h-4" /> Add to cart</>}
            </button>
            <button
              onClick={() => handleConfirm("buy")}
              disabled={isAdding}
              className="inline-flex items-center gap-2 w-full justify-center border border-primary text-primary px-4 py-3 font-body text-sm tracking-widest uppercase hover:bg-primary/10 transition-colors rounded-sm disabled:opacity-50"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Order & pay</>}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoOrderDialog;
