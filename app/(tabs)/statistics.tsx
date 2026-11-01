import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, spacing } from '@/constants/theme';
import type { ThemeColors } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useI18n } from '@/hooks/useI18n';
import { useHabits } from '@/hooks/useHabits';
import { useSettings } from '@/hooks/useSettings';
import { getOverallStats, getWeeklySummary } from '@/utils/statistics';
import WeekSummary from '@/components/WeekSummary';
import EmptyState from '@/components/EmptyState';

export default function StatisticsScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);
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
  const cards = [
    { label: t('stats.totalHabits'), value: String(stats.totalHabits) },
    { label: t('stats.checkIns'), value: String(stats.totalCheckIns) },
    { label: t('stats.completionRate'), value: stats.completionRate === null ? '–' : `${stats.completionRate}%` },
    { label: t('stats.bestStreak'), value: `${stats.bestStreak}d` },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('stats.title')}</Text>
        {stats.totalHabits === 0 ? (
          <EmptyState title={t('stats.emptyTitle')} subtitle={t('stats.emptySub')} />
        ) : (
          <>
            <View style={styles.grid}>
              {cards.map((c, i) => (
                <View key={i} style={styles.stat}>
                  <Text style={styles.statValue}>{c.value}</Text>
                  <Text style={styles.statLabel}>{c.label}</Text>
                </View>
              ))}
            </View>
            <View style={{ height: spacing.md }} />
            <WeekSummary days={week} today={today} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md, paddingBottom: spacing.xl },
    title: { color: colors.text, fontSize: 28, fontWeight: '700', marginBottom: spacing.md },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    stat: { width: '48.5%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
    statValue: { color: colors.text, fontSize: 26, fontWeight: '700' },
    statLabel: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  });
