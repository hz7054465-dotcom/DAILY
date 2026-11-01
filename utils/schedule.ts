import { TKey, dayKey } from '@/constants/i18n';
import { getWeekDisplayOrder } from '@/utils/dates';

/** 'Every day' or 'Sat · Mon · Wed', ordered from the chosen week start. */
export function scheduleLabel(days: number[], weekStart: number, t: (key: TKey) => string): string {
  if (days.length === 7) return t('schedule.everyDay');
  return getWeekDisplayOrder(weekStart)
    .filter((d) => days.includes(d))
    .map((d) => t(dayKey(d)))
    .join(' · ');
}
