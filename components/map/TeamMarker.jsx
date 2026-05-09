import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { buildStatusStyles, useTheme } from '../../constants/theme';

export default function TeamMarker({ member, isUser = false, selected = false, onPress }) {
  const { colors } = useTheme();
  const StatusStyles = useMemo(() => buildStatusStyles(colors), [colors]);
  const s = StatusStyles[member.status] || StatusStyles.offline;
  const isUrgent = member.status === 'needshelp';

  // Up to 2 initials from the cleaned name
  const cleanName = member.name.replace('You (', '').replace(')', '').trim();
  const initials = cleanName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join('');

  const circleSize = isUser ? 42 : 36;

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={styles.container}>
      {/* Tooltip area — always present to keep anchor stable */}
      <View style={styles.tooltipArea}>
        {selected && (
          <View style={[styles.tooltip, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
            <Text style={[styles.tooltipText, { color: colors.text1 }]} numberOfLines={1}>
              {cleanName}
            </Text>
          </View>
        )}
      </View>

      {/* Circle + status dot */}
      <View style={styles.markerWrapper}>
        <View
          style={[
            styles.circle,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: isUser ? colors.surface2 : s.color + 'cc',
              borderColor: isUser ? colors.text1 : s.color + (isUrgent ? 'ff' : '99'),
              borderWidth: isUser ? 2 : isUrgent ? 2 : 1.5,
            },
            isUrgent && {
              shadowColor: s.color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 6,
            },
          ]}
        >
          <Text style={[styles.initial, { color: isUser ? colors.text1 : '#fff' }]}>
            {initials}
          </Text>
        </View>
        <View
          style={[
            styles.dot,
            { backgroundColor: s.color, borderColor: colors.bg },
            isUrgent && {
              shadowColor: s.color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 6,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: 70 },
  tooltipArea: { height: 26, alignItems: 'center', justifyContent: 'flex-end', width: 70 },
  tooltip: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 0.5,
    marginBottom: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
  },
  tooltipText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  markerWrapper: { position: 'relative' },
  circle: { alignItems: 'center', justifyContent: 'center' },
  dot: {
    position: 'absolute',
    width: 11,
    height: 11,
    borderRadius: 5.5,
    borderWidth: 2.5,
    bottom: 0,
    right: 0,
  },
  initial: { fontSize: 12, fontWeight: '700', fontFamily: 'monospace' },
});
