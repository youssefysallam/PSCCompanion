import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../constants/theme';
import { Avatar, SignalBars } from '../shared';

export default function TeamMemberRow({ member, isLast = false }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const isUrgent = member.status === 'needshelp';

  return (
    <View style={[styles.row, !isLast && styles.bordered]}>
      {isUrgent && <View style={styles.urgentBar} />}
      <Avatar name={member.name} status={member.status} level={member.level} />
      <View style={styles.info}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.detail}>
          {member.role} · {member.lastUpdate}
        </Text>
      </View>
      <View style={styles.trailing}>
        <SignalBars strength={member.signal} />
      </View>
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
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
      left: 0, top: 0, bottom: 0,
      width: 3,
      backgroundColor: c.urgent,
    },
    bordered: {
      borderBottomWidth: 0.5,
      borderBottomColor: c.border,
    },
    info: { flex: 1, minWidth: 0 },
    name: { fontSize: 13, fontWeight: '500', color: c.text1 },
    detail: { fontSize: 11, color: c.text3, marginTop: 2 },
    trailing: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  });
}
