import { Link } from "@/i18n/LocalizedRouter";
import { motion } from "framer-motion";
import { Home, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { useTranslation } from "@/i18n/LanguageContext";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={t("notFound.seoTitle")} description={t("notFound.seoDescription")} noindex />
      <Navbar />
      <div className="pt-24 flex items-center justify-center min-h-[80vh]">
        <div className="container mx-auto px-6 flex flex-col items-center text-center max-w-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mb-3">{t("notFound.errorLabel")}</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">{t("notFound.title")}</h1>
            <p className="text-muted-foreground font-body text-lg mb-10 leading-relaxed">{t("notFound.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/bouquets" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg">
                <Sparkles className="w-4 h-4" /> {t("notFound.shopBouquets")}
              </Link>
              <Link to="/" className="inline-flex items-center gap-3 border border-primary text-primary px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/5 transition-colors rounded-lg">
                <Home className="w-4 h-4" /> {t("notFound.goHome")}
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
