import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import HamburgerButton from '../../../components/header/HamburgerButton';
import { Colors } from '../../../constants/colors';
import { useAlerts } from '../../../context/AlertContext';

const TYPE_STYLES = {
  urgent:  { color: Colors.onScene,  icon: 'warning-outline',      label: 'Critical' },
  warning: { color: Colors.enRoute,  icon: 'alert-circle-outline', label: 'Warning'  },
  info:    { color: Colors.info,     icon: 'information-circle-outline', label: 'Info' },
};

function AlertRow({ alert, isLast, updateAlertStatus }) {
  const s = TYPE_STYLES[alert.type] || TYPE_STYLES.info;
  const isUrgent = alert.type === 'urgent';
  const isAcknowledged = alert.status === 'acknowledged';
  const isResolved = alert.status === 'resolved';
  const canSwipe = isUrgent && !isAcknowledged && !isResolved;
  const [, forceUpdate] = React.useState(0);
  const swipeRef = React.useRef(null);
  const hasTriggered = React.useRef(false);

  React.useEffect(() => {
    const interval = setInterval(() => forceUpdate(n => n + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    hasTriggered.current = false;
  }, [alert.status]);

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
      <View
        style={[
          styles.alertRow,
          !isLast && styles.alertBorder,
          isResolved && styles.alertResolved,
        ]}
      >
        <View style={[styles.leftBar, { backgroundColor: s.color }]} />

        <Ionicons name={s.icon} size={18} color={isAcknowledged ? Colors.text3 : s.color} />

        <View style={styles.alertContent}>
          <View style={styles.alertTop}>
            <Text style={[styles.alertTitle, isAcknowledged && styles.alertTitleDim]} numberOfLines={1}>
              {alert.title}
            </Text>
            {isUrgent && !isAcknowledged && (
              <Text style={[styles.severityChip, { color: s.color }]}>{s.label}</Text>
            )}
            <Text style={styles.alertTime}>{getTime(alert.createdAt)}</Text>
          </View>
          <Text style={styles.alertDetail}>{alert.detail}</Text>
        </View>
      </View>
    </Swipeable>
  );
}

function SectionHeader({ title, count }) {
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
  const STATUS_PRIORITY = { urgent: 0, warning: 1, info: 2 };

  const activeAlerts = alerts
    .filter(alert => alert.status !== 'resolved')
    .sort((a, b) => {
      const typeDiff = (STATUS_PRIORITY[a.type] ?? 3) - (STATUS_PRIORITY[b.type] ?? 3);
      if (typeDiff !== 0) return typeDiff;
      if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
      return b.createdAt - a.createdAt;
    });

  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <HamburgerButton />
        <Text style={styles.headerTitle}>Alerts</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Active" count={activeAlerts.length} />

        <View style={styles.panel}>
          {activeAlerts.map((alert, i) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              isLast={i === activeAlerts.length - 1}
              updateAlertStatus={updateAlertStatus}
            />
          ))}
        </View>

        {resolvedAlerts.length > 0 && (
          <>
            <SectionHeader title="Resolved" count={resolvedAlerts.length} />
            <View style={styles.panel}>
              {resolvedAlerts.map((alert, i) => (
                <AlertRow
                  key={alert.id}
                  alert={alert}
                  isLast={i === resolvedAlerts.length - 1}
                  updateAlertStatus={updateAlertStatus}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text1,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 20,
    paddingTop: 8,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text1,
  },
  countPill: {
    backgroundColor: Colors.surface3,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  countText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.text2,
  },

  panel: {
    backgroundColor: Colors.surface1,
    borderRadius: 13,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
  },

  alertRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    paddingLeft: 15,
    backgroundColor: Colors.surface1,
    position: 'relative',
  },
  alertBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  alertResolved: {
    opacity: 0.4,
  },
  leftBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  alertContent: {
    flex: 1,
    minWidth: 0,
  },
  alertTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text1,
    flex: 1,
  },
  alertTitleDim: {
    color: Colors.text3,
  },
  alertTime: {
    fontSize: 10,
    color: Colors.text3,
    fontVariant: ['tabular-nums'],
  },
  alertDetail: {
    fontSize: 11,
    color: Colors.text3,
    marginTop: 3,
  },
  severityChip: {
    fontSize: 11,
    fontWeight: '500',
  },
  swipeAction: {
    backgroundColor: Colors.onScene,
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    flexDirection: 'row',
    gap: 8,
  },
  swipeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});
