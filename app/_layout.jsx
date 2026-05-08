import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AlertsProvider } from '../context/AlertContext';
import { SplashLogo } from '../components/SplashLogo';

// Keep the native splash visible while we mount our animated one.
SplashScreen.preventAutoHideAsync();

// Minimum time (ms) the animated splash stays visible so the build always
// plays fully even on fast devices. Equal to lead-in + 4 cells = 160 + 4×320.
const MIN_SPLASH_MS = 1440;

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const startTime = useRef(Date.now());

  // Dismiss native splash on first layout and mark app ready.
  const onRootLayout = useCallback(async () => {
    await SplashScreen.hideAsync();
    setAppReady(true);
  }, []);

  // Once app signals ready, wait for the animation to finish, then fade out.
  useEffect(() => {
    if (!appReady) return;

    const elapsed = Date.now() - startTime.current;
    const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSplashDone(true));
    }, remaining);

    return () => clearTimeout(timer);
  }, [appReady]);

  return (
    <AlertsProvider>
      <GestureHandlerRootView style={styles.root} onLayout={onRootLayout}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="tour" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>

        {!splashDone && (
          <Animated.View style={[styles.splash, { opacity: fadeAnim }]} pointerEvents="none">
            <SplashLogo size={160} />
          </Animated.View>
        )}
      </GestureHandlerRootView>
    </AlertsProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  splash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#16181c',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});
