import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const ShippingPolicy = () => (
  <div className="min-h-screen bg-background">
    <SeoHead title="Shipping & Pickup Policy – Charls Flowers" description="Shipping and pickup policy for Charls Flowers Miami. Delivery rates, preparation times, and pickup hours." path="/shipping-policy" />
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-title-retro text-4xl text-primary text-center mb-8">Shipping & Pickup</h1>
        <div className="font-body text-sm text-muted-foreground space-y-4 leading-relaxed">
          <p>At <strong>Charls Flowers</strong>, we take pride in delivering fresh, beautiful flowers right to your door or ready for pickup at our store.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Delivery Rates</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>0 to 5 miles:</strong> $20 per delivery.</li>
            <li><strong>More than 5 miles, up to 87 miles:</strong> $20 for the first 5 miles + $1.60 for each additional mile.</li>
          </ul>
          <p className="italic">Example: For a 10-mile delivery, the cost would be: $20 (first 5 miles) + (10-5) × $1.60 = <strong>$28</strong>.</p>
          <p><strong>Taxes:</strong> All orders are subject to a 7% sales tax (6% Florida State + 1% Miami-Dade County), calculated and shown at checkout.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Order Preparation</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>All orders need a <strong>minimum of 2 hours</strong> to be prepared.</li>
            <li><strong>Home Delivery:</strong> Your order will be delivered after the 2-hour preparation time.</li>
            <li><strong>Store Pickup:</strong> Orders will be ready for pickup <strong>2 hours after placing your order</strong>.</li>
          </ul>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Delivery & Pickup Hours</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Monday – Friday:</strong> 8:00 AM – 7:00 PM</li>
            <li><strong>Saturday:</strong> 8:00 AM – 6:00 PM</li>
            <li><strong>Sunday:</strong> 8:00 AM – 5:00 PM</li>
          </ul>
          <p className="italic">Note: Orders placed within 1 hour of closing will be scheduled for the next business day.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Important Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>All our flowers are <strong>customized and personalized</strong>, so cancellations and refunds are not available.</li>
            <li>Deliveries are only available within <strong>87 miles</strong>.</li>
            <li>We reserve the right to adjust delivery times in case of extreme weather or unusual traffic conditions.</li>
          </ul>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default ShippingPolicy;
