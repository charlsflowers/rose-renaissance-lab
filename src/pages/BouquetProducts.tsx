import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { bouquetProducts, bouquetSizeOptions } from "@/lib/catalogData";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";

const BouquetProducts = () => {
  const { type } = useParams<{ type: string }>();
  const isHeart = type === "corazones";
  const filtered = bouquetProducts.filter((b) => isHeart ? b.type === "heart" : b.type === "round");
  const title = isHeart ? "Corazones" : "Redondos";
  const description = isHeart ? "Bouquets en forma de corazón" : "Bouquets redondos clásicos";

  if (!["redondos", "corazones"].includes(type || "")) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground font-body">Tipo no encontrado</p>
          <Link to="/" className="text-primary font-body underline mt-4 inline-block">Volver</Link>
        </div>
      </div>
    );
  }

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
              {isHeart ? <Heart className="w-5 h-5 text-primary" /> : <Sparkles className="w-5 h-5 text-primary" />}
              <p className="text-gold font-body text-sm tracking-[0.3em] uppercase">{description}</p>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">{title}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {filtered.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Link to={`/bouquets/${type}/${product.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-sm mb-4 aspect-square bg-muted">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-4xl text-muted-foreground/30">{isHeart ? "💐" : "🌹"}</span>
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
