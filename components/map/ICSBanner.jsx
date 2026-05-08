import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { INCIDENTS } from '../../constants/mockData';

export default function ICSBanner({ profile }) {
  const incident = INCIDENTS.find((i) => i.id === profile.incidentId);

  return (
    <View style={styles.banner}>
      <View style={styles.glowLine} />
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Ionicons name="shield-checkmark" size={14} color={Colors.cyan} />
        </View>
        <View style={styles.info}>
          <Text style={styles.incident}>
            {profile.incidentId} · {incident?.type || 'UNKNOWN'}
          </Text>
          <Text style={styles.assignment}>
            {profile.division} → {profile.assignment}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 54,
    left: 12,
    right: 12,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.cyanBorder,
    overflow: 'hidden',
    zIndex: 10,
  },
  glowLine: {
    height: 1,
    backgroundColor: Colors.cyan + '40',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: Colors.cyanFaint,
    borderWidth: 1,
    borderColor: Colors.cyanBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  incident: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 1,
  },
  assignment: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
