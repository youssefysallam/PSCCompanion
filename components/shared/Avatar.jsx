import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { buildStatusStyles, useTheme } from '../../constants/theme';

export default function Avatar({ name, status, level, size = 40 }) {
  const { colors } = useTheme();
  const StatusStyles = useMemo(() => buildStatusStyles(colors), [colors]);
  const initial = name.split(' ').pop()[0];
  const s = StatusStyles[status] || StatusStyles.offline;
  const isOffline = status === 'offline' || !StatusStyles[status];

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: isOffline ? colors.border : s.color,
            backgroundColor: colors.surface1,
            borderWidth: 1.5,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Text style={{ fontSize: size * 0.38, fontWeight: '500', color: isOffline ? colors.border : s.color }}>
          {initial}
        </Text>
      </View>

      {level != null && (
        <View
          style={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            backgroundColor: colors.surface1,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 2,
            paddingHorizontal: 4,
            minWidth: 18,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 8, fontWeight: '500', color: colors.text2, lineHeight: 14 }}>
            {level}
          </Text>
        </View>
      )}
    </View>
  );
}
