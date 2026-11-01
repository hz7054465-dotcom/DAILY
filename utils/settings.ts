import { DEFAULT_SETTINGS, Settings } from '@/types/settings';

/** Builds a valid Settings object from any stored value (corrupted or partial). */
export function sanitizeSettings(raw: unknown): Settings {
  const out: Record<string, unknown> = { ...DEFAULT_SETTINGS };
  if (!raw || typeof raw !== 'object') return out as unknown as Settings;

  const r = raw as Record<string, unknown>;
  const defaults = DEFAULT_SETTINGS as unknown as Record<string, unknown>;
  for (const key of Object.keys(defaults)) {
    if (typeof r[key] === typeof defaults[key]) out[key] = r[key];
  }

  const wd = out.weekStartDay as number;
  if (!Number.isInteger(wd) || wd < 0 || wd > 6) out.weekStartDay = DEFAULT_SETTINGS.weekStartDay;
  if (!['dark', 'light', 'system'].includes(out.themeMode as string)) out.themeMode = DEFAULT_SETTINGS.themeMode;
  if (!['en', 'ar'].includes(out.language as string)) out.language = DEFAULT_SETTINGS.language;
  if (!/^#[0-9A-Fa-f]{6}$/.test(out.accentColor as string)) out.accentColor = DEFAULT_SETTINGS.accentColor;

  return out as unknown as Settings;
}
