import { Habit, HabitCompletion } from '@/types/habit';
import { getCurrentStreak, getDayProgress, getOverallStats } from '@/utils/statistics';

const habit = (over: Partial<Habit> = {}): Habit => ({
  id: 'h1',
  name: 'Read',
  icon: 'book',
  selectedDays: [0, 1, 2, 3, 4, 5, 6],
  createdAt: '2026-10-20',
  isArchived: false,
  ...over,
});
const done = (habitId: string, date: string): HabitCompletion => ({
  id: `${habitId}-${date}`,
  habitId,
  completedDate: date,
});

describe('streak', () => {
  it('counts consecutive completed days', () => {
    const dates = new Set(['2026-10-29', '2026-10-30', '2026-10-31']);
    expect(getCurrentStreak(habit(), dates, '2026-10-31')).toBe(3);
  });

  it('does not break if today is not yet done', () => {
    const dates = new Set(['2026-10-29', '2026-10-30']);
    expect(getCurrentStreak(habit(), dates, '2026-10-31')).toBe(2);
  });

  it('breaks on a missed scheduled day', () => {
    const dates = new Set(['2026-10-29', '2026-10-31']);
    expect(getCurrentStreak(habit(), dates, '2026-10-31')).toBe(1);
  });

  it('skips unscheduled days without breaking', () => {
    // Only Saturdays (6). 2026-10-24 and 2026-10-31 are Saturdays.
    const h = habit({ selectedDays: [6], createdAt: '2026-10-01' });
    const dates = new Set(['2026-10-24', '2026-10-31']);
    expect(getCurrentStreak(h, dates, '2026-10-31')).toBe(2);
  });

  it('does not count days before createdAt', () => {
    const h = habit({ createdAt: '2026-10-30' });
    const dates = new Set(['2026-10-30', '2026-10-31']);
    expect(getCurrentStreak(h, dates, '2026-10-31')).toBe(2);
  });

  it('returns 0 for archived habits', () => {
    expect(getCurrentStreak(habit({ isArchived: true }), new Set(['2026-10-31']), '2026-10-31')).toBe(0);
  });
});

describe('progress and overall stats', () => {
  it('returns null percent when nothing is scheduled', () => {
    const h = habit({ selectedDays: [0] }); // Sunday only
    expect(getDayProgress([h], [], '2026-10-31').percent).toBeNull();
  });

  it('ignores duplicate completion records', () => {
    const list = [done('h1', '2026-10-31'), done('h1', '2026-10-31')];
    const p = getDayProgress([habit()], list, '2026-10-31');
    expect(p.completed).toBe(1);
    expect(p.percent).toBe(100);
  });

  it('computes overall completion rate from real data', () => {
    // createdAt 10-30, today 10-31 => 2 scheduled days, 1 done => 50%
    const h = habit({ createdAt: '2026-10-30' });
    const s = getOverallStats([h], [done('h1', '2026-10-31')], '2026-10-31');
    expect(s.completionRate).toBe(50);
    expect(s.totalCheckIns).toBe(1);
    expect(s.totalHabits).toBe(1);
  });
});
