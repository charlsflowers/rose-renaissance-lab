import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { Truck, Store, MapPin, Clock, DollarSign } from "lucide-react";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constants";
import { useTranslation } from "@/i18n/LanguageContext";

const Delivery = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Flower Delivery Miami | Same-Day & Free Pickup"
        description="Same-day flower delivery in Miami up to 87 miles. $20 flat rate for 0-5 miles, $1.60/mile after. Free in-store pickup. Order before 3PM."
        path="/delivery"
      />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="font-title-retro text-4xl md:text-5xl text-primary text-center mb-4">{t("deliveryPage.title")}</h1>
          <p className="text-center font-body text-sm text-primary font-semibold mb-10 tracking-wider uppercase">{t("deliveryPage.orderBefore")}</p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Delivery */}
            <div className="bg-cream rounded-sm p-8">
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
                    <p>Mon–Fri 8AM–7PM | Sat 8AM–6PM | Sun 8AM–5PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup */}
            <div className="bg-cream rounded-sm p-8">
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
                    <p>Mon–Fri 8AM–7PM | Sat 8AM–6PM | Sun 8AM–5PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="aspect-video rounded-sm overflow-hidden border border-border mb-12" style={{ minHeight: 300 }}>
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=7261+NW+12th+Street,Miami,FL+33126&center=25.7617,-80.3999&zoom=14`}
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Charls Flowers Miami delivery area"
            />
          </div>

          <div className="text-center">
            <p className="font-body text-xs text-muted-foreground mb-6">{t("deliveryPage.internationalShipping")}</p>
            <Link to="/bouquets" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm">
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
