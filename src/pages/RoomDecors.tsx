import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";
import CollectionFAQ, { roomDecorFAQs } from "@/components/CollectionFAQ";
import { roomDecorPackages } from "@/lib/roomDecorData";

const RoomDecors = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title="Room Decoration Miami | Romantic Floral Setup – Charls Flowers" description="Premium romantic room decoration with flowers in Miami. Full setup service. Book your Love Bomb, Overly Romantic or Deluxe Love Package today." path="/room-decors" />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://www.charlsflowers.com" }, { name: "Room Decors", url: "https://www.charlsflowers.com/room-decors" }])} />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Room Decors" }]} />

          <div className="text-center mb-12">
            <p className="font-subtitle-script text-gold text-lg md:text-2xl mb-2">Transform any space</p>
            <h1 className="font-title-retro text-4xl md:text-5xl text-foreground">Room Decoration Miami</h1>
            <p className="text-muted-foreground font-body mt-3 max-w-lg mx-auto">
              Create unforgettable moments with our romantic room decoration packages. Delivery included up to 10 miles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {roomDecorPackages.map((pkg, idx) => (
              <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.15 }}>
                <Link to={`/room-decors/${pkg.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-sm mb-4 aspect-square bg-muted">
                    <img src={pkg.image} alt={`${pkg.name} Miami Room Decoration – Charls Flowers`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
                    {pkg.id === 'rd-deluxe-love' && (
                      <div className="absolute -top-1 -right-1 z-10">
                        <div className="bg-gold text-foreground px-5 py-1.5 rounded-bl-lg rounded-tr-sm font-body text-xs tracking-wider uppercase font-bold shadow-lg">
                          ⭐ Most Popular
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground text-center">{pkg.name}</h3>
                  <p className="text-primary font-body text-sm font-semibold text-center mt-2">From ${pkg.price}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RoomDecors;
