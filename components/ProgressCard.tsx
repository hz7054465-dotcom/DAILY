import { StyleSheet, Text, View } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { DayProgress } from '@/utils/statistics';
import ProgressRing from '@/components/ProgressRing';

function message(p: DayProgress): string {
  if (p.percent === null) return 'Nothing scheduled today';
  if (p.percent === 0) return "Let's get started";
  if (p.percent < 50) return 'Good start, keep going';
  if (p.percent < 100) return 'Almost there';
  return 'All done. Great day!';
}

export default function ProgressCard({ progress, bestStreak }: { progress: DayProgress; bestStreak: number }) {
  const ratio = progress.total === 0 ? 0 : progress.completed / progress.total;
  const complete = progress.total > 0 && ratio >= 1;
  return (
    <View style={styles.card}>
      <ProgressRing
        progress={ratio}
        label={progress.percent === null ? '–' : `${progress.percent}%`}
        color={complete ? colors.success : colors.primary}
      />
      <View style={styles.info}>
        <Text style={styles.label}>Today's progress</Text>
        <Text style={styles.count}>
          {progress.total === 0 ? 'No habits' : `${progress.completed} of ${progress.total} done`}
        </Text>
        <Text style={styles.msg}>{message(progress)}</Text>
        {bestStreak > 0 ? (
          <View style={styles.chip}>
            <Flame color={colors.primary} size={14} />
            <Text style={styles.chipText}>{bestStreak} day streak</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  info: { flex: 1, marginLeft: spacing.md },
  label: { color: colors.textSecondary, fontSize: 13 },
  count: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: 4 },
  msg: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  chip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, marginTop: 10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: colors.background },
  chipText: { color: colors.text, fontSize: 12, fontWeight: '600' },
});
