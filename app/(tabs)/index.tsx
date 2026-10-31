import { FlatList, Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { useHabits } from '@/hooks/useHabits';
import { formatLongDate, getGreeting, getWeekday } from '@/utils/dates';
import { buildCompletionMap, getCurrentStreak, getDayProgress, isScheduledOn } from '@/utils/statistics';
import HabitCard from '@/components/HabitCard';
import ProgressCard from '@/components/ProgressCard';
import EmptyState from '@/components/EmptyState';

export default function HomeScreen() {
  const router = useRouter();
  const { habits, completions, today, loading, toggleCompletion } = useHabits();

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
  void getWeekday;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList
        data={scheduled}
        keyExtractor={(h) => h.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={{ marginBottom: spacing.md }}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.date}>{formatLongDate(today)}</Text>
            <View style={{ height: spacing.md }} />
            <ProgressCard progress={progress} />
            <Text style={styles.section}>Your habits</Text>
          </View>
        }
        ListEmptyComponent={
          habits.filter((h) => !h.isArchived).length === 0 ? (
            <EmptyState title="No habits yet" subtitle="Tap + to create your first habit." />
          ) : (
            <EmptyState title="Nothing scheduled today" subtitle="Enjoy your day off." />
          )
        }
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            done={map.get(item.id)?.has(today) ?? false}
            streak={getCurrentStreak(item, map.get(item.id), today)}
            onToggle={() => toggleCompletion(item.id)}
          />
        )}
      />
      <Pressable style={styles.fab} onPress={() => router.push('/add-habit')}>
        <Plus color="#fff" size={28} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  list: { padding: spacing.md, paddingBottom: 120 },
  greeting: { color: colors.text, fontSize: 28, fontWeight: '700' },
  date: { color: colors.textSecondary, fontSize: 15, marginTop: 4 },
  section: { color: colors.text, fontSize: 18, fontWeight: '600', marginTop: spacing.lg },
  fab: { position: 'absolute', right: spacing.lg, bottom: spacing.lg, width: 60, height: 60, borderRadius: radius.lg, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 6 },
});
