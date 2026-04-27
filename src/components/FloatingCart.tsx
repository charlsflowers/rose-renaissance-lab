import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import BrandLogo from "@/components/BrandLogo";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Trash2 } from "lucide-react";
import PaymentIcons from "@/components/PaymentIcons";

const FloatingCart = () => {
  const { t } = useTranslation();
  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const isLoading = useCartStore(state => state.isLoading);
  const open = useCartStore(state => state.isOpen);
  const setOpen = useCartStore(state => state.setOpen);
  const totalItems = items.length;
  const cartTotal = items.reduce((sum, i) => sum + i.totalPrice, 0);

  return (
    <>
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-2xl hover:bg-primary/90 transition-colors font-body"
            >
              <BrandLogo className="w-6 h-6" color="hsl(var(--primary-foreground))" />
              <span className="text-sm font-semibold whitespace-nowrap">
                {totalItems} {totalItems === 1 ? t("floatingCart.item") : t("floatingCart.items")}
              </span>
              <span className="bg-primary-foreground/20 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                ${parseFloat(cartTotal.toFixed(2))}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="font-display text-xl text-foreground">
              {t("floatingCart.yourCart")} ({totalItems})
            </SheetTitle>
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
                          onClick={() => removeItem(item.id)}
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
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-muted-foreground">
                  {t("floatingCart.subtotal")}
                </span>
                <span className="font-display text-lg font-semibold text-foreground">
                  ${parseFloat(cartTotal.toFixed(2))}
                </span>
              </div>
              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-primary text-primary-foreground py-3 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
              >
                {t("floatingCart.viewCart")}
              </Link>
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