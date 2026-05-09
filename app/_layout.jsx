import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AlertsProvider } from '../context/AlertContext';
import { UserProvider } from '../context/UserContext';
import { SplashLogo } from '../components/SplashLogo';
import { ThemeContext, darkColors, lightColors } from '../constants/theme';

SplashScreen.preventAutoHideAsync();

const MIN_SPLASH_MS = 1440;
const THEME_KEY = 'theme';

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const startTime = useRef(Date.now());

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((val) => {
      if (val === 'light') setIsDark(false);
    });
  }, []);

  const toggleTheme = useCallback(async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
  }, [isDark]);

  const onRootLayout = useCallback(async () => {
    await SplashScreen.hideAsync();
    setAppReady(true);
  }, []);

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

  const colors = isDark ? darkColors : lightColors;

  return (
    <AlertsProvider>
      <UserProvider>
        <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
          <GestureHandlerRootView style={styles.root} onLayout={onRootLayout}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
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
        </ThemeContext.Provider>
      </UserProvider>
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
