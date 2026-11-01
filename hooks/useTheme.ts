import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useSettings } from '@/hooks/useSettings';
import { ThemeColors, buildColors } from '@/constants/theme';

export function useTheme(): { colors: ThemeColors; isDark: boolean } {
  const { settings } = useSettings();
  const system = useColorScheme();
  const isDark =
    settings.themeMode === 'system' ? system !== 'light' : settings.themeMode === 'dark';
  const colors = useMemo(
    () => buildColors(isDark, settings.accentColor),
    [isDark, settings.accentColor]
  );
  return { colors, isDark };
}
