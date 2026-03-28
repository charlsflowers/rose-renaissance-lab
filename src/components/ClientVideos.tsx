import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import VideoOrderDialog from "@/components/VideoOrderDialog";
import { useTranslation } from "@/i18n/LanguageContext";

// Product images for cart
import bqRojoImg from '@/assets/bq-rojo.png';
import bqLightpinkImg from '@/assets/bq-lightpink.png';
import bqMoradoImg from '@/assets/bq-morado.png';
import bqBlancoImg from '@/assets/bq-blanco.png';
import bqMixLightpinkBlancoImg from '@/assets/bq-mix-lightpink-blanco.png';

export interface VideoProduct {
  id: number;
  title: string;
  src: string;
  roses: number;
  color: string;
  hasCustomText?: boolean;
  customFields?: Array<{ label: string; placeholder: string }>;
  glitter?: boolean;
  paperColor?: string;
  basePrice: number;
  productImage?: string;
  pricingTier?: import('@/lib/productData').PricingTier;
}

const videoProducts: VideoProduct[] = [
  { id: 2, title: "Surprise delivery", src: "/videos/video_2.mp4", roses: 100, color: "Rojo", basePrice: 196, productImage: bqRojoImg },
  { id: 4, title: "Anniversary love", src: "/videos/video_4.mp4", roses: 100, color: "Rojo", basePrice: 196, productImage: bqRojoImg },
  { id: 5, title: "Pink elegance", src: "/videos/video_5.mp4", roses: 200, color: "Pink", basePrice: 301, productImage: bqLightpinkImg },
  { id: 6, title: "Red & black passion", src: "/videos/video_6.mov", roses: 75, color: "Rojo", basePrice: 146, paperColor: "Black", hasCustomText: true, customFields: [{ label: "Letter (1 character)", placeholder: "e.g. M" }], productImage: bqRojoImg },
  { id: 7, title: "Personalized detail", src: "/videos/video_7.mov", roses: 75, color: "Rojo", basePrice: 146, paperColor: "White", hasCustomText: true, customFields: [{ label: "Letter (1 character)", placeholder: "e.g. A" }, { label: "Ribbon text", placeholder: "e.g. Happy Birthday" }], productImage: bqRojoImg },
  { id: 8, title: "Glitter sparkle", src: "/videos/video_8.mov", roses: 75, color: "Rojo", basePrice: 146, paperColor: "Black", glitter: true, hasCustomText: true, customFields: [{ label: "Numbers (2 digits)", placeholder: "e.g. 25" }], productImage: bqRojoImg },
  { id: 9, title: "Pink glitter", src: "/videos/video_9.mov", roses: 100, color: "Pink", basePrice: 136, paperColor: "White", glitter: true, productImage: bqLightpinkImg },
  { id: 10, title: "Personalized tenderness", src: "/videos/video_10.mov", roses: 100, color: "Pink", basePrice: 136, paperColor: "White", hasCustomText: true, customFields: [{ label: "Letter (1 character)", placeholder: "e.g. P" }, { label: "Ribbon text", placeholder: "e.g. I Love You" }], productImage: bqLightpinkImg },
  { id: 11, title: "Purple dedication", src: "/videos/video_11.mov", roses: 100, color: "Morado", basePrice: 136, paperColor: "White", hasCustomText: true, customFields: [{ label: "Letter (1 character)", placeholder: "e.g. L" }, { label: "Ribbon text", placeholder: "e.g. Congratulations" }], productImage: bqMoradoImg },
  { id: 12, title: "Intense classic red", src: "/videos/video_12.mov", roses: 100, color: "Rojo", basePrice: 196, paperColor: "Black", hasCustomText: true, customFields: [{ label: "Letter (1 character)", placeholder: "e.g. R" }], productImage: bqRojoImg },
  { id: 13, title: "Special date", src: "/videos/video_13.mov", roses: 100, color: "Rojo", basePrice: 196, paperColor: "White", hasCustomText: true, customFields: [{ label: "Numbers (2 digits)", placeholder: "e.g. 15" }], productImage: bqRojoImg },
  { id: 14, title: "Grand celebration", src: "/videos/video_14.mov", roses: 125, color: "Rojo", basePrice: 276, paperColor: "White", hasCustomText: true, customFields: [{ label: "Numbers (2 digits)", placeholder: "e.g. 30" }], productImage: bqRojoImg },
  { id: 15, title: "White & pink fantasy", src: "/videos/video_15.mov", roses: 200, color: "Blanco, Pink", basePrice: 301, paperColor: "Light Pink", glitter: true, hasCustomText: true, customFields: [{ label: "Ribbon text", placeholder: "e.g. Happy Anniversary" }], productImage: bqMixLightpinkBlancoImg },
];

const VideoCard = ({ video, index, onOrder, orderLabel }: { video: VideoProduct; index: number; onOrder: (v: VideoProduct) => void; orderLabel: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current && video.src) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [video.src]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="min-w-[calc(33.333%-11px)] snap-start flex-shrink-0 max-md:min-w-[calc(50%-8px)] max-sm:min-w-[calc(50%-8px)]"
    >
      <div className="relative aspect-[9/16] max-h-[400px] rounded-lg overflow-hidden bg-muted group">
        {video.src ? (
          <video
            ref={videoRef}
            src={video.src}
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-muted to-muted-foreground/20 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
              <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/70 to-transparent">
          <p className="font-body text-sm text-primary-foreground">{video.title}</p>
        </div>
      </div>
      <button
        onClick={() => onOrder(video)}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 font-body text-xs tracking-widest uppercase rounded-sm hover:bg-primary/90 transition-colors"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        {orderLabel}
      </button>
    </motion.div>
  );
};

const ClientVideos = () => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoProduct | null>(null);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => { checkScroll(); }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.clientWidth / 3;
    scrollRef.current.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary mb-4">
            {t("clientVideos.title")}
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            {t("clientVideos.subtitle")}
          </p>
        </motion.div>

        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 md:left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {videoProducts.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} onOrder={setSelectedVideo} orderLabel={t("clientVideos.orderSame")} />
            ))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-3 md:right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {selectedVideo && (
        <VideoOrderDialog
          video={selectedVideo}
          open={!!selectedVideo}
          onOpenChange={(open) => !open && setSelectedVideo(null)}
        />
      )}
    </section>
  );
};

export default ClientVideos;
