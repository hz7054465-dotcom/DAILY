import { Text, View } from 'react-native';
import { colors } from '@/constants/theme';

export default function StatisticsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.textSecondary }}>Statistics coming next</Text>
    </View>
  );
}
