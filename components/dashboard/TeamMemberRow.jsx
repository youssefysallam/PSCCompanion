import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, StatusStyles } from '../../constants/colors';
import { Avatar, StatusBadge, SignalBars } from '../shared';

export default function TeamMemberRow({ member, isLast = false }) {
  const isUrgent = member.status === 'needshelp';

  return (
    <View
      style={[
        styles.row,
        !isLast && styles.bordered,
      ]}
    >
      {isUrgent && <View style={styles.urgentBar} />}

      <Avatar
        name={member.name}
        status={member.status}
        level={member.level}
      />

      <View style={styles.info}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.detail}>
          {member.role} · {member.lastUpdate}
        </Text>
      </View>

      <View style={styles.trailing}>
        <SignalBars strength={member.signal} />
        <StatusBadge status={member.status} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    position: 'relative',
  },
  urgentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: Colors.onScene,
  },
  bordered: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text1,
  },
  detail: {
    fontSize: 11,
    color: Colors.text3,
    marginTop: 2,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
