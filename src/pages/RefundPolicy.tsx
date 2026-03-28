import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const RefundPolicy = () => (
  <div className="min-h-screen bg-background">
    <SeoHead title="Refund & Return Policy – Charls Flowers" description="Refund and return policy for Charls Flowers Miami. Custom and perishable flower products policy." path="/refund-policy" />
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-title-retro text-4xl text-primary text-center mb-8">Refund & Return Policy</h1>
        <div className="font-body text-sm text-muted-foreground space-y-4 leading-relaxed">
          <p>At <strong>Charls Flowers</strong>, all of our flowers and arrangements are <strong>customized and personalized</strong>, which means:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Cancellations and returns are generally not available</strong> once an order is placed.</li>
            <li><strong>Refunds are not available</strong> because each order is specially made for you and is perishable.</li>
          </ul>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Exception – Immediate Cancellation</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>If you contact us <strong>within 1 hour of placing your order</strong>, we may issue a <strong>full refund</strong> because the bouquet likely has not yet been prepared (preparation time is 2 hours).</li>
            <li>Please contact us immediately at <a href="mailto:charlsflowerscorp@gmail.com" className="text-primary hover:underline">charlsflowerscorp@gmail.com</a> to request this.</li>
          </ul>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Damages and Issues</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Please <strong>inspect your order upon delivery or pickup</strong>.</li>
            <li>If your item arrives <strong>defective, damaged, or incorrect</strong>, contact us immediately at <a href="mailto:charlsflowerscorp@gmail.com" className="text-primary hover:underline">charlsflowerscorp@gmail.com</a> so we can evaluate the issue and make it right.</li>
          </ul>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Exceptions / Non-Returnable Items</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>All flowers, plants, and perishable goods</li>
            <li>Customized or personalized products</li>
            <li>Gift cards and sale items</li>
          </ul>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Exchanges</h2>
          <p>Because each product is unique and personalized, <strong>exchanges are not available</strong>. If you would like a different item, please place a new order.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Contact</h2>
          <p>For any issues, contact us at <a href="mailto:charlsflowerscorp@gmail.com" className="text-primary hover:underline">charlsflowerscorp@gmail.com</a>.</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default RefundPolicy;
