import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ShelterProvider } from '@/hooks/use-shelter-store';

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f7efe5',
    card: '#fff9f2',
    text: '#221712',
    primary: '#b55b35',
    border: '#e9d6c3',
  },
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={appTheme}>
        <ShelterProvider>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f7efe5' } }} />
        </ShelterProvider>
        <StatusBar style="dark" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
