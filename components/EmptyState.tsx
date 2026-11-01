import { StyleSheet, Text, View } from 'react-native';
import { spacing } from '@/constants/theme';
import type { ThemeColors } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useMemo } from 'react';

export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  box: { alignItems: 'center', padding: spacing.xl },
  title: { color: colors.text, fontSize: 18, fontWeight: '600', textAlign: 'center' },
  sub: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.sm, textAlign: 'center' },
});
