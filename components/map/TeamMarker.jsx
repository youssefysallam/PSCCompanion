import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { buildStatusStyles, useTheme } from '../../constants/theme';

export default function TeamMarker({ member, isUser = false }) {
  const { colors } = useTheme();
  const StatusStyles = buildStatusStyles(colors);
  const s = StatusStyles[member.status] || StatusStyles.offline;
  const isUrgent = member.status === 'needshelp';
  const label = isUser ? 'YOU' : member.name.split(' ').pop();
  const circleSize = isUser ? 42 : 36;

  return (
    <View style={styles.container}>
      <View style={styles.markerWrapper}>
        <View
          style={[
            styles.circle,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              borderColor: isUser ? colors.text1 : s.color + (isUrgent ? 'ff' : '70'),
              backgroundColor: s.color + '12',
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
          <Text style={[styles.initial, { color: isUser ? colors.text1 : s.color }]}>
            {label[0]}
          </Text>
        </View>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: s.color,
              borderColor: colors.bg,
            },
            isUrgent && {
              shadowColor: s.color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 6,
            },
          ]}
        />
      </View>
      <Text
        style={[styles.label, { color: isUser ? colors.text2 : s.color + '90' }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: 50 },
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
  initial: { fontSize: 13, fontWeight: '700', fontFamily: 'monospace' },
  label: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
    marginTop: 5,
  },
});
