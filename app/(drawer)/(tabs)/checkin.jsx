import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HamburgerButton from '../../../components/header/HamburgerButton';
import { buildStatusStyles, useTheme } from '../../../constants/theme';

const STATUS_KEYS = ['safe', 'enroute', 'onscene', 'needshelp'];
const STATUS_SUBLABELS = { safe: 'Safe', enroute: 'Code 2', onscene: 'Code 3', needshelp: 'Alert' };

function StatusIcon({ statusKey, size = 22, color, StatusStyles }) {
  const s = StatusStyles[statusKey];
  if (!s) return null;
  const iconColor = color || s.color;
  if (s.iconLib === 'MaterialCommunityIcons')
    return <MaterialCommunityIcons name={s.icon} size={size} color={iconColor} />;
  return <Ionicons name={s.icon} size={size} color={iconColor} />;
}

export default function CheckInScreen() {
  const { colors } = useTheme();
  const StatusStyles = useMemo(() => buildStatusStyles(colors), [colors]);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();

  const [currentStatus, setCurrentStatus] = useState('safe');

  const current = StatusStyles[currentStatus];

  const onPickStatus = async (key) => {
    if (key === currentStatus) {
      await Haptics.selectionAsync();
      return;
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Heavy);
    setCurrentStatus(key);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{ position: 'absolute', top: insets.top + 8, left: 16, zIndex: 20 }}>
        <HamburgerButton />
      </View>

      <View style={styles.content}>
        <Text style={[styles.pageTitle, { color: colors.accent }]}>What's your status?</Text>
        <View style={[styles.heroBlock, { borderTopColor: current.color }]}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroMicro}>Current status</Text>
            <Text style={[styles.heroWord, { color: current.color }]}>{current.label}</Text>
            <Text style={styles.heroMeta}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <StatusIcon statusKey={currentStatus} size={26} StatusStyles={StatusStyles} />
        </View>

        <View style={styles.grid}>
          {STATUS_KEYS.map((key) => {
            const s = StatusStyles[key];
            const isCurrent = key === currentStatus;
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.statusButton,
                  isCurrent && styles.statusButtonSelected,
                  isCurrent && { borderTopColor: s.color },
                  !isCurrent && styles.statusButtonDim,
                ]}
                onPress={() => onPickStatus(key)}
                activeOpacity={0.75}
              >
                {isCurrent && <View style={[styles.activeDot, { backgroundColor: s.color }]} />}
                <StatusIcon statusKey={key} size={30} StatusStyles={StatusStyles} />
                <Text style={[styles.btnLabel, isCurrent && { color: s.color }]}>{s.label}</Text>
                <Text style={[styles.btnSublabel, isCurrent && { color: s.color }]}>
                  {isCurrent ? 'Active' : STATUS_SUBLABELS[key]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </View>
    </SafeAreaView>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    content: {
      flex: 1, alignItems: 'center', justifyContent: 'center',
      paddingHorizontal: 20, gap: 16,
    },
    pageTitle: {
      fontSize: 30, fontWeight: '500', textAlign: 'center', letterSpacing: -0.5,
    },
    heroBlock: {
      width: '100%', flexDirection: 'row',
      justifyContent: 'space-between', alignItems: 'center',
      backgroundColor: c.surface1, borderRadius: 14,
      borderWidth: 0.5, borderColor: c.border,
      borderTopWidth: 1.5,
      paddingTop: 18, paddingHorizontal: 18, paddingBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 18,
      elevation: 8,
    },
    heroLeft: { gap: 2 },
    heroMicro: { fontSize: 10, color: c.text3, letterSpacing: 0.4 },
    heroWord: { fontSize: 30, fontWeight: '500', letterSpacing: -0.3 },
    heroMeta: { fontSize: 11, color: c.text3, fontVariant: ['tabular-nums'] },
    grid: {
      width: '100%', flexDirection: 'row', flexWrap: 'wrap',
      gap: 10, justifyContent: 'space-between',
    },
    statusButton: {
      width: '48%', aspectRatio: 1.15, borderRadius: 13,
      borderWidth: 0.5, borderColor: c.border, borderTopWidth: 0.5,
      backgroundColor: c.surface2, padding: 11,
      alignItems: 'center', justifyContent: 'center', gap: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 4,
    },
    statusButtonSelected: {
      backgroundColor: c.surface1, borderTopWidth: 1.5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.22,
      shadowRadius: 12,
      elevation: 6,
    },
    statusButtonDim: { opacity: 0.45 },
    activeDot: { position: 'absolute', top: 10, right: 10, width: 6, height: 6, borderRadius: 3 },
    btnLabel: { fontSize: 13, fontWeight: '500', color: c.text1, textAlign: 'center' },
    btnSublabel: { fontSize: 10, color: c.text3, letterSpacing: 0.4, textAlign: 'center' },
  });
}
