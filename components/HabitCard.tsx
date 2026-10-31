import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Flame } from 'lucide-react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { getHabitIcon } from '@/constants/icons';
import { Habit } from '@/types/habit';

interface Props {
  habit: Habit;
  done: boolean;
  streak: number;
  onToggle: () => void;
  onLongPress?: () => void;
}

export default function HabitCard({ habit, done, streak, onToggle, onLongPress }: Props) {
  const Icon = getHabitIcon(habit.icon);
  return (
    <Pressable onPress={onToggle} onLongPress={onLongPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}>
      <View style={styles.iconBox}>
        <Icon color={colors.primary} size={22} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, done && styles.nameDone]} numberOfLines={1}>{habit.name}</Text>
        {streak > 0 ? (
          <View style={styles.streakRow}>
            <Flame color={colors.textSecondary} size={13} />
            <Text style={styles.streak}>{streak} day streak</Text>
          </View>
        ) : null}
      </View>
      <View style={[styles.check, done && styles.checkDone]}>
        {done ? <Check color="#fff" size={18} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  iconBox: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, marginHorizontal: spacing.md },
  name: { color: colors.text, fontSize: 16, fontWeight: '600' },
  nameDone: { color: colors.textSecondary, textDecorationLine: 'line-through' },
  streakRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  streak: { color: colors.textSecondary, fontSize: 12 },
  check: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkDone: { backgroundColor: colors.success, borderColor: colors.success },
});
