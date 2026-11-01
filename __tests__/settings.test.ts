import { DEFAULT_SETTINGS } from '@/types/settings';
import { sanitizeSettings } from '@/utils/settings';

describe('sanitizeSettings', () => {
  it('returns defaults for garbage input', () => {
    expect(sanitizeSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(sanitizeSettings('oops')).toEqual(DEFAULT_SETTINGS);
  });

  it('keeps valid values and fills missing ones', () => {
    const s = sanitizeSettings({ haptics: false, weekStartDay: 1 });
    expect(s.haptics).toBe(false);
    expect(s.weekStartDay).toBe(1);
    expect(s.animations).toBe(true);
  });

  it('rejects invalid values', () => {
    const s = sanitizeSettings({ weekStartDay: 9, themeMode: 'neon', accentColor: 'red', haptics: 'yes' });
    expect(s.weekStartDay).toBe(6);
    expect(s.themeMode).toBe('dark');
    expect(s.accentColor).toBe('#8B5CF6');
    expect(s.haptics).toBe(true);
  });
});
