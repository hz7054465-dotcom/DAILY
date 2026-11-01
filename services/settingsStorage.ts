import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_SETTINGS, Settings } from '@/types/settings';
import { sanitizeSettings } from '@/utils/settings';

const SETTINGS_KEY = 'daily:settings:v1';
const CORRUPT_KEY = 'daily:settings:corrupt-backup';

export async function loadSettings(): Promise<Settings> {
  let raw: string | null = null;
  try {
    raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return sanitizeSettings(JSON.parse(raw));
  } catch {
    // Keep the unreadable payload so it is not lost on the next save.
    if (raw) {
      try {
        await AsyncStorage.setItem(CORRUPT_KEY, raw);
      } catch {}
    }
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
