/**
 * Meta Pixel helper.
 *
 * Behaviour (US/CCPA opt-out model — NOT GDPR):
 *  - Pixel is initialized automatically on first use, regardless of cookie banner state.
 *  - PageView / ViewContent / AddToCart fire on every call.
 *  - If the user explicitly opts out via the cookie banner (marketing=false),
 *    `revokeMetaPixel()` is called and subsequent events are suppressed +
 *    `fbq('consent', 'revoke')` is sent.
 *  - Each event carries a unique `eventID` so Facebook can deduplicate against
 *    server-side events sent by Shopify CAPI (same Pixel ID on both ends).
 *
 * Pixel ID: 1631820708074499
 */
export const META_PIXEL_ID = "1631820708074499";

type Fbq = (...args: any[]) => void;

const ADD_TO_CART_STORAGE_KEY = "charls-meta-addtocart-eventids";

const getFbq = (): Fbq | null => {
  if (typeof window === "undefined") return null;
  return (window as any).fbq ?? null;
};

let pixelInitialized = false;
let userOptedOut = false;

const generateEventId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

const ensureInitialized = (): Fbq | null => {
  const fbq = getFbq();
  if (!fbq) return null;
  if (!pixelInitialized) {
    fbq("init", META_PIXEL_ID);
    pixelInitialized = true;
  }
  return fbq;
};

/** Returns true if fbq is loaded AND init has been performed. */
export const isMetaPixelReady = (): boolean => {
  return pixelInitialized && !!getFbq();
};

/** Init Pixel + fire initial PageView. Idempotent. Safe to call on app boot. */
export const initMetaPixel = () => {
  if (userOptedOut) return;
  const fbq = ensureInitialized();
  if (!fbq) return;
  fbq("consent", "grant");
  trackMetaEvent("PageView");
};

/** Revoke Pixel consent + suppress future events for this session. */
export const revokeMetaPixel = () => {
  userOptedOut = true;
  const fbq = getFbq();
  if (!fbq) return;
  fbq("consent", "revoke");
};

/**
 * Track a Meta standard event with automatic eventID for CAPI deduplication.
 * Returns the generated eventID (or null if the event was suppressed).
 */
export const trackMetaEvent = (
  eventName: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string }
): string | null => {
  if (userOptedOut) return null;
  const fbq = ensureInitialized();
  if (!fbq) return null;

  const eventID = options?.eventID ?? generateEventId();
  const eventData = { eventID };

  if (params) {
    fbq("track", eventName, params, eventData);
  } else {
    fbq("track", eventName, {}, eventData);
  }

  // For AddToCart, persist the eventID so Shopify CAPI (if it ever fires the
  // same AddToCart server-side) could theoretically reuse it for dedup.
  if (eventName === "AddToCart" && typeof sessionStorage !== "undefined") {
    try {
      const raw = sessionStorage.getItem(ADD_TO_CART_STORAGE_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
      const contentIds = (params?.content_ids as string[] | undefined) ?? [];
      const key = contentIds.length ? contentIds.join("|") : `__${Date.now()}`;
      map[key] = eventID;
      sessionStorage.setItem(ADD_TO_CART_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // ignore storage errors
    }
  }

  return eventID;
};
