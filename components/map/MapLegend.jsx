import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, StatusStyles } from '../../constants/colors';

export default function MapLegend({ visibleCount, totalCount }) {
  return (
    <>
      <View style={styles.legend}>
        {Object.entries(StatusStyles)
          .filter(([k]) => k !== 'offline')
          .map(([key, val]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: val.color }]} />
              <Text style={[styles.legendText, { color: val.color }]}>{val.label}</Text>
            </View>
          ))}
      </View>

      <View style={styles.countBadge}>
        <Ionicons name="people" size={12} color={Colors.cyan} />
        <Text style={styles.countText}>
          {visibleCount}/{totalCount} VISIBLE
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  legend: {
    position: 'absolute',
    bottom: 114,
    left: 12,
    backgroundColor: Colors.surface + 'e6',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 8,
    gap: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  countBadge: {
    position: 'absolute',
    top: 108,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  countText: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 1,
  },
});
