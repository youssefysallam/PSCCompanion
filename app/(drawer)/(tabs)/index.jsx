import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IncidentCard from '../../../components/dashboard/IncidentCard';
import HamburgerButton from '../../../components/header/HamburgerButton';
import { buildStatusStyles, useTheme } from '../../../constants/theme';
import { STATUS_SORT_ORDER } from '../../../constants/colors';
import { INCIDENTS, TEAM } from '../../../constants/mockData';

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

function TeamChip({ member, colors, StatusStyles }) {
  const ms = StatusStyles[member.status] || StatusStyles.offline;
  const isOffline = member.status === 'offline';
  const initial = member.name.split(' ').pop()[0];

  return (
    <View style={[{ width: 64, alignItems: 'center' }, isOffline && { opacity: 0.55 }]}>
      <View style={{ position: 'relative', marginBottom: 6 }}>
        <View style={{
          width: 54, height: 54, borderRadius: 27,
          backgroundColor: colors.surface1, borderWidth: 1.5,
          borderColor: isOffline ? colors.border : ms.color,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 20, fontWeight: '500', color: isOffline ? colors.border : ms.color }}>
            {initial}
          </Text>
        </View>
        <View style={{
          position: 'absolute', bottom: 0, right: 1,
          width: 12, height: 12, borderRadius: 6,
          borderWidth: 2.5, borderColor: colors.bg,
          backgroundColor: ms.color,
        }} />
      </View>
      <Text style={{ fontSize: 11, color: colors.text1, textAlign: 'center' }} numberOfLines={1}>
        {member.name.split(' ')[0]}
      </Text>
      <Text style={{ fontSize: 9, color: colors.text3, textAlign: 'center' }} numberOfLines={1}>
        {member.role}
      </Text>
    </View>
  );
}

function IncidentDetailOverlay({ incident, onClose, colors }) {
  if (!incident) return null;
  const isHigh = incident.priority === 'high';
  const color = isHigh ? colors.onScene : colors.enRoute;

  return (
    <Modal visible transparent animationType="fade">
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 16 }} onPress={onClose}>
        <View
          style={{
            backgroundColor: colors.surface1, borderRadius: 13,
            borderWidth: 0.5, borderColor: colors.border,
            width: '100%', maxHeight: '85%', overflow: 'hidden',
          }}
          onStartShouldSetResponder={() => true}
        >
          <Pressable style={{
            position: 'absolute', top: 12, right: 12,
            width: 30, height: 30, borderRadius: 8,
            backgroundColor: colors.surface2, borderWidth: 0.5, borderColor: colors.border,
            alignItems: 'center', justifyContent: 'center', zIndex: 10,
          }} onPress={onClose}>
            <Ionicons name="close" size={18} color={colors.text3} />
          </Pressable>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16 }}>
            <View style={{ paddingRight: 36 }}>
              <Text style={{ fontSize: 11, fontWeight: '500', color }}>{isHigh ? 'Urgent' : 'Active'}</Text>
              <Text style={{ fontSize: 20, fontWeight: '500', color: colors.text1 }}>{incident.type}</Text>
              <Text style={{ fontSize: 11, color: colors.text3 }}>{incident.id}</Text>
            </View>

            <View style={{ flexDirection: 'row', backgroundColor: colors.surface2, borderRadius: 10, borderWidth: 0.5, borderColor: colors.border, paddingVertical: 12 }}>
              {[['Time', incident.time], ['Units', incident.units], ['Dist', incident.distance]].map(([label, val], i, arr) => (
                <React.Fragment key={label}>
                  <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                    <Text style={{ fontSize: 10, color: colors.text3 }}>{label}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '500', color, fontVariant: ['tabular-nums'] }}>{val}</Text>
                  </View>
                  {i < arr.length - 1 && <View style={{ width: 0.5, alignSelf: 'stretch', backgroundColor: colors.border }} />}
                </React.Fragment>
              ))}
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 10, fontWeight: '500', color: colors.text3, letterSpacing: 0.4 }}>Location</Text>
              <Text style={{ fontSize: 13, color: colors.text1, lineHeight: 18 }}>{incident.address}</Text>
            </View>

            {incident.hazards && incident.hazards.length > 0 && (
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 10, fontWeight: '500', color: colors.onScene, letterSpacing: 0.4 }}>Hazard warnings</Text>
                {incident.hazards.map((h, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.onScene }} />
                    <Text style={{ fontSize: 12, color: colors.onScene, lineHeight: 18 }}>{h}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 10, fontWeight: '500', color: colors.text3, letterSpacing: 0.4 }}>Assigned team</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {incident.assignedTeam?.map((name, i) => (
                  <View key={i} style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, borderWidth: 0.5, borderColor: colors.border, backgroundColor: colors.surface2 }}>
                    <Text style={{ fontSize: 11, color: colors.text2, fontWeight: '500' }}>{name}</Text>
                  </View>
                ))}
              </View>
            </View>

            {incident.resourcesRequested && (
              <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 10, fontWeight: '500', color: colors.enRoute, letterSpacing: 0.4 }}>Resources requested</Text>
                {incident.resourcesRequested.map((r, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: colors.enRoute, fontSize: 12 }}>→</Text>
                    <Text style={{ fontSize: 12, color: colors.text2, lineHeight: 18 }}>{r}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 10, fontWeight: '500', color: colors.text3, letterSpacing: 0.4 }}>911 call transcript</Text>
              <View style={{ backgroundColor: colors.surface2, borderRadius: 8, borderWidth: 0.5, borderColor: colors.border, borderLeftWidth: 3, borderLeftColor: colors.text4, padding: 12 }}>
                <Text style={{ fontSize: 12, color: colors.text2, fontStyle: 'italic', lineHeight: 18 }}>"{incident.callTranscript}"</Text>
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 10, fontWeight: '500', color: colors.text3, letterSpacing: 0.4 }}>Incident timeline</Text>
              {incident.timeline?.map((entry, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, minHeight: 36 }}>
                  <View style={{ width: 42, alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, fontWeight: '500', color, fontVariant: ['tabular-nums'] }}>{entry.time}</Text>
                    {i < incident.timeline.length - 1 && (
                      <View style={{ width: 1, flex: 1, marginTop: 4, minHeight: 16, backgroundColor: color + '30' }} />
                    )}
                  </View>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, marginTop: 2 }} />
                  <Text style={{ flex: 1, fontSize: 11, color: colors.text2, lineHeight: 16 }}>{entry.event}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

