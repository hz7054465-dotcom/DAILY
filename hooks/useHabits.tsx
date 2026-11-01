import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';
import { Habit, HabitCompletion } from '@/types/habit';
import {
  loadCompletions,
  loadHabits,
  saveCompletions,
  saveHabits,
} from '@/services/storage';
import { generateId, getTodayString } from '@/utils/dates';

interface NewHabitInput {
  name: string;
  icon: string;
  selectedDays: number[];
}

interface HabitsContextValue {
  habits: Habit[];
  completions: HabitCompletion[];
  today: string;
  loading: boolean;
  addHabit: (input: NewHabitInput) => Promise<void>;
  updateHabit: (id: string, input: NewHabitInput) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  restoreHabit: (id: string) => Promise<void>;
  purgeHabit: (id: string) => Promise<void>;
  toggleCompletion: (habitId: string) => Promise<void>;
  reorderHabits: (orderedVisibleIds: string[]) => Promise<void>;
}

const HabitsContext = createContext<HabitsContextValue | null>(null);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [today, setToday] = useState<string>(getTodayString());
  const [loading, setLoading] = useState(true);

  // Refs hold the latest data so rapid taps never use stale state.
  const habitsRef = useRef<Habit[]>([]);
  const completionsRef = useRef<HabitCompletion[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [h, c] = await Promise.all([loadHabits(), loadCompletions()]);
      if (cancelled) return;
      // Anything still soft-deleted at launch was never undone: remove it for good.
      const gone = new Set(h.filter((x) => x.isArchived).map((x) => x.id));
      const keptHabits = h.filter((x) => !x.isArchived).map((x, idx) => ({ ...x, order: idx }));
      const keptCompletions = c.filter((x) => !gone.has(x.habitId));
      habitsRef.current = keptHabits;
      completionsRef.current = keptCompletions;
      setHabits(keptHabits);
      setCompletions(keptCompletions);
      if (gone.size > 0) {
        saveHabits(keptHabits).catch(() => {});
        saveCompletions(keptCompletions).catch(() => {});
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Refresh "today" when the app returns to the foreground.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') setToday(getTodayString());
    });
    return () => sub.remove();
  }, []);

  const commitHabits = useCallback(async (next: Habit[]) => {
    habitsRef.current = next;
    setHabits(next);
    await saveHabits(next);
  }, []);

  const commitCompletions = useCallback(async (next: HabitCompletion[]) => {
    completionsRef.current = next;
    setCompletions(next);
    await saveCompletions(next);
  }, []);

  const addHabit = useCallback(
    async (input: NewHabitInput) => {
      const habit: Habit = {
        id: generateId(),
        name: input.name.trim(),
        icon: input.icon,
        selectedDays: [...input.selectedDays].sort((a, b) => a - b),
        createdAt: getTodayString(),
        isArchived: false,
        order: habitsRef.current.reduce((max, h) => Math.max(max, h.order), -1) + 1,
      };
      await commitHabits([...habitsRef.current, habit]);
    },
    [commitHabits]
  );

  const updateHabit = useCallback(
    async (id: string, input: NewHabitInput) => {
      await commitHabits(
        habitsRef.current.map((h) =>
          h.id === id
            ? {
                ...h,
                name: input.name.trim(),
                icon: input.icon,
                selectedDays: [...input.selectedDays].sort((a, b) => a - b),
              }
            : h
        )
      );
    },
    [commitHabits]
  );

  // Soft delete: hidden everywhere, but can be undone until purged.
  const deleteHabit = useCallback(
    async (id: string) => {
      await commitHabits(
        habitsRef.current.map((h) => (h.id === id ? { ...h, isArchived: true } : h))
      );
    },
    [commitHabits]
  );

  const restoreHabit = useCallback(
    async (id: string) => {
      await commitHabits(
        habitsRef.current.map((h) => (h.id === id ? { ...h, isArchived: false } : h))
      );
    },
    [commitHabits]
  );

  // Permanent delete (habit + its completions). Only for soft-deleted habits.
  const purgeHabit = useCallback(
    async (id: string) => {
      const target = habitsRef.current.find((h) => h.id === id);
      if (!target || !target.isArchived) return;
      await commitCompletions(completionsRef.current.filter((c) => c.habitId !== id));
      await commitHabits(
        habitsRef.current
          .filter((h) => h.id !== id)
          .map((h, idx) => ({ ...h, order: idx }))
      );
    },
    [commitHabits, commitCompletions]
  );

  // Reorders only the habits shown today; the others keep their slots.
  const reorderHabits = useCallback(
    async (orderedVisibleIds: string[]) => {
      const current = habitsRef.current;
      const byId = new Map(current.map((h) => [h.id, h]));
      const queue = orderedVisibleIds
        .map((id) => byId.get(id))
        .filter((h): h is Habit => !!h);
      const visible = new Set(queue.map((h) => h.id));
      let i = 0;
      const next = current.map((h) => (visible.has(h.id) ? queue[i++] : h));
      await commitHabits(next.map((h, idx) => ({ ...h, order: idx })));
    },
    [commitHabits]
  );

  const toggleCompletion = useCallback(
    async (habitId: string) => {
      const date = getTodayString();
      const exists = completionsRef.current.some(
        (c) => c.habitId === habitId && c.completedDate === date
      );
      const next = exists
        ? completionsRef.current.filter(
            (c) => !(c.habitId === habitId && c.completedDate === date)
          )
        : [
            ...completionsRef.current,
            { id: generateId(), habitId, completedDate: date },
          ];
      await commitCompletions(next);
    },
    [commitCompletions]
  );

  const value = useMemo(
    () => ({
      habits,
      completions,
      today,
      loading,
      addHabit,
      updateHabit,
      deleteHabit,
      restoreHabit,
      purgeHabit,
      toggleCompletion,
      reorderHabits,
    }),
    [habits, completions, today, loading, addHabit, updateHabit, deleteHabit, restoreHabit, purgeHabit, toggleCompletion, reorderHabits]
  );

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits(): HabitsContextValue {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error('useHabits must be used inside <HabitsProvider>');
  return ctx;
}
