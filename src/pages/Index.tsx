import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles, Crown } from "lucide-react";
import Navbar from "@/components/Navbar";
import heroBouquet from "@/assets/hero-bouquet.jpg";
import heartBouquet from "@/assets/heart-bouquet.jpg";
import letterBouquet from "@/assets/letter-bouquet.jpg";
import numberBouquet from "@/assets/number-bouquet.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBouquet} alt="Luxury rose bouquet" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-4">
              Bouquets de lujo
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              Rosas que cuentan historias
            </h1>
            <p className="text-primary-foreground/80 font-body text-lg mb-8 leading-relaxed">
              Bouquets artesanales de 50 a 200 rosas. Naturales, pintadas o con brillos. 
              Cada ramo es una obra de arte.
            </p>
            <Link
              to="/bouquets"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm"
            >
              Crear tu bouquet
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Types */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-3">Colección</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Bouquets Especiales
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: heartBouquet, title: "Corazón", desc: "Rosas en forma de corazón, disponible en rosa y rojo", icon: Heart },
              { img: letterBouquet, title: "Con Letras", desc: "Personaliza tu bouquet con las letras que elijas", icon: Sparkles },
              { img: numberBouquet, title: "Con Números", desc: "Celebra fechas especiales con números de rosas", icon: Crown },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <Link to="/bouquets" className="group block">
                  <div className="relative overflow-hidden rounded-sm mb-5 aspect-square">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-xl font-semibold text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground font-body text-sm">{item.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mb-4">
              Desde $76 USD
            </h2>
            <p className="text-primary-foreground/80 font-body mb-8 max-w-md mx-auto">
              Personaliza cada detalle: color, tamaño, accesorios y más.
            </p>
            <Link
              to="/bouquets"
              className="inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-background/90 transition-colors rounded-sm"
            >
              Personalizar ahora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground">
        <div className="container mx-auto px-6 text-center">
          <Heart className="w-6 h-6 text-primary mx-auto mb-3 fill-primary" />
          <p className="font-display text-lg text-primary-foreground mb-2">Bloom & Petal</p>
          <p className="text-primary-foreground/50 font-body text-xs tracking-widest uppercase">
            Bouquets de lujo artesanales
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
