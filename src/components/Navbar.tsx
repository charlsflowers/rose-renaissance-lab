import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <span className="font-display text-2xl font-semibold text-foreground tracking-wide">
            Bloom & Petal
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 font-body text-sm tracking-widest uppercase text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
          <Link to="/bouquets" className="hover:text-primary transition-colors">Bouquets</Link>
          <Link to="/bouquets" className="hover:text-primary transition-colors">Especiales</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
