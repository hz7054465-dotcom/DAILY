import { formatSchedule, getWeekDates, getWeekDisplayOrder, getWeekStart } from '@/utils/dates';

describe('configurable week start', () => {
  it('defaults to Saturday', () => {
    expect(getWeekStart('2026-11-04')).toBe('2026-10-31');
  });

  it('supports Sunday as the first day', () => {
    expect(getWeekStart('2026-11-04', 0)).toBe('2026-11-01');
  });

  it('supports Monday as the first day', () => {
    expect(getWeekStart('2026-11-04', 1)).toBe('2026-11-02');
    expect(getWeekDates('2026-11-04', 1)[0]).toBe('2026-11-02');
    expect(getWeekDates('2026-11-04', 1)[6]).toBe('2026-11-08');
  });

  it('builds the display order from any start day', () => {
    expect(getWeekDisplayOrder(6)).toEqual([6, 0, 1, 2, 3, 4, 5]);
    expect(getWeekDisplayOrder(1)).toEqual([1, 2, 3, 4, 5, 6, 0]);
  });

  it('orders the schedule label by the chosen start day', () => {
    expect(formatSchedule([6, 0, 1])).toBe('Sat · Sun · Mon');
    expect(formatSchedule([6, 0, 1], 0)).toBe('Sun · Mon · Sat');
    expect(formatSchedule([0, 1, 2, 3, 4, 5, 6], 1)).toBe('Every day');
  });
});
