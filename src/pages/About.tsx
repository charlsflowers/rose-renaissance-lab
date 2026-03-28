import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { Flower2, Truck, Store, Sparkles, Star, MapPin } from "lucide-react";

const About = () => (
  <div className="min-h-screen bg-background">
    <SeoHead
      title="Miami's Premier Flower Shop – Charls Flowers"
      description="Charls Flowers is Miami's top flower shop. Handcrafted bouquets from 50 to 200 roses, AI preview, same-day delivery up to 87 miles, free pickup."
      path="/about"
    />
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-title-retro text-4xl md:text-5xl text-primary text-center mb-10">Miami's Premier Flower Shop</h1>

        <div className="prose-sm font-body text-muted-foreground space-y-5 mb-12">
          <p>Charls Flowers was born in Miami in October 2025, but my story started long before that. After years working in the floral industry, I saw firsthand what was broken in the market — overpriced bouquets, expensive delivery fees, and a customer experience that stopped the moment the order was placed.</p>
          <p>So I decided to do things differently.</p>
          <p>At Charls Flowers, I offer the same premium quality you'd find anywhere in Miami — the same fresh, hand-selected flowers — but at prices that actually make sense. I believe beautiful flowers shouldn't come with an inflated price tag, and neither should getting them delivered to your door.</p>
          <p>But what truly sets us apart is what happens after you place your order. My delivery team isn't just drivers — they're professionals I personally selected because they care. They handle every bouquet with the attention it deserves. No cramming dozens of arrangements into a van where they shift and fall. Each delivery is treated as if it were the only one. If you're a few minutes away when they arrive, they wait. They won't leave until your flowers are safely in your hands, in perfect condition.</p>
          <p>I'm also building something bigger. While I'm proud to serve Miami, I'm actively working to bring Charls Flowers to customers across the United States — because everyone deserves access to premium flowers at fair prices, no matter where they are.</p>
          <p>This is more than a flower shop. It's a standard I set for myself every single day.</p>
          <p className="font-display text-foreground font-semibold">— Carlos Chorrero Ferruz, Founder of Charls Flowers</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Flower2, title: "50–200 Roses", desc: "Per bouquet, handcrafted" },
            { icon: Sparkles, title: "AI Preview", desc: "See before you order" },
            { icon: Star, title: "3 Finishes", desc: "Natural, glitter, painted" },
            { icon: Truck, title: "Same-Day Delivery", desc: "Up to 87 miles" },
            { icon: Store, title: "Free Pickup", desc: "Miami, FL 33126" },
            { icon: MapPin, title: "7261 NW 12th St", desc: "Miami, Florida" },
          ].map((f, i) => (
            <div key={i} className="bg-cream rounded-sm p-5 text-center">
              <f.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="font-display text-sm font-semibold text-foreground">{f.title}</p>
              <p className="font-body text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/bouquets" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm">
            Shop Bouquets
          </Link>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
