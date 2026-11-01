import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Flame } from 'lucide-react-native';
import { radius, spacing } from '@/constants/theme';
import type { ThemeColors } from '@/constants/theme';
import type { TKey } from '@/constants/i18n';
import { useTheme } from '@/hooks/useTheme';
import { useI18n } from '@/hooks/useI18n';
import { DayProgress } from '@/utils/statistics';
import ProgressRing from '@/components/ProgressRing';

function messageKey(p: DayProgress): TKey {
  if (p.percent === null) return 'progress.none';
  if (p.percent === 0) return 'progress.start';
  if (p.percent < 50) return 'progress.good';
  if (p.percent < 100) return 'progress.almost';
  return 'progress.complete';
}

export default function ProgressCard({ progress, bestStreak }: { progress: DayProgress; bestStreak: number }) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = useMemo(() => makeStyles(colors), [colors]);
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
        <Text style={styles.label}>{t('progress.title')}</Text>
        <Text style={styles.count}>
          {progress.total === 0
            ? t('progress.noHabits')
            : t('progress.done', { done: progress.completed, total: progress.total })}
        </Text>
        <Text style={styles.msg}>{t(messageKey(progress))}</Text>
        {bestStreak > 0 ? (
          <View style={styles.chip}>
            <Flame color={colors.primary} size={14} />
            <Text style={styles.chipText}>{t('progress.streak', { n: bestStreak })}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
    info: { flex: 1, marginLeft: spacing.md },
    label: { color: colors.textSecondary, fontSize: 13 },
    count: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: 4 },
    msg: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
    chip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, marginTop: 10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: colors.background },
    chipText: { color: colors.text, fontSize: 12, fontWeight: '600' },
  });
