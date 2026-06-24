import { Link } from "@/i18n/LocalizedRouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, serviceSchema } from "@/components/JsonLd";
import { Truck, Store, MapPin, Clock, DollarSign } from "lucide-react";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constants";
import { useTranslation } from "@/i18n/LanguageContext";

const Delivery = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={t("seo.delivery.title")}
        description={t("seo.delivery.description")}
        path="/delivery"
      />
      <JsonLd data={[breadcrumbSchema([{ name: "Home", url: "https://www.charlsflowers.com" }, { name: "Delivery", url: "https://www.charlsflowers.com/delivery" }]), serviceSchema()]} />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: t("nav.delivery") }]} />
          <h1 className="font-title-retro text-4xl md:text-5xl text-primary text-center mb-4">{t("deliveryPage.title")}</h1>
          <p className="text-center font-body text-sm text-primary font-semibold mb-10 tracking-wider uppercase">{t("deliveryPage.orderBefore")}</p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Delivery */}
            <div className="bg-cream rounded-lg p-8">
              <div className="flex items-center gap-3 mb-5">
                <Truck className="w-6 h-6 text-primary" />
                <h2 className="font-display text-xl font-semibold text-foreground">{t("deliveryPage.homeDelivery")}</h2>
              </div>
              <div className="space-y-4 font-body text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{t("deliveryPage.flatRate")}</p>
                    <p>{t("deliveryPage.perMile")}</p>
                    <p className="text-xs italic mt-1">{t("deliveryPage.example")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p>{t("deliveryPage.minPrep")}</p>
                    <p>Mon–Fri 8AM–7PM | Sat 8AM–5PM | Sun Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup */}
            <div className="bg-cream rounded-lg p-8">
              <div className="flex items-center gap-3 mb-5">
                <Store className="w-6 h-6 text-primary" />
                <h2 className="font-display text-xl font-semibold text-foreground">{t("deliveryPage.freePickup")}</h2>
              </div>
              <div className="space-y-4 font-body text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">7261 NW 12th Street</p>
                    <p>Miami, FL 33126</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p>{t("deliveryPage.ready")}</p>
                    <p>Mon–Fri 8AM–7PM | Sat 8AM–5PM | Sun Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-lg overflow-hidden border border-border mb-12" style={{ minHeight: 300 }}>
            <iframe
              title="Charls Flowers Miami delivery area"
              src="https://www.google.com/maps?q=7261+NW+12th+St,+Miami,+FL+33126&z=12&output=embed"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="text-center">
            <p className="font-body text-xs text-muted-foreground mb-6">{t("deliveryPage.internationalShipping")}</p>
            <Link to="/bouquets" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg">
              {t("deliveryPage.orderNow")}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Delivery;
