import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';

export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', padding: spacing.xl },
  title: { color: colors.text, fontSize: 18, fontWeight: '600', textAlign: 'center' },
  sub: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.sm, textAlign: 'center' },
});
