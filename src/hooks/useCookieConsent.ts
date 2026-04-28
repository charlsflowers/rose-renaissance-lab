import { useCallback, useEffect, useState } from "react";

export type ConsentState = {
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: number;
};

const STORAGE_KEY = "charls-cookie-consent";
const VERSION = 1;
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;

type Gtag = (...args: any[]) => void;

const getGtag = (): Gtag | null => {
  if (typeof window === "undefined") return null;
  // gtag is defined inline in index.html
  return (window as any).gtag ?? null;
};

const pushConsentUpdate = (analytics: boolean, marketing: boolean) => {
  const gtag = getGtag();
  const payload = {
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
    analytics_storage: analytics ? "granted" : "denied",
  };
  if (gtag) {
    gtag("consent", "update", payload);
  } else if (typeof window !== "undefined") {
    // Fallback: push directly to dataLayer
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(["consent", "update", payload]);
  }
};

const readStored = (): ConsentState | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== VERSION) return null;
    const ts = new Date(parsed.timestamp).getTime();
    if (Number.isNaN(ts) || Date.now() - ts > SIX_MONTHS_MS) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeStored = (analytics: boolean, marketing: boolean): ConsentState => {
  const next: ConsentState = {
    analytics,
    marketing,
    timestamp: new Date().toISOString(),
    version: VERSION,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  return next;
};

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [hasResponded, setHasResponded] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setConsent(stored);
      setHasResponded(true);
      // Re-apply stored consent on every load so gtag knows the current state
      pushConsentUpdate(stored.analytics, stored.marketing);
    }
    setReady(true);
  }, []);

  const acceptAll = useCallback(() => {
    const next = writeStored(true, true);
    pushConsentUpdate(true, true);
    setConsent(next);
    setHasResponded(true);
  }, []);

  const rejectAll = useCallback(() => {
    const next = writeStored(false, false);
    pushConsentUpdate(false, false);
    setConsent(next);
    setHasResponded(true);
  }, []);

  const updateConsent = useCallback((analytics: boolean, marketing: boolean) => {
    const next = writeStored(analytics, marketing);
    pushConsentUpdate(analytics, marketing);
    setConsent(next);
    setHasResponded(true);
  }, []);

  return { consent, hasResponded, ready, acceptAll, rejectAll, updateConsent };
};

/** Event used to reopen the cookie preferences modal from anywhere (e.g. Footer link). */
export const COOKIE_PREFS_EVENT = "charls:open-cookie-preferences";

export const openCookiePreferences = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(COOKIE_PREFS_EVENT));
};