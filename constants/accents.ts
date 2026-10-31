export const ACCENTS: Record<string, string> = {
  book: '#60A5FA',
  workout: '#F97316',
  water: '#22D3EE',
  sleep: '#818CF8',
  mind: '#F472B6',
  food: '#84CC16',
  walk: '#FBBF24',
  coffee: '#D97706',
  write: '#A78BFA',
  music: '#FB7185',
  health: '#EF4444',
  morning: '#FACC15',
};

export const DEFAULT_ACCENT = '#8B5CF6';

export function getAccent(key: string): string {
  return ACCENTS[key] ?? DEFAULT_ACCENT;
}

/** Hex color + alpha (0..1) -> 8-digit hex. */
export function tint(hex: string, alpha = 0.16): string {
  const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return `${hex}${a}`;
}
