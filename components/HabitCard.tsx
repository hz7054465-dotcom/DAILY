import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Flame } from 'lucide-react-native';
import { radius, spacing } from '@/constants/theme';
import type { ThemeColors } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useMemo } from 'react';
import { getHabitIcon } from '@/constants/icons';
import { getAccent, tint } from '@/constants/accents';
import { scheduleLabel } from '@/utils/schedule';
import { useI18n } from '@/hooks/useI18n';
import { useSettings } from '@/hooks/useSettings';
import { Habit } from '@/types/habit';

interface Props {
  habit: Habit;
  done: boolean;
  streak: number;
  onToggle: () => void;
  index?: number;
}

export default function HabitCard({ habit, done, streak, onToggle, index }: Props) {
  const { settings } = useSettings();
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const Icon = getHabitIcon(habit.icon);
  const accent = getAccent(habit.icon);
  const press = useRef(new Animated.Value(1)).current;
  const pop = useRef(new Animated.Value(done ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: done ? 1 : 0, friction: 5, tension: 160, useNativeDriver: true }).start();
  }, [done, pop]);

  const to = (v: number) => Animated.spring(press, { toValue: v, friction: 6, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale: press }] }}>
      <Pressable
        onPress={onToggle}
        onPressIn={() => to(0.97)}
        onPressOut={() => to(1)}
        style={[styles.card, done && styles.cardDone]}
      >
        {index !== undefined ? <Text style={styles.index}>{index}</Text> : null}
        <View style={[styles.iconBox, { backgroundColor: tint(accent) }]}>
          <Icon color={accent} size={22} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, done && styles.nameDone]} numberOfLines={1}>{habit.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{scheduleLabel(habit.selectedDays, settings.weekStartDay, t)}</Text>
            {streak > 0 ? (
              <View style={styles.streakRow}>
                <Flame color={accent} size={12} />
                <Text style={[styles.meta, { color: accent }]}>{streak}</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={[styles.check, done && styles.checkDone]}>
          <Animated.View style={{ transform: [{ scale: pop }], opacity: pop }}>
            <Check color="#fff" size={18} />
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  cardDone: { opacity: 0.85 },
  index: { width: 22, color: colors.textSecondary, opacity: 0.6, fontSize: 13, fontWeight: '600' },
  iconBox: { width: 46, height: 46, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, marginHorizontal: spacing.md },
  name: { color: colors.text, fontSize: 16, fontWeight: '600' },
  nameDone: { color: colors.textSecondary, textDecorationLine: 'line-through' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  meta: { color: colors.textSecondary, fontSize: 12 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  check: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkDone: { backgroundColor: colors.success, borderColor: colors.success },
});
