import { GOOGLE_MAPS_API_KEY, FOTO_DE_PORTADA, FOTO_DE_PORTADA_SRCSET } from "@/lib/constants";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles, Star, Lock, Store, Truck, Globe, Flower2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import JsonLd, { localBusinessSchema, serviceSchema, websiteSchema, faqSchema, homepageFaqs } from "@/components/JsonLd";
import { useTranslation } from "@/i18n/LanguageContext";
import { isMothersDayPromoActive } from "@/lib/mothersDayPromo";
import MothersDayHero from "@/components/MothersDayHero";
import MothersDayBanner from "@/components/MothersDayBanner";
import MothersDayCollectionSection from "@/components/MothersDayCollectionSection";
import arreglosImg from "@/assets/arreglos.jpg";
import cajasImg from "@/assets/cajas.jpg";
import cestasImg from "@/assets/cestas.jpg";
import jarronesImg from "@/assets/jarrones.jpg";
import ososImg from "@/assets/osos.jpg";
import heartBouquet from "@/assets/heart-bouquet.jpg";
const bicolorPassionImg = 'https://cdn.shopify.com/s/files/1/0979/1671/5140/files/16.png?v=1774610789';
const deluxeLoveImg = 'https://cdn.shopify.com/s/files/1/0979/1671/5140/files/3_adaa192a-8c9b-41b5-8586-cb7e13640829.png?v=1774615718';

const comingSoonSlugs = ["arreglos", "cajas", "cestas", "jarrones", "osos"];

