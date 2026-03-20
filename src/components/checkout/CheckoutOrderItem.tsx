import { motion } from "framer-motion";
import { Trash2, Store, Truck } from "lucide-react";
import type { CartItem } from "@/stores/cartStore";
import { getExtraImage, getAccessoryImage } from "./ExtrasImages";

interface Props {
  item: CartItem;
  index: number;
  onRemove: (id: string) => void;
}

function bouquetLabel(type: string) {
  switch (type) {
    case "classic": return "Classic";
    case "heart": return "Heart";
    case "letters": return "With Letters";
    case "round": return "Round";
    case "numbers": return "With Numbers";
    default: return type;
  }
}

const CheckoutOrderItem = ({ item, index, onRemove }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border rounded-sm p-6"
    >
      {/* Product image */}
      {item.image && (
        <div className="mb-4 flex justify-center">
          <img
            src={item.image}
            alt={`${item.bouquetType} bouquet`}
            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-sm border border-border"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground">
            {bouquetLabel(item.bouquetType)} Bouquet
          </h3>
          <p className="text-sm font-body text-muted-foreground mt-1">
            {item.roses} roses · {item.color}
          </p>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="text-muted-foreground hover:text-destructive transition-colors p-1"
          title="Remove"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 text-sm font-body">
        {/* Extras — vertical list with thumbnails */}
        {item.addons.length > 0 && (
          <div>
            <p className="text-muted-foreground mb-2">Extras:</p>
            <div className="space-y-2">
              {item.addons.map((addon, i) => {
                const img = getExtraImage(addon);
                return (
                  <div key={i} className="flex items-center gap-3">
                    {img ? (
                      <img src={img} alt={addon} className="w-10 h-10 object-cover rounded-sm border border-border flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-muted-foreground">✦</span>
                      </div>
                    )}
                    <span className="text-foreground">{addon}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Special text (letters/numbers) */}
        {item.specialText && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-muted-foreground font-bold">AB</span>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Text</p>
              <p className="text-foreground font-semibold">{item.specialText}</p>
            </div>
          </div>
        )}

        {/* Accessory with image */}
        {item.accessory !== "none" && item.accessory !== "" && (
          <div className="flex items-center gap-3">
            {(() => {
              const img = getAccessoryImage(item.accessory);
              return img ? (
                <img src={img} alt={item.accessory} className="w-10 h-10 object-cover rounded-sm border border-border flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {item.accessory === "note" ? "📝" : item.accessory === "card" ? "💌" : "🦋"}
                  </span>
                </div>
              );
            })()}
            <div>
              <p className="text-muted-foreground text-xs">Accessory</p>
              <p className="text-foreground">
                {item.accessory === "note" ? "Note" : item.accessory === "card" ? "Card" : "Butterflies"}
                {item.accessoryText && `: "${item.accessoryText}"`}
              </p>
            </div>
          </div>
        )}

        {/* Ribbon with image */}
        {item.ribbonText && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-muted-foreground">🎀</span>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Ribbon</p>
              <p className="text-foreground">"{item.ribbonText}"</p>
            </div>
          </div>
        )}

        {/* Delivery method */}
        <div className="pt-3 border-t border-border mt-2">
          <p className="text-muted-foreground mb-1">Delivery:</p>
          <p className="text-foreground inline-flex items-center gap-2">
            {item.deliveryMethod === "pickup" ? (
              <><Store className="w-4 h-4" /> Store pickup</>
            ) : (
              <><Truck className="w-4 h-4" /> Home delivery</>
            )}
          </p>
        </div>
      </div>

      {/* Subtotal */}
      <div className="flex justify-end mt-4 pt-3 border-t border-border">
        <div className="text-right">
          <p className="text-sm text-muted-foreground font-body">Item total</p>
          <p className="font-display text-2xl font-bold text-foreground">${parseFloat(item.totalPrice.toFixed(2))}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutOrderItem;
