import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles, Flower2, Star } from "lucide-react";
import ReviewCard, { type ReviewData } from "@/components/ReviewCard";
import Navbar from "@/components/Navbar";
import heroBouquet from "@/assets/hero-bouquet.jpg";
import arreglosImg from "@/assets/arreglos.jpg";
import cajasImg from "@/assets/cajas.jpg";
import cestasImg from "@/assets/cestas.jpg";
import jarronesImg from "@/assets/jarrones.jpg";
import ososImg from "@/assets/osos.jpg";
import heartBouquet from "@/assets/heart-bouquet.jpg";
import numberBouquet from "@/assets/number-bouquet.jpg";

const Index = () => {
  const reviews: ReviewData[] = [
    {
      id: 'rev-1',
      name: 'María G.',
      rating: 5,
      text: 'Pedí un bouquet de 100 rosas rojas y blancas para mi aniversario. ¡Quedó espectacular! Mi esposa lloró de la emoción.',
      image: '/placeholder.svg',
      productLink: '/bouquets/redondos/bq-round-1',
      productLabel: 'Elegancia Roja y Blanca',
    },
    {
      id: 'rev-2',
      name: 'Carlos R.',
      rating: 5,
      text: 'El bouquet corazón de rosas hot pink fue perfecto para el cumpleaños de mi novia. Calidad increíble y entrega puntual.',
      image: '/placeholder.svg',
      productLink: '/bouquets/corazones/bq-heart-2',
      productLabel: 'Corazón Rosa Intenso',
    },
    {
      id: 'rev-3',
      name: 'Ana P.',
      rating: 5,
      text: 'Compré el arreglo de rosas negras y rojas para decorar un evento. Todos me preguntaron dónde lo conseguí. ¡Hermoso!',
      image: '/placeholder.svg',
      productLink: '/bouquets/redondos/bq-round-3',
      productLabel: 'Misterio Nocturno',
    },
    {
      id: 'rev-4',
      name: 'Laura M.',
      rating: 5,
      text: 'Las rosas light pink con blancas son un sueño. Pedí 150 rosas y el resultado superó todas mis expectativas.',
      image: '/placeholder.svg',
      productLink: '/bouquets/corazones/bq-heart-4',
      productLabel: 'Corazón Suave',
    },
  ];

  const categories = [
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
          <img src={heroBouquet} alt="Bouquet de rosas frescas" className="w-full h-full object-cover" />
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
            <Link to="/bouquets/redondos"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm">
              Ver bouquets <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary">Categorías</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {categories.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Link to={`/categoria/${item.slug}`} className="group block">
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
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary">Bouquets</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <Link to="/bouquets/redondos" className="group block">
                <div className="relative overflow-hidden rounded-sm mb-5 aspect-square">
                  <img src={numberBouquet} alt="Bouquets Redondos" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 transition-colors" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="font-display text-xl font-semibold text-foreground uppercase tracking-wide">Redondos</h3>
                </div>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Link to="/bouquets/corazones" className="group block">
                <div className="relative overflow-hidden rounded-sm mb-5 aspect-square">
                  <img src={heartBouquet} alt="Bouquets Corazón" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 transition-colors" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <h3 className="font-display text-xl font-semibold text-foreground uppercase tracking-wide">Corazones</h3>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Personaliza tu Bouquet */}
      <section className="py-24 bg-background">
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

      {/* Reseñas */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">¿Te gusta alguno? Pídelo directamente desde aquí.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {reviews.map((review, i) => (
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
