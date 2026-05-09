/**
 * Alerts Screen
 * Owner: Azealia
 * Solo Leveling system notification style.
 * tasks:
 * 1. alert state model: new, active, acknowledged, resolved (done)
 * 2. split alerts array into: active(new, active, acknowledged), resolved (done)
 * 3. add dynamic timestamps (done)
 * 4. add visual distinction for acknowledged alerts (done)
 * 5. color-code timestamps for urgency decay (done)
 * 6. sort alerts by status and then by time within each status (improves situational awareness)(done)
 * 7. fix color: text and tier (done)
 * 8. swipe right to acknowledge: one action with haptic feedback (for red tier) (done)
 * 9. tap to expand (I think this should only be for info and warning alerts and it should be its own page: incident/detail page. alert page should remain minimal, scannable)
 * 
 * 
 */

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import HamburgerButton from '../../../components/header/HamburgerButton';
import { Colors } from '../../../constants/colors';
import { useAlerts } from '../../../context/AlertContext';

const TYPE_STYLES = {
  urgent: { color: Colors.danger, bg: Colors.dangerFaint, bgStrong: Colors.dangerStrong, icon: 'warning' },
  warning: { color: Colors.orange, bg: Colors.orangeFaint, bgStrong: Colors.orangeStrong, icon: 'alert-circle' },
  info: { color: Colors.warning, bg: Colors.warningFaint, bgStrong: Colors.warningStrong, icon: 'build' },
};


