import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingCart = () => {
  const { totalItems, cartTotal } = useCart();

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
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm font-semibold">
              {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
            </span>
            <span className="bg-primary-foreground/20 px-3 py-1 rounded-full text-sm font-bold">
              ${cartTotal}
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCart;
