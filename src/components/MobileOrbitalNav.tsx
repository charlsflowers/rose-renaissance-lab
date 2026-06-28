import { Link } from "@/i18n/LocalizedRouter";
import { useTranslation } from "@/i18n/LanguageContext";
import { useCartStore } from "@/stores/cartStore";
import { Home, Flower2, Sparkles, ShoppingBag } from "lucide-react";

/**
 * Mobile "Orbital" floating bottom nav — fixed at thumb reach.
 *
 * Romuald — Armada SEO 2025, Módulo 12 "Prepara tu web para monetizar" clase 01:
 * la navegación móvil debe maximizar páginas-vistas-por-sesión. Un sidebar en
 * móvil se cae al fondo y nadie clica; por eso se pone un menú flotante FIJO
 * abajo, al alcance del pulgar, para subir los clics internos (estudio propio de
 * más páginas/sesión). Los enlaces de cluster van además dentro del body
 * (ver DynamicClusters), esto es el complemento de navegación fija.
 *
 * Solo móvil (md:hidden). No duplica el carrito del navbar: reutiliza el mismo
 * store del carrito. Nada de checkout/tracking aquí.
 */

const MobileOrbitalNav = () => {
  const { t } = useTranslation();
  const totalItems = useCartStore((s) => s.items.length);
  const setCartOpen = useCartStore((s) => s.setOpen);

  const itemCls =
    "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-foreground/70 hover:text-primary active:text-primary transition-colors";
  const labelCls = "font-body text-[10px] tracking-wide";

  return (
    // z-30 keeps it below the PDP sticky "Order Now" bar (z-40) and the cart
    // sheet (z-50) so those always sit on top when present.
    <nav
      aria-label={t("clusters.quickNav")}
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-stretch">
        <Link to="/" className={itemCls}>
          <Home className="w-5 h-5" strokeWidth={1.8} />
          <span className={labelCls}>{t("nav.home")}</span>
        </Link>
        <Link to="/bouquets" className={itemCls}>
          <Flower2 className="w-5 h-5" strokeWidth={1.8} />
          <span className={labelCls}>{t("nav.bouquets")}</span>
        </Link>
        <Link to="/bouquets/personalizar" className={itemCls}>
          <Sparkles className="w-5 h-5" strokeWidth={1.8} />
          <span className={labelCls}>{t("nav.customBouquets")}</span>
        </Link>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label={t("floatingCart.yourCart")}
          className={`${itemCls} relative`}
        >
          <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />
          {totalItems > 0 && (
            <span className="absolute top-1 right-[calc(50%-1.1rem)] bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span className={labelCls}>{t("floatingCart.yourCart")}</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileOrbitalNav;
