export type ThemeMode = 'dark' | 'light' | 'system';
export type Language = 'en' | 'ar';

export interface Settings {
  themeMode: ThemeMode;
  accentColor: string;
  language: Language;
  weekStartDay: number; // 0 = Sunday ... 6 = Saturday
  timeFormat24h: boolean;
  haptics: boolean;
  animations: boolean;
  splash: boolean;
  hideCompleted: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  themeMode: 'dark',
  accentColor: '#8B5CF6',
  language: 'en',
  weekStartDay: 6,
  timeFormat24h: false,
  haptics: true,
  animations: true,
  splash: true,
  hideCompleted: false,
};
