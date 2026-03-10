import { useState } from "react";
import { Star, ShoppingBag, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import ReviewUpsellDialog from "@/components/ReviewUpsellDialog";

export interface ReviewCartData {
  bouquetType: string;
  color: string;
  roses: number;
  price: number;
  productImage?: string;
  pricingTier?: import('@/lib/productData').PricingTier;
}

export type ReviewCategory = "bouquets" | "arreglos" | "cajas" | "cestas" | "jarrones" | "osos" | "personalizados";

export interface ReviewData {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  text: string;
  image: string;
  productLabel: string;
  category: ReviewCategory;
  cartData: ReviewCartData;
}

const ReviewCard = ({ review, index }: { review: ReviewData; index: number }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"cart" | "buy">("cart");

  const openDialog = (mode: "cart" | "buy") => {
    setDialogMode(mode);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="group">
        <div className="bg-card rounded-sm overflow-hidden border border-border">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={review.image}
              alt={`Review by ${review.name}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
          </div>

          <div className="p-5">
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? "text-gold fill-gold" : "text-muted-foreground/30"}`}
                />
              ))}
            </div>

            <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-3 leading-relaxed">
              "{review.text}"
            </p>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border">
                {review.avatar ? (
                  <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-display text-xs font-semibold">
                    {review.name.charAt(0)}
                  </div>
                )}
              </div>
              <p className="font-display text-sm font-semibold text-foreground">
                {review.name}
              </p>
            </div>
            <p className="font-body text-xs text-muted-foreground mb-4">
              {review.productLabel} · {review.cartData.roses} roses · ${review.cartData.price}
            </p>

            <div className="flex flex-col gap-1.5 sm:gap-2">
              <button
                onClick={() => openDialog("cart")}
                className="inline-flex items-center gap-1.5 w-full justify-center bg-primary text-primary-foreground px-3 py-2 sm:py-2.5 font-body text-[9px] sm:text-xs tracking-wider sm:tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm"
              >
                <ShoppingBag className="w-3 h-3 shrink-0" />
                Add to cart
              </button>
              <button
                onClick={() => openDialog("buy")}
                className="inline-flex items-center gap-1.5 w-full justify-center border border-primary text-primary px-3 py-2 sm:py-2.5 font-body text-[9px] sm:text-xs tracking-wider sm:tracking-widest uppercase hover:bg-primary/10 transition-colors rounded-sm"
              >
                <CreditCard className="w-3 h-3 shrink-0" />
                Order & pay
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReviewUpsellDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cartData={review.cartData}
        productLabel={review.productLabel}
        mode={dialogMode}
      />
    </>
  );
};

export default ReviewCard;
