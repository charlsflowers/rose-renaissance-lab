import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { applyManualTrackingParams, captureTrackingParams } from "@/lib/trackingParams";
import { SHORT_LINKS } from "@/lib/shortLinks";
import Index from "./Index";

/**
 * Short link route handler. Applies the mapped UTMs (first-touch, 90-day TTL)
 * and renders the home page in-place — URL stays clean (e.g. /wa).
 */
const ShortLink = () => {
  const { slug } = useParams<{ slug: string }>();
  const mapping = useMemo(() => (slug ? SHORT_LINKS[slug] : undefined), [slug]);

  useEffect(() => {
    if (mapping) applyManualTrackingParams(mapping);
    // Still capture any extra URL params / referrer using existing logic
    captureTrackingParams();
  }, [mapping]);

  return <Index />;
};

export default ShortLink;