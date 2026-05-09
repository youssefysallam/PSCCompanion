import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { buildStatusStyles, useTheme } from '../../constants/theme';

const makeStyles = (colors) =>
  StyleSheet.create({
    legend: {
      position: 'absolute',
      bottom: 114,
      left: 12,
      backgroundColor: colors.surface1 + 'e6',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 8,
      gap: 4,
    },
    countBadge: {
      position: 'absolute',
      top: 108,
      right: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: colors.surface1,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 5,
      paddingHorizontal: 8,
    },
    countText: {
      fontSize: 9,
      fontWeight: '700',
      fontFamily: 'monospace',
      color: colors.info,
      letterSpacing: 1,
    },
  });

const staticStyles = StyleSheet.create({
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
});

export default function MapLegend({ visibleCount, totalCount }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const StatusStyles = useMemo(() => buildStatusStyles(colors), [colors]);

  return (
    <>
      <View style={styles.legend}>
        {Object.entries(StatusStyles)
          .filter(([k]) => k !== 'offline')
          .map(([key, val]) => (
            <View key={key} style={staticStyles.legendItem}>
              <View style={[staticStyles.legendDot, { backgroundColor: val.color }]} />
              <Text style={[staticStyles.legendText, { color: val.color }]}>{val.label}</Text>
            </View>
          ))}
      </View>

      <View style={styles.countBadge}>
        <Ionicons name="people" size={12} color={colors.info} />
        <Text style={styles.countText}>
          {visibleCount}/{totalCount} VISIBLE
        </Text>
      </View>
    </>
  );
}
