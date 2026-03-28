import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const CookiePolicy = () => (
  <div className="min-h-screen bg-background">
    <SeoHead title="Cookie Policy – Charls Flowers" description="Cookie Policy for Charls Flowers Miami. Learn about cookies we use and your choices." path="/cookie-policy" />
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-title-retro text-4xl text-primary text-center mb-8">Cookie Policy</h1>
        <div className="font-body text-sm text-muted-foreground space-y-4 leading-relaxed">
          <p><strong>Last updated: March 21, 2026</strong></p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Who We Are</h2>
          <p>Charls Flowers is an online floral boutique based in Miami, Florida. We deliver and offer local pickup of premium flower bouquets and arrangements.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">What Are Cookies</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, analyze traffic, and provide a better user experience.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Essential Cookies</h2>
          <p>Required for the website to function. They cannot be disabled. These include session management and cart functionality.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Analytics Cookies</h2>
          <p>Help us understand how visitors interact with our site (Google Analytics).</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Functional Cookies</h2>
          <p>Enable enhanced features and personalization, including Google Maps embeds for our Miami location.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Your Choices</h2>
          <p>You can manage cookies through your browser settings. Note that disabling essential cookies may affect your ability to place orders.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Contact Us</h2>
          <p><a href="mailto:charlsflowerscorp@gmail.com" className="text-primary hover:underline">charlsflowerscorp@gmail.com</a><br/>7261 NW 12th St, Miami, FL 33126</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default CookiePolicy;
