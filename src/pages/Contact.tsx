import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <SeoHead
      title="Contact Charls Flowers – Miami FL"
      description="Get in touch with Charls Flowers Miami. Call 904-442-4042, visit us at 7261 NW 12th St, or send a message. Same-day flower delivery up to 87 miles."
      path="/contact"
    />
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="font-title-retro text-4xl md:text-5xl text-primary text-center mb-10">Contact Charls Flowers – Miami FL</h1>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">Address</p>
                <p className="font-body text-sm text-muted-foreground">7261 NW 12th Street, Miami, FL 33126</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">Phone</p>
                <a href="tel:9044424042" className="font-body text-sm text-primary hover:underline">904-442-4042</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">Email</p>
                <a href="mailto:charlsflowerscorp@gmail.com" className="font-body text-sm text-primary hover:underline">charlsflowerscorp@gmail.com</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Clock className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">Hours</p>
                <p className="font-body text-sm text-muted-foreground">Mon–Fri 8AM–7PM</p>
                <p className="font-body text-sm text-muted-foreground">Sat 8AM–6PM | Sun 8AM–5PM</p>
              </div>
            </div>
            <p className="font-body text-xs text-muted-foreground italic">Same-day delivery up to 87 miles from Miami</p>
          </div>

          {/* Contact Form */}
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
            <input type="text" placeholder="Your name" className="w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="email" placeholder="Your email" className="w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <textarea placeholder="Your message" rows={5} className="w-full bg-card border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm w-full">Send Message</button>
          </form>
        </div>

        {/* Google Maps */}
        <div className="aspect-video rounded-sm overflow-hidden border border-border" style={{ minHeight: 300 }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.6!2d-80.3999!3d25.7617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDQ1JzQyLjEiTiA4MMKwMjMnNTkuNiJX!5e0!3m2!1sen!2sus!4v1"
            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            title="Charls Flowers Miami location"
          />
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Contact;
