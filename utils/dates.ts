/**
 * Date helpers. All dates are LOCAL calendar dates in YYYY-MM-DD format.
 * Weekday numbers follow Date.getDay(): 0 = Sunday ... 6 = Saturday.
 * The week is displayed starting from Saturday.
 */

export const WEEK_START_DAY = 6; // Saturday

// Display order of weekdays: Sat, Sun, Mon, Tue, Wed, Thu, Fri
export const WEEK_DISPLAY_ORDER = [6, 0, 1, 2, 3, 4, 5] as const;

export const WEEKDAY_SHORT: Record<number, string> = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

const pad = (n: number): string => String(n).padStart(2, '0');

/** Date -> 'YYYY-MM-DD' using local time. */
export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** 'YYYY-MM-DD' -> Date at local midnight (noon-safe against DST shifts). */
export function parseDateString(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function getTodayString(): string {
  return toDateString(new Date());
}

export function addDays(value: string, amount: number): string {
  const date = parseDateString(value);
  date.setDate(date.getDate() + amount);
  return toDateString(date);
}

/** Weekday number (0 = Sunday ... 6 = Saturday) of a date string. */
export function getWeekday(value: string): number {
  return parseDateString(value).getDay();
}

/** The Saturday that starts the week containing the given date. */
export function getWeekStart(value: string, weekStart: number = WEEK_START_DAY): string {
  const weekday = getWeekday(value);
  const diff = (weekday - weekStart + 7) % 7;
  return addDays(value, -diff);
}

/** The 7 dates of the week containing the given date, Saturday first. */
export function getWeekDates(value: string, weekStart: number = WEEK_START_DAY): string[] {
  const start = getWeekStart(value, weekStart);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** Difference in whole days: b - a. */
export function daysBetween(a: string, b: string): number {
  const ms = parseDateString(b).getTime() - parseDateString(a).getTime();
  return Math.round(ms / 86400000);
}

export function formatLongDate(value: string, locale: string = 'en-US'): string {
  return parseDateString(value).toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Simple unique id: timestamp + random suffix. */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** 'Every day' or 'Sat · Mon · Wed' (week order starts on Saturday). */
export function formatSchedule(days: number[], weekStart: number = WEEK_START_DAY): string {
  if (days.length === 7) return 'Every day';
  return getWeekDisplayOrder(weekStart).filter((d) => days.includes(d))
    .map((d) => WEEKDAY_SHORT[d])
    .join(' · ');
}

/** Weekday numbers in display order, starting from the given day. */
export function getWeekDisplayOrder(weekStart: number = WEEK_START_DAY): number[] {
  return Array.from({ length: 7 }, (_, i) => (weekStart + i) % 7);
}

export function getGreetingPeriod(date: Date = new Date()): 'morning' | 'afternoon' | 'evening' {
  const hour = date.getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}
