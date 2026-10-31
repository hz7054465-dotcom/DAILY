import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { HabitsProvider } from '@/hooks/useHabits';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <HabitsProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="add-habit"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </HabitsProvider>
  );
}
