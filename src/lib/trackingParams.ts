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
  referrer?: string;
  landingUrl?: string;
};

/** Read URL params on app load and persist any tracking params + first-touch referrer. */
export const captureTrackingParams = (): void => {
  if (typeof window === "undefined") return;
  try {
    const search = window.location.search;
    const found: Partial<Record<TrackingParamKey, string>> = {};
    if (search) {
      const url = new URLSearchParams(search);
      for (const key of TRACKING_PARAM_KEYS) {
        const v = url.get(key);
        if (v) found[key] = v;
      }
    }

    const rawReferrer = document.referrer || "";
    let externalReferrer = "";
    try {
      if (rawReferrer) {
        const refHost = new URL(rawReferrer).hostname;
        if (refHost && refHost !== window.location.hostname) {
          externalReferrer = rawReferrer;
        }
      }
    } catch {
      // ignore malformed referrer
    }

    const existingRaw = readRaw();
    const hasNewParams = Object.keys(found).length > 0;
    const hasNewReferrer = !!externalReferrer && !existingRaw?.referrer;

    if (!hasNewParams && !hasNewReferrer && existingRaw) return;
    if (!hasNewParams && !hasNewReferrer && !existingRaw) {
      // first visit, no params, no external referrer → still persist so we
      // remember "directo" for the 90-day window
      const payload: StoredParams = {
        params: {},
        timestamp: Date.now(),
        referrer: "",
        landingUrl: window.location.href,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return;
    }

    const merged: StoredParams = {
      params: { ...(existingRaw?.params || {}), ...found },
      timestamp: existingRaw?.timestamp || Date.now(),
      referrer: existingRaw?.referrer || externalReferrer,
      landingUrl: existingRaw?.landingUrl || window.location.href,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // ignore
  }
};

/**
 * Apply a manual set of tracking params (e.g. from a short link route like /wa)
 * using the SAME first-touch + 90-day TTL semantics as captureTrackingParams.
 * Does NOT overwrite previously stored params.
 */
export const applyManualTrackingParams = (
  manual: Partial<Record<TrackingParamKey, string>>,
): void => {
  if (typeof window === "undefined") return;
  try {
    const existingRaw = readRaw();
    const merged: StoredParams = {
      params: { ...manual, ...(existingRaw?.params || {}) }, // first-touch wins
      timestamp: existingRaw?.timestamp || Date.now(),
      referrer: existingRaw?.referrer || "",
      landingUrl: existingRaw?.landingUrl || window.location.href,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // ignore
  }
};

function readRaw(): StoredParams | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredParams;
    if (!parsed?.timestamp || Date.now() - parsed.timestamp > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** Returns persisted tracking params, or null if expired / missing. */
export const getStoredTrackingParams = (): Partial<Record<TrackingParamKey, string>> | null => {
  const raw = readRaw();
  return raw?.params || null;
};

/** Returns the first-touch external referrer captured, or "" if none. */
export const getStoredReferrer = (): string => {
  return readRaw()?.referrer || "";
};

/**
 * Derive a human-readable attribution source for Shopify.
 * Priority: utm_source/medium → referrer host heuristic → "directo".
 */
export const getDerivedSource = (): string => {
  const params = getStoredTrackingParams() || {};
  const utmSource = params.utm_source?.trim();
  const utmMedium = params.utm_medium?.trim();
  if (utmSource) {
    return utmMedium ? `${utmSource} / ${utmMedium}` : utmSource;
  }
  if (params.fbclid) return "facebook / paid";
  if (params.gclid) return "google / paid";

  const referrer = getStoredReferrer();
  if (!referrer) return "directo";
  try {
    const host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    if (host.includes("instagram.")) return "instagram (orgánico)";
    if (host.includes("facebook.") || host === "l.facebook.com" || host === "m.facebook.com") return "facebook (orgánico)";
    if (host.includes("google.")) return "google (orgánico)";
    if (host.includes("bing.")) return "bing (orgánico)";
    if (host.includes("duckduckgo.")) return "duckduckgo (orgánico)";
    if (host.includes("yahoo.")) return "yahoo (orgánico)";
    if (host.includes("tiktok.")) return "tiktok (orgánico)";
    if (host.includes("youtube.")) return "youtube (orgánico)";
    if (host.includes("t.co") || host.includes("twitter.") || host.includes("x.com")) return "twitter (orgánico)";
    if (host.includes("whatsapp") || host === "wa.me") return "whatsapp (orgánico)";
    if (host.includes("linkedin.")) return "linkedin (orgánico)";
    return `${host} (referral)`;
  } catch {
    return "directo";
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
