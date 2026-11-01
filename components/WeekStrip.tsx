import { StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { radius } from '@/constants/theme';
import type { ThemeColors } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useMemo } from 'react';
import { Habit, HabitCompletion } from '@/types/habit';
import { getWeekDates, getWeekday, parseDateString } from '@/utils/dates';
import { dayKey } from '@/constants/i18n';
import { useI18n } from '@/hooks/useI18n';
import { getDayProgress } from '@/utils/statistics';

interface Props {
  habits: Habit[];
  completions: HabitCompletion[];
  today: string;
  weekStart?: number;
}

export default function WeekStrip({ habits, completions, today, weekStart = 6 }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const dates = getWeekDates(today, weekStart);
  const { t } = useI18n();
  return (
    <View style={styles.row}>
      {dates.map((date) => {
        const p = getDayProgress(habits, completions, date);
        const isToday = date === today;
        const isFuture = date > today;
        const full = p.total > 0 && p.completed === p.total;
        const partial = p.completed > 0 && !full;
        return (
          <View key={date} style={[styles.cell, isToday && styles.cellToday, isFuture && { opacity: 0.45 }]}>
            <Text style={[styles.day, isToday && styles.dayToday]}>{t(dayKey(getWeekday(date)))}</Text>
            <View style={[styles.dot, partial && styles.dotPartial, full && styles.dotFull]}>
              {full ? (
                <Check color="#fff" size={15} />
              ) : (
                <Text style={[styles.num, partial && { color: colors.primary }]}>
                  {parseDateString(date).getDate()}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  cell: { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 6, borderRadius: radius.md, flex: 1 },
  cellToday: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  day: { color: colors.textSecondary, fontSize: 11, fontWeight: '600', marginBottom: 8 },
  dayToday: { color: colors.primary },
  dot: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  dotPartial: { borderColor: colors.primary },
  dotFull: { backgroundColor: colors.success, borderColor: colors.success },
  num: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
});
