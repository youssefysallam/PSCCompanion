import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';

export default function AutoManDownWarning({ visible, countdown, onDismiss }) {
  if (!visible) return null;

  const isUrgent = countdown <= 5;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, isUrgent && styles.cardUrgent]}>
          <View style={[styles.glowLine, isUrgent && styles.glowLineUrgent]} />

          <View style={styles.header}>
            <View style={[styles.iconRing, isUrgent && styles.iconRingUrgent]}>
              <Ionicons
                name="body"
                size={28}
                color={isUrgent ? Colors.danger : Colors.warning}
              />
            </View>
            <Text style={[styles.title, isUrgent && styles.titleUrgent]}>
              ARE YOU OK?
            </Text>
            <Text style={styles.subtitle}>
              No movement detected in hazard zone
            </Text>
          </View>

          {/* Countdown ring */}
          <View style={styles.countdownContainer}>
            <View style={[styles.countdownRing, isUrgent && styles.countdownRingUrgent]}>
              <Text style={[styles.countdownNumber, isUrgent && styles.countdownNumberUrgent]}>
                {countdown}
              </Text>
              <Text style={styles.countdownLabel}>SEC</Text>
            </View>
            <Text style={styles.countdownCaption}>
              Man-down auto-triggers if no response
            </Text>
          </View>

          <TouchableOpacity style={styles.okButton} onPress={onDismiss}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            <Text style={styles.okText}>I'M OK — DISMISS</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            Tap to cancel · Man-down will trigger automatically
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3,7,18,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.warning + '50',
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
  },
  cardUrgent: {
    borderColor: Colors.danger + '70',
  },
  glowLine: {
    height: 3,
    width: '100%',
    backgroundColor: Colors.warning + '90',
  },
  glowLineUrgent: {
    backgroundColor: Colors.danger + '90',
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
    gap: 8,
    paddingHorizontal: 16,
  },
  iconRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.warning + '60',
    backgroundColor: Colors.warning + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRingUrgent: {
    borderColor: Colors.danger + '60',
    backgroundColor: Colors.dangerFaint,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.warning,
    letterSpacing: 3,
  },
  titleUrgent: {
    color: Colors.danger,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  countdownContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 10,
  },
  countdownRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.warning + '80',
    backgroundColor: Colors.warning + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownRingUrgent: {
    borderColor: Colors.danger + '80',
    backgroundColor: Colors.danger + '10',
  },
  countdownNumber: {
    fontSize: 42,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.warning,
    lineHeight: 48,
  },
  countdownNumberUrgent: {
    color: Colors.danger,
  },
  countdownLabel: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 2,
  },
  countdownCaption: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 0.3,
  },
  okButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.success + '15',
    borderWidth: 1,
    borderColor: Colors.success + '50',
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  okText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.success,
    letterSpacing: 1.5,
  },
  hint: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    marginBottom: 20,
  },
});