import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { SplashLogo } from '../components/SplashLogo';

export default function LoginScreen() {
  const router = useRouter();
  const [badgeId, setBadgeId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignIn = async () => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    router.replace('/(drawer)/(tabs)/checkin');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.logoArea}>
        <SplashLogo size={130} />
      </View>

      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.top}>
          {/* Title */}
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>
            Enter your badge ID and password to access the field operations system.
          </Text>

          {/* Fields */}
          <View style={styles.fields}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Badge ID</Text>
              <View style={styles.fieldRow}>
                <Ionicons name="id-card-outline" size={16} color={Colors.text3} />
                <TextInput
                  style={styles.input}
                  value={badgeId}
                  onChangeText={setBadgeId}
                  placeholder="e.g. PSC-1042"
                  placeholderTextColor={Colors.text4}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.fieldRow}>
                <Ionicons name="lock-closed-outline" size={16} color={Colors.text3} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.text4}
                  secureTextEntry={!passwordVisible}
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Ionicons
                    name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={16}
                    color={Colors.text3}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Sign in button */}
          <TouchableOpacity style={styles.signInBtn} onPress={handleSignIn} activeOpacity={0.8}>
            <Ionicons name="log-in-outline" size={16} color={Colors.text1} />
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>

          <Text style={styles.forgotText}>
            Forgot your password? Contact your supervisor.
          </Text>
        </View>

        <Text style={styles.footer}>PSC Companion v1.0 · For authorized personnel only</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  logoArea: {
    flex: 0.55,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  top: {
    gap: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '500',
    color: Colors.text1,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.text3,
    lineHeight: 18,
  },

  fields: {
    gap: 12,
    marginTop: 4,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.text3,
    letterSpacing: 0.4,
  },
  fieldRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface1,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 11,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text1,
    padding: 0,
  },

  signInBtn: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface1,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 13,
    marginTop: 4,
  },
  signInText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text1,
  },

  forgotText: {
    fontSize: 11,
    color: Colors.text3,
    textAlign: 'center',
  },

  footer: {
    fontSize: 10,
    color: Colors.text4,
    textAlign: 'center',
  },
});
