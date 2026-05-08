import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

function getIncidentIcon(type, color) {
  if (type === 'Medical Response') {
    return <MaterialCommunityIcons name="medical-bag" size={22} color={color} />;
  }
  if (type === 'Vehicle Accident') {
    return <MaterialCommunityIcons name="car-emergency" size={22} color={color} />;
  }
  return <Ionicons name="flame" size={22} color={color} />;
}

export default function IncidentCard({ incident, width, onPress }) {
  const isHigh = incident.priority === 'high';
  const severityColor = isHigh ? Colors.onScene : Colors.enRoute;
  const cardWidth = width || undefined;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress && onPress(incident)}
      style={[styles.card, cardWidth ? { width: cardWidth } : null]}
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface1,
    borderRadius: 13,
    borderWidth: 0.5,
    borderColor: Colors.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  severityBar: {
    width: 3,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  iconCol: {
    width: 22,
    alignItems: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  type: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text1,
  },
  address: {
    fontSize: 11,
    color: Colors.text3,
    marginTop: 2,
  },
  meta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  codeBadge: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  time: {
    fontSize: 10,
    color: Colors.text3,
    fontVariant: ['tabular-nums'],
  },
});
