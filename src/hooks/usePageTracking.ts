import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackMetaEvent } from "@/lib/metaPixel";
import { isProductionDomain } from "@/lib/isProductionDomain";

/**
 * Fires GA4 `page_view` and Meta `PageView` on every SPA route change.
 *
 * The first navigation is skipped because:
 *   - GA4 already auto-sends a `page_view` from `gtag('config', ...)` on initial load.
 *   - Meta Pixel fires its own initial `PageView` when init'd in metaPixel.ts.
 *
 * Both `gtag` and `trackMetaEvent` are silent no-ops when consent is denied,
 * so this hook respects Consent Mode v2 automatically.
 *
 * Additionally, this entire hook is a no-op outside the production domain
 * (charlsflowers.com / www.charlsflowers.com) so preview/dev visits don't
 * pollute analytics.
 */
export const usePageTracking = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isProductionDomain()) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const pagePath = location.pathname + location.search;
    (window as any).gtag?.("event", "page_view", {
      page_path: pagePath,
      page_title: typeof document !== "undefined" ? document.title : "",
      page_location: typeof window !== "undefined" ? window.location.href : "",
    });
    trackMetaEvent("PageView");
  }, [location.pathname, location.search]);
};