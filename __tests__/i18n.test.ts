import { ar, dayKey, dayLongKey, en, translate } from '@/constants/i18n';
import { scheduleLabel } from '@/utils/schedule';

describe('i18n', () => {
  it('Arabic has exactly the same keys as English, none empty', () => {
    expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort());
    for (const v of Object.values(ar)) expect(v.trim().length).toBeGreaterThan(0);
  });

  it('interpolates parameters', () => {
    expect(translate('en', 'progress.done', { done: 2, total: 5 })).toBe('2 of 5 done');
    expect(translate('ar', 'home.habitsCount', { n: 3 })).toBe('3 عادة');
  });

  it('falls back to the key when it does not exist', () => {
    expect(translate('en', 'nope.missing' as never)).toBe('nope.missing');
  });

  it('has weekday names for all 7 days in both languages', () => {
    for (let d = 0; d < 7; d++) {
      expect(translate('en', dayKey(d)).length).toBeGreaterThan(0);
      expect(translate('ar', dayLongKey(d)).length).toBeGreaterThan(0);
    }
  });

  it('builds the schedule label in the chosen week order', () => {
    const t = (k: never) => translate('en', k);
    expect(scheduleLabel([6, 0, 1], 6, t)).toBe('Sat · Sun · Mon');
    expect(scheduleLabel([6, 0, 1], 0, t)).toBe('Sun · Mon · Sat');
    expect(scheduleLabel([0, 1, 2, 3, 4, 5, 6], 6, t)).toBe('Every day');
  });
});
