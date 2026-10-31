import {
  BookOpen, Dumbbell, Droplets, Moon, Brain, Apple, Footprints, Coffee,
  Pencil, Music, Heart, Sun, LucideIcon,
} from 'lucide-react-native';

export const HABIT_ICONS: Record<string, LucideIcon> = {
  book: BookOpen,
  workout: Dumbbell,
  water: Droplets,
  sleep: Moon,
  mind: Brain,
  food: Apple,
  walk: Footprints,
  coffee: Coffee,
  write: Pencil,
  music: Music,
  health: Heart,
  morning: Sun,
};

export const HABIT_ICON_KEYS = Object.keys(HABIT_ICONS);

export function getHabitIcon(key: string): LucideIcon {
  return HABIT_ICONS[key] ?? Heart;
}