function AlertRow({ alert, isLast, updateAlertStatus }) {
  const s = TYPE_STYLES[alert.type] || TYPE_STYLES.info;
  const isUrgent = alert.type === 'urgent';
  const isNew = (Date.now() - alert.createdAt) < 200000;
  const isAcknowledged = alert.status === "acknowledged";
  const isResolved = alert.status === 'resolved';
  const canSwipe = isUrgent && !isAcknowledged && !isResolved;
  const [, forceUpdate] = React.useState(0);
  const swipeRef = React.useRef(null);
  const hasTriggered = React.useRef(false);

   //update timestamp every 30s rather than every time component re-renders
  React.useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(n => n + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    hasTriggered.current = false;
  }, [alert.status]);

  //active --> acknowledged (swipe gesture)
  const renderRightActions = () => {
    return (
      <View style={styles.swipeAction}>
        <Ionicons name="checkmark-circle" size={20} color="#fff"/>
        <Text style={styles.swipeText}>ACKNOWLEDGE</Text>
      </View>
    );
  };

  //active/acknoewledged --> resolved (system action or manual resolve action)

  function getTime(timestamp){
    const diff = Math.floor((Date.now() - timestamp) / 1000);

    if(diff < 60) return `${diff}s ago`;
    if(diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if(diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    <Swipeable 
      ref={swipeRef}
      enabled={canSwipe}
      renderRightActions={renderRightActions}
      onSwipeableWillOpen={(direction) => {
        if(direction === 'left' && !hasTriggered.current){
          hasTriggered.current = true;
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimeout(() => {
            updateAlertStatus(alert.id, 'acknowledged');
            //snap back 
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
          isUrgent && !isAcknowledged && styles.alertUrgent && { backgroundColor: s.bgStrong },   
          !isUrgent && isNew && { backgroundColor: s.bgStrong },      
          !isUrgent && !isResolved && !isNew && { backgroundColor: Colors.panel },
          isAcknowledged && styles.alertAcknowledged,
          isResolved && styles.alertResolved,
        ]}
        
      >
        {/* Left color bar */}
        <View style={[styles.leftBar, { backgroundColor: s.color }]} />

        <View style={[styles.alertIcon, { backgroundColor: s.bg, borderColor: s.color + '40' }]}>
          <Ionicons name={s.icon} size={14} color={s.color} />
        </View>
        <View style={styles.alertContent}>
          <View style={styles.alertTop}>
            <Text style={styles.alertTitle} numberOfLines={1}>
              {alert.title}
            </Text>
            {isUrgent && (
              <View style={styles.severityChip}>
                <Text style={styles.severityText}>CRITICAL</Text>
              </View>
            )}
            <Text style={styles.alertTime}>{getTime(alert.createdAt)}</Text>
          </View>
          <Text style={styles.alertDetail}>{alert.detail}</Text>
        </View>
      </View>
    </Swipeable>
  );
}

function PanelHeader({ title, color = Colors.cyan }) {
  return (
    <View style={[styles.panelHeader, { borderBottomColor: color + '15' }]}>
      <View style={[styles.headerIcon, { borderColor: color }]}>
        <Text style={[styles.headerIconText, { color }]}>!</Text>
      </View>
      <Text style={[styles.headerTitle, { color }]}>{title}</Text>
    </View>
  );
}

export default function AlertsScreen() {
  const { alerts, updateAlertStatus } = useAlerts();
  const STATUS_PRIORITY = {urgent: 0, warning: 1, info: 2};

  const activeAlerts = alerts
    .filter(alert => alert.status !== 'resolved')
    //type -> status -> time
    .sort((a, b) => {
      //first sort by type periority 
      //if res is neg a comes first, if pos b comes first 
      const typeDiff = (STATUS_PRIORITY[a.type] ?? 3) - (STATUS_PRIORITY[b.type] ?? 3);
      //if a & b have diff types, sort by type periority only
      if (typeDiff !== 0) return typeDiff;
      //type is same, sort by status (active comes before acknowledged)
      if(a.status != b.status) return a.status === 'active' ? -1 : 1;
      //same type and same status, then sort by time 
      return b.createdAt - a.createdAt;
    })

  const resolvedAlerts = alerts.filter(
    alerts => alerts.status === 'resolved'
  );


  return (
    <View style={styles.screen}>
      <View style={styles.header}>
         <View style={styles.hamburgerRow}>
            <HamburgerButton />
          </View>
        <Text style={styles.title}>SYSTEM ALERTS</Text>
        <Text style={styles.subtitle}>Recent team activity</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.panel}>
          <PanelHeader title="Active Alerts" color={Colors.danger}/>

          {activeAlerts.map((alert, i) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              isLast={i === activeAlerts.length - 1}
              updateAlertStatus={updateAlertStatus}
            />
          ))}
          {/*Resolved section: not always have any items*/}
          {resolvedAlerts.length > 0 && (
            <>
            <PanelHeader title="Resolved Alerts" color={Colors.textTertiary}/>
            {resolvedAlerts.map((alert, i) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                isLast={i === resolvedAlerts.length - 1}
                updateAlertStatus={updateAlertStatus}
              />
            ))}
            </>
          )}     
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 18,
    paddingBottom: 10,
    backgroundColor: Colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  hamburgerRow: {
    paddingHorizontal: 1,
    paddingBottom: 26,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textBright,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontFamily: 'monospace',
    marginTop: 2,
    letterSpacing: 0.8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 20,
    paddingTop: 12,
  },
  panel: {
    backgroundColor: Colors.panel,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.cyanBorder,
    overflow: 'hidden',
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  headerIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 12,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    paddingLeft: 16,
    position: 'relative',
  },
  alertUrgent: {
    backgroundColor: Colors.dangerFaint,
  },
  alertNew: {
    backgroundColor: 'rgba(255, 149, 0, 0.14)',
  },
  alertAcknowledged: {
    backgroundColor: Colors.panel,
  },
  alertResolved: {
    opacity: 0.3,
    backgroundColor: Colors.panel,
  },
  alertBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  alertContent: {
    flex: 1,
    minWidth: 0,
  },
  alertTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textBright,
    flex: 1,
  },
  alertTime: {
    fontSize: 9,
    color: Colors.textQuaternary,
    fontFamily: 'monospace',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  alertDetail: {
    fontSize: 11,
    color: Colors.textQuaternary,
    fontFamily: 'monospace',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  severityChip: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  severityText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  swipeAction: {
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    flexDirection: 'row',
    gap: 8,
  },
  
  swipeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
 
});