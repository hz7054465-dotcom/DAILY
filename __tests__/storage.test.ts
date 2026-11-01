const store: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async (k: string) => (k in store ? store[k] : null)),
    setItem: jest.fn(async (k: string, v: string) => {
      store[k] = v;
    }),
  },
}));

import { loadHabits, saveHabits, loadCompletions } from '@/services/storage';

const base = {
  icon: 'book',
  selectedDays: [0, 1],
  createdAt: '2026-10-20',
  isArchived: false,
};

const keys = (prefix: string) =>
  Object.keys(store).filter((k) => k.startsWith(prefix));

beforeEach(() => {
  for (const k of Object.keys(store)) delete store[k];
});

describe('habits storage', () => {
  it('numbers legacy habits (no order) by their current position', async () => {
    store['daily:habits:v1'] = JSON.stringify([
      { id: 'a', name: 'A', ...base },
      { id: 'b', name: 'B', ...base },
      { id: 'c', name: 'C', ...base },
    ]);
    const habits = await loadHabits();
    expect(habits.map((h) => h.id)).toEqual(['a', 'b', 'c']);
    expect(habits.map((h) => h.order)).toEqual([0, 1, 2]);
  });

  it('sorts by saved order and renumbers 0..n-1', async () => {
    store['daily:habits:v1'] = JSON.stringify([
      { id: 'a', name: 'A', order: 5, ...base },
      { id: 'b', name: 'B', order: 2, ...base },
    ]);
    const habits = await loadHabits();
    expect(habits.map((h) => h.id)).toEqual(['b', 'a']);
    expect(habits.map((h) => h.order)).toEqual([0, 1]);
  });

  it('backs up unreadable JSON instead of losing it', async () => {
    store['daily:habits:v1'] = '{not json';
    expect(await loadHabits()).toEqual([]);
    const backups = keys('daily:habits:v1:corrupt:');
    expect(backups).toHaveLength(1);
    expect(store[backups[0]]).toBe('{not json');
  });

  it('backs up rejected items and keeps the valid ones', async () => {
    store['daily:habits:v1'] = JSON.stringify([
      { id: 'a', name: 'A', ...base },
      { id: 123, name: 'broken' },
    ]);
    const habits = await loadHabits();
    expect(habits).toHaveLength(1);
    const backups = keys('daily:habits:v1:dropped:');
    expect(backups).toHaveLength(1);
    expect(JSON.parse(store[backups[0]])).toEqual([{ id: 123, name: 'broken' }]);
  });

  it('round-trips save and load', async () => {
    const h = { id: 'a', name: 'A', order: 0, ...base };
    await saveHabits([h]);
    expect(await loadHabits()).toEqual([h]);
  });
});

describe('completions storage', () => {
  it('drops duplicates and backs up rejected entries', async () => {
    store['daily:completions:v1'] = JSON.stringify([
      { id: '1', habitId: 'a', completedDate: '2026-10-20' },
      { id: '2', habitId: 'a', completedDate: '2026-10-20' },
      { id: '3', habitId: 'a', completedDate: 'bad-date' },
    ]);
    const list = await loadCompletions();
    expect(list).toHaveLength(1);
    expect(keys('daily:completions:v1:dropped:')).toHaveLength(1);
  });
});
