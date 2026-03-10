import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, ShoppingBag } from "lucide-react";

const placeholderVideos = [
  { id: 2, title: "Sorpresa inolvidable", src: "/videos/video_2.mp4", productLink: "" },
  { id: 4, title: "Amor de aniversario", src: "/videos/video_4.mp4", productLink: "" },
  { id: 5, title: "Elegancia en rosa", src: "/videos/video_5.mp4", productLink: "" },
  { id: 6, title: "Pasión en rojo y negro", src: "/videos/video_6.mov", productLabel: "75 rosas rojas · 1 letra + 1 corazón · Papel negro", productLink: "" },
  { id: 7, title: "Detalle con nombre", src: "/videos/video_7.mov", productLabel: "75 rosas rojas · 1 letra + 1 corazón + cinta personalizada · Papel blanco", productLink: "" },
  { id: 8, title: "Brillos que enamoran", src: "/videos/video_8.mov", productLabel: "75 rosas rojas glitter · 2 números + 1 corazón · Papel negro", productLink: "" },
  { id: 9, title: "Rosa glitter", src: "/videos/video_9.mov", productLabel: "100 rosas rosa glitter · Papel blanco", productLink: "" },
  { id: 10, title: "Ternura personalizada", src: "/videos/video_10.mov", productLabel: "100 rosas rosa · 1 letra + 1 corazón + cinta · Papel blanco", productLink: "" },
  { id: 11, title: "Morado con dedicatoria", src: "/videos/video_11.mov", productLabel: "100 rosas moradas · 1 letra + 1 corazón + cinta · Papel blanco", productLink: "" },
  { id: 12, title: "Clásico rojo intenso", src: "/videos/video_12.mov", productLabel: "100 rosas rojas · 1 letra + 1 corazón · Papel negro", productLink: "" },
  { id: 13, title: "Fecha especial", src: "/videos/video_13.mov", productLabel: "100 rosas rojas · 2 números + 1 corazón · Papel blanco", productLink: "" },
  { id: 14, title: "Gran celebración", src: "/videos/video_14.mov", productLabel: "125 rosas rojas · 2 números + 1 corazón · Papel blanco", productLink: "" },
  { id: 15, title: "Fantasía blanca y rosa", src: "/videos/video_15.mov", productLabel: "200 rosas blancas y rosas glitter · Mariposas + cinta · Papel rosa", productLink: "" },
];

const VideoCard = ({ video, index }: { video: typeof placeholderVideos[0]; index: number }) => {
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
        disabled={!video.productLink}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 font-body text-xs tracking-widest uppercase rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        Pedir el mismo
      </button>
    </motion.div>
  );
};

const ClientVideos = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
            Nuestros clientes
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Mira lo que opinan quienes ya recibieron sus flores.
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
            {placeholderVideos.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
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
    </section>
  );
};

export default ClientVideos;
