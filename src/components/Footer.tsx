import { Link } from "react-router-dom";
import { Flower2, MapPin, Phone, Clock } from "lucide-react";
import JsonLd, { organizationSchema } from "@/components/JsonLd";

const Footer = () => (
  <footer className="bg-foreground pt-16 pb-8">
    <JsonLd data={organizationSchema()} />
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Col 1 — Info */}
        <div>
          <Flower2 className="w-6 h-6 text-primary mb-3 fill-primary" />
          <p className="font-display text-lg text-primary-foreground mb-3">Charls Flowers</p>
          <div className="space-y-2 font-body text-xs text-primary-foreground/60">
            <p className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /> 7261 NW 12th Street, Miami, FL 33126</p>
            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" /> <a href="tel:9044424042" className="hover:text-primary transition-colors">904-442-4042</a></p>
            <p className="flex items-start gap-2"><Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Mon–Fri 8AM–7PM<br/>Sat 8AM–6PM | Sun 8AM–5PM</p>
          </div>
          <p className="font-body text-[10px] text-primary-foreground/40 mt-3 italic">Same-day flower delivery across Miami up to 87 miles</p>
        </div>

        {/* Col 2 — Navigation */}
        <div>
          <p className="font-body text-xs tracking-widest uppercase text-primary-foreground/80 mb-4">Navigation</p>
          <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground/60">
            {[
              { to: "/", label: "Home" },
              { to: "/bouquets", label: "Bouquets" },
              { to: "/bouquets/personalizar", label: "Custom Bouquets" },
              { to: "/room-decors", label: "Room Decors" },
              { to: "/delivery", label: "Delivery" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
              { to: "/faq", label: "FAQ" },
              { to: "/blog", label: "Blog" },
              { to: "/sitemap", label: "Sitemap" },
            ].map(link => (
              <Link key={link.to} to={link.to} className="hover:text-primary transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>

        {/* Col 3 — Legal */}
        <div>
          <p className="font-body text-xs tracking-widest uppercase text-primary-foreground/80 mb-4">Legal</p>
          <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground/60">
            {[
              { to: "/privacy-policy", label: "Privacy Policy" },
              { to: "/terms-of-service", label: "Terms of Service" },
              { to: "/refund-policy", label: "Refund & Return Policy" },
              { to: "/shipping-policy", label: "Shipping Policy" },
              { to: "/cookie-policy", label: "Cookie Policy" },
            ].map(link => (
              <Link key={link.to} to={link.to} className="hover:text-primary transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>

        {/* Col 4 — Social & Payments */}
        <div>
          <p className="font-body text-xs tracking-widest uppercase text-primary-foreground/80 mb-4">Follow Us</p>
          <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground/60 mb-6">
            <a href="https://www.instagram.com/charlsflowers" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
            <a href="https://www.facebook.com/charlsflowers" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Facebook</a>
            <a href="https://www.tiktok.com/@charlsflowers" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">TikTok</a>
          </div>
          <p className="font-body text-[10px] text-primary-foreground/40">Visa · Mastercard · Amex · PayPal · Shop Pay</p>
          <p className="font-body text-[10px] text-primary-foreground/40 mt-1">Secure checkout powered by Shopify</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-primary-foreground/10 pt-6 text-center">
        <p className="font-body text-[10px] text-primary-foreground/40">© 2026 Charls Flowers Miami. All rights reserved.</p>
        <p className="font-body text-[10px] text-primary-foreground/30 mt-1">Miami's premier flower shop — custom bouquets & same-day delivery.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
