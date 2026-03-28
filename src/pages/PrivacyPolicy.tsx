import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <SeoHead title="Privacy Policy – Charls Flowers" description="Privacy Policy for Charls Flowers Miami. Learn how we collect, use, and protect your personal information." path="/privacy-policy" />
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-title-retro text-4xl text-primary text-center mb-8">Privacy Policy</h1>
        <div className="font-body text-sm text-muted-foreground space-y-4 leading-relaxed">
          <p><strong>Last updated: March 21, 2026</strong></p>
          <p>Charls Flowers operates this store and website, including all related information, content, features, tools, products and services, in order to provide you, the customer, with a curated shopping experience (the "Services"). Charls Flowers is powered by Shopify, which enables us to provide the Services to you. This Privacy Policy describes how we collect, use, and disclose your personal information when you visit, use, or make a purchase or other transaction using the Services or otherwise communicate with us.</p>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Personal Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Contact details</strong> including your name, address, billing address, shipping address, phone number, and email address.</li>
            <li><strong>Financial information</strong> including credit card, debit card, and financial account numbers, payment details.</li>
            <li><strong>Account information</strong> including your username, password, preferences and settings.</li>
            <li><strong>Transaction information</strong> including the items you view, put in your cart, or purchase.</li>
            <li><strong>Communications with us</strong> including customer support inquiries.</li>
            <li><strong>Device information</strong> including your IP address and other unique identifiers.</li>
            <li><strong>Usage information</strong> including how you interact with the Services.</li>
          </ul>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Provide and Improve Services:</strong> Process payments, fulfill orders, manage your account.</li>
            <li><strong>Marketing:</strong> Send promotional communications based on your preferences.</li>
            <li><strong>Security:</strong> Detect and prevent fraud, protect our services.</li>
            <li><strong>Communication:</strong> Customer support and business relationship maintenance.</li>
            <li><strong>Legal Reasons:</strong> Comply with applicable law.</li>
          </ul>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Your Rights</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Right to Access/Know:</strong> Request access to personal information we hold.</li>
            <li><strong>Right to Delete:</strong> Request deletion of your personal information.</li>
            <li><strong>Right to Correct:</strong> Request correction of inaccurate information.</li>
            <li><strong>Right of Portability:</strong> Receive a copy of your information.</li>
          </ul>
          <h2 className="font-display text-lg font-semibold text-foreground pt-4">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, contact us at <a href="mailto:charlsflowerscorp@gmail.com" className="text-primary hover:underline">charlsflowerscorp@gmail.com</a>.</p>
          <p>Charls Flowers<br/>7261 NW 12th Street, Miami FL 33126, United States</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default PrivacyPolicy;
