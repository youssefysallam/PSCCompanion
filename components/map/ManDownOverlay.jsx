import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, StatusStyles } from '../../constants/colors';

export default function ManDownOverlay({ visible, responders, onClose }) {
  if (!visible || !responders) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.glowLine} />

          <View style={styles.header}>
            <View style={styles.pulseRing}>
              <Ionicons name="warning" size={28} color={Colors.danger} />
            </View>
            <Text style={styles.title}>MAN-DOWN ALERT</Text>
            <Text style={styles.subtitle}>Emergency broadcast sent</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SYSTEM ACTIONS</Text>
            {[
              '2 closest responders identified',
              'Priority alert dispatched',
              'Command notified (Capt. Rivera)',
              'Route highlighted on map',
            ].map((action) => (
              <View key={action} style={styles.actionRow}>
                <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                <Text style={styles.actionText}>{action}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RESPONDING</Text>
            {responders.map((r) => {
              const s = StatusStyles[r.status];
              return (
                <View key={r.id} style={styles.responderRow}>
                  <View style={[styles.responderIcon, { borderColor: s.color + '60', backgroundColor: s.bg }]}>
                    <Text style={[styles.responderInitial, { color: s.color }]}>
                      {r.name.split(' ').pop()[0]}
                    </Text>
                  </View>
                  <View style={styles.responderInfo}>
                    <Text style={styles.responderName}>{r.name}</Text>
                    <Text style={styles.responderDetail}>
                      {r.role} · {Math.round(r.dist)}m away
                    </Text>
                  </View>
                  <View style={styles.etaBadge}>
                    <Text style={styles.etaText}>
                      ~{Math.max(1, Math.round(r.dist / 80))} min
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>DISMISS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3,7,18,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.danger + '40',
    width: '100%',
    overflow: 'hidden',
  },
  glowLine: { height: 3, backgroundColor: Colors.danger + '80' },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    gap: 8,
  },
  pulseRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.danger + '60',
    backgroundColor: Colors.dangerFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.danger,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 2,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 11,
    color: Colors.text,
    fontFamily: 'monospace',
    letterSpacing: 0.3,
  },
  responderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  responderIcon: {
    width: 36,
    height: 36,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  responderInitial: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  responderInfo: { flex: 1 },
  responderName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textBright,
  },
  responderDetail: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  etaBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.cyan + '40',
    backgroundColor: Colors.cyanFaint,
  },
  etaText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 0.5,
  },
  closeButton: {
    margin: 16,
    padding: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.panel,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 2,
  },
});
