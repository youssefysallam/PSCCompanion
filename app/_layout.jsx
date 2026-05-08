import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AlertsProvider } from '../context/AlertContext';

export default function RootLayout() {
  return (
    <AlertsProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="tour" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </AlertsProvider>
  );
}
