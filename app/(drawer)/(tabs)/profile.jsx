import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HamburgerButton from '../../../components/header/HamburgerButton';
import { buildStatusStyles, useTheme } from '../../../constants/theme';
import { INCIDENTS, USER_PROFILE } from '../../../constants/mockData';

function SectionHeader({ icon, iconLib = 'Ionicons', title, colors }) {
  const IconComp = iconLib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 9,
      paddingVertical: 12, paddingHorizontal: 16,
      backgroundColor: colors.surface2,
      borderBottomWidth: 0.5, borderBottomColor: colors.border,
    }}>
      <IconComp name={icon} size={15} color={colors.text3} />
      <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text1 }}>{title}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { colors } = useTheme();
  const StatusStyles = useMemo(() => buildStatusStyles(colors), [colors]);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();

  const p = USER_PROFILE;
  const s = StatusStyles[p.status] || StatusStyles.offline;
  const incident = INCIDENTS.find((i) => i.id === p.incidentId);

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const shiftDuration = 24;
  const progress = Math.min(p.hoursOnDuty / shiftDuration, 1);
  const hoursLeft = shiftDuration - p.hoursOnDuty;
  const progressColor = progress < 0.5 ? colors.available : progress < 0.75 ? colors.enRoute : colors.onScene;

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
        {/* Hero card: identity + shift clock */}
        {/* Outer view carries the shadow (overflow:hidden would clip it) */}
        <View style={styles.heroShadowWrap}>
        <View style={[styles.panel, styles.heroCard]}>
          {/* Monogram watermark — clipped naturally by overflow:hidden */}
          <Text style={styles.heroWatermark} numberOfLines={1}>
            {p.name.split(' ').pop()[0]}
          </Text>
          <View style={styles.identityContent}>
            <View style={[styles.avatar, { borderColor: s.color }]}>
              <Text style={[styles.avatarText, { color: s.color }]}>
                {p.name.split(' ').pop()[0]}
              </Text>
              <View style={[styles.statusRing, { borderColor: colors.surface1 }]}>
                <View style={[styles.statusRingDot, { backgroundColor: s.color }]} />
              </View>
            </View>
            <View style={styles.identityInfo}>
              <Text style={styles.idName}>{p.name.replace('You (', '').replace(')', '')}</Text>
              <Text style={styles.idRank}>{p.rank}</Text>
              <Text style={styles.idRole}>{p.role} · {p.station}</Text>
              <View style={[styles.statusChip, { backgroundColor: s.color + '18', borderColor: s.color + '60' }]}>
                <View style={[styles.chipDot, { backgroundColor: s.color }]} />
                <Text style={[styles.chipLabel, { color: s.color }]}>{s.label}</Text>
              </View>
            </View>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.shiftClockRow}>
            <Text style={styles.clockTime}>
              {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <View style={styles.shiftMetaCol}>
              <Text style={styles.shiftMetaLabel}>SHIFT</Text>
              <Text style={styles.shiftMetaValue}>{p.shift}</Text>
              <Text style={styles.shiftMetaSub}>{p.hoursOnDuty}h elapsed · {hoursLeft}h left</Text>
            </View>
          </View>

          <View style={styles.clockTrack}>
            <View style={[styles.clockFill, { width: `${progress * 100}%`, backgroundColor: progressColor }]} />
          </View>
        </View>
        </View>

        {/* ICS Assignment */}
        <View style={styles.panel}>
          <SectionHeader icon="shield-checkmark-outline" title="ICS assignment" colors={colors} />
          <View style={styles.icsContent}>
            <View style={styles.icsRow}>
              <Text style={styles.icsLabel}>Incident</Text>
              <View style={styles.icsValueRow}>
                <Text style={[styles.icsValue, { color: colors.onScene }]}>{p.incidentId}</Text>
                <Text style={styles.icsSeparator}>·</Text>
                <Text style={styles.icsValue}>{incident?.type || '—'}</Text>
              </View>
            </View>
            <View style={styles.icsDivider} />
            <View style={styles.icsRow}>
              <Text style={styles.icsLabel}>Division</Text>
              <Text style={styles.icsValue}>{p.division}</Text>
            </View>
            <View style={styles.icsDivider} />
            <View style={styles.icsRow}>
              <Text style={styles.icsLabel}>Assignment</Text>
              <Text style={styles.icsValue}>{p.assignment}</Text>
            </View>
          </View>
        </View>

        {/* Gear status — 2×2 grid */}
        <View style={styles.panel}>
          <SectionHeader icon="construct-outline" title="Gear status" colors={colors} />
          <View style={styles.gearGrid}>
            {p.gear.map((g, i) => {
              const isActive = g.status === 'active' || g.status === 'checked';
              const gColor = isActive ? colors.available : colors.enRoute;
              const detail = g.psi || g.channel || g.note;
              return (
                <View key={i} style={[styles.gearTile, { borderTopColor: gColor }]}>
                  <View style={styles.tileTitleRow}>
                    <Ionicons
                      name={isActive ? 'checkmark-circle-outline' : 'time-outline'}
                      size={15} color={gColor}
                    />
                    <View style={[styles.tilePill, { backgroundColor: gColor + '18', borderColor: gColor + '50' }]}>
                      <Text style={[styles.tilePillText, { color: gColor }]}>
                        {g.status.charAt(0).toUpperCase() + g.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.tileName}>{g.item}</Text>
                  <Text style={styles.tileDetail}>{detail}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Certifications — horizontal carousel */}
        <View style={styles.panel}>
          <SectionHeader icon="certificate-outline" iconLib="MaterialCommunityIcons" title="Certifications" colors={colors} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.certCarousel}
          >
            {p.certifications.map((cert, i) => {
              const cColor = cert.active ? colors.available : colors.onScene;
              return (
                <View key={i} style={[styles.certCard, { borderTopColor: cColor }]}>
                  <View style={[styles.certBadge, { backgroundColor: cColor + '18', borderColor: cColor + '50' }]}>
                    <Text style={[styles.certBadgeText, { color: cColor }]}>
                      {cert.active ? 'Active' : 'Expired'}
                    </Text>
                  </View>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certExpiry}>
                    {cert.active ? 'Expires' : 'Expired'} {cert.expires}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 14, paddingBottom: 20, gap: 10 },

    panel: {
      backgroundColor: c.surface1, borderRadius: 13,
      borderWidth: 0.5, borderColor: c.border, overflow: 'hidden',
    },
    heroShadowWrap: {
      borderRadius: 13,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 18,
      elevation: 8,
    },
    heroCard: {},
    heroWatermark: {
      position: 'absolute',
      right: -16,
      bottom: -36,
      fontSize: 190,
      fontWeight: '700',
      color: c.text1,
      opacity: 0.04,
      lineHeight: 190,
    },

    // Hero — identity
    identityContent: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, padding: 18 },
    avatar: {
      width: 72, height: 72, borderRadius: 36, borderWidth: 2,
      backgroundColor: c.surface2, alignItems: 'center', justifyContent: 'center',
      position: 'relative', flexShrink: 0,
    },
    avatarText: { fontSize: 30, fontWeight: '500' },
    statusRing: {
      position: 'absolute', bottom: 0, right: 0,
      width: 20, height: 20, borderRadius: 10,
      borderWidth: 3, alignItems: 'center', justifyContent: 'center',
    },
    statusRingDot: { width: 11, height: 11, borderRadius: 5.5 },
    identityInfo: { flex: 1, paddingTop: 3 },
    idName: { fontSize: 21, fontWeight: '500', color: c.text1, marginBottom: 3 },
    idRank: { fontSize: 13, color: c.text2, marginBottom: 2 },
    idRole: { fontSize: 11, color: c.text3, marginBottom: 10 },
    statusChip: {
      flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
      paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, borderWidth: 0.5,
    },
    chipDot: { width: 5, height: 5, borderRadius: 2.5 },
    chipLabel: { fontSize: 11, fontWeight: '500' },

    // Hero — shift clock
    heroDivider: { height: 0.5, backgroundColor: c.border, marginHorizontal: 18 },
    shiftClockRow: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 18, paddingTop: 14, paddingBottom: 14, gap: 16,
    },
    clockTime: {
      fontSize: 38, fontWeight: '300', color: c.text1,
      fontVariant: ['tabular-nums'], letterSpacing: -1,
    },
    shiftMetaCol: { flex: 1, gap: 2 },
    shiftMetaLabel: { fontSize: 9, fontWeight: '500', color: c.text3, letterSpacing: 1.2 },
    shiftMetaValue: { fontSize: 15, fontWeight: '500', color: c.text1 },
    shiftMetaSub: { fontSize: 11, color: c.text3 },
    clockTrack: { height: 3, backgroundColor: c.surface3 },
    clockFill: { height: 3 },

    // ICS
    icsContent: { padding: 14 },
    icsRow: { paddingVertical: 8 },
    icsLabel: { fontSize: 10, color: c.text3, letterSpacing: 0.4, marginBottom: 4 },
    icsValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    icsValue: { fontSize: 13, fontWeight: '500', color: c.text1 },
    icsSeparator: { fontSize: 13, color: c.text4 },
    icsDivider: { height: 0.5, backgroundColor: c.border },

    // Gear grid
    gearGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 12 },
    gearTile: {
      width: '47%', backgroundColor: c.surface2,
      borderRadius: 10, borderWidth: 0.5, borderColor: c.border,
      borderTopWidth: 1.5, padding: 12, gap: 6,
    },
    tileTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    tilePill: { paddingVertical: 2, paddingHorizontal: 7, borderRadius: 999, borderWidth: 0.5 },
    tilePillText: { fontSize: 9, fontWeight: '500' },
    tileName: { fontSize: 14, fontWeight: '500', color: c.text1 },
    tileDetail: { fontSize: 11, color: c.text3 },

    // Certifications carousel
    certCarousel: { paddingHorizontal: 12, paddingVertical: 12, gap: 10 },
    certCard: {
      width: 160, backgroundColor: c.surface2,
      borderRadius: 10, borderWidth: 0.5, borderColor: c.border,
      borderTopWidth: 1.5, padding: 14, gap: 8,
    },
    certBadge: { alignSelf: 'flex-start', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 999, borderWidth: 0.5 },
    certBadgeText: { fontSize: 10, fontWeight: '500' },
    certName: { fontSize: 13, fontWeight: '500', color: c.text1, lineHeight: 18 },
    certExpiry: { fontSize: 11, color: c.text3 },
  });
}
