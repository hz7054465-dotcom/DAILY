import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, spacing } from '@/constants/theme';
import type { ThemeColors } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useMemo } from 'react';
import { HABIT_ICON_KEYS, getHabitIcon } from '@/constants/icons';
import { getWeekDisplayOrder } from '@/utils/dates';
import { useHabits } from '@/hooks/useHabits';
import { useSettings } from '@/hooks/useSettings';
import { useI18n } from '@/hooks/useI18n';
import { dayKey } from '@/constants/i18n';

export default function AddHabitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { habits, addHabit, updateHabit } = useHabits();
  const { settings } = useSettings();
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const editing = id ? habits.find((h) => h.id === id) : undefined;

  const [name, setName] = useState(editing?.name ?? '');
  const [icon, setIcon] = useState(editing?.icon ?? HABIT_ICON_KEYS[0]);
  const [days, setDays] = useState<number[]>(editing?.selectedDays ?? [0, 1, 2, 3, 4, 5, 6]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleDay = (d: number) =>
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const onSave = async () => {
    if (saving) return;
    if (!name.trim()) return setError(t('habit.errName'));
    if (days.length === 0) return setError(t('habit.errDays'));
    setError('');
    setSaving(true);
    try {
      const input = { name, icon, selectedDays: days };
      if (editing) await updateHabit(editing.id, input);
      else await addHabit(input);
      router.back();
    } catch {
      setError(t('habit.errSave'));
      setSaving(false);
    }
  };


  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{editing ? t('habit.edit') : t('habit.new')}</Text>

        <Text style={styles.label}>{t('habit.name')}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t('habit.namePlaceholder')}
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          maxLength={40}
        />

        <Text style={styles.label}>{t('habit.icon')}</Text>
        <View style={styles.grid}>
          {HABIT_ICON_KEYS.map((key) => {
            const Icon = getHabitIcon(key);
            const active = key === icon;
            return (
              <Pressable key={key} onPress={() => setIcon(key)} style={[styles.iconCell, active && styles.iconCellActive]}>
                <Icon color={active ? '#fff' : colors.textSecondary} size={22} />
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>{t('habit.repeat')}</Text>
        <View style={styles.daysRow}>
          {getWeekDisplayOrder(settings.weekStartDay).map((d) => {
            const active = days.includes(d);
            return (
              <Pressable key={d} onPress={() => toggleDay(d)} style={[styles.day, active && styles.dayActive]}>
                <Text style={[styles.dayText, active && { color: '#fff' }]}>{t(dayKey(d))}</Text>
              </Pressable>
            );
          })}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable onPress={onSave} style={[styles.save, saving && { opacity: 0.6 }]}>
          <Text style={styles.saveText}>{editing ? t('habit.saveChanges') : t('habit.save')}</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.cancel}>
          <Text style={styles.cancelText}>{t('habit.cancel')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { color: colors.text, fontSize: 26, fontWeight: '700', marginBottom: spacing.md },
  label: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.lg, marginBottom: spacing.sm },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, color: colors.text, fontSize: 16, padding: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  iconCell: { width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  iconCellActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  daysRow: { flexDirection: 'row', gap: 6 },
  day: { flex: 1, paddingVertical: 12, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  dayActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  error: { color: '#EF4444', marginTop: spacing.md, fontSize: 14 },
  save: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center', marginTop: spacing.xl },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancel: { paddingVertical: 14, alignItems: 'center', marginTop: spacing.xs },
  cancelText: { color: colors.textSecondary, fontSize: 15 },
});
