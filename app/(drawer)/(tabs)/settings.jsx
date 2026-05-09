import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HamburgerButton from '../../../components/header/HamburgerButton';
import { useTheme } from '../../../constants/theme';
import { USER_PROFILE } from '../../../constants/mockData';

function SectionLabel({ label, styles }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function InfoRow({ label, value, isLast, styles }) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function ToggleRow({ label, sublabel, value, onChange, isLast, styles, colors }) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.toggleLeft}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sublabel && <Text style={styles.rowSublabel}>{sublabel}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.surface3, true: colors.available + 'cc' }}
        thumbColor={value ? colors.available : colors.text3}
        ios_backgroundColor={colors.surface3}
      />
    </View>
  );
}

function NavRow({ label, sublabel, value, isLast, styles, colors }) {
  return (
    <TouchableOpacity style={[styles.row, !isLast && styles.rowBorder]} activeOpacity={0.7}>
      <View style={styles.toggleLeft}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sublabel && <Text style={styles.rowSublabel}>{sublabel}</Text>}
      </View>
      <View style={styles.navRight}>
        {value && <Text style={styles.navValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={14} color={colors.text4} />
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();

  const [urgentAlerts, setUrgentAlerts] = useState(true);
  const [warningAlerts, setWarningAlerts] = useState(true);
  const [infoAlerts, setInfoAlerts] = useState(false);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);

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
        {/* Theme toggle — top of page */}
        <View style={styles.themeCard}>
          <Text style={styles.themeCardLabel}>Appearance</Text>
          <View style={styles.themeRow}>
            <TouchableOpacity
              style={[styles.themeBtn, !isDark && styles.themeBtnActive]}
              onPress={() => isDark && toggleTheme()}
              activeOpacity={0.8}
            >
              <Ionicons name="sunny-outline" size={17} color={!isDark ? colors.text1 : colors.text3} />
              <Text style={[styles.themeBtnText, !isDark && { color: colors.text1 }]}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeBtn, isDark && styles.themeBtnActive]}
              onPress={() => !isDark && toggleTheme()}
              activeOpacity={0.8}
            >
              <Ionicons name="moon-outline" size={17} color={isDark ? colors.text1 : colors.text3} />
              <Text style={[styles.themeBtnText, isDark && { color: colors.text1 }]}>Dark</Text>
            </TouchableOpacity>
          </View>
        </View>

        <SectionLabel label="On duty" styles={styles} />
        <View style={styles.panel}>
          <InfoRow label="Name" value={USER_PROFILE.name.replace('You (', '').replace(')', '')} styles={styles} />
          <InfoRow label="Rank" value={USER_PROFILE.rank} styles={styles} />
          <InfoRow label="Station" value={USER_PROFILE.station} styles={styles} />
          <InfoRow label="Shift" value={USER_PROFILE.shift} styles={styles} />
          <InfoRow label="Hours on duty" value={`${USER_PROFILE.hoursOnDuty}h`} isLast styles={styles} />
        </View>

        <SectionLabel label="Notifications" styles={styles} />
        <View style={styles.panel}>
          <ToggleRow label="Urgent alerts" sublabel="Mayday, PASS alarms, missing signals"
            value={urgentAlerts} onChange={setUrgentAlerts} styles={styles} colors={colors} />
          <ToggleRow label="Warning alerts" sublabel="Accountability, wind shifts, backup requests"
            value={warningAlerts} onChange={setWarningAlerts} styles={styles} colors={colors} />
          <ToggleRow label="Info alerts" sublabel="Location, staging, status updates"
            value={infoAlerts} onChange={setInfoAlerts} isLast styles={styles} colors={colors} />
        </View>
        <View style={styles.panel}>
          <ToggleRow label="Sound" value={sound} onChange={setSound} styles={styles} colors={colors} />
          <ToggleRow label="Vibration" value={vibration} onChange={setVibration} isLast styles={styles} colors={colors} />
        </View>

        <SectionLabel label="Radio" styles={styles} />
        <View style={styles.panel}>
          <NavRow label="Primary channel" value="TAC-3" styles={styles} colors={colors} />
          <NavRow label="Backup channel" value="CMD-1" isLast styles={styles} colors={colors} />
        </View>

        <SectionLabel label="Privacy" styles={styles} />
        <View style={styles.panel}>
          <ToggleRow label="Location tracking" sublabel="Share position with incident command"
            value={locationTracking} onChange={setLocationTracking} isLast styles={styles} colors={colors} />
        </View>

        <SectionLabel label="About" styles={styles} />
        <View style={styles.panel}>
          <InfoRow label="Version" value="1.0.0" styles={styles} />
          <InfoRow label="Build" value="1" isLast styles={styles} />
        </View>

        <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.75}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
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
      paddingBottom: 40,
    },

    themeCard: {
      backgroundColor: c.surface1,
      borderRadius: 13, borderWidth: 0.5, borderColor: c.border,
      padding: 14, gap: 12, marginTop: 6,
    },
    themeCardLabel: { fontSize: 11, fontWeight: '500', color: c.text3, letterSpacing: 0.4 },
    themeRow: { flexDirection: 'row', gap: 8 },
    themeBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 6, paddingVertical: 10, borderRadius: 10,
      borderWidth: 0.5, borderColor: c.border,
      backgroundColor: c.surface2,
    },
    themeBtnActive: { backgroundColor: c.surface3, borderColor: c.text3 },
    themeBtnText: { fontSize: 13, fontWeight: '500', color: c.text3 },

    sectionLabel: {
      fontSize: 11, fontWeight: '500', color: c.text3, letterSpacing: 0.4,
      paddingHorizontal: 4, paddingTop: 20, paddingBottom: 8,
    },
    panel: {
      backgroundColor: c.surface1, borderRadius: 13,
      borderWidth: 0.5, borderColor: c.border, overflow: 'hidden',
    },
    row: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingVertical: 13, paddingHorizontal: 14,
      backgroundColor: c.surface1, minHeight: 48,
    },
    rowBorder: { borderBottomWidth: 0.5, borderBottomColor: c.border },
    rowLabel: { fontSize: 13, color: c.text1 },
    rowValue: { fontSize: 13, color: c.text3, maxWidth: '55%', textAlign: 'right' },
    rowSublabel: { fontSize: 11, color: c.text3, marginTop: 2, maxWidth: 220 },
    toggleLeft: { flex: 1, paddingRight: 16 },
    navRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    navValue: { fontSize: 13, color: c.text3 },

    signOutBtn: {
      marginTop: 24, height: 44, borderRadius: 13,
      borderWidth: 0.5, borderColor: c.border,
      backgroundColor: c.surface1, alignItems: 'center', justifyContent: 'center',
    },
    signOutText: { fontSize: 13, fontWeight: '500', color: c.onScene },
  });
}
