/**
 * Capture and persist marketing tracking params (gclid, fbclid, utm_*) for
 * cross-domain attribution to Shopify checkout. 90-day TTL.
 */
const STORAGE_KEY = "charls-tracking-params";
const TTL_MS = 1000 * 60 * 60 * 24 * 90; // 90 days

export const TRACKING_PARAM_KEYS = [
  "gclid",
  "fbclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type TrackingParamKey = (typeof TRACKING_PARAM_KEYS)[number];

type StoredParams = {
  params: Partial<Record<TrackingParamKey, string>>;
  timestamp: number;
};

/** Read URL params on app load and persist any tracking params found. */
export const captureTrackingParams = (): void => {
  if (typeof window === "undefined") return;
  try {
    const search = window.location.search;
    if (!search) return;
    const url = new URLSearchParams(search);
    const found: Partial<Record<TrackingParamKey, string>> = {};
    for (const key of TRACKING_PARAM_KEYS) {
      const v = url.get(key);
      if (v) found[key] = v;
    }
    if (Object.keys(found).length === 0) return;

    // Merge with existing (don't overwrite older params with empty new visit)
    const existing = getStoredTrackingParams() || {};
    const merged = { ...existing, ...found };
    const payload: StoredParams = { params: merged, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
};

/** Returns persisted tracking params, or null if expired / missing. */
export const getStoredTrackingParams = (): Partial<Record<TrackingParamKey, string>> | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredParams;
    if (!parsed?.timestamp || Date.now() - parsed.timestamp > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.params || null;
  } catch {
    return null;
  }
};

/** Append stored tracking params to a checkout URL (synchronous). */
export const appendTrackingParamsToUrl = (urlStr: string): string => {
  const stored = getStoredTrackingParams();
  if (!stored) return urlStr;
  try {
    const url = new URL(urlStr);
    for (const [k, v] of Object.entries(stored)) {
      if (v && !url.searchParams.has(k)) {
        url.searchParams.set(k, v);
      }
    }
    return url.toString();
  } catch {
    return urlStr;
  }
};
