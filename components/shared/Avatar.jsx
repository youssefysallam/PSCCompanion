import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, StatusStyles } from '../../constants/colors';

export default function Avatar({ name, status, level, size = 40 }) {
  const initial = name.split(' ').pop()[0];
  const s = StatusStyles[status] || StatusStyles.offline;
  const isOffline = status === 'offline' || !StatusStyles[status];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: isOffline ? Colors.border : s.color,
          },
        ]}
      >
        <Text
          style={[
            styles.initial,
            {
              fontSize: size * 0.38,
              color: isOffline ? Colors.border : s.color,
            },
          ]}
        >
          {initial}
        </Text>
      </View>

      {level != null && (
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface1,
    borderWidth: 1.5,
  },
  initial: {
    fontWeight: '500',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.surface1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 2,
    paddingHorizontal: 4,
    minWidth: 18,
    alignItems: 'center',
  },
  levelText: {
    fontSize: 8,
    fontWeight: '500',
    color: Colors.text2,
    lineHeight: 14,
  },
});
