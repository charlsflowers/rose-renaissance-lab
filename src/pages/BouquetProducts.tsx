import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { bouquetProducts, bouquetSizeOptions } from "@/lib/catalogData";
import { ArrowLeft, Sparkles } from "lucide-react";

const BouquetProducts = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>

          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <p className="text-gold font-body text-sm tracking-[0.3em] uppercase">Ramos hechos a mano</p>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">Bouquets</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {bouquetProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                <Link to={`/bouquets/all/${product.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-sm mb-4 aspect-square bg-muted">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-4xl text-muted-foreground/30">🌹</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground text-center">{product.name}</h3>
                  <p className="text-muted-foreground font-body text-xs text-center mt-1">{product.description}</p>
                  <p className="text-primary font-body text-sm font-semibold text-center mt-2">Desde ${bouquetSizeOptions[0].price}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BouquetProducts;
