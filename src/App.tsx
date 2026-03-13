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
import ShopifyCheckoutRedirect from "./pages/ShopifyCheckoutRedirect";

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
        <Route path="/cart/c/:cartId" element={<ShopifyCheckoutRedirect />} />
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
