import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { DayProgress } from '@/utils/statistics';

export default function ProgressCard({ progress }: { progress: DayProgress }) {
  const pct = progress.percent ?? 0;
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Today's progress</Text>
        <Text style={styles.value}>
          {progress.total === 0 ? '—' : `${progress.completed}/${progress.total}`}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.pct}>
        {progress.percent === null ? 'Nothing scheduled today' : `${pct}% complete`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: colors.textSecondary, fontSize: 14 },
  value: { color: colors.text, fontSize: 22, fontWeight: '700' },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.border, marginTop: spacing.md, overflow: 'hidden' },
  fill: { height: 8, backgroundColor: colors.primary, borderRadius: 4 },
  pct: { color: colors.textSecondary, fontSize: 13, marginTop: spacing.sm },
});
