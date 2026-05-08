import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/colors';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <View style={styles.center}>
        {/* App icon */}
        <View style={styles.appIcon}>
          <View style={styles.iconInner} />
        </View>

        <Text style={styles.appName}>PSC Companion</Text>
        <Text style={styles.tagline}>Field operations at your fingertips</Text>

        {/* Progress dots */}
        <View style={styles.dots}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      <View style={styles.footer}>
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
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  appIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: Colors.surface1,
    borderWidth: 0.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconInner: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surface3,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  appName: {
    fontSize: 22,
    fontWeight: '500',
    color: Colors.text1,
    letterSpacing: -0.2,
  },
  tagline: {
    fontSize: 12,
    color: Colors.text3,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
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
  footer: {
    gap: 0,
  },
  button: {
    width: '100%',
    height: 44,
    backgroundColor: Colors.surface1,
    borderRadius: 13,
    borderWidth: 0.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text1,
  },
});
