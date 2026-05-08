import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusStyles } from '../../constants/colors';

export default function TeamMarker({ member, isUser = false }) {
  const s = StatusStyles[member.status] || StatusStyles.offline;
  const isUrgent = member.status === 'needshelp';
  const label = isUser ? 'YOU' : member.name.split(' ').pop();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.pin,
          {
            backgroundColor: s.bg,
            borderColor: s.color + (isUrgent ? 'ff' : '80'),
          },
          isUser && styles.userPin,
        ]}
      >
        <Text style={[styles.pinText, { color: s.color }]}>
          {label[0]}
        </Text>
      </View>
      <Text style={[styles.label, { color: s.color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: 60 },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPin: {
    width: 36,
    height: 36,
    borderWidth: 2.5,
  },
  pinText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  label: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
