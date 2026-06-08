/**
 * Forwards Meta Pixel events server-side to the Conversions API edge function.
 *
 * MUST be called with the SAME eventID that the browser Pixel used so Meta
 * deduplicates instead of double-counting. See metaPixel.ts → trackMetaEvent
 * returns the eventID that should be passed here.
 *
 * Reads fbp/fbc cookies + any stored marketing identifiers and lets the
 * edge function hash + enrich with IP / User-Agent / Advanced Matching.
 *
 * Disabled outside production domain to keep preview/dev data clean.
 */
import { isProductionDomain } from "@/lib/isProductionDomain";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_KEY as string;

type UserData = {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  external_id?: string;
};

type CapiEvent = {
  event_name: string;
  event_id?: string;
  custom_data?: Record<string, unknown>;
  user_data?: UserData;
};

const readCookie = (name: string): string => {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : "";
};

/** Fire & forget — never blocks UI, never throws. */
export const sendMetaCapiEvent = (event: CapiEvent): void => {
  if (!isProductionDomain()) return;
  try {
    const fbp = readCookie("_fbp");
    let fbc = readCookie("_fbc");
    // Synthesize _fbc from fbclid in URL if cookie not set yet
    if (!fbc && typeof window !== "undefined") {
      const fbclid = new URLSearchParams(window.location.search).get("fbclid");
      if (fbclid) {
        fbc = `fb.1.${Date.now()}.${fbclid}`;
      }
    }

    const payload = {
      events: [
        {
          event_name: event.event_name,
          event_id: event.event_id,
          event_time: Math.floor(Date.now() / 1000),
          event_source_url:
            typeof window !== "undefined" ? window.location.href : undefined,
          action_source: "website",
          custom_data: event.custom_data || {},
          user_data: {
            ...(event.user_data || {}),
            fbp: fbp || undefined,
            fbc: fbc || undefined,
          },
        },
      ],
    };

    const url = `${SUPABASE_URL}/functions/v1/meta-capi`;
    const body = JSON.stringify(payload);

    // Prefer fetch with keepalive (sendBeacon can't set custom headers and the
    // edge function expects application/json).
    void fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      },
      body,
      keepalive: true,
    }).catch(() => {
      /* swallow */
    });
  } catch {
    /* swallow */
  }
};