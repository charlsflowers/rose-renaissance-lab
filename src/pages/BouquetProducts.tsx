import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { bouquetProducts, bouquetSizeOptions } from "@/lib/catalogData";
import { ArrowLeft, Sparkles } from "lucide-react";

type FilterType = "un-color" | "mezclas";

const BouquetProducts = () => {
  const [filter, setFilter] = useState<FilterType>("un-color");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filteredProducts = bouquetProducts.filter((product) => {
    // Check both "y" and "," and " y " to be sure it captures all mixes
    const isMix = product.color.includes(" y ") || product.color.includes(", ") || product.color.includes(" y");
    return filter === "mezclas" ? isMix : !isMix;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <p className="text-gold font-body text-sm tracking-[0.3em] uppercase">Ramos hechos a mano</p>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">Bouquets</h1>
          </div>

          <div className="flex justify-center gap-3 mb-12">
            {([
              { key: "un-color", label: "Un solo color" },
              { key: "mezclas", label: "Mezclas" },
            ] as { key: FilterType; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-5 py-2 rounded-full font-body text-sm transition-all ${
                  filter === key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
            {filteredProducts.map((product) => (
              <div key={product.id}>
                <Link to={`/bouquets/all/${product.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-sm mb-4 aspect-square bg-muted">
                    {product.image ? (
                      <>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className={`w-full h-full object-cover transition-all duration-700 ${product.image2 ? 'group-hover:opacity-0 md:group-hover:scale-105' : 'group-hover:scale-105'}`} 
                        />
                        {product.image2 && (
                          <img 
                            src={product.image2} 
                            alt={`${product.name} - vista alternativa`} 
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 md:group-hover:scale-105 hidden md:block" 
                          />
                        )}
                      </>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BouquetProducts;