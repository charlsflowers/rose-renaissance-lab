import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import FloatingCart from "@/components/FloatingCart";
import Index from "./pages/Index";
import BouquetBuilder from "./pages/BouquetBuilder";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import CategoryProducts from "./pages/CategoryProducts";
import CategoryProductDetail from "./pages/CategoryProductDetail";
import BouquetProducts from "./pages/BouquetProducts";
import BouquetProductDetail from "./pages/BouquetProductDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FloatingCart />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/categoria/:slug" element={<CategoryProducts />} />
            <Route path="/categoria/:slug/:productId" element={<CategoryProductDetail />} />
            <Route path="/bouquets/personalizar" element={<BouquetBuilder />} />
            <Route path="/bouquets/:type/:productId" element={<BouquetProductDetail />} />
            <Route path="/bouquets" element={<BouquetProducts />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
