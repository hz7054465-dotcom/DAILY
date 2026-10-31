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
  archiveHabit: (id: string) => Promise<void>;
  toggleCompletion: (habitId: string) => Promise<void>;
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
      habitsRef.current = h;
      completionsRef.current = c;
      setHabits(h);
      setCompletions(c);
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

  const archiveHabit = useCallback(
    async (id: string) => {
      await commitHabits(
        habitsRef.current.map((h) =>
          h.id === id ? { ...h, isArchived: true } : h
        )
      );
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
      archiveHabit,
      toggleCompletion,
    }),
    [habits, completions, today, loading, addHabit, updateHabit, archiveHabit, toggleCompletion]
  );

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits(): HabitsContextValue {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error('useHabits must be used inside <HabitsProvider>');
  return ctx;
}
