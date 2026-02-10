import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from "@/context/UserContext";
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <UserProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          
          {/* Page de connexion */}
          <Stack.Screen name="index" />

          {/* Page d'inscription */}
          <Stack.Screen name="register" />

          {/* L'appli après connexion = TABS */}
          <Stack.Screen name="(tabs)" />

        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </UserProvider>
  );
}
