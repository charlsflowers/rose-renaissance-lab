import { useState } from "react";
import { Sparkles, StickyNote, Bug, Plus, Check, X } from "lucide-react";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import { GLITTER_VARIANTS } from "@/lib/accessoryVariants";
import { useTranslation } from "@/i18n/LanguageContext";
import { toast } from "sonner";

interface Props {
  item: CartItem;
}

/**
 * Per-bouquet upsells shown in the cart:
 *  - Glitter Finish (paid, depends on roses)
 *  - Notes (free, with text)
 *  - Butterflies (free)
 *
 * Updates the cart item in-place. The checkout flow (Checkout.tsx and
 * FloatingCart) reads item.glitter / item.accessory / item.accessoryText,
 * so the upsell is sent to Shopify exactly the same way as if the user
 * had picked it on the product page.
 */
const CartItemUpsells = ({ item }: Props) => {
  const { t, language } = useTranslation();
  const updateItem = useCartStore((s) => s.updateItem);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(item.accessoryText || "");

  // Only for bouquet products (skip room decors / coming-soon items / Mother's Day bundle).
  const isBouquet =
    !!item.shopifyVariantId &&
    !!item.bouquetType &&
    !item.isMothersDay;
  if (!isBouquet) return null;

  const hasGlitter = !!item.glitter;
  const hasAccessory = item.accessory && item.accessory !== "none" && item.accessory !== "";
  const hasNote = item.accessory === "note";
  const hasButterfly = item.accessory === "butterfly";

  const glitterAvailable = !!GLITTER_VARIANTS[item.roses];
  const glitterCost = Math.ceil(item.roses / 25) * 8;

  const canShowGlitter = !hasGlitter && glitterAvailable;
  // Accessory is a single slot — only offer if it's still free.
  const canShowNote = !hasAccessory;
  const canShowButterfly = !hasAccessory;

  if (!canShowGlitter && !canShowNote && !canShowButterfly) return null;

  const labels = {
    title: language === "es" ? "Añade un detalle a este ramo" : "Add an extra to this bouquet",
    glitter: language === "es" ? "Acabado Glitter" : "Glitter Finish",
    notes: language === "es" ? "Tarjeta con nota" : "Card with note",
    butterflies: language === "es" ? "Mariposas doradas" : "Gold butterflies",
    free: language === "es" ? "Gratis" : "Free",
    add: language === "es" ? "Añadir" : "Add",
    save: language === "es" ? "Guardar nota" : "Save note",
    cancel: language === "es" ? "Cancelar" : "Cancel",
    placeholder: language === "es" ? "Escribe el mensaje que irá en la nota..." : "Write the message for the note...",
    added: language === "es" ? "Añadido a este ramo" : "Added to this bouquet",
  };

  const handleAddGlitter = () => {
    updateItem(item.id, {
      glitter: true,
      price: parseFloat((item.price + glitterCost).toFixed(2)),
      totalPrice: parseFloat((item.totalPrice + glitterCost).toFixed(2)),
    });
    toast.success(`${labels.glitter} — ${labels.added}`);
  };

  const handleAddButterfly = () => {
    updateItem(item.id, {
      accessory: "butterfly",
      accessoryText: "",
    });
    toast.success(`${labels.butterflies} — ${labels.added}`);
  };

  const handleSaveNote = () => {
    const trimmed = noteText.trim();
    if (!trimmed) return;
    updateItem(item.id, {
      accessory: "note",
      accessoryText: trimmed,
    });
    setNoteOpen(false);
    toast.success(`${labels.notes} — ${labels.added}`);
  };

  return (
    <div className="mt-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
      <p className="text-xs font-body font-semibold text-primary mb-3 uppercase tracking-wider">
        + {labels.title}
      </p>
      <div className="flex flex-col gap-2">
        {canShowGlitter && (
          <button
            type="button"
            onClick={handleAddGlitter}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-card border border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors text-left"
          >
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="flex-1 text-sm font-body text-foreground">{labels.glitter}</span>
            <span className="text-sm font-body font-semibold text-primary">+${glitterCost}</span>
            <Plus className="w-4 h-4 text-primary" />
          </button>
        )}

        {canShowNote && !noteOpen && (
          <button
            type="button"
            onClick={() => setNoteOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-card border border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors text-left"
          >
            <StickyNote className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="flex-1 text-sm font-body text-foreground">{labels.notes}</span>
            <span className="text-xs font-body text-muted-foreground">{labels.free}</span>
            <Plus className="w-4 h-4 text-primary" />
          </button>
        )}

        {canShowNote && noteOpen && (
          <div className="rounded-md bg-card border border-primary/40 p-3">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={labels.placeholder}
              maxLength={500}
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px] resize-none"
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button
                type="button"
                onClick={() => { setNoteOpen(false); setNoteText(item.accessoryText || ""); }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-body text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" /> {labels.cancel}
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={!noteText.trim()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-body bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Check className="w-3 h-3" /> {labels.save}
              </button>
            </div>
          </div>
        )}

        {canShowButterfly && (
          <button
            type="button"
            onClick={handleAddButterfly}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-card border border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors text-left"
          >
            <Bug className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="flex-1 text-sm font-body text-foreground">{labels.butterflies}</span>
            <span className="text-xs font-body text-muted-foreground">{labels.free}</span>
            <Plus className="w-4 h-4 text-primary" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CartItemUpsells;