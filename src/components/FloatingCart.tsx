import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import BrandLogo from "@/components/BrandLogo";
import { motion, AnimatePresence } from "framer-motion";

const FloatingCart = () => {
  const items = useCartStore(state => state.items);
  const totalItems = items.length;
  const cartTotal = items.reduce((sum, i) => sum + i.totalPrice, 0);

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Link
            to="/checkout"
            className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-2xl hover:bg-primary/90 transition-colors font-body"
          >
            <BrandLogo className="w-6 h-6" color="hsl(var(--primary-foreground))" />
            <span className="text-sm font-semibold">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
            <span className="bg-primary-foreground/20 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
              ${parseFloat(cartTotal.toFixed(2))}
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCart;
