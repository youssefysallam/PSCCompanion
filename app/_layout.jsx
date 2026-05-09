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
          {/* <Stack.Screen name="(tabs)" /> */}
          {/*<Stack.Screen name="(drawer)" /> */} 
        </Stack>
      </GestureHandlerRootView>
    </AlertsProvider>
  );
}
