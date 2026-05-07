/**
 * Meta Pixel helper. All calls are silent no-ops unless:
 *  - the Pixel script (`fbq`) is loaded, AND
 *  - the user has granted marketing consent (Pixel was init'd via useCookieConsent).
 *
 * Pixel ID: 1631820708074499
 */
export const META_PIXEL_ID = "1631820708074499";

type Fbq = (...args: any[]) => void;

const getFbq = (): Fbq | null => {
  if (typeof window === "undefined") return null;
  return (window as any).fbq ?? null;
};

let pixelInitialized = false;

/** Returns true if fbq is loaded AND init has been performed. */
export const isMetaPixelReady = (): boolean => {
  return pixelInitialized && !!getFbq();
};

/** Init Pixel exactly once (idempotent). Called from useCookieConsent on grant. */
export const initMetaPixel = () => {
  const fbq = getFbq();
  if (!fbq) return;
  if (pixelInitialized) {
    // Already init'd — just (re)grant consent.
    fbq("consent", "grant");
    return;
  }
  fbq("init", META_PIXEL_ID);
  fbq("consent", "grant");
  fbq("track", "PageView");
  pixelInitialized = true;
};

/** Revoke Pixel consent (does not "uninit" — Meta has no such API). */
export const revokeMetaPixel = () => {
  const fbq = getFbq();
  if (!fbq) return;
  fbq("consent", "revoke");
};

/** Track a standard Meta event. Silent no-op when consent / fbq not ready. */
export const trackMetaEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (!isMetaPixelReady()) return;
  const fbq = getFbq();
  if (!fbq) return;
  if (params) {
    fbq("track", eventName, params);
  } else {
    fbq("track", eventName);
  }
};
