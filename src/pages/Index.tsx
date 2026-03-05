import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles, Flower2, Star } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";
import type { ReviewCategory } from "@/components/ReviewCard";
import ReviewFilters from "@/components/ReviewFilters";
import { reviews } from "@/lib/reviewsData";
import Navbar from "@/components/Navbar";
import ClientVideos from "@/components/ClientVideos";
import heroBouquet from "@/assets/hero-bouquet.jpg";
import arreglosImg from "@/assets/arreglos.jpg";
import cajasImg from "@/assets/cajas.jpg";
import cestasImg from "@/assets/cestas.jpg";
import jarronesImg from "@/assets/jarrones.jpg";
import ososImg from "@/assets/osos.jpg";
import heartBouquet from "@/assets/heart-bouquet.jpg";


const Index = () => {
  const [reviewCategory, setReviewCategory] = useState<ReviewCategory>("bouquets");
  const categories = [
    { img: heartBouquet, title: "Bouquets", slug: "bouquets", isRoute: true },
    { img: arreglosImg, title: "Arreglos", slug: "arreglos" },
    { img: cajasImg, title: "Cajas", slug: "cajas" },
    { img: cestasImg, title: "Cestas", slug: "cestas" },
    { img: jarronesImg, title: "Jarrones", slug: "jarrones" },
    { img: ososImg, title: "Osos", slug: "osos" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBouquet} alt="Bouquet de rosas frescas" className="w-full h-full object-cover object-center max-sm:object-[70%_center]" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-4">Hechos a mano con amor</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              Rosas frescas y naturales
            </h1>
            <p className="text-primary-foreground/80 font-body text-lg mb-8 leading-relaxed">
              Bouquets hechos a mano de 50 a 200 rosas. Naturales, pintadas o con brillos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/bouquets"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm">
                Ver bouquets <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/bouquets/personalizar"
                className="inline-flex items-center gap-3 border border-primary-foreground/50 text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary-foreground/10 transition-colors rounded-sm">
                Crea tu bouquet <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary">Categorías</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-5">
            {categories.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Link to={item.isRoute ? `/${item.slug}` : `/categoria/${item.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-sm mb-4 aspect-square">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/25 transition-colors" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground text-center uppercase tracking-wide">{item.title}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bouquets */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary">Bouquets</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-md mx-auto">
            <Link to="/bouquets" className="group block">
              <div className="relative overflow-hidden rounded-sm mb-5 aspect-square">
                <img src={heartBouquet} alt="Bouquets" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 transition-colors" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-display text-xl font-semibold text-foreground uppercase tracking-wide">Ver Bouquets</h3>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Ticker */}
      <div className="relative mt-[-1px]">
        <div className="absolute -top-[14px] left-0 w-[200%] h-4 z-10 overflow-hidden">
          <motion.svg
            className="w-full h-full text-primary"
            viewBox="0 0 2880 24"
            preserveAspectRatio="none"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
          >
            <path d="M0,24 C120,4 240,4 360,24 C480,44 600,4 720,24 C840,4 960,4 1080,24 C1200,44 1320,4 1440,24 C1560,4 1680,4 1800,24 C1920,44 2040,4 2160,24 C2280,4 2400,4 2520,24 C2640,44 2760,4 2880,24 L2880,24 L0,24 Z" fill="currentColor" />
          </motion.svg>
        </div>
        <div className="bg-primary py-4 overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 15, ease: "linear", repeat: Infinity }}
          >
            {[...Array(2)].map((_, loop) => (
              <div key={loop} className="flex items-center gap-12 px-6">
                {[
                  "La mejor florería calidad-precio de Miami",
                  "Precios imbatibles en rosas frescas",
                  "Ramos 100% artesanales hechos a mano",
                  "Entrega el mismo día en Miami",
                  "De 50 a 200 rosas por bouquet",
                  "Flores naturales, pintadas o con brillos",
                ].map((text, i) => (
                  <span key={i} className="font-body text-sm tracking-widest uppercase text-primary-foreground flex items-center gap-12">
                    {text}
                    <Star className="w-3 h-3 fill-primary-foreground text-primary-foreground" />
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
        <div className="absolute -bottom-[14px] left-0 w-[200%] h-4 z-10 overflow-hidden">
          <motion.svg
            className="w-full h-full text-primary"
            viewBox="0 0 2880 24"
            preserveAspectRatio="none"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
          >
            <path d="M0,0 C120,20 240,20 360,0 C480,-20 600,20 720,0 C840,20 960,20 1080,0 C1200,-20 1320,20 1440,0 C1560,20 1680,20 1800,0 C1920,-20 2040,20 2160,0 C2280,20 2400,20 2520,0 C2640,-20 2760,20 2880,0 L2880,0 L0,0 Z" fill="currentColor" />
          </motion.svg>
        </div>
      </div>

      {/* Personaliza tu Bouquet */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary mb-6">
              Personaliza tu Bouquet
            </h2>
            <p className="text-muted-foreground font-body mb-8 max-w-md mx-auto">
              Crea un ramo único eligiendo color, tamaño, accesorios y más.
            </p>
            <Link to="/bouquets/personalizar"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm">
              Personalizar <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Videos de clientes */}
      <ClientVideos />

      {/* Reseñas */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">¿Te gusta alguno? Pídelo directamente desde aquí.</p>
          </motion.div>

          <ReviewFilters active={reviewCategory} onChange={setReviewCategory} />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {reviews.filter((r) => r.category === reviewCategory).map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mb-4">Desde $76 USD</h2>
            <p className="text-primary-foreground/80 font-body mb-8 max-w-md mx-auto">Personaliza cada detalle: color, tamaño, accesorios y más.</p>
            <Link to="/bouquets/personalizar"
              className="inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-background/90 transition-colors rounded-sm">
              Personalizar ahora <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground">
        <div className="container mx-auto px-6 text-center">
          <Flower2 className="w-6 h-6 text-primary mx-auto mb-3 fill-primary" />
          <p className="font-display text-lg text-primary-foreground mb-2">Charl's Flowers</p>
          <p className="text-primary-foreground/50 font-body text-xs tracking-widest uppercase">Ramos hechos a mano con flores frescas</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
