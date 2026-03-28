import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Home, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead title="Page Not Found – Charls Flowers Miami" description="This page doesn't exist. Browse our beautiful bouquet collection or go back home." path="/404" noindex />
      <Navbar />
      <div className="pt-24 flex items-center justify-center min-h-[80vh]">
        <div className="container mx-auto px-6 flex flex-col items-center text-center max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-3">Error 404</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Oops! This page doesn't exist.
            </h1>
            <p className="text-muted-foreground font-body text-lg mb-10 leading-relaxed">
              But we have the most beautiful bouquets in Miami.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/bouquets"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm"
              >
                <Sparkles className="w-4 h-4" /> Shop Bouquets
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-3 border border-primary text-primary px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/5 transition-colors rounded-sm"
              >
                <Home className="w-4 h-4" /> Go Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
