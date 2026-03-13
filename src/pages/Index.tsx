import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles, Flower2, Star, Lock, Store, Truck, Globe } from "lucide-react";
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
import purezaBlancaImg from "@/assets/bq-blanco.png";
import roomDecorImg from "@/assets/room-decor.jpg";

const comingSoonSlugs = ["arreglos", "cajas", "cestas", "jarrones", "osos", "room-decors"];

const Index = () => {
  const [reviewCategory, setReviewCategory] = useState<ReviewCategory>("bouquets");
  const categories = [
    { img: purezaBlancaImg, title: "Bouquets", slug: "bouquets", isRoute: true },
    { img: arreglosImg, title: "Arrangements", slug: "arreglos" },
    { img: cajasImg, title: "Boxes", slug: "cajas" },
    { img: cestasImg, title: "Baskets", slug: "cestas" },
    { img: jarronesImg, title: "Vases", slug: "jarrones" },
    { img: ososImg, title: "Bears", slug: "osos" },
    { img: roomDecorImg, title: "Room Decors", slug: "room-decors", isRoute: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] md:h-screen flex items-end md:items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBouquet} alt="Fresh rose bouquet" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-foreground/85 via-foreground/50 to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-6 pb-10 md:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className="text-gold font-body text-xs md:text-sm tracking-[0.3em] uppercase mb-2 md:mb-4">Handcrafted with love</p>
            <h1 className="font-display text-3xl md:text-7xl font-bold text-primary-foreground leading-tight mb-3 md:mb-6">
              Fresh & natural roses
            </h1>
            <p className="text-primary-foreground/80 font-body text-sm md:text-lg mb-5 md:mb-8 leading-relaxed">
              Handmade bouquets from 50 to 200 roses. Natural, painted, or glitter finish.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link to="/bouquets"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 md:px-8 py-3 md:py-4 font-body text-xs md:text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm">
                View bouquets <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
              <Link to="/bouquets/personalizar"
                className="inline-flex items-center justify-center gap-2 border border-primary-foreground/50 text-primary-foreground px-5 md:px-8 py-3 md:py-4 font-body text-xs md:text-sm tracking-widest uppercase hover:bg-primary-foreground/10 transition-colors rounded-sm">
                Build your bouquet <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Shipping Options Bar */}
      <section className="py-5 md:py-6 bg-cream border-y border-primary/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-6 md:gap-12 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="w-4 h-4 text-primary" />
              </div>
              <span className="font-body text-[11px] md:text-xs tracking-wider text-foreground uppercase">Store pickup</span>
            </div>
            <div className="w-px h-6 bg-primary/15 hidden md:block" />
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="w-4 h-4 text-primary" />
              </div>
              <span className="font-body text-[11px] md:text-xs tracking-wider text-foreground uppercase">Home delivery</span>
            </div>
            <div className="w-px h-6 bg-primary/15 hidden md:block" />
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="font-body text-[11px] md:text-xs tracking-wider text-foreground uppercase">Nationwide shipping</span>
                <span className="font-body text-[9px] md:text-[10px] tracking-widest uppercase text-primary-foreground bg-primary px-2 py-0.5 rounded-full">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-10">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary">Categories</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-5">
            {categories.map((item, i) => {
              const isComingSoon = comingSoonSlugs.includes(item.slug);
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  {isComingSoon ? (
                    <div className="block opacity-50 cursor-not-allowed">
                      <div className="relative overflow-hidden rounded-sm mb-4 aspect-square">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover grayscale" />
                        <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
                          <div className="bg-foreground/70 px-3 py-1.5 rounded-sm flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-primary-foreground" />
                            <span className="font-body text-[10px] text-primary-foreground tracking-widest uppercase">Coming Soon</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-muted-foreground text-center uppercase tracking-wide">{item.title}</h3>
                    </div>
                  ) : (
                    <Link to={item.isRoute ? `/${item.slug}` : `/categoria/${item.slug}`} className="group block">
                      <div className="relative overflow-hidden rounded-sm mb-4 aspect-square">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/25 transition-colors" />
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground text-center uppercase tracking-wide">{item.title}</h3>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bouquets */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-10">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary">Bouquets</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-md mx-auto">
            <Link to="/bouquets" className="group block">
              <div className="relative overflow-hidden rounded-sm mb-5 aspect-square">
                <img src={purezaBlancaImg} alt="Bouquets" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 transition-colors" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-display text-xl font-semibold text-foreground uppercase tracking-wide">View Bouquets</h3>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Ticker */}
      <div className="relative mt-[-1px]">
        <div className="absolute -top-[50px] left-0 w-full h-[55px] z-10 overflow-hidden">
          <svg className="h-full animate-wave" style={{ width: "200%", minWidth: "3840px" }} viewBox="0 0 2880 60" preserveAspectRatio="none">
            <path d="M0,60 C360,20 720,50 1080,30 C1440,10 1800,50 2160,25 C2520,5 2880,40 2880,40 L2880,60 Z" fill="hsl(var(--primary))" opacity="0.3" />
            <path d="M0,60 C480,35 960,55 1440,40 C1920,25 2400,50 2880,35 L2880,60 Z" fill="hsl(var(--primary))" opacity="0.55" />
            <path d="M0,60 C320,48 640,56 960,50 C1280,44 1600,54 1920,48 C2240,42 2560,52 2880,46 L2880,60 Z" fill="hsl(var(--primary))" opacity="0.8" />
          </svg>
        </div>
        <div className="bg-primary py-4 overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap will-change-transform"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
            style={{ width: "max-content" }}
          >
            {[...Array(2)].map((_, loop) => (
              <div key={loop} className="flex items-center gap-8 md:gap-12 px-4 md:px-6 shrink-0">
                {[
                  "Best quality-price flower shop in Miami",
                  "Unbeatable prices on fresh roses",
                  "100% handcrafted artisan bouquets",
                  "Same-day delivery in Miami",
                  "From 50 to 200 roses per bouquet",
                  "Natural, painted, or glitter finish flowers",
                ].map((text, i) => (
                  <span key={i} className="font-body text-xs md:text-sm tracking-widest uppercase text-primary-foreground flex items-center gap-8 md:gap-12 shrink-0">
                    {text}
                    <Star className="w-3 h-3 fill-primary-foreground text-primary-foreground shrink-0" />
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
        <div className="absolute -bottom-[50px] left-0 w-full h-[55px] z-10 overflow-hidden">
          <svg className="h-full animate-wave-reverse" style={{ width: "200%", minWidth: "3840px" }} viewBox="0 0 2880 60" preserveAspectRatio="none">
            <path d="M0,0 C360,40 720,10 1080,30 C1440,50 1800,10 2160,35 C2520,55 2880,20 2880,20 L2880,0 Z" fill="hsl(var(--primary))" opacity="0.3" />
            <path d="M0,0 C480,25 960,5 1440,20 C1920,35 2400,10 2880,25 L2880,0 Z" fill="hsl(var(--primary))" opacity="0.55" />
            <path d="M0,0 C320,12 640,4 960,10 C1280,16 1600,6 1920,12 C2240,18 2560,8 2880,14 L2880,0 Z" fill="hsl(var(--primary))" opacity="0.8" />
          </svg>
        </div>
      </div>

      {/* Customize your Bouquet */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary mb-6">
              Customize Your Bouquet
            </h2>
            <p className="text-muted-foreground font-body mb-8 max-w-md mx-auto">
              Create a unique bouquet by choosing color, size, accessories, and more.
            </p>
            <Link to="/bouquets/personalizar"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm">
              Customize <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Client Videos */}
      <ClientVideos />

      {/* Reviews */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-10">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary mb-4">What our customers say</h2>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">Like what you see? Order it directly from here.</p>
          </motion.div>

          <ReviewFilters active={reviewCategory} onChange={setReviewCategory} />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
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
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mb-4">From $76 USD</h2>
            <p className="text-primary-foreground/80 font-body mb-8 max-w-md mx-auto">Customize every detail: color, size, accessories, and more.</p>
            <Link to="/bouquets/personalizar"
              className="inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-background/90 transition-colors rounded-sm">
              Customize now <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground">
        <div className="container mx-auto px-6 text-center">
          <Flower2 className="w-6 h-6 text-primary mx-auto mb-3 fill-primary" />
          <p className="font-display text-lg text-primary-foreground mb-2">Charl's Flowers</p>
          <p className="text-primary-foreground/50 font-body text-xs tracking-widest uppercase">Handmade bouquets with fresh flowers</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
