import { addDays, daysBetween, getWeekDates, getWeekStart, getWeekday, toDateString } from '@/utils/dates';

describe('dates', () => {
  it('formats local dates as YYYY-MM-DD', () => {
    expect(toDateString(new Date(2026, 9, 31))).toBe('2026-10-31');
  });

  it('adds days across month and year boundaries', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('maps weekdays like Date.getDay()', () => {
    expect(getWeekday('2026-10-31')).toBe(6); // Saturday
    expect(getWeekday('2026-11-01')).toBe(0); // Sunday
  });

  it('starts the week on Saturday', () => {
    expect(getWeekStart('2026-10-31')).toBe('2026-10-31'); // Saturday itself
    expect(getWeekStart('2026-11-04')).toBe('2026-10-31'); // Wednesday
    expect(getWeekStart('2026-11-06')).toBe('2026-10-31'); // Friday (week end)
    expect(getWeekDates('2026-11-02')).toHaveLength(7);
  });

  it('computes day differences', () => {
    expect(daysBetween('2026-10-01', '2026-10-31')).toBe(30);
  });
});