const Index = () => {
  const { t } = useTranslation();
  const promoActive = isMothersDayPromoActive();
  const categories = [
    { img: bicolorPassionImg, title: t("categories.bouquets"), slug: "bouquets", isRoute: true },
    { img: arreglosImg, title: t("categories.arrangements"), slug: "arreglos" },
    { img: cajasImg, title: t("categories.boxes"), slug: "cajas" },
    { img: cestasImg, title: t("categories.baskets"), slug: "cestas" },
    { img: jarronesImg, title: t("categories.vases"), slug: "jarrones" },
    { img: ososImg, title: t("categories.bears"), slug: "osos" },
    { img: deluxeLoveImg, title: t("categories.roomDecors"), slug: "room-decors", isRoute: true },
  ];

  const tickerTexts = [
    t("ticker.bestQuality"),
    t("ticker.unbeatablePrices"),
    t("ticker.handcrafted"),
    t("ticker.sameDayDelivery"),
    t("ticker.rosesPerBouquet"),
    t("ticker.finishOptions"),
  ];

  const occasions = [
    { text: t("home.valentinesDay"), icon: Heart },
    { text: t("home.mothersDay"), icon: Heart },
    { text: t("home.weddingFlowers"), icon: Heart },
    { text: t("home.birthdayBouquets"), icon: Sparkles },
    { text: t("home.babyShower"), icon: Sparkles },
    { text: t("home.anniversaryRoses"), icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SeoHead title="Charls Flowers Miami | Custom Bouquets & Same-Day Delivery" description="Miami's premier flower shop. Handcrafted bouquets from 50 to 200 roses, natural or glitter finish. Custom designs with AI preview. Same-day delivery up to 87 miles. Free pickup." path="/" />
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={serviceSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={faqSchema(homepageFaqs)} />
      <Navbar />

      <main>
      {promoActive && (
        <>
          <MothersDayHero />
          <MothersDayBanner />
          <MothersDayCollectionSection />
        </>
      )}
      {/* Hero */}
      {!promoActive && (
      <section className="relative h-[70vh] md:h-screen flex items-end md:items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={FOTO_DE_PORTADA}
            srcSet={FOTO_DE_PORTADA_SRCSET}
            sizes="100vw"
            width={1920}
            height={1080}
            alt="Charls Flowers Miami – Fresh Handcrafted Rose Bouquets Same-Day Delivery"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-foreground/85 via-foreground/50 to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-6 pb-10 md:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className="font-subtitle-script text-primary-foreground/70 text-lg md:text-2xl mb-2 md:mb-4">{t("home.heroSubtitle")}</p>
            <h1 className="font-display text-3xl md:text-7xl font-bold text-primary-foreground leading-tight mb-3 md:mb-6">
              {t("home.heroTitle")}
            </h1>
            <p className="text-primary-foreground/80 font-body text-sm md:text-lg mb-5 md:mb-8 leading-relaxed">
              {t("home.heroDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link to="/bouquets"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 md:px-8 py-3 md:py-4 font-body text-xs md:text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg">
                {t("home.viewBouquets")} <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
              <Link to="/bouquets/personalizar"
                className="inline-flex items-center justify-center gap-2 border border-primary-foreground/50 text-primary-foreground px-5 md:px-8 py-3 md:py-4 font-body text-xs md:text-sm tracking-widest uppercase hover:bg-primary-foreground/10 transition-colors rounded-lg">
                {t("home.buildYourBouquet")} <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      )}

      {/* Shipping Options Bar */}
      <section className="py-5 md:py-6 bg-cream border-y border-primary/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center gap-3 md:gap-12 flex-wrap md:flex-nowrap">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Store className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              </div>
              <span className="font-body text-[9px] md:text-xs tracking-wider text-foreground uppercase whitespace-nowrap">{t("home.storePickup")}</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-primary/15 shrink-0" />
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Truck className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              </div>
              <span className="font-body text-[9px] md:text-xs tracking-wider text-foreground uppercase whitespace-nowrap">{t("home.homeDelivery")}</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-primary/15 shrink-0" />
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Globe className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="font-body text-[9px] md:text-xs tracking-wider text-foreground uppercase whitespace-nowrap">{t("home.nationwideShipping")}</span>
                <span className="font-body text-[7px] md:text-[10px] tracking-widest uppercase text-primary-foreground bg-primary px-1.5 py-0.5 rounded-full whitespace-nowrap">{t("common.comingSoon")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-10">
            <h2 className="font-title-retro text-4xl md:text-5xl text-primary">{t("home.categoriesTitle")}</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-5">
            {categories.map((item, i) => {
              const isComingSoon = comingSoonSlugs.includes(item.slug);
              const isBlockedByPromo = promoActive && (item.slug === "bouquets" || item.slug === "room-decors");
              return (
                <motion.div key={item.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  {isComingSoon ? (
                    <div className="block opacity-50 cursor-not-allowed">
                      <div className="relative overflow-hidden rounded-lg mb-4 aspect-square">
                         <img src={item.img} alt={`${item.title} Miami – Charls Flowers`} loading="lazy" width={400} height={400} className="w-full h-full object-cover grayscale" />
                        <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
                          <div className="bg-foreground/70 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-primary-foreground" />
                            <span className="font-body text-[10px] text-primary-foreground tracking-widest uppercase">{t("common.comingSoon")}</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-muted-foreground text-center uppercase tracking-wide">{item.title}</h3>
                    </div>
                  ) : isBlockedByPromo ? (
                    <div className="block opacity-50 cursor-not-allowed pointer-events-none" aria-disabled="true">
                      <div className="relative overflow-hidden rounded-lg mb-4 aspect-square">
                        <img src={item.img} alt={`${item.title} Miami – Charls Flowers`} loading="lazy" width={400} height={400} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
                          <div className="bg-foreground/70 px-3 py-1.5 rounded-lg">
                            <span className="font-body text-[10px] text-primary-foreground tracking-widest uppercase">Available May 13</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-muted-foreground text-center uppercase tracking-wide">{item.title}</h3>
                    </div>
                  ) : (
                    <Link to={item.isRoute ? `/${item.slug}` : `/categoria/${item.slug}`} className="group block">
                       <div className="relative overflow-hidden rounded-lg mb-4 aspect-square">
                        <img src={item.img} alt={`${item.title} Miami – Charls Flowers`} loading="lazy" width={400} height={400} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-10">
            <h2 className="font-title-retro text-4xl md:text-5xl text-primary">{t("home.bouquetsTitle")}</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-md mx-auto">
            {promoActive ? (
              <div className="block opacity-50 cursor-not-allowed pointer-events-none" aria-disabled="true">
                <div className="relative overflow-hidden rounded-lg mb-5 aspect-square">
                  <img src={bicolorPassionImg} alt="Fresh Rose Bouquets Miami – Charls Flowers" loading="lazy" width={500} height={500} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
                    <div className="bg-foreground/70 px-3 py-1.5 rounded-lg">
                      <span className="font-body text-[10px] text-primary-foreground tracking-widest uppercase">Available May 13</span>
                    </div>
                  </div>
                </div>
                <div className="text-center mb-2">
                  <h3 className="font-display text-xl font-semibold text-foreground uppercase tracking-wide">{t("home.viewBouquetsBtn")}</h3>
                </div>
              </div>
            ) : (
              <Link to="/bouquets" className="group block">
                <div className="relative overflow-hidden rounded-lg mb-5 aspect-square">
                  <img src={bicolorPassionImg} alt="Fresh Rose Bouquets Miami – Charls Flowers" loading="lazy" width={500} height={500} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 transition-colors" />
                </div>
                <div className="text-center mb-2">
                  <h3 className="font-display text-xl font-semibold text-foreground uppercase tracking-wide">{t("home.viewBouquetsBtn")}</h3>
                </div>
              </Link>
            )}
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
                {tickerTexts.map((text, i) => (
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
        <div className="container mx-auto px-6 text-left md:text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="font-title-retro text-4xl md:text-5xl text-primary mb-6">
              {t("home.customizeTitle")}
            </h2>
            <p className="text-muted-foreground font-body mb-8 max-w-md md:mx-auto">
              {t("home.customizeDescription")}
            </p>
            {promoActive ? (
              <div className="inline-flex flex-col items-center gap-1">
                <button type="button" disabled aria-disabled="true"
                  className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase rounded-lg opacity-50 cursor-not-allowed pointer-events-none">
                  {t("home.customize")} <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[10px] md:text-xs tracking-widest uppercase text-muted-foreground font-body">Available May 13</span>
              </div>
            ) : (
              <Link to="/bouquets/personalizar"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg">
                {t("home.customize")} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Why Charls Flowers */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-10">
            <h2 className="font-title-retro text-4xl md:text-5xl text-primary mb-4">{t("home.whyUs.title")}</h2>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">{t("home.whyUs.subtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { Icon: Flower2, title: t("home.whyUs.value1Title"), desc: t("home.whyUs.value1Desc") },
              { Icon: Truck, title: t("home.whyUs.value2Title"), desc: t("home.whyUs.value2Desc") },
              { Icon: Sparkles, title: t("home.whyUs.value3Title"), desc: t("home.whyUs.value3Desc") },
              { Icon: Heart, title: t("home.whyUs.value4Title"), desc: t("home.whyUs.value4Desc") },
            ].map(({ Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center px-4"
              >
                <Icon className="h-10 w-10 text-primary mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-lg font-semibold text-foreground uppercase tracking-wide mb-2">{title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="relative mt-[-1px]">
        <div className="absolute -top-[50px] left-0 w-full h-[55px] z-10 overflow-hidden pointer-events-none">
          <svg className="h-full animate-wave" style={{ width: "200%", minWidth: "3840px" }} viewBox="0 0 2880 60" preserveAspectRatio="none">
            <path d="M0,60 C360,20 720,50 1080,30 C1440,10 1800,50 2160,25 C2520,5 2880,40 2880,40 L2880,60 Z" fill="hsl(var(--primary))" opacity="0.3" />
            <path d="M0,60 C480,35 960,55 1440,40 C1920,25 2400,50 2880,35 L2880,60 Z" fill="hsl(var(--primary))" opacity="0.55" />
            <path d="M0,60 C320,48 640,56 960,50 C1280,44 1600,54 1920,48 C2240,42 2560,52 2880,46 L2880,60 Z" fill="hsl(var(--primary))" opacity="0.8" />
          </svg>
        </div>
        <section className="bg-primary py-20 overflow-hidden">
          <div className="container mx-auto px-6 text-center relative z-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mb-4">{t("home.ctaPrice")}</h2>
              <p className="text-primary-foreground/80 font-body mb-8 max-w-md mx-auto">{t("home.ctaDescription")}</p>
              {promoActive ? (
                <div className="inline-flex flex-col items-center gap-1">
                  <button type="button" disabled aria-disabled="true"
                    className="inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 font-body text-sm tracking-widest uppercase rounded-lg opacity-50 cursor-not-allowed pointer-events-none">
                    {t("home.customizeNow")} <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] md:text-xs tracking-widest uppercase text-primary-foreground/80 font-body">Available May 13</span>
                </div>
              ) : (
                <Link to="/bouquets/personalizar"
                  className="inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-background/90 transition-colors rounded-lg">
                  {t("home.customizeNow")} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </motion.div>
          </div>
        </section>
        <div className="absolute -bottom-[50px] left-0 w-full h-[55px] z-10 overflow-hidden pointer-events-none">
          <svg className="h-full animate-wave-reverse" style={{ width: "200%", minWidth: "3840px" }} viewBox="0 0 2880 60" preserveAspectRatio="none">
            <path d="M0,0 C360,40 720,10 1080,30 C1440,50 1800,10 2160,35 C2520,55 2880,20 2880,20 L2880,0 Z" fill="hsl(var(--primary))" opacity="0.3" />
            <path d="M0,0 C480,25 960,5 1440,20 C1920,35 2400,10 2880,25 L2880,0 Z" fill="hsl(var(--primary))" opacity="0.55" />
            <path d="M0,0 C320,12 640,4 960,10 C1280,16 1600,6 1920,12 C2240,18 2560,8 2880,14 L2880,0 Z" fill="hsl(var(--primary))" opacity="0.8" />
          </svg>
        </div>
      </div>

      {/* Occasions — SEO H3 section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-10">
            <h2 className="font-title-retro text-4xl md:text-5xl text-primary">{t("home.occasionsTitle")}</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
            {occasions.map(({ text, icon: Icon }) => (
              <div key={text} className="flex flex-col items-center gap-2 p-4">
                <Icon className="w-5 h-5 text-primary" />
                <h3 className="font-display text-sm md:text-base font-semibold text-foreground">{text}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Same-Day Delivery + Google Maps */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-left md:text-center mb-8">
            <h2 className="font-title-retro text-4xl md:text-5xl text-primary mb-4">{t("home.deliveryTitle")}</h2>
            <p className="text-muted-foreground font-body max-w-lg md:mx-auto">{t("home.deliverySubtitleLine1")}</p>
            <p className="text-muted-foreground font-body max-w-lg md:mx-auto mt-1">{t("home.deliverySubtitleLine2")}</p>
            <p className="text-primary font-body text-sm font-semibold mt-3">{t("home.deliveryAddress")}</p>
          </motion.div>
          <div className="max-w-2xl mx-auto rounded-lg overflow-hidden border border-border aspect-square md:aspect-video" style={{ minHeight: '280px' }}>
            <iframe
              src="https://www.google.com/maps?q=7261+NW+12th+St,+Miami,+FL+33126&z=12&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Charls Flowers Miami Location"
            />
          </div>
          <div className="text-center mt-4 font-body text-sm text-muted-foreground space-y-1">
            <p><a href="tel:9044424042" className="text-primary hover:underline font-semibold">904-442-4042</a></p>
            <p>{t("home.hoursLine1")}</p>
            <p>{t("home.hoursLine2")}</p>
            <p>{t("home.hoursLine3")}</p>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
};

export default Index;
