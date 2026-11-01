import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitCompletion } from '@/types/habit';

const HABITS_KEY = 'daily:habits:v1';
const COMPLETIONS_KEY = 'daily:completions:v1';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Habits saved before ordering existed have no `order` yet.
type StoredHabit = Omit<Habit, 'order'> & { order?: unknown };

function isHabit(value: unknown): value is StoredHabit {
  if (!value || typeof value !== 'object') return false;
  const h = value as Record<string, unknown>;
  return (
    typeof h.id === 'string' &&
    typeof h.name === 'string' &&
    typeof h.icon === 'string' &&
    Array.isArray(h.selectedDays) &&
    h.selectedDays.every((d) => Number.isInteger(d) && d >= 0 && d <= 6) &&
    typeof h.createdAt === 'string' &&
    DATE_RE.test(h.createdAt) &&
    typeof h.isArchived === 'boolean'
  );
}

function isCompletion(value: unknown): value is HabitCompletion {
  if (!value || typeof value !== 'object') return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === 'string' &&
    typeof c.habitId === 'string' &&
    typeof c.completedDate === 'string' &&
    DATE_RE.test(c.completedDate)
  );
}

// Keep whatever we could not use so a later save never destroys it silently.
async function backup(key: string, kind: 'corrupt' | 'dropped', payload: string) {
  try {
    await AsyncStorage.setItem(`${key}:${kind}:${Date.now()}`, payload);
  } catch {}
}

async function readList<T>(
  key: string,
  guard: (v: unknown) => v is T
): Promise<T[]> {
  let raw: string | null = null;
  try {
    raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      await backup(key, 'corrupt', raw);
      return [];
    }
    const good = parsed.filter((v): v is T => guard(v));
    const bad = parsed.filter((v) => !guard(v));
    if (bad.length > 0) await backup(key, 'dropped', JSON.stringify(bad));
    return good;
  } catch {
    if (raw) await backup(key, 'corrupt', raw);
    return [];
  }
}

async function writeList<T>(key: string, list: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(list));
}

/** Sorts by saved order (legacy habits keep their current position) and renumbers 0..n-1. */
function normalizeHabits(list: StoredHabit[]): Habit[] {
  return list
    .map((h, i) => ({
      h,
      i,
      o: typeof h.order === 'number' && Number.isFinite(h.order) ? h.order : i,
    }))
    .sort((a, b) => a.o - b.o || a.i - b.i)
    .map(({ h }, idx) => ({ ...h, order: idx }));
}

export async function loadHabits(): Promise<Habit[]> {
  return normalizeHabits(await readList(HABITS_KEY, isHabit));
}

export async function saveHabits(habits: Habit[]): Promise<void> {
  await writeList(HABITS_KEY, habits);
}

export async function loadCompletions(): Promise<HabitCompletion[]> {
  const list = await readList(COMPLETIONS_KEY, isCompletion);
  // Remove duplicates (same habit + date) defensively.
  const seen = new Set<string>();
  return list.filter((c) => {
    const k = `${c.habitId}|${c.completedDate}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export async function saveCompletions(
  completions: HabitCompletion[]
): Promise<void> {
  await writeList(COMPLETIONS_KEY, completions);
}
