import { useState } from "react";
import { Star, ShoppingBag, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import ReviewUpsellDialog from "@/components/ReviewUpsellDialog";

export interface ReviewCartData {
  bouquetType: string;
  color: string;
  roses: number;
  price: number;
}

export type ReviewCategory = "bouquets" | "arreglos" | "cajas" | "cestas" | "jarrones" | "osos" | "personalizados";

export interface ReviewData {
  id: string;
  name: string;
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
              alt={`Reseña de ${review.name}`}
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

            <p className="font-display text-sm font-semibold text-foreground mb-1">
              — {review.name}
            </p>
            <p className="font-body text-xs text-muted-foreground mb-4">
              {review.productLabel} · {review.cartData.roses} rosas · ${review.cartData.price}
            </p>

            <div className="flex flex-row sm:flex-col gap-2">
              <button
                onClick={() => openDialog("cart")}
                className="inline-flex items-center gap-1.5 flex-1 justify-center bg-primary text-primary-foreground px-3 py-2.5 font-body text-[9px] sm:text-xs tracking-wider sm:tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm"
              >
                <ShoppingBag className="w-3 h-3 shrink-0" />
                Añadir al carrito
              </button>
              <button
                onClick={() => openDialog("buy")}
                className="inline-flex items-center gap-1.5 flex-1 justify-center border border-primary text-primary px-3 py-2.5 font-body text-[9px] sm:text-xs tracking-wider sm:tracking-widest uppercase hover:bg-primary/10 transition-colors rounded-sm"
              >
                <CreditCard className="w-3 h-3 shrink-0" />
                Pedir y pagar
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
