import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { radius, spacing } from '@/constants/theme';
import type { ThemeColors } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/hooks/useSettings';
import { ThemeMode } from '@/types/settings';
import { tap } from '@/utils/haptics';

const MODES: { key: ThemeMode; label: string }[] = [
  { key: 'dark', label: 'Dark' },
  { key: 'light', label: 'Light' },
  { key: 'system', label: 'System' },
];

const ACCENT_COLORS = ['#8B5CF6', '#3B82F6', '#14B8A6', '#EC4899', '#F97316', '#6366F1'];

const WEEK_STARTS: { key: number; label: string }[] = [
  { key: 6, label: 'Saturday' },
  { key: 0, label: 'Sunday' },
  { key: 1, label: 'Monday' },
];

export default function SettingsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { settings, update } = useSettings();

  const segments = <T extends string | number>(
    options: { key: T; label: string }[],
    value: T,
    onChange: (key: T) => void
  ) => (
    <View style={styles.segmentRow}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={String(o.key)}
            onPress={() => {
              tap();
              onChange(o.key);
            }}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Appearance</Text>
          <Text style={styles.label}>Mode</Text>
          {segments(MODES, settings.themeMode, (k) => update({ themeMode: k }))}

          <Text style={[styles.label, { marginTop: spacing.md }]}>Accent color</Text>
          <View style={styles.swatches}>
            {ACCENT_COLORS.map((c) => (
              <Pressable
                key={c}
                onPress={() => {
                  tap();
                  update({ accentColor: c });
                }}
                style={[styles.swatch, { backgroundColor: c }]}
              >
                {settings.accentColor === c ? <Check color="#fff" size={20} /> : null}
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Date</Text>
          <Text style={styles.label}>Week starts on</Text>
          {segments(WEEK_STARTS, settings.weekStartDay, (k) => update({ weekStartDay: k }))}
          <Text style={styles.hint}>Changes saved automatically.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md, paddingBottom: spacing.xl },
    title: { color: colors.text, fontSize: 28, fontWeight: '700', marginBottom: spacing.md },
    card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
    cardTitle: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: spacing.md },
    label: { color: colors.textSecondary, fontSize: 13, marginBottom: spacing.sm },
    segmentRow: { flexDirection: 'row', backgroundColor: colors.background, borderRadius: radius.md, padding: 4 },
    segment: { flex: 1, paddingVertical: 10, borderRadius: radius.md - 2, alignItems: 'center' },
    segmentActive: { backgroundColor: colors.primary },
    segmentText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
    segmentTextActive: { color: colors.onPrimary },
    swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    swatch: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    hint: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.sm },
  });
