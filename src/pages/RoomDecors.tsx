import { useEffect } from "react";
import { Link } from "@/i18n/LocalizedRouter";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, itemListSchema } from "@/components/JsonLd";
import CollectionFAQ from "@/components/CollectionFAQ";
import { roomDecorPackages } from "@/lib/roomDecorData";
import { useTranslation } from "@/i18n/LanguageContext";
import { isMothersDayPromoActive } from "@/lib/mothersDayPromo";

const RoomDecors = () => {
  const { t } = useTranslation();
  const promoActive = isMothersDayPromoActive();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const roomDecorFAQs = [
    { question: t("roomDecorFaq.q1"), answer: t("roomDecorFaq.a1") },
    { question: t("roomDecorFaq.q2"), answer: t("roomDecorFaq.a2") },
    { question: t("roomDecorFaq.q3"), answer: t("roomDecorFaq.a3") },
    { question: t("roomDecorFaq.q4"), answer: t("roomDecorFaq.a4") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={t("seo.roomDecors.title")} description={t("seo.roomDecors.description")} path="/room-decors" />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://charlsflowers.com" }, { name: "Romantic Room Decoration", url: "https://charlsflowers.com/room-decors" }])} />
      <JsonLd
        data={itemListSchema(
          roomDecorPackages.map((pkg) => ({
            name: `${pkg.name} Miami`,
            url: `https://charlsflowers.com/room-decors/${pkg.id}`,
            image: pkg.image,
            price: Number(pkg.price),
          })),
          "Romantic Room Decoration Miami",
        )}
      />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: t("nav.roomDecors") }]} />

          <div className="text-center mb-12">
            <p className="font-subtitle-script text-gold text-lg md:text-2xl mb-2">{t("roomDecors.subtitle")}</p>
            <h1 className="font-title-retro text-4xl md:text-5xl text-foreground">{t("roomDecors.title")}</h1>
            <p className="text-muted-foreground font-body text-sm mt-3 max-w-lg mx-auto">
              {t("roomDecors.description")}{' '}
               <Link to="/room-decors/love-bomb" className="text-primary hover:underline">Love Bomb</Link>,{' '}
               <Link to="/room-decors/overly-romantic" className="text-primary hover:underline">Overly Romantic</Link>, {t("roomDecors.orThe")}{' '}
               <Link to="/room-decors/deluxe-love-package" className="text-primary hover:underline">Deluxe Love Package</Link>. {t("roomDecors.deliveryIncluded")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
            {roomDecorPackages.map((pkg, idx) => (
              <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.15 }}>
                <Link to={`/room-decors/${pkg.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-muted">
                    <img src={pkg.image} alt={`${pkg.name} — Romantic Room Decoration in Miami | Charls Flowers`} loading="lazy" width={400} height={400} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
                    {pkg.id === 'deluxe-love-package' && (
                      <div className="absolute -top-1 -right-1 z-10">
                        <div className="bg-primary text-primary-foreground px-2.5 md:px-5 py-1 md:py-1.5 rounded-bl-lg rounded-tr-sm font-body text-[9px] md:text-xs tracking-wider uppercase font-bold shadow-lg">
                          {t("roomDecors.mostPopular")}
                        </div>
                      </div>
                    )}
                    {promoActive && (
                      <div className="absolute bottom-2 left-2 right-2 z-10 bg-primary text-primary-foreground px-2 py-1.5 rounded-md font-body text-[10px] md:text-xs tracking-wider uppercase font-bold shadow-lg text-center">
                        Available May 13
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-sm md:text-lg font-semibold text-foreground text-center">{pkg.name}</h3>
                  <p className="text-primary font-body text-sm font-semibold text-center mt-2">{t("product.from")} ${pkg.price}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6">
        <CollectionFAQ faqs={roomDecorFAQs} />
      </div>
      <Footer />
    </div>
  );
};

export default RoomDecors;
