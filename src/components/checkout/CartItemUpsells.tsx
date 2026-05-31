import { useEffect, useState } from "react";
import { Plus, Check, X, ArrowUpCircle } from "lucide-react";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import { GLITTER_VARIANTS } from "@/lib/accessoryVariants";
import { useTranslation } from "@/i18n/LanguageContext";
import { toast } from "sonner";
import { fetchVariantsByHandle, findVariantByRoses, type ShopifyHandleVariant } from "@/lib/shopifyVariants";
import { getNotePrice, getButterflyPrice } from "@/lib/shopifyAccessoryPrices";
import glitterRoseImg from "@/assets/glitter-rose.webp";
import butterflyImg from "@/assets/butterfly-gold.webp";
import noteImg from "@/assets/accessory-note.webp";

interface Props {
  item: CartItem;
}

const ROSE_TIERS = [50, 75, 100, 125, 150, 175, 200] as const;

// Module-level cache so we don't refetch variants for the same handle
// every time the drawer opens.
const variantsByHandleCache = new Map<string, ShopifyHandleVariant[]>();

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
  const [upgradeClicked, setUpgradeClicked] = useState(false);
  const [siblingVariants, setSiblingVariants] = useState<ShopifyHandleVariant[] | null>(
    item.shopifyHandle ? variantsByHandleCache.get(item.shopifyHandle) ?? null : null,
  );
  const [notePrice, setNotePrice] = useState<number | null>(null);
  const [butterflyPrice, setButterflyPrice] = useState<number | null>(null);

  // Only for bouquet products (skip room decors / coming-soon items / Mother's Day bundle).
  const isBouquet =
    !!item.shopifyVariantId &&
    !!item.bouquetType &&
    !item.isMothersDay;

  // Lazy-load sibling size variants for the size-upgrade button.
  useEffect(() => {
    if (!isBouquet || !item.shopifyHandle || siblingVariants) return;
    let cancelled = false;
    fetchVariantsByHandle(item.shopifyHandle)
      .then((variants) => {
        if (cancelled) return;
        variantsByHandleCache.set(item.shopifyHandle!, variants);
        setSiblingVariants(variants);
      })
      .catch(() => { /* silently ignore — upgrade just won't show */ });
    return () => { cancelled = true; };
  }, [isBouquet, item.shopifyHandle, siblingVariants]);

  // Fetch live Shopify prices for Note / Butterfly accessories.
  useEffect(() => {
    if (!isBouquet) return;
    let cancelled = false;
    getNotePrice().then((p) => { if (!cancelled && p) setNotePrice(p.amount); });
    getButterflyPrice().then((p) => { if (!cancelled && p) setButterflyPrice(p.amount); });
    return () => { cancelled = true; };
  }, [isBouquet]);

  if (!isBouquet) return null;

  const hasGlitter = !!item.glitter;
  // Note and butterflies are now INDEPENDENT — picking one no longer hides the other.
  // - Note uses the dedicated `accessory` slot (it carries the text).
  // - Butterfly is pushed into `addons` (same convention as the product page).
  const hasNote = item.accessory === "note";
  const hasButterfly =
    item.accessory === "butterfly" ||
    (item.addons?.some((a) => a.toLowerCase().includes("butterfl")) ?? false);

  const glitterAvailable = !!GLITTER_VARIANTS[item.roses];
  const glitterCost = Math.ceil(item.roses / 25) * 8;

  const canShowGlitter = !hasGlitter && glitterAvailable;
  const canShowNote = !hasNote;
  const canShowButterfly = !hasButterfly;

  // Size upgrade: only if we know the sibling variants and there is a next tier
  // with a real variant available.
  const currentTierIdx = ROSE_TIERS.indexOf(item.roses as typeof ROSE_TIERS[number]);
  const nextRoses = currentTierIdx >= 0 && currentTierIdx < ROSE_TIERS.length - 1
    ? ROSE_TIERS[currentTierIdx + 1]
    : null;
  const nextVariant = nextRoses && siblingVariants ? findVariantByRoses(siblingVariants, nextRoses) : null;
  const currentVariant = siblingVariants ? findVariantByRoses(siblingVariants, item.roses) : null;
  const currentVariantPrice = currentVariant?.price?.amount ? parseFloat(currentVariant.price.amount) : null;
  const nextVariantPrice = nextVariant?.price?.amount ? parseFloat(nextVariant.price.amount) : null;
  const upgradeDelta =
    currentVariantPrice !== null && nextVariantPrice !== null
      ? Math.max(0, parseFloat((nextVariantPrice - currentVariantPrice).toFixed(2)))
      : null;
  const canShowUpgrade =
    !!nextVariant && upgradeDelta !== null && nextVariantPrice !== null;

  if (!canShowGlitter && !canShowNote && !canShowButterfly && !canShowUpgrade) return null;

  const labels = {
    title: language === "es" ? "Añade un detalle a este ramo" : "Add an extra to this bouquet",
    glitter: language === "es" ? "Acabado Glitter" : "Glitter Finish",
    notes: language === "es" ? "Tarjeta con nota" : "Card with note",
    butterflies: language === "es" ? "Mariposas doradas" : "Gold butterflies",
    upgrade: language === "es" ? `Subir a ${nextRoses} rosas` : `Upgrade to ${nextRoses} roses`,
    upgradeBadge: language === "es" ? "Mejor valor" : "Better value",
    recommended: language === "es" ? "Recomendado" : "Recommended",
    free: language === "es" ? "Gratis" : "Free",
    add: language === "es" ? "Añadir" : "Add",
    save: language === "es" ? "Guardar nota" : "Save note",
    cancel: language === "es" ? "Cancelar" : "Cancel",
    placeholder: language === "es" ? "Escribe el mensaje que irá en la nota..." : "Write the message for the note...",
    added: language === "es" ? "Añadido a este ramo" : "Added to this bouquet",
    upgraded: language === "es" ? "Tamaño actualizado" : "Size upgraded",
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
    const currentAddons = item.addons ?? [];
    if (currentAddons.some((a) => a.toLowerCase().includes("butterfl"))) return;
    const cost = butterflyPrice ?? 0;
    updateItem(item.id, {
      addons: [...currentAddons, "Butterflies"],
      price: parseFloat((item.price + cost).toFixed(2)),
      totalPrice: parseFloat((item.totalPrice + cost).toFixed(2)),
    });
    toast.success(`${labels.butterflies} — ${labels.added}`);
  };

  const handleSaveNote = () => {
    const trimmed = noteText.trim();
    if (!trimmed) return;
    // If the note wasn't already added, add its price too.
    const wasAlreadyNote = item.accessory === "note";
    const cost = wasAlreadyNote ? 0 : (notePrice ?? 0);
    updateItem(item.id, {
      accessory: "note",
      accessoryText: trimmed,
      price: parseFloat((item.price + cost).toFixed(2)),
      totalPrice: parseFloat((item.totalPrice + cost).toFixed(2)),
    });
    setNoteOpen(false);
    toast.success(`${labels.notes} — ${labels.added}`);
  };

  const handleUpgrade = () => {
    if (!nextVariant || nextVariantPrice === null || !nextRoses) return;
    // Recompute glitter cost if the item already has glitter, since glitter
    // price scales with roses count.
    const oldGlitterCost = item.glitter ? Math.ceil(item.roses / 25) * 8 : 0;
    const newGlitterCost = item.glitter ? Math.ceil(nextRoses / 25) * 8 : 0;
    const newPrice = parseFloat((nextVariantPrice + newGlitterCost).toFixed(2));
    const totalDelta = newPrice - item.price;
    updateItem(item.id, {
      roses: nextRoses,
      shopifyVariantId: nextVariant.id,
      price: newPrice,
      totalPrice: parseFloat((item.totalPrice + totalDelta).toFixed(2)),
    });
    toast.success(`${labels.upgraded} — ${nextRoses} ${language === "es" ? "rosas" : "roses"}`);
  };

  return (
    <div className="mt-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-2">
      <p className="text-[10px] font-body font-semibold text-primary mb-2 uppercase tracking-wider">
        + {labels.title}
      </p>
      <div className="flex flex-col gap-1.5">
        {canShowUpgrade && !upgradeClicked && (
          <button
            type="button"
            onClick={handleUpgrade}
            className="relative w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-card border border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors text-left"
          >
            <span className="absolute -top-2.5 right-3 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-body font-semibold uppercase tracking-wider leading-none shadow-sm">
              {labels.recommended}
            </span>
            <ArrowUpCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="flex-1 text-xs font-body text-foreground">
              {labels.upgrade}
              <span className="ml-1.5 text-[9px] uppercase tracking-wider font-semibold text-primary/80">
                {labels.upgradeBadge}
              </span>
            </span>
            <span className="text-xs font-body font-semibold text-primary">+${upgradeDelta}</span>
            <Plus className="w-3.5 h-3.5 text-primary" />
          </button>
        )}

        {canShowGlitter && (
          <button
            type="button"
            onClick={handleAddGlitter}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-card border border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors text-left"
          >
            <img src={glitterRoseImg} alt="" className="w-7 h-7 object-contain flex-shrink-0" />
            <span className="flex-1 text-xs font-body text-foreground">{labels.glitter}</span>
            <span className="text-xs font-body font-semibold text-primary">+${glitterCost}</span>
            <Plus className="w-3.5 h-3.5 text-primary" />
          </button>
        )}

        {canShowNote && !noteOpen && (
          <button
            type="button"
            onClick={() => setNoteOpen(true)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-card border border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors text-left"
          >
            <img src={noteImg} alt="" className="w-7 h-7 object-contain rounded flex-shrink-0" />
            <span className="flex-1 text-xs font-body text-foreground">{labels.notes}</span>
            {notePrice !== null && (
              <span className="text-xs font-body font-semibold text-primary">
                +${notePrice.toFixed(2)}
              </span>
            )}
            <Plus className="w-3.5 h-3.5 text-primary" />
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
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-card border border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors text-left"
          >
            <img src={butterflyImg} alt="" className="w-7 h-7 object-contain flex-shrink-0" />
            <span className="flex-1 text-xs font-body text-foreground">{labels.butterflies}</span>
            {butterflyPrice !== null && (
              <span className="text-xs font-body font-semibold text-primary">
                +${butterflyPrice.toFixed(2)}
              </span>
            )}
            <Plus className="w-3.5 h-3.5 text-primary" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CartItemUpsells;