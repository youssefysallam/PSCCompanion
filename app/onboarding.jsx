import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SplashLogo } from '../components/SplashLogo';
import { Colors } from '../constants/colors';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <SplashLogo size={180} />
        <Text style={styles.appName}>PSC Companion</Text>
        <Text style={styles.tagline}>Field operations at your fingertips</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/tour')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonLabel}>Get started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: 24,
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '500',
    color: Colors.text1,
    letterSpacing: -0.4,
  },
  tagline: {
    fontSize: 13,
    color: Colors.text3,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    gap: 20,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dotActive: {
    width: 16,
    height: 5,
    borderRadius: 999,
    backgroundColor: Colors.text2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: Colors.border,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.surface1,
    borderRadius: 13,
    borderWidth: 0.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text1,
  },
});
