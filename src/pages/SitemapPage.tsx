import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const Sitemap = () => {
  const sections = [
    { title: "Main Pages", links: [
      { to: "/", label: "Home" },
      { to: "/bouquets", label: "Bouquets" },
      { to: "/bouquets/personalizar", label: "Custom Bouquet Builder" },
      { to: "/room-decors", label: "Room Decors" },
      { to: "/delivery", label: "Delivery" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/faq", label: "FAQ" },
      { to: "/blog", label: "Blog" },
    ]},
    { title: "Landing Pages", links: [
      { to: "/flower-shop-miami", label: "Flower Shop Miami" },
      { to: "/flower-delivery-coral-gables", label: "Flower Delivery Coral Gables" },
      { to: "/flower-delivery-doral", label: "Flower Delivery Doral" },
      { to: "/flower-delivery-hialeah", label: "Flower Delivery Hialeah" },
      { to: "/flower-delivery-kendall", label: "Flower Delivery Kendall" },
      { to: "/flower-delivery-brickell", label: "Flower Delivery Brickell" },
      { to: "/flower-delivery-wynwood", label: "Flower Delivery Wynwood" },
      { to: "/flower-delivery-miami-beach", label: "Flower Delivery Miami Beach" },
      { to: "/flower-delivery-aventura", label: "Flower Delivery Aventura" },
      { to: "/valentines-day-flowers-miami", label: "Valentine's Day Flowers Miami" },
      { to: "/mothers-day-bouquets-miami", label: "Mother's Day Bouquets Miami" },
      { to: "/quinceanera-bouquets-miami", label: "Quinceañera Bouquets Miami" },
      { to: "/gender-reveal-flowers-miami", label: "Gender Reveal Flowers Miami" },
      { to: "/100-roses-bouquet-miami", label: "100 Roses Bouquet Miami" },
    ]},
    { title: "Legal", links: [
      { to: "/privacy-policy", label: "Privacy Policy" },
      { to: "/terms-of-service", label: "Terms of Service" },
      { to: "/refund-policy", label: "Refund & Return Policy" },
      { to: "/shipping-policy", label: "Shipping Policy" },
      { to: "/cookie-policy", label: "Cookie Policy" },
    ]},
  ];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title="Sitemap – Charls Flowers Miami" description="Complete sitemap of Charls Flowers Miami. Browse all pages, products, and resources." path="/sitemap" />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-title-retro text-4xl text-primary text-center mb-10">Sitemap</h1>
          <div className="space-y-10">
            {sections.map(section => (
              <div key={section.title}>
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">{section.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {section.links.map(link => (
                    <Link key={link.to} to={link.to} className="font-body text-sm text-primary hover:underline">{link.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Sitemap;
