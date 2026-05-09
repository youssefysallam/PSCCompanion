import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../constants/theme';

export default function AutoManDownWarning({ visible, countdown, onDismiss }) {
  const { colors } = useTheme();

  if (!visible) return null;

  const isUrgent = countdown <= 5;
  const accentColor = isUrgent ? colors.urgent : colors.enRoute;

  return (
    <Modal visible transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: 'rgba(3,7,18,0.92)' }]}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface1,
              borderColor: accentColor + (isUrgent ? '70' : '50'),
            },
          ]}
        >
          <View style={[styles.glowLine, { backgroundColor: accentColor + '90', width: '100%' }]} />

          <View style={styles.header}>
            <View
              style={[
                styles.iconRing,
                { borderColor: accentColor + '60', backgroundColor: accentColor + '15' },
              ]}
            >
              <Ionicons name="body" size={28} color={accentColor} />
            </View>
            <Text style={[styles.title, { color: accentColor }]}>ARE YOU OK?</Text>
            <Text style={[styles.subtitle, { color: colors.text3 }]}>
              No movement detected in hazard zone
            </Text>
          </View>

          <View style={styles.countdownContainer}>
            <View
              style={[
                styles.countdownRing,
                { borderColor: accentColor + '80', backgroundColor: accentColor + '10' },
              ]}
            >
              <Text style={[styles.countdownNumber, { color: accentColor }]}>{countdown}</Text>
              <Text style={[styles.countdownLabel, { color: colors.text3 }]}>SEC</Text>
            </View>
            <Text style={[styles.countdownCaption, { color: colors.text3 }]}>
              Man-down auto-triggers if no response
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.okButton,
              { backgroundColor: colors.available + '15', borderColor: colors.available + '50' },
            ]}
            onPress={onDismiss}
          >
            <Ionicons name="checkmark-circle" size={20} color={colors.available} />
            <Text style={[styles.okText, { color: colors.available }]}>I'M OK — DISMISS</Text>
          </TouchableOpacity>

          <Text style={[styles.hint, { color: colors.text3 }]}>
            Tap to cancel · Man-down will trigger automatically
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { borderRadius: 4, borderWidth: 1, width: '100%', overflow: 'hidden', alignItems: 'center' },
  glowLine: { height: 3 },
  header: {
    alignItems: 'center', paddingTop: 24, paddingBottom: 8, gap: 8, paddingHorizontal: 16,
  },
  iconRing: {
    width: 60, height: 60, borderRadius: 30, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 3 },
  subtitle: { fontSize: 10, fontFamily: 'monospace', letterSpacing: 0.5, textAlign: 'center' },
  countdownContainer: { alignItems: 'center', paddingVertical: 24, gap: 10 },
  countdownRing: {
    width: 100, height: 100, borderRadius: 50, borderWidth: 3,
    alignItems: 'center', justifyContent: 'center',
  },
  countdownNumber: { fontSize: 42, fontWeight: '700', fontFamily: 'monospace', lineHeight: 48 },
  countdownLabel: { fontSize: 9, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 2 },
  countdownCaption: { fontSize: 10, fontFamily: 'monospace', letterSpacing: 0.3 },
  okButton: {
    flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1,
    borderRadius: 4, paddingVertical: 14, paddingHorizontal: 32, marginBottom: 16,
  },
  okText: { fontSize: 13, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 1.5 },
  hint: { fontSize: 9, fontFamily: 'monospace', letterSpacing: 0.5, marginBottom: 20 },
});
