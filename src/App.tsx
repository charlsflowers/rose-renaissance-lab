import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { Navigate } from "@/i18n/LocalizedRouter";
import FloatingCart from "@/components/FloatingCart";
import CookieBanner from "@/components/CookieBanner";
import { landingPages } from "@/lib/landingPagesData";
import { bouquetProducts } from "@/lib/catalogData";
import { slugForHandle, slugEsForHandle, handleFromSlug, BOUQUET_SLUGS } from "@/lib/bouquetSlugs";
import { COLOR_COLLECTIONS } from "@/lib/colorCollections";
import { useTranslation } from "@/i18n/LanguageContext";
import { roomDecorPackages } from "@/lib/roomDecorData";
import { captureTrackingParams } from "@/lib/trackingParams";
import { usePageTracking } from "@/hooks/usePageTracking";
import ScrollToTop from "./components/ScrollToTop";
import { LanguageProvider } from "./i18n/LanguageContext";

// Eager: Index (LCP/home) + NotFound (tiny fallback) stay in main bundle
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ShortLink from "./pages/ShortLink";
import { SHORT_LINKS } from "@/lib/shortLinks";

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
const StudioPage = lazy(() => import("./pages/StudioPage"));
const MothersDayCollection = lazy(() => import("./pages/MothersDayCollection"));
const CityShippingPage = lazy(() => import("./pages/CityShippingPage"));
const CityIndexPage = lazy(() => import("./pages/CityIndexPage"));
const OccasionPage = lazy(() => import("./pages/OccasionPage"));
const OccasionsIndexPage = lazy(() => import("./pages/OccasionsIndexPage"));
const FlowerTypesIndexPage = lazy(() => import("./pages/FlowerTypesIndexPage"));

const queryClient = new QueryClient();

/**
 * Resolver for the clean ficha route `/bouquets/:slug` (and the legacy
 * `/bouquets/:type/:productId` compat route).
 *
 * Resolution order:
 *   1. If the segment is a known SEO slug (EN or ES) → render the PDP.
 *   2. If it is an old internal id (bq-*) → 301 to the new slug.
 *   3. If it is a raw shopifyHandle (old /bouquets/all/<handle> or
 *      /bouquets/:type/<handle> links / ads) → 301 to the new slug.
 *   4. Otherwise → render the PDP (it shows its own not-found state).
 */
const BouquetSlugResolver = () => {
  const { slug, type, productId } = useParams<{ slug?: string; type?: string; productId?: string }>();
  const { language } = useTranslation();
  // `productId` is set on the legacy /bouquets/:type/:productId route; `slug` on the clean route.
  const segment = slug ?? productId;

  // Redirect a handle to its clean ficha URL, using the slug that matches the
  // active language so the destination already equals the canonical.
  const cleanFichaPath = (handle: string) =>
    language === "es"
      ? `/es/bouquets/${slugEsForHandle(handle)}`
      : `/bouquets/${slugForHandle(handle)}`;

  // Mother's Day fichas keep their dedicated /bouquets/mothers-day/<handle> URLs untouched.
  if (type === "mothers-day") return <BouquetProductDetail />;

  if (segment) {
    const handle = handleFromSlug(segment);
    if (handle) {
      const m = BOUQUET_SLUGS[handle];
      // Already a clean SEO slug (EN or ES) → render in place.
      if (m && (m.slug === segment || m.slugEs === segment)) return <BouquetProductDetail />;
      // segment was a raw shopifyHandle → 301 to the language-matched clean slug.
      return <Navigate to={cleanFichaPath(handle)} replace noLocalize />;
    }
    // Legacy internal id (bq-*) → map to handle → 301 to clean slug.
    if (segment.startsWith("bq-")) {
      const product = bouquetProducts.find(p => p.id === segment);
      if (product) return <Navigate to={cleanFichaPath(product.shopifyHandle)} replace noLocalize />;
    }
  }
  return <BouquetProductDetail />;
};

/** 301 redirect: /mothers-day/<handle> → /bouquets/mothers-day/<handle> */
const MothersDayProductRedirect = () => {
  const { handle } = useParams<{ handle: string }>();
  if (!handle) return <Navigate to="/mothers-day" replace />;
  return <Navigate to={`/bouquets/mothers-day/${handle}`} replace />;
};

/** Defensive redirect for /room-decors/:packageId when prefixed with rd-* (legacy/duplicate URLs) */
const RoomDecorRedirect = () => {
  const { packageId } = useParams<{ packageId: string }>();
  if (packageId?.startsWith("rd-")) {
    return <Navigate to={`/room-decors/${packageId.slice(3)}`} replace />;
  }
  return <RoomDecorDetail />;
};

/** Redirect Shopify-style URLs (/products/:handle) coming from Meta/Instagram ads */
const ShopifyProductRedirect = () => {
  const { handle } = useParams<{ handle: string }>();
  if (!handle) return <Navigate to="/" replace />;

  // Check room decor packages first (love-bomb, overly-romantic, deluxe-love-package)
  const roomDecor = roomDecorPackages.find(p => p.shopifyHandle === handle);
  if (roomDecor) return <Navigate to={`/room-decors/${roomDecor.id}`} replace />;

  // Then check bouquets — redirect to the new keyword-first slug
  const bouquet = bouquetProducts.find(p => p.shopifyHandle === handle);
  if (bouquet) return <Navigate to={`/bouquets/${slugForHandle(bouquet.shopifyHandle)}`} replace />;

  // Unknown handle → fall back to bouquets listing
  return <Navigate to="/bouquets" replace />;
};

