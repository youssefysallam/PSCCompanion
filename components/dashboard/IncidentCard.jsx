import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../constants/theme';

function getIncidentIcon(type, color) {
  if (type === 'Medical Response')
    return <MaterialCommunityIcons name="medical-bag" size={22} color={color} />;
  if (type === 'Vehicle Accident')
    return <MaterialCommunityIcons name="car-emergency" size={22} color={color} />;
  return <Ionicons name="flame" size={22} color={color} />;
}

export default function IncidentCard({ incident, width, onPress, expanded = false }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const isHigh = incident.priority === 'high';
  const severityColor = isHigh ? colors.onScene : colors.enRoute;

  if (expanded) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress && onPress(incident)}
        style={styles.card}
      >
        <View style={[styles.severityBar, { backgroundColor: severityColor }]} />
        <View style={styles.expandedInner}>
          <View style={styles.expandedTop}>
            <View style={styles.iconCol}>
              {getIncidentIcon(incident.type, severityColor)}
            </View>
            <View style={styles.expandedBody}>
              <Text style={styles.type}>{incident.type}</Text>
              <Text style={styles.expandedAddress}>{incident.address}</Text>
            </View>
            <View style={styles.meta}>
              <Text style={[styles.codeBadge, { color: severityColor }]}>{incident.id}</Text>
              <Text style={styles.time}>{incident.time}</Text>
            </View>
          </View>

          <View style={styles.statsBar}>
            <Text style={[styles.statVal, { color: severityColor }]}>{incident.units} units</Text>
            <View style={styles.statDot} />
            <Text style={[styles.statVal, { color: severityColor }]}>{incident.distance}</Text>
          </View>

          {incident.assignedTeam && incident.assignedTeam.length > 0 && (
            <View style={styles.tagRow}>
              {incident.assignedTeam.map((name, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress && onPress(incident)}
      style={[styles.card, width ? { width } : null]}
    >
      <View style={[styles.severityBar, { backgroundColor: severityColor }]} />
      <View style={styles.inner}>
        <View style={styles.iconCol}>
          {getIncidentIcon(incident.type, severityColor)}
        </View>
        <View style={styles.body}>
          <Text style={styles.type}>{incident.type}</Text>
          <Text style={styles.address}>{incident.location}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={[styles.codeBadge, { color: severityColor }]}>{incident.id}</Text>
          <Text style={styles.time}>{incident.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    card: {
      backgroundColor: c.surface1,
      borderRadius: 13,
      borderWidth: 0.5,
      borderColor: c.border,
      flexDirection: 'row',
      overflow: 'hidden',
    },
    severityBar: { width: 3 },
    inner: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
    },
    iconCol: { width: 22, alignItems: 'center' },
    body: { flex: 1, minWidth: 0 },
    type: { fontSize: 13, fontWeight: '500', color: c.text1 },
    address: { fontSize: 11, color: c.text3, marginTop: 2 },
    meta: { alignItems: 'flex-end', gap: 4 },
    codeBadge: { fontSize: 11, fontWeight: '500', letterSpacing: 0.3 },
    time: { fontSize: 10, color: c.text1, fontVariant: ['tabular-nums'] },

    expandedInner: { flex: 1, padding: 12, gap: 10 },
    expandedTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    expandedBody: { flex: 1, minWidth: 0, gap: 2 },
    expandedAddress: { fontSize: 11, color: c.text2, lineHeight: 15 },
    statsBar: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statVal: { fontSize: 11, fontWeight: '500', fontVariant: ['tabular-nums'] },
    statDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: c.text4 },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    tag: {
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: 999,
      borderWidth: 0.5,
      borderColor: c.border,
      backgroundColor: c.surface2,
    },
    tagText: { fontSize: 10, color: c.text2, fontWeight: '500' },
  });
}
