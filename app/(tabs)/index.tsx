import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { radius, spacing } from '@/constants/theme';
import type { ThemeColors } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useMemo } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { useSettings } from '@/hooks/useSettings';
import { useI18n } from '@/hooks/useI18n';
import type { TKey } from '@/constants/i18n';
import { formatLongDate, getGreetingPeriod } from '@/utils/dates';
import {
  buildCompletionMap,
  getBestCurrentStreak,
  getCurrentStreak,
  getDayProgress,
  isScheduledOn,
} from '@/utils/statistics';
import { success, tap } from '@/utils/haptics';
import HabitCard from '@/components/HabitCard';
import ProgressCard from '@/components/ProgressCard';
import WeekStrip from '@/components/WeekStrip';
import EmptyState from '@/components/EmptyState';

export default function HomeScreen() {
  const router = useRouter();
  const { habits, completions, today, loading, toggleCompletion } = useHabits();
  const { settings } = useSettings();
  const { t, locale } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const map = buildCompletionMap(completions);
  const scheduled = habits.filter((h) => isScheduledOn(h, today));
  const progress = getDayProgress(habits, completions, today);
  const bestStreak = getBestCurrentStreak(habits, completions, today);
  const hasHabits = habits.some((h) => !h.isArchived);

  const handleToggle = (habitId: string, wasDone: boolean) => {
    const completesDay = !wasDone && progress.total > 0 && progress.completed + 1 === progress.total;
    tap();
    if (completesDay) success();
    toggleCompletion(habitId);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList
        data={scheduled}
        keyExtractor={(h) => h.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={{ marginBottom: spacing.md }}>
            <Text style={styles.greeting}>{t(`greeting.${getGreetingPeriod()}` as TKey)}</Text>
            <Text style={styles.date}>{formatLongDate(today, locale)}</Text>
            <View style={{ height: spacing.md }} />
            <ProgressCard progress={progress} bestStreak={bestStreak} />
            <WeekStrip habits={habits} completions={completions} today={today} weekStart={settings.weekStartDay} />
            <View style={styles.sectionRow}>
              <Text style={styles.section}>{t('home.today')}</Text>
              {scheduled.length > 0 ? <Text style={styles.sectionCount}>{t('home.habitsCount', { n: scheduled.length })}</Text> : null}
            </View>
          </View>
        }
        ListEmptyComponent={
          hasHabits ? (
            <EmptyState title={t('home.offTitle')} subtitle={t('home.offSub')} />
          ) : (
            <EmptyState title={t('home.noHabitsTitle')} subtitle={t('home.noHabitsSub')} />
          )
        }
        renderItem={({ item, index }) => {
          const done = map.get(item.id)?.has(today) ?? false;
          return (
            <HabitCard
              habit={item}
              index={index + 1}
              done={done}
              streak={getCurrentStreak(item, map.get(item.id), today)}
              onToggle={() => handleToggle(item.id, done)}
              onLongPress={() => router.push({ pathname: '/add-habit', params: { id: item.id } })}
            />
          );
        }}
      />
      <Pressable
        style={styles.fab}
        onPress={() => {
          tap();
          router.push('/add-habit');
        }}
      >
        <Plus color="#fff" size={28} />
      </Pressable>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  list: { padding: spacing.md, paddingBottom: 120 },
  greeting: { color: colors.text, fontSize: 30, fontWeight: '700' },
  date: { color: colors.textSecondary, fontSize: 15, marginTop: 4 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: spacing.lg },
  section: { color: colors.text, fontSize: 18, fontWeight: '600' },
  sectionCount: { color: colors.textSecondary, fontSize: 13 },
  fab: { position: 'absolute', right: spacing.lg, bottom: spacing.lg, width: 60, height: 60, borderRadius: radius.lg, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: colors.primary, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
});
