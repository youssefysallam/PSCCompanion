import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusStyles } from '../../constants/colors';

export default function StatusBadge({ status, compact = false }) {
  const s = StatusStyles[status] || StatusStyles.offline;

  if (compact) {
    return <View style={[styles.dot, { backgroundColor: s.color }]} />;
  }

  return (
    <View style={styles.badge}>
      <Text style={[styles.label, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
});