const AppContent = () => {
  usePageTracking();
  useEffect(() => {
    captureTrackingParams();
  }, []);
  // Routes are mounted twice: once at root (EN) and once under /es (ES).
  // The path strings inside `renderRoutes` are RELATIVE — no leading slash.
  const renderRoutes = () => (
    <>
      <Route index element={<Index />} />
      {Object.keys(SHORT_LINKS).map((slug) => (
        <Route key={`short-${slug}`} path={slug} element={<ShortLink slug={slug} />} />
      ))}
      <Route path="products/:handle" element={<ShopifyProductRedirect />} />
      <Route path="categoria/:slug" element={<CategoryProducts />} />
      <Route path="categoria/:slug/:productId" element={<CategoryProductDetail />} />
      <Route path="bouquets/personalizar" element={<BouquetBuilder />} />
      {/* Legacy /bouquet-builder → 301 (client-side) to the custom builder. */}
      <Route path="bouquet-builder" element={<Navigate to="/bouquets/personalizar" replace />} />
      {/* Indexable subcategory pages (clean URLs replacing ?filter=...) */}
      <Route path="bouquets/single-color" element={<BouquetProducts initialFilter="un-color" />} />
      <Route path="bouquets/mixed-color" element={<BouquetProducts initialFilter="mezclas" />} />
      <Route path="bouquets/zodiac" element={<BouquetProducts initialFilter="zodiac" />} />
      <Route path="bouquets/bicolor" element={<BouquetProducts initialFilter="bicolor" />} />
      {/* Indexable color collections — one per rose color, EN slug + native ES slug.
          Both slugs are registered in the shared tree so /bouquets/<en> and
          /es/bouquets/<es> both resolve. Must precede the /bouquets/:slug ficha route. */}
      {COLOR_COLLECTIONS.flatMap((c) => [
        <Route key={`color-${c.slug}`} path={`bouquets/${c.slug}`} element={<BouquetProducts colorCollection={c.color} />} />,
        <Route key={`color-${c.slugEs}`} path={`bouquets/${c.slugEs}`} element={<BouquetProducts colorCollection={c.color} />} />,
      ])}
      {/* Legacy two-segment fichas (/bouquets/all/<handle>, /bouquets/mothers-day/<handle>, etc.)
          → resolved/301'd by BouquetSlugResolver (kept indefinitely for backlinks + ads). */}
      <Route path="bouquets/:type/:productId" element={<BouquetSlugResolver />} />
      {/* Clean keyword-first ficha URL: /bouquets/<slug> (EN) and /es/bouquets/<slugEs> (ES). */}
      <Route path="bouquets/:slug" element={<BouquetSlugResolver />} />
      <Route path="bouquets" element={<BouquetProducts />} />
      <Route path="mothers-day" element={<MothersDayCollection />} />
      <Route path="mothers-day/:handle" element={<MothersDayProductRedirect />} />
      <Route path="room-decors/rd-deluxe-love" element={<Navigate to="/room-decors/deluxe-love-package" replace />} />
      <Route path="room-decors/:packageId" element={<RoomDecorRedirect />} />
      <Route path="room-decors" element={<RoomDecors />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="delivery" element={<Delivery />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
      <Route path="terms-of-service" element={<TermsOfService />} />
      <Route path="refund-policy" element={<RefundPolicy />} />
      <Route path="shipping-policy" element={<ShippingPolicy />} />
      <Route path="cookie-policy" element={<CookiePolicy />} />
      <Route path="sitemap" element={<SitemapPage />} />
      <Route path="blog" element={<Blog />} />
      <Route path="blog/:slug" element={<BlogArticle />} />
      {/* Nationwide FedEx city landing pages — index + per-city, EN & ES slugs.
          Mounted twice (root + /es) so both /flower-delivery and /es/envio-de-flores resolve. */}
      <Route path="flower-delivery" element={<CityIndexPage />} />
      <Route path="flower-delivery/:city" element={<CityShippingPage />} />
      <Route path="envio-de-flores" element={<CityIndexPage />} />
      <Route path="envio-de-flores/:city" element={<CityShippingPage />} />
      {/* Occasion collection pages — indexable EN + native ES slugs.
          Mounted twice (root + /es). The index slug ("occasions" / "ocasiones")
          matches first via the dedicated routes; everything else falls through
          to OccasionPage which looks up by slug or slugEs. */}
      <Route path="collections/occasions" element={<OccasionsIndexPage />} />
      <Route path="collections/ocasiones" element={<OccasionsIndexPage />} />
      <Route path="collections/flowers" element={<FlowerTypesIndexPage />} />
      <Route path="collections/flores" element={<FlowerTypesIndexPage />} />
      <Route path="collections/:slug" element={<OccasionPage />} />
      {landingPages.map(page => (
        <Route key={page.slug} path={page.slug} element={<LandingPage />} />
      ))}
      <Route path="checkout" element={<Checkout />} />
      <Route path="*" element={<NotFound />} />
    </>
  );

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
        {/* Studio admin — EN only, no /es version */}
        <Route path="/studio/*" element={<StudioPage />} />
        {/* Spanish routes — same tree under /es prefix */}
        <Route path="/es">
          {renderRoutes()}
        </Route>
        {/* English routes — root */}
        {renderRoutes()}
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
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
