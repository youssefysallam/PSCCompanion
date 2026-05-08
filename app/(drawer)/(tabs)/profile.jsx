import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import HamburgerButton from '../../../components/header/HamburgerButton';
import { Colors, StatusStyles } from '../../../constants/colors';
import { INCIDENTS, USER_PROFILE } from '../../../constants/mockData';

function SectionHeader({ icon, iconLib = 'Ionicons', title }) {
  const IconComp = iconLib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
  return (
    <View style={secStyles.header}>
      <IconComp name={icon} size={13} color={Colors.text3} />
      <Text style={secStyles.title}>{title}</Text>
    </View>
  );
}

const secStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text1,
  },
});

export default function ProfileScreen() {
  const p = USER_PROFILE;
  const s = StatusStyles[p.status] || StatusStyles.offline;
  const incident = INCIDENTS.find((i) => i.id === p.incidentId);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <HamburgerButton />
        <Text style={styles.headerTitle}>Operator profile</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Identity card */}
        <View style={styles.panel}>
          <View style={styles.identityContent}>
            <View style={[styles.avatar, { borderColor: s.color }]}>
              <Text style={[styles.avatarText, { color: s.color }]}>
                {p.name.split(' ').pop()[0]}
              </Text>
              <View style={styles.statusDot}>
                <View style={[styles.dotInner, { backgroundColor: s.color }]} />
              </View>
            </View>
            <View style={styles.identityInfo}>
              <Text style={styles.name}>{p.name.replace('You (', '').replace(')', '')}</Text>
              <Text style={styles.rank}>{p.rank} · {p.role}</Text>
              <Text style={styles.station}>{p.station}</Text>
            </View>
          </View>
        </View>

        {/* ICS Assignment */}
        <View style={styles.panel}>
          <SectionHeader icon="shield-checkmark-outline" title="ICS assignment" />
          <View style={styles.icsContent}>
            <View style={styles.icsRow}>
              <Text style={styles.icsLabel}>Incident</Text>
              <View style={styles.icsValueRow}>
                <Text style={[styles.icsValue, { color: Colors.onScene }]}>{p.incidentId}</Text>
                <Text style={styles.icsSeparator}>·</Text>
                <Text style={styles.icsValue}>{incident?.type || '—'}</Text>
              </View>
            </View>
            <View style={styles.icsDivider} />
            <View style={styles.icsRow}>
              <Text style={styles.icsLabel}>Division</Text>
              <Text style={[styles.icsValue, { color: Colors.text2 }]}>{p.division}</Text>
            </View>
            <View style={styles.icsDivider} />
            <View style={styles.icsRow}>
              <Text style={styles.icsLabel}>Assignment</Text>
              <Text style={[styles.icsValue, { color: Colors.text2 }]}>{p.assignment}</Text>
            </View>
          </View>
        </View>

        {/* Shift Info */}
        <View style={styles.panel}>
          <SectionHeader icon="time-outline" title="Shift info" />
          <View style={styles.shiftContent}>
            <View style={styles.shiftStat}>
              <Text style={styles.shiftStatLabel}>Shift</Text>
              <Text style={styles.shiftStatValue}>{p.shift}</Text>
            </View>
            <View style={styles.shiftDivider} />
            <View style={styles.shiftStat}>
              <Text style={styles.shiftStatLabel}>On duty</Text>
              <Text style={[styles.shiftStatValue, { color: Colors.enRoute }]}>{p.hoursOnDuty}h</Text>
            </View>
          </View>
        </View>

        {/* Gear Readiness */}
        <View style={styles.panel}>
          <SectionHeader icon="construct-outline" title="Gear status" />
          {p.gear.map((g, i) => {
            const isActive = g.status === 'active' || g.status === 'checked';
            const gColor = isActive ? Colors.available : Colors.enRoute;
            return (
              <View
                key={i}
                style={[
                  styles.gearRow,
                  i < p.gear.length - 1 && styles.rowBorder,
                ]}
              >
                <Ionicons
                  name={isActive ? 'checkmark-circle-outline' : 'time-outline'}
                  size={18}
                  color={gColor}
                />
                <View style={styles.rowInfo}>
                  <Text style={styles.rowName}>{g.item}</Text>
                  <Text style={styles.rowDetail}>{g.psi || g.channel || g.note}</Text>
                </View>
                <View style={[styles.statusPill, { borderColor: gColor }]}>
                  <Text style={[styles.statusPillText, { color: gColor }]}>
                    {g.status.charAt(0).toUpperCase() + g.status.slice(1)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Certifications */}
        <View style={styles.panel}>
          <SectionHeader icon="certificate-outline" iconLib="MaterialCommunityIcons" title="Certifications" />
          {p.certifications.map((c, i) => {
            const cColor = c.active ? Colors.available : Colors.onScene;
            return (
              <View
                key={i}
                style={[
                  styles.gearRow,
                  i < p.certifications.length - 1 && styles.rowBorder,
                ]}
              >
                <View style={[styles.certDot, { backgroundColor: cColor }]} />
                <View style={styles.rowInfo}>
                  <Text style={styles.rowName}>{c.name}</Text>
                  <Text style={styles.rowDetail}>
                    {c.active ? 'Expires' : 'Expired'}: {c.expires}
                  </Text>
                </View>
                <View style={[styles.statusPill, { borderColor: cColor }]}>
                  <Text style={[styles.statusPillText, { color: cColor }]}>
                    {c.active ? 'Active' : 'Expired'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
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
    paddingTop: 12,
    gap: 10,
  },
  panel: {
    backgroundColor: Colors.surface1,
    borderRadius: 13,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
  },

  identityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '500',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  identityInfo: { flex: 1 },
  name: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.text1,
  },
  rank: {
    fontSize: 12,
    color: Colors.text2,
    marginTop: 3,
  },
  station: {
    fontSize: 11,
    color: Colors.text3,
    marginTop: 2,
  },

  icsContent: {
    padding: 14,
  },
  icsRow: {
    paddingVertical: 8,
  },
  icsLabel: {
    fontSize: 10,
    color: Colors.text3,
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  icsValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icsValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text1,
  },
  icsSeparator: {
    fontSize: 13,
    color: Colors.text4,
  },
  icsDivider: {
    height: 0.5,
    backgroundColor: Colors.border,
  },

  shiftContent: {
    flexDirection: 'row',
    padding: 14,
    gap: 0,
  },
  shiftStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  shiftStatLabel: {
    fontSize: 10,
    color: Colors.text3,
  },
  shiftStatValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text1,
    fontVariant: ['tabular-nums'],
  },
  shiftDivider: {
    width: 0.5,
    alignSelf: 'stretch',
    backgroundColor: Colors.border,
  },

  gearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  rowInfo: { flex: 1 },
  rowName: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text1,
  },
  rowDetail: {
    fontSize: 11,
    color: Colors.text3,
    marginTop: 2,
  },
  statusPill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 0.5,
    backgroundColor: Colors.surface2,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '500',
  },
  certDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
