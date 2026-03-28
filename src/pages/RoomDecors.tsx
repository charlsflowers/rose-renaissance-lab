import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { roomDecorPackages } from "@/lib/roomDecorData";
import { ArrowLeft } from "lucide-react";
import roomDecorImg from "@/assets/room-decor.jpg";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground font-body text-sm hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <div className="text-center mb-12">
            <p className="font-subtitle-script text-gold text-lg md:text-2xl mb-2">Transform any space</p>
            <h1 className="font-title-retro text-4xl md:text-5xl text-foreground">Room Decors</h1>
            <p className="text-muted-foreground font-body mt-3 max-w-lg mx-auto">
              Create unforgettable moments with our romantic room decoration packages. Delivery included up to 10 miles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {roomDecorPackages.map((pkg, idx) => {
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                >
                  <Link to={`/room-decors/${pkg.id}`} className="group block">
                    <div className="relative overflow-hidden rounded-sm mb-4 aspect-square bg-muted">
                      <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
                      {pkg.id === 'rd-deluxe-love' && (
                        <div className="absolute top-0 right-0 overflow-hidden w-28 h-28">
                          <div className="absolute top-4 -right-6 rotate-45 bg-primary text-primary-foreground py-1 w-40 text-center font-body text-[10px] tracking-wider uppercase font-semibold shadow-md">
                            Most Popular
                          </div>
                        </div>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground text-center">{pkg.name}</h3>
                    <p className="text-muted-foreground font-body text-xs text-center mt-1 line-clamp-2">{pkg.description}</p>
                    <p className="text-primary font-body text-sm font-semibold text-center mt-2">From ${pkg.price}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDecors;
