import { Link } from "@/i18n/LocalizedRouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";
import { Flower2, Truck, Store, Sparkles, Star, MapPin } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

const About = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Flower2, title: t("about.roses"), desc: t("about.rosesDesc") },
    { icon: Sparkles, title: t("about.aiPreview"), desc: t("about.aiPreviewDesc") },
    { icon: Star, title: t("about.finishes"), desc: t("about.finishesDesc") },
    { icon: Truck, title: t("about.sameDayDelivery"), desc: t("about.sameDayDeliveryDesc") },
    { icon: Store, title: t("about.freePickup"), desc: t("about.freePickupDesc") },
    { icon: MapPin, title: t("about.address"), desc: t("about.addressDesc") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={t("seo.about.title")}
        description={t("seo.about.description")}
        path="/about"
      />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://www.charlsflowers.com" }, { name: "About", url: "https://www.charlsflowers.com/about" }])} />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: t("nav.about") }]} />
          <h1 className="font-title-retro text-4xl md:text-5xl text-primary text-center mb-10">{t("about.title")}</h1>

          <div className="prose-sm font-body text-muted-foreground space-y-5 mb-12">
            <p>{t("about.p1")}</p>
            <p>{t("about.p2")}</p>
            <p>{t("about.p3")}</p>
            <p>{t("about.p4")}</p>
            <p>{t("about.p5")}</p>
            <p>{t("about.p6")}</p>
            <p className="font-display text-foreground font-semibold">{t("about.founder")}</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {features.map((f, i) => (
              <div key={i} className="bg-cream rounded-lg p-5 text-center">
                <f.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-display text-sm font-semibold text-foreground">{f.title}</p>
                <p className="font-body text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/bouquets" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg">
              {t("about.shopBouquets")}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
