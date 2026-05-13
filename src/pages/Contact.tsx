import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import JsonLd, { localBusinessSchema } from "@/components/JsonLd";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Contact Charls Flowers – Miami FL"
        description="Get in touch with Charls Flowers Miami. Call 904-442-4042, visit us at 7261 NW 12th St, or send a message. Same-day flower delivery up to 87 miles."
        path="/contact"
      />
      <JsonLd data={localBusinessSchema()} />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="font-title-retro text-4xl md:text-5xl text-primary text-center mb-10">{t("contact.title")}</h1>

          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{t("contact.address")}</p>
                  <p className="font-body text-sm text-muted-foreground">7261 NW 12th Street, Miami, FL 33126</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{t("contact.phone")}</p>
                  <a href="tel:9044424042" className="font-body text-sm text-primary hover:underline">904-442-4042</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{t("contact.email")}</p>
                  <a href="mailto:charlsflowerscorp@gmail.com" className="font-body text-sm text-primary hover:underline">charlsflowerscorp@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Clock className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{t("contact.hours")}</p>
                  <p className="font-body text-sm text-muted-foreground">{t("contact.hoursLine1")}</p>
                  <p className="font-body text-sm text-muted-foreground">{t("contact.hoursLine2")}</p>
                </div>
              </div>
              <p className="font-body text-xs text-muted-foreground italic">{t("contact.sameDayNote")}</p>
            </div>

            {/* Contact Form */}
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
              <input type="text" placeholder={t("contact.yourName")} className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input type="email" placeholder={t("contact.yourEmail")} className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <textarea placeholder={t("contact.yourMessage")} rows={5} className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg w-full">{t("contact.sendMessage")}</button>
            </form>
          </div>

          {/* Google Maps */}
          <div className="aspect-square md:aspect-video rounded-lg overflow-hidden border border-border" style={{ minHeight: 280 }}>
            <iframe
              src="https://storage.googleapis.com/maps-solutions-0p9mp01my4/locator-plus/twwi/locator-plus.html"
              width="100%" height="100%" style={{ border: 0 }} loading="lazy"
              title="Charls Flowers Miami location"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
