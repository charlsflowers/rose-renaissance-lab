import { useShopifyProductImages } from "@/hooks/useShopifyProductImages";

interface Props {
  handle: string;
  name: string;
  fallback?: string;
  fallback2?: string;
  enableHoverSwap?: boolean;
}

/**
 * Renders a bouquet image preferring live Shopify Storefront images
 * (1st = primary, 2nd = secondary on hover). Falls back to hardcoded
 * URLs while the API request is in flight.
 */
export default function BouquetCardImage({
  handle,
  name,
  fallback,
  fallback2,
  enableHoverSwap = true,
}: Props) {
  // Las tarjetas se ven pequeñas (~300px). Pedimos a Shopify una versión de 600px (nítida en retina)
  // en vez de la imagen a resolución completa. Solo afecta a tarjetas; la página de producto usa el
  // hook directamente y sigue a resolución completa.
  const sized = (u?: string, w = 600) =>
    u && u.includes("cdn.shopify.com")
      ? u.includes("?")
        ? `${u}&width=${w}`
        : `${u}?width=${w}`
      : u;

  const live = useShopifyProductImages(handle);
  const primary = sized(live.primary || fallback);
  // Hover-swap image = LAST photo available on Shopify (photo 6 if 6+, else photo 5, etc.).
  // Falls back to second image / hardcoded fallback while loading.
  const all = live.all ?? [];
  const hoverIdx = all.length >= 6 ? 5 : all.length - 1;
  const secondary = sized(
    (hoverIdx > 0 ? all[hoverIdx] : undefined) || live.secondary || fallback2
  );

  if (!primary) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="font-display text-4xl text-muted-foreground/30">🌹</span>
      </div>
    );
  }

  return (
    <>
      <img
        src={primary}
        alt={`${name} Miami – Charls Flowers`}
        loading="lazy"
        width={400}
        height={400}
        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
          secondary && enableHoverSwap ? "md:group-hover:opacity-0" : ""
        }`}
      />
      {secondary && enableHoverSwap && (
        <img
          src={secondary}
          alt={`${name} rose bouquet — back view, Miami same-day delivery`}
          loading="lazy"
          width={400}
          height={400}
          className="absolute inset-0 w-full h-full object-cover opacity-0 md:group-hover:opacity-100 transition-all duration-700 md:group-hover:scale-105 hidden md:block"
        />
      )}
    </>
  );
}