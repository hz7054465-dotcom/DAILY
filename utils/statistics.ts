import { Habit, HabitCompletion } from '@/types/habit';
import { addDays, getWeekDates, getWeekday, getTodayString } from '@/utils/dates';

/** Habits that are active (not archived) and exist on the given date. */
export function isScheduledOn(habit: Habit, date: string): boolean {
  if (habit.isArchived) return false;
  if (date < habit.createdAt) return false;
  return habit.selectedDays.includes(getWeekday(date));
}

/** Unique set of completed dates per habit (removes duplicates). */
export function buildCompletionMap(
  completions: HabitCompletion[]
): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const c of completions) {
    if (!map.has(c.habitId)) map.set(c.habitId, new Set());
    map.get(c.habitId)!.add(c.completedDate);
  }
  return map;
}

export interface DayProgress {
  completed: number;
  total: number;
  percent: number | null; // null when nothing is scheduled
}

export function getDayProgress(
  habits: Habit[],
  completions: HabitCompletion[],
  date: string
): DayProgress {
  const map = buildCompletionMap(completions);
  const scheduled = habits.filter((h) => isScheduledOn(h, date));
  const completed = scheduled.filter((h) => map.get(h.id)?.has(date)).length;
  const total = scheduled.length;
  return {
    completed,
    total,
    percent: total === 0 ? null : Math.round((completed / total) * 100),
  };
}

/**
 * Current streak for one habit: consecutive scheduled days completed,
 * counting back from today. Unscheduled days are skipped (never break it).
 * If today is scheduled but not yet completed, it does not break the streak.
 */
export function getCurrentStreak(
  habit: Habit,
  completedDates: Set<string> | undefined,
  today: string = getTodayString()
): number {
  if (habit.isArchived) return 0;
  const done = completedDates ?? new Set<string>();
  let streak = 0;
  let cursor = today;
  let isToday = true;

  // Safety cap: never loop beyond ~10 years.
  for (let i = 0; i < 3650; i++) {
    if (cursor < habit.createdAt) break;
    if (habit.selectedDays.includes(getWeekday(cursor))) {
      if (done.has(cursor)) {
        streak++;
      } else if (!isToday) {
        break;
      }
    }
    isToday = false;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function getBestCurrentStreak(
  habits: Habit[],
  completions: HabitCompletion[],
  today: string = getTodayString()
): number {
  const map = buildCompletionMap(completions);
  return habits.reduce(
    (best, h) => Math.max(best, getCurrentStreak(h, map.get(h.id), today)),
    0
  );
}

export interface WeekDayStat {
  date: string;
  completed: number;
  total: number;
  isFuture: boolean;
}

/** Per-day stats for the week (Saturday first) containing the given date. */
export function getWeeklySummary(
  habits: Habit[],
  completions: HabitCompletion[],
  today: string = getTodayString()
): WeekDayStat[] {
  return getWeekDates(today).map((date) => {
    const { completed, total } = getDayProgress(habits, completions, date);
    return { date, completed, total, isFuture: date > today };
  });
}

export interface OverallStats {
  totalHabits: number;
  totalCheckIns: number;
  completionRate: number | null; // null when nothing was ever scheduled
  bestStreak: number;
}

/**
 * Overall completion rate = valid check-ins / scheduled occurrences,
 * from each habit's createdAt up to today (uses current selectedDays).
 */
export function getOverallStats(
  habits: Habit[],
  completions: HabitCompletion[],
  today: string = getTodayString()
): OverallStats {
  const active = habits.filter((h) => !h.isArchived);
  const map = buildCompletionMap(completions);

  let scheduled = 0;
  let done = 0;
  for (const h of active) {
    const dates = map.get(h.id) ?? new Set<string>();
    let cursor = h.createdAt;
    for (let i = 0; i < 3650 && cursor <= today; i++) {
      if (h.selectedDays.includes(getWeekday(cursor))) {
        scheduled++;
        if (dates.has(cursor)) done++;
      }
      cursor = addDays(cursor, 1);
    }
  }

  const activeIds = new Set(active.map((h) => h.id));
  const totalCheckIns = Array.from(map.entries())
    .filter(([id]) => activeIds.has(id))
    .reduce((sum, [, set]) => sum + set.size, 0);

  return {
    totalHabits: active.length,
    totalCheckIns,
    completionRate: scheduled === 0 ? null : Math.round((done / scheduled) * 100),
    bestStreak: getBestCurrentStreak(active, completions, today),
  };
}
