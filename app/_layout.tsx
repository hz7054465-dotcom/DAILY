import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { HabitsProvider } from '@/hooks/useHabits';
import { SettingsProvider, useSettings } from '@/hooks/useSettings';
import { useTheme } from '@/hooks/useTheme';

function ThemedStack() {
  const { colors, isDark } = useTheme();
  const { ready } = useSettings();
  if (!ready) return null; // avoid flashing the wrong theme while settings load
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
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
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <HabitsProvider>
          <ThemedStack />
        </HabitsProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
