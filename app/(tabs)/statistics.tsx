import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '@/constants/theme';
import { useHabits } from '@/hooks/useHabits';
import { useSettings } from '@/hooks/useSettings';
import { getOverallStats, getWeeklySummary } from '@/utils/statistics';
import WeekSummary from '@/components/WeekSummary';
import EmptyState from '@/components/EmptyState';

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function StatisticsScreen() {
  const { habits, completions, today, loading } = useHabits();
  const { settings } = useSettings();

  if (loading) {
    return (
      <View style={[styles.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const stats = getOverallStats(habits, completions, today);
  const week = getWeeklySummary(habits, completions, today, settings.weekStartDay);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Statistics</Text>
        {stats.totalHabits === 0 ? (
          <EmptyState title="No data yet" subtitle="Create a habit and check it off to see your stats." />
        ) : (
          <>
            <View style={styles.grid}>
              <StatCard label="Total habits" value={String(stats.totalHabits)} />
              <StatCard label="Check-ins" value={String(stats.totalCheckIns)} />
              <StatCard
                label="Completion rate"
                value={stats.completionRate === null ? '–' : `${stats.completionRate}%`}
              />
              <StatCard label="Best streak" value={`${stats.bestStreak}d`} />
            </View>
            <View style={{ height: spacing.md }} />
            <WeekSummary days={week} today={today} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  title: { color: colors.text, fontSize: 28, fontWeight: '700', marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  stat: { width: '48.5%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  statValue: { color: colors.text, fontSize: 26, fontWeight: '700' },
  statLabel: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
});
