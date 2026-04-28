import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import FloatingCart from "@/components/FloatingCart";
import CookieBanner from "@/components/CookieBanner";
import { landingPages } from "@/lib/landingPagesData";
import { bouquetProducts } from "@/lib/catalogData";
import { roomDecorPackages } from "@/lib/roomDecorData";
import ScrollToTop from "./components/ScrollToTop";

// Eager: Index (LCP/home) + NotFound (tiny fallback) stay in main bundle
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-loaded route components (code-split)
const BouquetBuilder = lazy(() => import("./pages/BouquetBuilder"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CategoryProducts = lazy(() => import("./pages/CategoryProducts"));
const CategoryProductDetail = lazy(() => import("./pages/CategoryProductDetail"));
const BouquetProducts = lazy(() => import("./pages/BouquetProducts"));
const BouquetProductDetail = lazy(() => import("./pages/BouquetProductDetail"));
const RoomDecors = lazy(() => import("./pages/RoomDecors"));
const RoomDecorDetail = lazy(() => import("./pages/RoomDecorDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Delivery = lazy(() => import("./pages/Delivery"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const SitemapPage = lazy(() => import("./pages/SitemapPage"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

const queryClient = new QueryClient();

/** 301-style redirect for old /bouquets/:type/bq-* URLs */
const OldBouquetRedirect = () => {
  const { type, productId } = useParams<{ type: string; productId: string }>();
  if (productId?.startsWith("bq-")) {
    const product = bouquetProducts.find(p => p.id === productId);
    if (product) return <Navigate to={`/bouquets/${type}/${product.shopifyHandle}`} replace />;
  }
  return <BouquetProductDetail />;
};

/** Redirect Shopify-style URLs (/products/:handle) coming from Meta/Instagram ads */
const ShopifyProductRedirect = () => {
  const { handle } = useParams<{ handle: string }>();
  if (!handle) return <Navigate to="/" replace />;

  // Check room decor packages first (love-bomb, overly-romantic, deluxe-love-package)
  const roomDecor = roomDecorPackages.find(p => p.shopifyHandle === handle);
  if (roomDecor) return <Navigate to={`/room-decors/${roomDecor.id}`} replace />;

  // Then check bouquets
  const bouquet = bouquetProducts.find(p => p.shopifyHandle === handle);
  if (bouquet) return <Navigate to={`/bouquets/all/${bouquet.shopifyHandle}`} replace />;

  // Unknown handle → fall back to bouquets listing
  return <Navigate to="/bouquets" replace />;
};

const AppContent = () => {
  useCartSync();
  return (
    <>
      <ScrollToTop />
      <FloatingCart />
      <CookieBanner />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        }
      >
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products/:handle" element={<ShopifyProductRedirect />} />
        <Route path="/categoria/:slug" element={<CategoryProducts />} />
        <Route path="/categoria/:slug/:productId" element={<CategoryProductDetail />} />
        <Route path="/bouquets/personalizar" element={<BouquetBuilder />} />
        <Route path="/bouquets/:type/:productId" element={<OldBouquetRedirect />} />
        <Route path="/bouquets" element={<BouquetProducts />} />
        <Route path="/room-decors/rd-love-bomb" element={<Navigate to="/room-decors/love-bomb" replace />} />
        <Route path="/room-decors/rd-overly-romantic" element={<Navigate to="/room-decors/overly-romantic" replace />} />
        <Route path="/room-decors/rd-deluxe-love" element={<Navigate to="/room-decors/deluxe-love-package" replace />} />
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
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        {landingPages.map(page => (
          <Route key={page.slug} path={`/${page.slug}`} element={<LandingPage />} />
        ))}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
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
