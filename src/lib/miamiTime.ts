/**
 * Miami timezone utilities.
 * All date/time calculations for delivery windows must use Miami time (America/New_York),
 * regardless of the user's browser timezone.
 */

const MIAMI_TZ = "America/New_York";

/** Returns the current date/time as seen in Miami */
export function nowInMiami(): Date {
  const miamiStr = new Date().toLocaleString("en-US", { timeZone: MIAMI_TZ });
  return new Date(miamiStr);
}

/** Returns today's start-of-day in Miami time */
export function todayInMiami(): Date {
  const now = nowInMiami();
  now.setHours(0, 0, 0, 0);
  return now;
}

/** Checks if a given date is today in Miami */
export function isTodayInMiami(date: Date): boolean {
  const today = todayInMiami();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
