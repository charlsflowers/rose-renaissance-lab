import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <BrandLogo className="w-8 h-8" />
          <span className="font-display text-2xl font-semibold text-foreground tracking-wide">
            Bloom & Petal
          </span>
        </Link>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8 font-body text-sm tracking-widest uppercase text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
            <Link to="/bouquets" className="hover:text-primary transition-colors">Bouquets</Link>
            <Link to="/bouquets" className="hover:text-primary transition-colors">Especiales</Link>
          </div>
          <Link to="/checkout" className="relative hover:text-primary transition-colors text-foreground">
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-body font-semibold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
