/**
 * Mother's Day Promotion (May 1–12, 2026)
 *
 * Hybrid activation: requires BOTH a master flag AND the current Miami date
 * to fall inside the promo window. This way the promo turns OFF automatically
 * on May 13 even if we forget to flip the flag.
 *
 * To DISABLE the promo entirely (e.g. on May 13), set MOTHERS_DAY_FLAG_ENABLED to false.
 * Everything (hero, banner, collection section, purchase block on bouquets/room decor)
 * reverts automatically.
 */
import { getMiamiTime } from "@/lib/miamiTime";

export const MOTHERS_DAY_FLAG_ENABLED = true;

// Inclusive range. Format: YYYY-MM-DD in Miami local date.
export const MOTHERS_DAY_START = "2026-05-01";
export const MOTHERS_DAY_END = "2026-05-12";

export const MOTHERS_DAY_COLLECTION_HANDLE = "mothers-day";

/** True if promo flag is on AND today (Miami) is within the window. */
export function isMothersDayPromoActive(): boolean {
  if (!MOTHERS_DAY_FLAG_ENABLED) return false;
  const { year, month, date } = getMiamiTime();
  const today = `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
  return today >= MOTHERS_DAY_START && today <= MOTHERS_DAY_END;
}

/** Identify whether a Shopify handle belongs to the Mother's Day collection (suffix-based). */
export function isMothersDayHandle(handle: string | undefined | null): boolean {
  if (!handle) return false;
  return handle.endsWith("-mothers-day-edition");
}
