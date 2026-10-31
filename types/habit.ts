/**
 * Weekday mapping (same as Date.getDay()):
 * 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday,
 * 4 = Thursday, 5 = Friday, 6 = Saturday
 * The week is DISPLAYED starting from Saturday.
 */
export interface Habit {
  id: string;
  name: string;
  icon: string;
  selectedDays: number[];
  createdAt: string; // YYYY-MM-DD (local date)
  isArchived: boolean;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  completedDate: string; // YYYY-MM-DD (local date)
}
