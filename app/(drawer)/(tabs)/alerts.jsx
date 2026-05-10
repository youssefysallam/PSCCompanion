import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HamburgerButton from '../../../components/header/HamburgerButton';
import { useTheme } from '../../../constants/theme';
import { useAlerts } from '../../../context/AlertContext';

function getTypeStyles(colors) {
  return {
    urgent:  { color: colors.onScene,  icon: 'warning-outline',           label: 'Critical' },
    warning: { color: colors.enRoute,  icon: 'alert-circle-outline',      label: 'Warning'  },
    info:    { color: colors.info,     icon: 'information-circle-outline', label: 'Info'     },
  };
}

function AlertRow({ alert, updateAlertStatus, colors, styles, TYPE_STYLES, tick }) {
  const s = TYPE_STYLES[alert.type] || TYPE_STYLES.info;
  const isUrgent = alert.type === 'urgent';
  const isAcknowledged = alert.status === 'acknowledged';
  const isResolved = alert.status === 'resolved';
  const canSwipe = isUrgent && !isAcknowledged && !isResolved;
  const isBig = isUrgent && !isAcknowledged && !isResolved;
  const swipeRef = React.useRef(null);
  const hasTriggered = React.useRef(false);

  React.useEffect(() => { hasTriggered.current = false; }, [alert.status]);

  function getTime(timestamp) {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  const renderRightActions = () => (
    <View style={styles.swipeAction}>
      <Ionicons name="checkmark-circle" size={20} color="#fff" />
      <Text style={styles.swipeText}>Acknowledge</Text>
    </View>
  );

  return (
    <View style={[styles.alertCard, isBig && styles.alertCardUrgent, isResolved && styles.alertResolved]}>
      <Swipeable
        ref={swipeRef}
        enabled={canSwipe}
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={(direction) => {
          if (direction === 'left' && !hasTriggered.current) {
            hasTriggered.current = true;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setTimeout(() => {
              updateAlertStatus(alert.id, 'acknowledged');
              swipeRef.current?.close();
            }, 600);
          }
        }}
        overshootRight={false}
        rightThreshold={30}
        friction={1.5}
      >
        <View style={[styles.alertRow, isBig && styles.alertRowUrgent]}>
          <View style={[styles.leftBar, isBig && styles.leftBarUrgent, { backgroundColor: s.color }]} />
          <Ionicons name={s.icon} size={isBig ? 22 : 18} color={isAcknowledged ? colors.text3 : s.color} />
          <View style={styles.alertContent}>
            {isBig && (
              <View style={styles.urgentChipRow}>
                <View style={[styles.urgentPill, { borderColor: s.color }]}>
                  <Text style={[styles.urgentPillText, { color: s.color }]}>{s.label}</Text>
                </View>
                <Text style={styles.alertTime}>{getTime(alert.createdAt)}</Text>
              </View>
            )}
            <View style={styles.alertTop}>
              <Text style={[
                styles.alertTitle,
                isBig && styles.alertTitleUrgent,
                isAcknowledged && styles.alertTitleDim,
              ]} numberOfLines={isBig ? 2 : 1}>
                {alert.title}
              </Text>
              {!isBig && isUrgent && !isAcknowledged && (
                <Text style={[styles.severityChip, { color: s.color }]}>{s.label}</Text>
              )}
              {!isBig && <Text style={styles.alertTime}>{getTime(alert.createdAt)}</Text>}
            </View>
            <Text style={[styles.alertDetail, isBig && styles.alertDetailUrgent]}>{alert.detail}</Text>
            {isBig && <Text style={styles.swipeHint}>Swipe left to acknowledge →</Text>}
          </View>
        </View>
      </Swipeable>
    </View>
  );
}

function SectionHeader({ title, count, styles }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {count != null && (
        <View style={styles.countPill}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      )}
    </View>
  );
}

export default function AlertsScreen() {
  const { alerts, updateAlertStatus } = useAlerts();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const TYPE_STYLES = useMemo(() => getTypeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const STATUS_PRIORITY = { urgent: 0, warning: 1, info: 2 };

  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const activeAlerts = alerts
    .filter(a => a.status !== 'resolved')
    .sort((a, b) => {
      const typeDiff = (STATUS_PRIORITY[a.type] ?? 3) - (STATUS_PRIORITY[b.type] ?? 3);
      if (typeDiff !== 0) return typeDiff;
      if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
      return b.createdAt - a.createdAt;
    });

  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');
  console.log('AlertsScreen render, tick:', tick);
  return (
    <SafeAreaView style={styles.screen}>
      <View style={{ position: 'absolute', top: insets.top + 8, left: 16, zIndex: 20 }}>
        <HamburgerButton />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 54 }]}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Active" count={activeAlerts.length} styles={styles} />
        <View style={styles.alertList}>
          {activeAlerts.map((alert) => (
            <AlertRow key={`${alert.id}-${tick}`} alert={alert} tick={tick} updateAlertStatus={updateAlertStatus}
            colors={colors} styles={styles} TYPE_STYLES={TYPE_STYLES} />
          ))}
        </View>

        {resolvedAlerts.length > 0 && (
          <>
            <SectionHeader title="Resolved" count={resolvedAlerts.length} styles={styles} />
            <View style={styles.alertList}>
              {resolvedAlerts.map((alert) => (
              <AlertRow key={`${alert.id}-${tick}`} alert={alert} tick={tick} updateAlertStatus={updateAlertStatus}
                colors={colors} styles={styles} TYPE_STYLES={TYPE_STYLES} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: 14,
      paddingBottom: 20,
    },

    sectionHeader: {
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 14, paddingHorizontal: 4, paddingBottom: 8,
    },
    sectionTitle: { fontSize: 13, fontWeight: '500', color: c.text1 },
    countPill: {
      backgroundColor: c.surface3, paddingVertical: 2,
      paddingHorizontal: 8, borderRadius: 999,
    },
    countText: { fontSize: 11, fontWeight: '500', color: c.text2 },

    alertList: { gap: 8 },
    alertCard: {
      backgroundColor: c.surface1, borderRadius: 13,
      borderWidth: 0.5, borderColor: c.border, overflow: 'hidden',
    },
    alertCardUrgent: { borderColor: c.onScene, borderWidth: 1 },
    alertResolved: { opacity: 0.4 },
    alertRow: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 12,
      padding: 12, paddingLeft: 15,
      backgroundColor: c.surface1, position: 'relative',
    },
    alertRowUrgent: { padding: 16, paddingLeft: 19, gap: 14 },
    leftBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
    leftBarUrgent: { width: 5 },
    alertContent: { flex: 1, minWidth: 0 },
    alertTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    alertTitle: { fontSize: 13, fontWeight: '500', color: c.text1, flex: 1 },
    alertTitleUrgent: { fontSize: 16, fontWeight: '600', lineHeight: 21 },
    alertTitleDim: { color: c.text3 },
    alertTime: { fontSize: 10, color: c.text3, fontVariant: ['tabular-nums'] },
    alertDetail: { fontSize: 11, color: c.text3, marginTop: 3 },
    alertDetailUrgent: { fontSize: 13, color: c.text2, marginTop: 4 },
    severityChip: { fontSize: 11, fontWeight: '500' },
    urgentChipRow: {
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-between', marginBottom: 6,
    },
    urgentPill: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1 },
    urgentPillText: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3 },
    swipeHint: { fontSize: 10, color: c.text4, marginTop: 10 },
    swipeAction: {
      backgroundColor: c.onScene,
      justifyContent: 'center', alignItems: 'center',
      width: 130, flexDirection: 'row', gap: 8,
    },
    swipeText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  });
}
