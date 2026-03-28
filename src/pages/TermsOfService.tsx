import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <SeoHead title="Terms of Service – Charls Flowers" description="Terms of Service for Charls Flowers Miami. Read our terms and conditions for using our flower delivery services." path="/terms-of-service" />
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-title-retro text-4xl text-primary text-center mb-8">Terms of Service</h1>
        <div className="font-body text-sm text-muted-foreground space-y-4 leading-relaxed">
          <h2 className="font-display text-lg font-semibold text-foreground">Overview</h2>
          <p>Welcome to Charls Flowers! The terms "we", "us" and "our" refer to Charls Flowers. Charls Flowers operates this store and website, including all related information, content, features, tools, products and services in order to provide you, the customer, with a curated shopping experience (the "Services"). By visiting, interacting with or using our Services, you agree to be bound by these Terms of Service and our Privacy Policy.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Section 1 – Access and Account</h2>
          <p>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You are solely responsible for maintaining the security of your account credentials.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Section 2 – Our Products</h2>
          <p>We have made every effort to provide an accurate representation of our products. However, colors or product appearance may differ from how they appear on your screen. All descriptions are subject to change without notice.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Section 3 – Orders</h2>
          <p>When you place an order, you are making an offer to purchase. Charls Flowers reserves the right to accept or decline your order. Your order is not accepted until we confirm acceptance. Please review your order carefully before submitting.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Section 4 – Prices and Billing</h2>
          <p>Prices, discounts and promotions are subject to change without notice. Unless expressly stated, posted prices do not include taxes, shipping, handling, customs or import charges.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Section 5 – Shipping and Delivery</h2>
          <p>We are not liable for shipping and delivery delays. All delivery times are estimates only. Once we transfer products to the carrier, title and risk of loss passes to you.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Section 6 – Intellectual Property</h2>
          <p>Our Services, including all trademarks, text, images, graphics, video, and audio are owned by Charls Flowers or its licensors and protected by intellectual property laws.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Contact</h2>
          <p>For questions about these Terms, contact us at <a href="mailto:charlsflowerscorp@gmail.com" className="text-primary hover:underline">charlsflowerscorp@gmail.com</a>.</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default TermsOfService;
