import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getLandingPage } from "@/lib/landingPagesData";
import { ArrowRight, MapPin, Truck, Store, Clock, Sparkles } from "lucide-react";

const LandingPage = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace("/", "");
  const page = getLandingPage(slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!page) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground font-body">Page not found</p>
          <Link to="/" className="text-primary font-body underline mt-4 inline-block">Go home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={page.seoTitle} description={page.seoDescription} path={`/${page.slug}`} />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: page.h1.split("|")[0].trim() }]} />

          <div className="max-w-4xl mx-auto">
            <h1 className="font-title-retro text-3xl md:text-5xl text-foreground mb-6 text-center">{page.h1}</h1>
            <p className="text-muted-foreground font-body text-base md:text-lg leading-relaxed mb-12 text-center max-w-2xl mx-auto">{page.intro}</p>

            {/* Services */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-cream rounded-sm p-6 text-center">
                <Truck className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">Same-Day Delivery</h3>
                <p className="font-body text-sm text-muted-foreground">Order before 3PM for delivery today. Up to 87 miles from Miami.</p>
              </div>
              <div className="bg-cream rounded-sm p-6 text-center">
                <Store className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">Free Pickup</h3>
                <p className="font-body text-sm text-muted-foreground">Pick up for free at 7261 NW 12th St, Miami, FL 33126.</p>
              </div>
              <div className="bg-cream rounded-sm p-6 text-center">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">Custom Bouquets</h3>
                <p className="font-body text-sm text-muted-foreground">Design your own bouquet with AI preview. 50-200 roses, any color.</p>
              </div>
            </div>

            {/* Delivery Rates */}
            <div className="bg-card border border-border rounded-sm p-8 mb-16">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6 text-center">Delivery Rates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-sm">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">0–5 miles</p>
                    <p className="font-body text-xs text-muted-foreground">$20 flat rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-sm">
                  <Truck className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">5–87 miles</p>
                    <p className="font-body text-xs text-muted-foreground">$1.60 per mile</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center mt-4">
                <Clock className="w-4 h-4 text-primary" />
                <p className="font-body text-xs text-muted-foreground">Minimum 2 hours preparation time</p>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-sm overflow-hidden mb-16" style={{ minHeight: 300 }}>
              <iframe
                title="Charls Flowers Miami Location"
                src="https://storage.googleapis.com/maps-solutions-0p9mp01my4/locator-plus/twwi/locator-plus.html"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/bouquets" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm">
                Shop Bouquets <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/bouquets/personalizar" className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/5 transition-colors rounded-sm">
                Custom Bouquet <Sparkles className="w-4 h-4" />
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