export default function DashboardScreen() {
  const { colors } = useTheme();
  const StatusStyles = useMemo(() => buildStatusStyles(colors), [colors]);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [selectedIncident, setSelectedIncident] = useState(null);

  const sortedTeam = [...TEAM].sort((a, b) => STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status]);
  const statusCounts = {};
  TEAM.forEach((m) => { statusCounts[m.status] = (statusCounts[m.status] || 0) + 1; });

  const totalUnits = INCIDENTS.reduce((sum, i) => sum + (i.units || 0), 0);
  const availableCount = statusCounts['safe'] || 0;
  const hasHighPriority = INCIDENTS.some(i => i.priority === 'high');
  const situationColor = hasHighPriority ? colors.urgent : INCIDENTS.length > 0 ? colors.enRoute : colors.accent;

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
        {/* Situation panel — asymmetric: hero count left, supporting stats right */}
        <View style={styles.situationShadowWrap}>
          <View style={[styles.situationPanel, { borderTopColor: situationColor }]}>
            <View style={styles.situationLeft}>
              <Text style={[styles.situationHero, { color: hasHighPriority ? colors.urgent : colors.text1 }]}>
                {String(INCIDENTS.length).padStart(2, '0')}
              </Text>
              <Text style={styles.situationHeroLabel}>ACTIVE INCIDENTS</Text>
            </View>
            <View style={styles.situationDivider} />
            <View style={styles.situationRight}>
              <View style={styles.situationStat}>
                <Text style={[styles.situationStatNum, { color: colors.enRoute }]}>{totalUnits}</Text>
                <Text style={styles.situationStatLabel}>DEPLOYED</Text>
              </View>
              <View style={styles.situationStatDivider} />
              <View style={styles.situationStat}>
                <Text style={[styles.situationStatNum, { color: colors.available }]}>{availableCount}</Text>
                <Text style={styles.situationStatLabel}>AVAILABLE</Text>
              </View>
            </View>
          </View>
        </View>

        <SectionHeader title="Active incidents" count={INCIDENTS.length} styles={styles} />
        <View style={styles.incidentList}>
          {INCIDENTS.map((inc) => (
            <IncidentCard key={inc.id} incident={inc} expanded onPress={setSelectedIncident} />
          ))}
        </View>

        <SectionHeader title="Team status" count={TEAM.length} styles={styles} />
        <View style={styles.readinessPanel}>
          {Object.entries(StatusStyles).map(([key, val], idx, arr) => {
            const count = statusCounts[key] || 0;
            const isLast = idx === arr.length - 1;
            return (
              <View key={key} style={[styles.readinessItem, !isLast && styles.readinessBorder]}>
                <View style={[styles.readinessDot, { backgroundColor: val.color }]} />
                <Text style={[styles.readinessNum, { color: val.color }]}>{count}</Text>
                <Text style={styles.readinessLabel}>{val.label}</Text>
              </View>
            );
          })}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          style={styles.teamScroll} contentContainerStyle={styles.teamScrollContent}>
          {sortedTeam.map((member) => (
            <TeamChip key={member.id} member={member} colors={colors} StatusStyles={StatusStyles} />
          ))}
        </ScrollView>
      </ScrollView>

      {selectedIncident && (
        <IncidentDetailOverlay
          incident={selectedIncident}
          colors={colors}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </SafeAreaView>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: 14, paddingBottom: 20,
    },
    sectionHeader: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingTop: 14, paddingHorizontal: 4, paddingBottom: 8,
    },
    sectionTitle: { fontSize: 20, fontWeight: '500', color: c.text1 },
    countPill: { backgroundColor: c.surface3, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999 },
    countText: { fontSize: 11, fontWeight: '500', color: c.text2 },
    situationShadowWrap: {
      borderRadius: 13,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 18,
      elevation: 8,
      marginBottom: 4,
    },
    situationPanel: {
      flexDirection: 'row', backgroundColor: c.surface1,
      borderRadius: 13, borderWidth: 0.5, borderColor: c.border,
      borderTopWidth: 2, overflow: 'hidden',
    },
    situationWatermark: {
      position: 'absolute',
      right: -8,
      bottom: -22,
      fontSize: 130,
      fontWeight: '700',
      opacity: 0.05,
      lineHeight: 130,
      fontVariant: ['tabular-nums'],
    },
    situationLeft: {
      flex: 1.1, justifyContent: 'center',
      paddingVertical: 20, paddingHorizontal: 18,
    },
    situationHero: {
      fontSize: 48, fontWeight: '500',
      fontVariant: ['tabular-nums'], letterSpacing: -1, lineHeight: 52,
    },
    situationHeroLabel: { fontSize: 9, fontWeight: '500', color: c.text3, letterSpacing: 1.2, marginTop: 4 },
    situationDivider: { width: 0.5, alignSelf: 'stretch', backgroundColor: c.border },
    situationRight: { flex: 1 },
    situationStat: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
    situationStatNum: { fontSize: 22, fontWeight: '500', fontVariant: ['tabular-nums'] },
    situationStatLabel: { fontSize: 9, fontWeight: '500', color: c.text3, letterSpacing: 1.2, marginTop: 3 },
    situationStatDivider: { height: 0.5, backgroundColor: c.border, marginHorizontal: 16 },
    incidentList: { gap: 8 },
    readinessPanel: {
      flexDirection: 'row', backgroundColor: c.surface1,
      borderRadius: 13, borderWidth: 0.5, borderColor: c.border,
      overflow: 'hidden', marginBottom: 8,
    },
    readinessItem: { flex: 1, alignItems: 'center', paddingVertical: 12, gap: 4 },
    readinessBorder: { borderRightWidth: 0.5, borderRightColor: c.border },
    readinessDot: { width: 6, height: 6, borderRadius: 3 },
    readinessNum: { fontSize: 16, fontWeight: '500', fontVariant: ['tabular-nums'] },
    readinessLabel: { fontSize: 9, color: c.text3 },
    teamScroll: { marginHorizontal: -14 },
    teamScrollContent: { paddingHorizontal: 14, gap: 10, paddingVertical: 4 },
  });
}
