import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '@/constants/theme';
import { HABIT_ICON_KEYS, getHabitIcon } from '@/constants/icons';
import { WEEK_DISPLAY_ORDER, WEEKDAY_SHORT } from '@/utils/dates';
import { useHabits } from '@/hooks/useHabits';

export default function AddHabitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { habits, addHabit, updateHabit, archiveHabit } = useHabits();
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
    if (!name.trim()) return setError('Habit name cannot be empty.');
    if (days.length === 0) return setError('Select at least one weekday.');
    setError('');
    setSaving(true);
    try {
      const input = { name, icon, selectedDays: days };
      if (editing) await updateHabit(editing.id, input);
      else await addHabit(input);
      router.back();
    } catch {
      setError('Could not save. Please try again.');
      setSaving(false);
    }
  };

  const onArchive = () => {
    if (!editing) return;
    Alert.alert('Archive habit?', 'It will be hidden from Home and statistics.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Archive',
        style: 'destructive',
        onPress: async () => {
          await archiveHabit(editing.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{editing ? 'Edit habit' : 'New habit'}</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Read 10 pages"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          maxLength={40}
        />

        <Text style={styles.label}>Icon</Text>
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

        <Text style={styles.label}>Repeat on</Text>
        <View style={styles.daysRow}>
          {WEEK_DISPLAY_ORDER.map((d) => {
            const active = days.includes(d);
            return (
              <Pressable key={d} onPress={() => toggleDay(d)} style={[styles.day, active && styles.dayActive]}>
                <Text style={[styles.dayText, active && { color: '#fff' }]}>{WEEKDAY_SHORT[d]}</Text>
              </Pressable>
            );
          })}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable onPress={onSave} style={[styles.save, saving && { opacity: 0.6 }]}>
          <Text style={styles.saveText}>{editing ? 'Save changes' : 'Save habit'}</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.cancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        {editing ? (
          <Pressable onPress={onArchive} style={styles.cancel}>
            <Text style={[styles.cancelText, { color: '#EF4444' }]}>Archive habit</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
