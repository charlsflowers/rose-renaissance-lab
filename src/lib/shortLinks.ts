/**
 * Short attribution links served on our own domain.
 * Adding a new one: just add an entry below — App.tsx auto-registers the route.
 *
 * Example: charlsflowers.com/wa → stores utm_source=whatsapp & utm_medium=chat
 * and renders the home page. URL stays clean as /wa.
 */
import type { TRACKING_PARAM_KEYS } from "./trackingParams";

type TrackingParamKey = (typeof TRACKING_PARAM_KEYS)[number];

export const SHORT_LINKS: Record<string, Partial<Record<TrackingParamKey, string>>> = {
  wa: { utm_source: "whatsapp", utm_medium: "chat" },
  ig: { utm_source: "instagram", utm_medium: "bio" },
  story: { utm_source: "instagram", utm_medium: "story" },
};