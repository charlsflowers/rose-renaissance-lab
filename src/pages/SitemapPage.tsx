import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { landingPages } from "@/lib/landingPagesData";
import { blogArticles } from "@/lib/blogData";
import { bouquetProducts } from "@/lib/catalogData";
import { roomDecorPackages } from "@/lib/roomDecorData";

const Sitemap = () => {
  // Deduplicate bouquets by shopifyHandle (unique key for the route)
  const uniqueBouquets = Array.from(
    new Map(bouquetProducts.map((p) => [p.shopifyHandle, p])).values()
  );

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
    { title: "Bouquets", links: uniqueBouquets.map(p => ({
      to: `/bouquets/all/${p.shopifyHandle}`, label: p.name,
    }))},
    { title: "Room Decors", links: roomDecorPackages.map(pkg => ({
      to: `/room-decors/${pkg.id}`, label: pkg.name,
    }))},
    { title: "Blog Articles", links: blogArticles.map(a => ({
      to: `/blog/${a.slug}`, label: a.title.split('|')[0].trim(),
    }))},
    { title: "Landing Pages", links: landingPages.map(p => ({
      to: `/${p.slug}`, label: p.h1.replace(/ [–—|].*/g, ''),
    }))},
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
