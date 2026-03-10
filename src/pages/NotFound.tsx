import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Home, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import bouquet404 from "@/assets/404-bouquet.png";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-6 flex flex-col items-center text-center max-w-lg">
          <motion.img
            src={bouquet404}
            alt="Rose bouquet"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-56 h-56 object-contain mb-8"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-3">Error 404</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              This page doesn't bloom here
            </h1>
            <p className="text-muted-foreground font-body text-lg mb-10 leading-relaxed">
              Looks like you got lost among the petals. Go back home or create a unique bouquet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm"
              >
                <Home className="w-4 h-4" /> Home
              </Link>
              <Link
                to="/bouquets/personalizar"
                className="inline-flex items-center gap-3 border border-primary text-primary px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/5 transition-colors rounded-sm"
              >
                Customize <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
