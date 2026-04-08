import { useEffect, useState } from "react";
import { fetchVariantsByHandle } from "@/lib/shopifyVariants";

interface Props {
  handle: string;
  fallbackPrice: number;
  className?: string;
  prefix?: string;
}

// Simple in-memory cache so we don't re-fetch the same handle twice per session
const priceCache: Record<string, number | null> = {};

const ShopifyPrice = ({ handle, fallbackPrice, className, prefix = "" }: Props) => {
  const [price, setPrice] = useState<number>(fallbackPrice);

  useEffect(() => {
    if (!handle) return;

    // If already cached, use it
    if (priceCache[handle] !== undefined) {
      setPrice(priceCache[handle] ?? fallbackPrice);
      return;
    }

    let cancelled = false;

    fetchVariantsByHandle(handle).then((variants) => {
      if (cancelled) return;
      if (variants.length > 0 && variants[0].price?.amount) {
        // Find the cheapest variant price
        const prices = variants
          .map((v) => (v.price?.amount ? parseFloat(v.price.amount) : null))
          .filter((p): p is number => p !== null);
        const minPrice = prices.length > 0 ? Math.min(...prices) : null;
        priceCache[handle] = minPrice;
        setPrice(minPrice ?? fallbackPrice);
      } else {
        priceCache[handle] = null;
      }
    }).catch(() => {
      priceCache[handle] = null;
    });

    return () => { cancelled = true; };
  }, [handle, fallbackPrice]);

  return <span className={className}>{prefix}${price}</span>;
};

export default ShopifyPrice;
