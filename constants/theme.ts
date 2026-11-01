export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  text: string;
  textSecondary: string;
  success: string;
  border: string;
  onPrimary: string;
  danger: string;
}

export const darkColors: ThemeColors = {
  background: '#15151B',
  surface: '#24232D',
  primary: '#8B5CF6',
  text: '#FFFFFF',
  textSecondary: '#A1A1AA',
  success: '#22C55E',
  border: '#34343E',
  onPrimary: '#FFFFFF',
  danger: '#EF4444',
};

export const lightColors: ThemeColors = {
  background: '#F6F5FA',
  surface: '#FFFFFF',
  primary: '#8B5CF6',
  text: '#15151B',
  textSecondary: '#6B6B76',
  success: '#16A34A',
  border: '#E4E3EC',
  onPrimary: '#FFFFFF',
  danger: '#DC2626',
};

/** Dark palette (kept for non-React code). Screens should use useTheme(). */
export const colors: ThemeColors = darkColors;

export function buildColors(isDark: boolean, accent: string): ThemeColors {
  return { ...(isDark ? darkColors : lightColors), primary: accent };
}

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radius = { md: 12, lg: 20 } as const;
