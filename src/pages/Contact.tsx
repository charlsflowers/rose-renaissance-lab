import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import JsonLd, { localBusinessSchema } from "@/components/JsonLd";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

const Contact = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "f63c8666-13a8-44b5-920f-1f2d0dacf1d3",
          name,
          email,
          message,
          subject: "Nuevo mensaje desde charlsflowers.com",
          from_name: "Charls Flowers Website",
        }),
      });
      const json = await res.json();
      if (json.success === true) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

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
                  <a href="mailto:charls@charlsflowers.com" className="font-body text-sm text-primary hover:underline">charls@charlsflowers.com</a>
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
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder={t("contact.yourName")} className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("contact.yourEmail")} className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t("contact.yourMessage")} rows={5} className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              <button type="submit" disabled={status === "sending"} className="bg-primary text-primary-foreground px-8 py-3 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg w-full disabled:opacity-60 disabled:cursor-not-allowed">
                {status === "sending" ? t("contact.sending") : t("contact.sendMessage")}
              </button>
              {status === "success" && (
                <p className="font-body text-sm text-primary text-center" role="status">{t("contact.successMessage")}</p>
              )}
              {status === "error" && (
                <p className="font-body text-sm text-destructive text-center" role="alert">{t("contact.errorMessage")}</p>
              )}
            </form>
          </div>

          {/* Google Maps */}
          <div className="mt-16 md:mt-24 aspect-square md:aspect-video rounded-lg overflow-hidden border border-border" style={{ minHeight: 280 }}>
            <iframe
              src="https://www.google.com/maps?q=7261+NW+12th+St,+Miami,+FL+33126&z=12&output=embed"
              width="100%" height="100%" style={{ border: 0 }} loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
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
