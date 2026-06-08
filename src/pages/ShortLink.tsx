import { useEffect } from "react";
import { applyManualTrackingParams, captureTrackingParams } from "@/lib/trackingParams";
import { SHORT_LINKS } from "@/lib/shortLinks";
import Index from "./Index";

/**
 * Short link route handler. Applies the mapped UTMs (first-touch, 90-day TTL)
 * and renders the home page in-place — URL stays clean (e.g. /wa).
 */
const ShortLink = ({ slug }: { slug: string }) => {
  useEffect(() => {
    const mapping = SHORT_LINKS[slug];
    if (mapping) applyManualTrackingParams(mapping);
    captureTrackingParams();
  }, [slug]);

  return <Index />;
};

export default ShortLink;