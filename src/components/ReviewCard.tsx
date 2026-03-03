import { Link } from "react-router-dom";
import { Star, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export interface ReviewData {
  id: string;
  name: string;
  rating: number;
  text: string;
  image: string;
  productLink: string;
  productLabel: string;
}

const ReviewCard = ({ review, index }: { review: ReviewData; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-card rounded-sm overflow-hidden border border-border">
        {/* Review image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={review.image}
            alt={`Reseña de ${review.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
        </div>

        {/* Review content */}
        <div className="p-5">
          {/* Stars */}
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

          <p className="font-display text-sm font-semibold text-foreground mb-4">
            — {review.name}
          </p>

          {/* CTA */}
          <Link
            to={review.productLink}
            className="inline-flex items-center gap-2 w-full justify-center bg-primary text-primary-foreground px-4 py-3 font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Pedir uno igual
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
