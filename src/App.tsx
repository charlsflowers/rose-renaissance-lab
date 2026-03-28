import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import FloatingCart from "@/components/FloatingCart";
import Index from "./pages/Index";
import BouquetBuilder from "./pages/BouquetBuilder";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import CategoryProducts from "./pages/CategoryProducts";
import CategoryProductDetail from "./pages/CategoryProductDetail";
import BouquetProducts from "./pages/BouquetProducts";
import BouquetProductDetail from "./pages/BouquetProductDetail";
import RoomDecors from "./pages/RoomDecors";
import RoomDecorDetail from "./pages/RoomDecorDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Delivery from "./pages/Delivery";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RefundPolicy from "./pages/RefundPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import SitemapPage from "./pages/SitemapPage";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  return (
    <>
      <FloatingCart />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/categoria/:slug" element={<CategoryProducts />} />
        <Route path="/categoria/:slug/:productId" element={<CategoryProductDetail />} />
        <Route path="/bouquets/personalizar" element={<BouquetBuilder />} />
        <Route path="/bouquets/:type/:productId" element={<BouquetProductDetail />} />
        <Route path="/bouquets" element={<BouquetProducts />} />
        <Route path="/room-decors/:packageId" element={<RoomDecorDetail />} />
        <Route path="/room-decors" element={<RoomDecors />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
