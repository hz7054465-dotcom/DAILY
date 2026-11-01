import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radius, spacing } from '@/constants/theme';
import type { ThemeColors } from '@/constants/theme';
import { dayKey } from '@/constants/i18n';
import { useTheme } from '@/hooks/useTheme';
import { useI18n } from '@/hooks/useI18n';
import { getWeekday } from '@/utils/dates';
import { WeekDayStat } from '@/utils/statistics';

export default function WeekSummary({ days, today }: { days: WeekDayStat[]; today: string }) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t('week.title')}</Text>
      <View style={styles.row}>
        {days.map((d) => {
          const ratio = d.total === 0 ? 0 : d.completed / d.total;
          const isToday = d.date === today;
          return (
            <View key={d.date} style={styles.col}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${Math.round(ratio * 100)}%` },
                    ratio === 1 && { backgroundColor: colors.success },
                  ]}
                />
              </View>
              <Text style={[styles.day, isToday && styles.dayToday]}>{t(dayKey(getWeekday(d.date)))}</Text>
              <Text style={styles.count}>{d.isFuture || d.total === 0 ? '–' : `${d.completed}/${d.total}`}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
    title: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: spacing.md },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    col: { flex: 1, alignItems: 'center' },
    barTrack: { width: 14, height: 90, borderRadius: 7, backgroundColor: colors.border, justifyContent: 'flex-end', overflow: 'hidden' },
    barFill: { width: 14, borderRadius: 7, backgroundColor: colors.primary },
    day: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.sm },
    dayToday: { color: colors.primary, fontWeight: '700' },
    count: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  });
