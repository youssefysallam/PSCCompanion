import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { buildStatusStyles, useTheme } from '../../constants/theme';

export default function ManDownOverlay({ visible, responders, onClose }) {
  const { colors } = useTheme();
  const StatusStyles = buildStatusStyles(colors);

  if (!visible || !responders) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: 'rgba(3,7,18,0.9)' }]}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface1, borderColor: colors.urgent + '40' },
          ]}
        >
          <View style={[styles.glowLine, { backgroundColor: colors.urgent + '80' }]} />

          <View style={styles.header}>
            <View
              style={[
                styles.pulseRing,
                { borderColor: colors.urgent + '60', backgroundColor: colors.urgent + '18' },
              ]}
            >
              <Ionicons name="warning" size={28} color={colors.urgent} />
            </View>
            <Text style={[styles.title, { color: colors.urgent }]}>MAN-DOWN ALERT</Text>
            <Text style={[styles.subtitle, { color: colors.text3 }]}>Emergency broadcast sent</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.info }]}>SYSTEM ACTIONS</Text>
            {[
              '2 closest responders identified',
              'Priority alert dispatched',
              'Command notified (Capt. Rivera)',
              'Route highlighted on map',
            ].map((action) => (
              <View key={action} style={styles.actionRow}>
                <Ionicons name="checkmark-circle" size={14} color={colors.available} />
                <Text style={[styles.actionText, { color: colors.text1 }]}>{action}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.info }]}>RESPONDING</Text>
            {responders.map((r) => {
              const s = StatusStyles[r.status] || StatusStyles.offline;
              return (
                <View
                  key={r.id}
                  style={[
                    styles.responderRow,
                    { backgroundColor: colors.surface2, borderColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.responderIcon,
                      { borderColor: s.color + '60', backgroundColor: s.color + '15' },
                    ]}
                  >
                    <Text style={[styles.responderInitial, { color: s.color }]}>
                      {r.name.split(' ').pop()[0]}
                    </Text>
                  </View>
                  <View style={styles.responderInfo}>
                    <Text style={[styles.responderName, { color: colors.text1 }]}>{r.name}</Text>
                    <Text style={[styles.responderDetail, { color: colors.text3 }]}>
                      {r.role} · {Math.round(r.dist)}m away
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.etaBadge,
                      { borderColor: colors.info + '40', backgroundColor: colors.info + '15' },
                    ]}
                  >
                    <Text style={[styles.etaText, { color: colors.info }]}>
                      ~{Math.max(1, Math.round(r.dist / 80))} min
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            style={[
              styles.closeButton,
              { backgroundColor: colors.surface2, borderColor: colors.border },
            ]}
            onPress={onClose}
          >
            <Text style={[styles.closeText, { color: colors.text3 }]}>DISMISS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { borderRadius: 4, borderWidth: 1, width: '100%', overflow: 'hidden' },
  glowLine: { height: 3 },
  header: { alignItems: 'center', paddingTop: 24, paddingBottom: 16, gap: 8 },
  pulseRing: {
    width: 56, height: 56, borderRadius: 28, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 3 },
  subtitle: { fontSize: 10, fontFamily: 'monospace', letterSpacing: 1 },
  section: { paddingHorizontal: 16, paddingBottom: 14, gap: 6 },
  sectionTitle: { fontSize: 9, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 2, marginBottom: 4 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionText: { fontSize: 11, fontFamily: 'monospace', letterSpacing: 0.3 },
  responderRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 10, borderRadius: 4, borderWidth: 1,
  },
  responderIcon: {
    width: 36, height: 36, borderRadius: 4, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  responderInitial: { fontSize: 16, fontWeight: '700', fontFamily: 'monospace' },
  responderInfo: { flex: 1 },
  responderName: { fontSize: 13, fontWeight: '600' },
  responderDetail: { fontSize: 9, fontFamily: 'monospace', letterSpacing: 0.5, marginTop: 2 },
  etaBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 2, borderWidth: 1 },
  etaText: { fontSize: 10, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 0.5 },
  closeButton: { margin: 16, padding: 14, borderRadius: 4, borderWidth: 1, alignItems: 'center' },
  closeText: { fontSize: 12, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 2 },
});
