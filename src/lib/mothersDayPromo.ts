/**
 * Mother's Day promo window.
 *
 * The collection lives on the site ALL YEAR (good for SEO). Purchase is only
 * enabled during a window around Mother's Day (US = 2nd Sunday of May):
 *   opens  1 week BEFORE Mother's Day
 *   closes 1 week AFTER  Mother's Day
 * Outside that window the products are shown "locked" (coming soon) with a
 * countdown to the next opening. The window is computed automatically every
 * year — no manual flag to flip.
 *
 * Example: Mother's Day 2027 = Sun May 9 → purchasable Sat May 2 → Sat May 16.
 */
import { getMiamiTime } from "@/lib/miamiTime";

export const MOTHERS_DAY_COLLECTION_HANDLE = "mothers-day";

const WINDOW_DAYS_BEFORE = 7;
const WINDOW_DAYS_AFTER = 7;

/** Second Sunday of May for a given year (calendar Date at local midnight). */
function mothersDayForYear(year: number): Date {
  const may1 = new Date(year, 4, 1);
  const daysToFirstSunday = (7 - may1.getDay()) % 7; // 0 if May 1 is a Sunday
  return new Date(year, 4, 1 + daysToFirstSunday + 7); // +7 → second Sunday
}

export interface MothersDayWindow {
  /** Mother's Day itself (2nd Sunday of May). */
  mothersDay: Date;
  /** First day the collection is purchasable (1 week before). */
  open: Date;
  /** Last day the collection is purchasable (1 week after). */
  close: Date;
}

function windowForYear(year: number): MothersDayWindow {
  const md = mothersDayForYear(year);
  const open = new Date(md.getFullYear(), md.getMonth(), md.getDate() - WINDOW_DAYS_BEFORE);
  const close = new Date(md.getFullYear(), md.getMonth(), md.getDate() + WINDOW_DAYS_AFTER);
  return { mothersDay: md, open, close };
}

/** Today as a calendar Date in Miami (midnight, timezone-safe). */
function todayInMiami(): Date {
  const { year, month, date } = getMiamiTime();
  return new Date(year, month - 1, date);
}

/**
 * The relevant window right now: this year's if we haven't passed its close,
 * otherwise next year's. Used for the countdown target and the "opens X–Y" copy.
 */
export function getMothersDayWindow(): MothersDayWindow {
  const today = todayInMiami();
  const thisYear = windowForYear(today.getFullYear());
  if (today.getTime() > thisYear.close.getTime()) {
    return windowForYear(today.getFullYear() + 1);
  }
  return thisYear;
}

/** True when today (Miami) is inside the purchase window → products buyable. */
export function isMothersDayPurchasable(): boolean {
  const today = todayInMiami().getTime();
  const w = getMothersDayWindow();
  return today >= w.open.getTime() && today <= w.close.getTime();
}

/**
 * Back-compat alias used across the app (Navbar banner, product purchase
 * blocks, etc.). "Promo active" == inside the purchasable window.
 */
export function isMothersDayPromoActive(): boolean {
  return isMothersDayPurchasable();
}

/** Identify whether a Shopify handle belongs to the Mother's Day collection. */
export function isMothersDayHandle(handle: string | undefined | null): boolean {
  if (!handle) return false;
  return handle.endsWith("-mothers-day-edition");
}
