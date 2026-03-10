import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import BrandLogo from "@/components/BrandLogo";
import charlsLogo from "@/assets/charls-logo.png";
import { Menu, X } from "lucide-react";

const comingSoonSlugs = ["arreglos", "cajas", "cestas", "jarrones", "osos", "room-decors"];

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/bouquets", label: "Bouquets" },
  { to: "/bouquets/personalizar", label: "Customize" },
  { to: "/categoria/arreglos", label: "Arrangements", slug: "arreglos" },
  { to: "/categoria/cajas", label: "Boxes", slug: "cajas" },
  { to: "/categoria/cestas", label: "Baskets", slug: "cestas" },
  { to: "/categoria/jarrones", label: "Vases", slug: "jarrones" },
  { to: "/categoria/osos", label: "Bears", slug: "osos" },
];

const Navbar = () => {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between relative">
        {/* Mobile: hamburger left */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-foreground hover:text-primary transition-colors"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop: logo left */}
        <Link to="/" className="hidden lg:flex items-center gap-2">
          <img src={charlsLogo} alt="Charl's Flowers" className="h-10 w-auto" />
        </Link>

        {/* Mobile/Tablet: logo center */}
        <Link to="/" className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center">
          <img src={charlsLogo} alt="Charl's Flowers" className="h-10 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 font-body text-xs tracking-widest uppercase text-muted-foreground">
          {navLinks.map((link) => {
            const isLocked = link.slug && comingSoonSlugs.includes(link.slug);
            if (isLocked) {
              return (
                <span key={link.to} className="text-muted-foreground/40 cursor-not-allowed whitespace-nowrap">
                  {link.label}
                </span>
              );
            }
            return (
              <Link key={link.to} to={link.to} className="hover:text-primary transition-colors whitespace-nowrap">
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Cart: right */}
        <Link to="/checkout" className="relative hover:text-primary transition-colors text-foreground">
          <BrandLogo className="w-7 h-7" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-body font-semibold">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-3 font-body text-sm tracking-widest uppercase text-muted-foreground">
            {navLinks.map((link) => {
              const isLocked = link.slug && comingSoonSlugs.includes(link.slug);
              if (isLocked) {
                return (
                  <span
                    key={link.to}
                    className="text-muted-foreground/40 cursor-not-allowed py-2 border-b border-border last:border-b-0"
                  >
                    {link.label}
                  </span>
                );
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="hover:text-primary transition-colors py-2 border-b border-border last:border-b-0"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
