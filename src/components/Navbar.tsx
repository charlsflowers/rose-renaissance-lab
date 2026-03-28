import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import BrandLogo from "@/components/BrandLogo";
import charlsLogo from "@/assets/charls-logo.png";
import { Menu, X, ChevronDown } from "lucide-react";

const bouquetSubLinks = [
  { to: "/bouquets", label: "All Bouquets", active: true },
  { to: "/bouquets", label: "Single Color Bouquets", active: true, filter: "un-color" },
  { to: "/bouquets", label: "Mixed Bouquets", active: true, filter: "mezclas" },
  { to: "/bouquets", label: "Zodiac Bouquets", active: true, filter: "zodiac" },
  { label: "Anniversaries", active: false },
  { label: "Birthday Bouquets", active: false },
  { label: "Baby Shower Bouquets", active: false },
  { label: "Valentine's Day Flowers", active: false },
  { label: "Wedding Bouquets", active: false },
];

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/bouquets", label: "Bouquets", hasDropdown: true },
  { to: "/bouquets/personalizar", label: "Custom Bouquets" },
  { to: "/room-decors", label: "Room Decors" },
  { to: "/delivery", label: "Delivery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
];

const Navbar = () => {
  const totalItems = useCartStore(state => state.items.length);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bouquetDropdownOpen, setBouquetDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between relative">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-foreground hover:text-primary transition-colors">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <Link to="/" className="hidden lg:flex items-center gap-2">
          <img src={charlsLogo} alt="Charls Flowers Miami – Premium Handcrafted Bouquets" className="h-10 w-auto" />
        </Link>

        <Link to="/" className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center">
          <img src={charlsLogo} alt="Charls Flowers Miami" className="h-10 w-auto" />
        </Link>

        <div className="hidden lg:flex items-center gap-5 font-body text-xs tracking-widest uppercase text-muted-foreground">
          {navLinks.map((link) => (
            link.hasDropdown ? (
              <div key={link.to} className="relative" onMouseEnter={() => setBouquetDropdownOpen(true)} onMouseLeave={() => setBouquetDropdownOpen(false)}>
                <Link to={link.to} className="hover:text-primary transition-colors whitespace-nowrap inline-flex items-center gap-1">
                  {link.label} <ChevronDown className="w-3 h-3" />
                </Link>
                {bouquetDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-sm shadow-lg py-2 min-w-[220px] z-50">
                    {bouquetSubLinks.map((sub, i) => (
                      sub.active ? (
                        <Link key={i} to={sub.to || "#"} className="block px-4 py-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-primary hover:bg-cream/50 transition-colors" onClick={() => setBouquetDropdownOpen(false)}>
                          {sub.label}
                        </Link>
                      ) : (
                        <span key={i} className="block px-4 py-2 text-xs tracking-widest uppercase text-muted-foreground/40 cursor-not-allowed">
                          {sub.label} <span className="text-[9px] normal-case">coming soon</span>
                        </span>
                      )
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.to} to={link.to!} className="hover:text-primary transition-colors whitespace-nowrap">
                {link.label}
              </Link>
            )
          ))}
        </div>

        <Link to="/checkout" className="relative hover:text-primary transition-colors text-foreground">
          <BrandLogo className="w-7 h-7" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-body font-semibold">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-3 font-body text-sm tracking-widest uppercase text-muted-foreground">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to!} onClick={() => setMobileOpen(false)} className="hover:text-primary transition-colors py-2 border-b border-border last:border-b-0">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
