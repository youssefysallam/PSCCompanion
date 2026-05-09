import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../constants/theme';
import { INCIDENTS } from '../../constants/mockData';

const makeStyles = (colors) =>
  StyleSheet.create({
    banner: {
      position: 'absolute',
      top: 54,
      left: 12,
      right: 12,
      backgroundColor: colors.surface1,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.info + '40',
      overflow: 'hidden',
      zIndex: 10,
    },
    glowLine: {
      height: 1,
      backgroundColor: colors.info + '40',
    },
    iconBox: {
      width: 30,
      height: 30,
      borderRadius: 4,
      backgroundColor: colors.info + '15',
      borderWidth: 1,
      borderColor: colors.info + '40',
      alignItems: 'center',
      justifyContent: 'center',
    },
    incident: {
      fontSize: 11,
      fontWeight: '700',
      fontFamily: 'monospace',
      color: colors.info,
      letterSpacing: 1,
    },
    assignment: {
      fontSize: 10,
      fontFamily: 'monospace',
      color: colors.text3,
      letterSpacing: 0.5,
      marginTop: 2,
    },
  });

const staticStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  info: { flex: 1 },
});

export default function ICSBanner({ profile }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const incident = INCIDENTS.find((i) => i.id === profile.incidentId);

  return (
    <View style={styles.banner}>
      <View style={styles.glowLine} />
      <View style={staticStyles.row}>
        <View style={styles.iconBox}>
          <Ionicons name="shield-checkmark" size={14} color={colors.info} />
        </View>
        <View style={staticStyles.info}>
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
