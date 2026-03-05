/**
 * Miami timezone utilities.
 * All date/time calculations for delivery windows must use Miami time (America/New_York),
 * regardless of the user's browser timezone.
 */

const MIAMI_TZ = "America/New_York";

/** Returns the current hour (0-23) and minutes in Miami */
export function getMiamiTime(): { hours: number; minutes: number; day: number; date: number; month: number; year: number } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: MIAMI_TZ,
    hour: "numeric",
    minute: "numeric",
    weekday: "short",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find(p => p.type === type)?.value || "0";

  return {
    hours: parseInt(get("hour")),
    minutes: parseInt(get("minute")),
    day: new Date(now.toLocaleString("en-US", { timeZone: MIAMI_TZ })).getDay(),
    date: parseInt(get("day")),
    month: parseInt(get("month")),
    year: parseInt(get("year")),
  };
}

/** Returns today's date string in Miami as "YYYY-MM-DD" */
export function todayStringInMiami(): string {
  const { year, month, date } = getMiamiTime();
  return `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
}

/** Checks if a given JS Date is today in Miami timezone */
export function isTodayInMiami(d: Date): boolean {
  const miami = getMiamiTime();
  return d.getDate() === miami.date && d.getMonth() === miami.month - 1 && d.getFullYear() === miami.year;
}

/** Returns the current Miami hour as a fractional number (e.g. 14.5 = 2:30pm) */
export function miamiHourNow(): number {
  const { hours, minutes } = getMiamiTime();
  return hours + minutes / 60;
}

/** Returns today's start-of-day as a Date for calendar comparison (uses Miami date) */
export function todayInMiami(): Date {
  const { year, month, date } = getMiamiTime();
  return new Date(year, month - 1, date, 0, 0, 0, 0);
}
