import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "@/i18n/LocalizedRouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { localBusinessSchema, faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import LandingZonesList from "@/components/landing/LandingZonesList";
import LandingOccasions from "@/components/landing/LandingOccasions";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingInternalLinks from "@/components/landing/LandingInternalLinks";
import { getLandingPage } from "@/lib/landingPagesData";
import { ArrowRight, MapPin, Truck, Store, Clock, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

const LandingPage = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace("/", "");
  const page = getLandingPage(slug);
  const { t } = useTranslation();

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!page) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground font-body">{t("landing.pageNotFound")}</p>
          <Link to="/" className="text-primary font-body underline mt-4 inline-block">{t("landing.goHome")}</Link>
        </div>
      </div>
    );
  }

  // Extended SEO layout (per-page unique content + LocalBusiness/FAQPage schema).
  if (page.seo) {
    const seo = page.seo;
    const breadcrumbLabel = page.h1.split("|")[0].split("—")[0].trim();
    const localBusiness = {
      ...localBusinessSchema(),
      areaServed: { "@type": "Place", name: seo.areaServed },
    };
    return (
      <div className="min-h-screen bg-background">
        <SeoHead title={page.seoTitle} description={page.seoDescription} path={`/${page.slug}`} />
        <JsonLd data={[
          localBusiness,
          faqSchema(seo.faqs.map(f => ({ question: f.question, answer: f.answer }))),
          breadcrumbSchema([
            { name: "Home", url: "https://www.charlsflowers.com" },
            { name: breadcrumbLabel, url: `https://www.charlsflowers.com/${page.slug}` },
          ]),
        ]} />
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <Breadcrumbs items={[{ label: t("sitemap.links.home"), to: "/" }, { label: breadcrumbLabel }]} />
            <div className="max-w-3xl mx-auto">
              <h1 className="font-title-retro text-3xl md:text-5xl text-foreground mb-6">{page.h1}</h1>
              <p className="text-muted-foreground font-body text-base md:text-lg leading-relaxed mb-12">{page.intro}</p>

              {/* Why we deliver here */}
              <section className="mb-16">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-3">{seo.whyTitle}</h2>
                <p className="font-body text-base text-foreground leading-relaxed">{seo.whyParagraph}</p>
              </section>

              {/* Zones */}
              <LandingZonesList title={seo.zonesTitle} intro={seo.zonesIntro} zones={seo.zones} />

              {/* Occasions */}
              <LandingOccasions title={seo.occasionsTitle} intro={seo.occasionsIntro} occasions={seo.occasions} />

              {/* Delivery info */}
              <section className="mb-16 bg-card border border-border rounded-lg p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" /> {seo.deliveryTitle}
                </h2>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{seo.deliveryParagraph}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="font-body text-xs font-semibold text-foreground">$20</p>
                      <p className="font-body text-xs text-muted-foreground">{t("landing.seoFirstMiles")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="font-body text-xs font-semibold text-foreground">{t("landing.seoTwoHours")}</p>
                      <p className="font-body text-xs text-muted-foreground">{t("landing.seoMinPrep")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                    <Store className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="font-body text-xs font-semibold text-foreground">{t("landing.seoFreePickup")}</p>
                      <p className="font-body text-xs text-muted-foreground">7261 NW 12th St</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/shipping-policy" className="font-body text-xs text-primary hover:underline">
                    {t("landing.seoSeeShipping")}
                  </Link>
                </div>
              </section>

              {/* FAQ */}
              <LandingFAQ title={seo.faqTitle} faqs={seo.faqs} />

              {/* Internal links */}
              <LandingInternalLinks title={seo.internalLinksTitle} links={seo.internalLinks} />

              {/* Map */}
              <div className="rounded-lg overflow-hidden mb-12" style={{ minHeight: 300 }}>
                <iframe
                  title={`Charls Flowers Miami — ${seo.areaServed} delivery area`}
                  src="https://storage.googleapis.com/maps-solutions-0p9mp01my4/locator-plus/twwi/locator-plus.html"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/bouquets" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg">
                  {seo.ctaLabel} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/bouquets/personalizar" className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/5 transition-colors rounded-lg">
                  {t("landing.customBouquetCta")} <Sparkles className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={page.seoTitle} description={page.seoDescription} path={`/${page.slug}`} />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: t("sitemap.links.home"), to: "/" }, { label: page.h1.split("|")[0].trim() }]} />

          <div className="max-w-4xl mx-auto">
            <h1 className="font-title-retro text-3xl md:text-5xl text-foreground mb-6 text-center">{page.h1}</h1>
            <p className="text-muted-foreground font-body text-base md:text-lg leading-relaxed mb-12 text-center max-w-2xl mx-auto">{page.intro}</p>

            {/* Services */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-cream rounded-lg p-6 text-center">
                <Truck className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{t("landing.sameDayDelivery")}</h3>
                <p className="font-body text-sm text-muted-foreground">{t("landing.sameDayDeliveryDesc")}</p>
              </div>
              <div className="bg-cream rounded-lg p-6 text-center">
                <Store className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{t("landing.freePickup")}</h3>
                <p className="font-body text-sm text-muted-foreground">{t("landing.freePickupDesc")}</p>
              </div>
              <div className="bg-cream rounded-lg p-6 text-center">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{t("landing.customBouquets")}</h3>
                <p className="font-body text-sm text-muted-foreground">{t("landing.customBouquetsDesc")}</p>
              </div>
            </div>

            {/* Delivery Rates */}
            <div className="bg-card border border-border rounded-lg p-8 mb-16">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6 text-center">{t("landing.deliveryRatesTitle")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{t("landing.rateClose")}</p>
                    <p className="font-body text-xs text-muted-foreground">{t("landing.rateCloseDetail")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
                  <Truck className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{t("landing.rateFar")}</p>
                    <p className="font-body text-xs text-muted-foreground">{t("landing.rateFarDetail")}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center mt-4">
                <Clock className="w-4 h-4 text-primary" />
                <p className="font-body text-xs text-muted-foreground">{t("landing.minPreparation")}</p>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden mb-16" style={{ minHeight: 300 }}>
              <iframe
                title={t("landing.mapTitle")}
                src="https://storage.googleapis.com/maps-solutions-0p9mp01my4/locator-plus/twwi/locator-plus.html"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/bouquets" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg">
                {t("landing.shopBouquetsCta")} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/bouquets/personalizar" className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/5 transition-colors rounded-lg">
                {t("landing.customBouquetCta")} <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
