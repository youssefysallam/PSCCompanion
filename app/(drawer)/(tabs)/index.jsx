import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import IncidentCard from '../../../components/dashboard/IncidentCard';
import HamburgerButton from '../../../components/header/HamburgerButton';
import { Colors, STATUS_SORT_ORDER, StatusStyles } from '../../../constants/colors';
import { INCIDENTS, TEAM } from '../../../constants/mockData';

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

function TeamChip({ member }) {
  const ms = StatusStyles[member.status] || StatusStyles.offline;
  const isOffline = member.status === 'offline';
  const initial = member.name.split(' ').pop()[0];

  return (
    <View style={[styles.chip, isOffline && styles.chipOffline]}>
      <View style={styles.chipAvatarWrap}>
        <View style={[styles.chipAvatar, { borderColor: isOffline ? Colors.border : ms.color }]}>
          <Text style={[styles.chipInitial, { color: isOffline ? Colors.border : ms.color }]}>
            {initial}
          </Text>
        </View>
        <View style={[styles.chipDot, { backgroundColor: ms.color }]} />
      </View>
      <Text style={styles.chipName} numberOfLines={1}>{member.name.split(' ')[0]}</Text>
      <Text style={styles.chipRole} numberOfLines={1}>{member.role}</Text>
    </View>
  );
}

function IncidentDetailOverlay({ incident, onClose }) {
  if (!incident) return null;

  const isHigh = incident.priority === 'high';
  const color = isHigh ? Colors.onScene : Colors.enRoute;

  return (
    <Modal visible={true} transparent animationType="fade">
      <Pressable style={detailStyles.overlay} onPress={onClose}>
        <Pressable style={detailStyles.card} onPress={(e) => e.stopPropagation()}>
          <Pressable style={detailStyles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={18} color={Colors.text3} />
          </Pressable>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={detailStyles.scrollContent}
          >
            <View style={detailStyles.headerRow}>
              <View style={detailStyles.headerInfo}>
                <Text style={[detailStyles.priorityLabel, { color }]}>
                  {isHigh ? 'Urgent' : 'Active'}
                </Text>
                <Text style={detailStyles.type}>{incident.type}</Text>
                <Text style={detailStyles.id}>{incident.id}</Text>
              </View>
            </View>

            <View style={detailStyles.statsRow}>
              <View style={detailStyles.stat}>
                <Text style={detailStyles.statLabel}>Time</Text>
                <Text style={[detailStyles.statValue, { color }]}>{incident.time}</Text>
              </View>
              <View style={detailStyles.statDivider} />
              <View style={detailStyles.stat}>
                <Text style={detailStyles.statLabel}>Units</Text>
                <Text style={[detailStyles.statValue, { color }]}>{incident.units}</Text>
              </View>
              <View style={detailStyles.statDivider} />
              <View style={detailStyles.stat}>
                <Text style={detailStyles.statLabel}>Dist</Text>
                <Text style={[detailStyles.statValue, { color }]}>{incident.distance}</Text>
              </View>
            </View>

            <View style={detailStyles.section}>
              <Text style={detailStyles.sectionTitle}>Location</Text>
              <Text style={detailStyles.sectionBody}>{incident.address}</Text>
            </View>

            {incident.hazards && incident.hazards.length > 0 && (
              <View style={detailStyles.section}>
                <Text style={[detailStyles.sectionTitle, { color: Colors.onScene }]}>Hazard warnings</Text>
                {incident.hazards.map((h, i) => (
                  <View key={i} style={detailStyles.hazardRow}>
                    <View style={[detailStyles.hazardDot, { backgroundColor: Colors.onScene }]} />
                    <Text style={[detailStyles.hazardText, { color: Colors.onScene }]}>{h}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={detailStyles.section}>
              <Text style={detailStyles.sectionTitle}>Assigned team</Text>
              <View style={detailStyles.tagRow}>
                {incident.assignedTeam?.map((name, i) => (
                  <View key={i} style={detailStyles.tag}>
                    <Text style={detailStyles.tagText}>{name}</Text>
                  </View>
                ))}
              </View>
            </View>

            {incident.resourcesRequested && (
              <View style={detailStyles.section}>
                <Text style={[detailStyles.sectionTitle, { color: Colors.enRoute }]}>Resources requested</Text>
                {incident.resourcesRequested.map((r, i) => (
                  <View key={i} style={detailStyles.resourceRow}>
                    <Text style={[detailStyles.resourceBullet, { color: Colors.enRoute }]}>→</Text>
                    <Text style={detailStyles.resourceText}>{r}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={detailStyles.section}>
              <Text style={detailStyles.sectionTitle}>911 call transcript</Text>
              <View style={detailStyles.transcriptBox}>
                <Text style={detailStyles.transcriptText}>"{incident.callTranscript}"</Text>
              </View>
            </View>

            <View style={detailStyles.section}>
              <Text style={detailStyles.sectionTitle}>Incident timeline</Text>
              {incident.timeline?.map((entry, i) => (
                <View key={i} style={detailStyles.timelineRow}>
                  <View style={detailStyles.timelineLeft}>
                    <Text style={[detailStyles.timelineTime, { color }]}>{entry.time}</Text>
                    {i < incident.timeline.length - 1 && (
                      <View style={[detailStyles.timelineLine, { backgroundColor: color + '30' }]} />
                    )}
                  </View>
                  <View style={[detailStyles.timelineDot, { backgroundColor: color }]} />
                  <Text style={detailStyles.timelineEvent}>{entry.event}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const detailStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: Colors.surface1,
    borderRadius: 13,
    borderWidth: 0.5,
    borderColor: Colors.border,
    width: '100%',
    maxHeight: '85%',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: Colors.surface2,
    borderWidth: 0.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  headerRow: {
    paddingRight: 36,
  },
  headerInfo: { gap: 2 },
  priorityLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  type: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.text1,
  },
  id: {
    fontSize: 11,
    color: Colors.text3,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface2,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.border,
    paddingVertical: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.text3,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  statDivider: {
    width: 0.5,
    alignSelf: 'stretch',
    backgroundColor: Colors.border,
  },
  section: { gap: 8 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.text3,
    letterSpacing: 0.4,
  },
  sectionBody: {
    fontSize: 13,
    color: Colors.text1,
    lineHeight: 18,
  },
  hazardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hazardDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  hazardText: {
    fontSize: 12,
    lineHeight: 18,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface2,
  },
  tagText: {
    fontSize: 11,
    color: Colors.text2,
    fontWeight: '500',
  },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resourceBullet: { fontSize: 12 },
  resourceText: {
    fontSize: 12,
    color: Colors.text2,
    lineHeight: 18,
  },
  transcriptBox: {
    backgroundColor: Colors.surface2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    borderLeftColor: Colors.text4,
    padding: 12,
  },
  transcriptText: {
    fontSize: 12,
    color: Colors.text2,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    minHeight: 36,
  },
  timelineLeft: {
    width: 42,
    alignItems: 'center',
  },
  timelineTime: {
    fontSize: 10,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  timelineLine: {
    width: 1,
    flex: 1,
    marginTop: 4,
    minHeight: 16,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 2,
  },
  timelineEvent: {
    flex: 1,
    fontSize: 11,
    color: Colors.text2,
    lineHeight: 16,
  },
});

export default function DashboardScreen() {
  const [selectedIncident, setSelectedIncident] = useState(null);

  const sortedTeam = [...TEAM].sort(
    (a, b) => STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status]
  );

  const statusCounts = {};
  TEAM.forEach((m) => {
    statusCounts[m.status] = (statusCounts[m.status] || 0) + 1;
  });

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <HamburgerButton />
        <Text style={styles.headerTitle}>PSC Companion</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Active incidents" count={INCIDENTS.length} />
        <View style={styles.incidentList}>
          {INCIDENTS.map((inc) => (
            <IncidentCard
              key={inc.id}
              incident={inc}
              onPress={(incident) => setSelectedIncident(incident)}
            />
          ))}
        </View>

        <SectionHeader title="Team status" count={TEAM.length} />

        {/* Readiness grid */}
        <View style={styles.readinessPanel}>
          {Object.entries(StatusStyles).map(([key, val], idx, arr) => {
            const count = statusCounts[key] || 0;
            const isLast = idx === arr.length - 1;
            return (
              <View
                key={key}
                style={[styles.readinessItem, !isLast && styles.readinessBorder]}
              >
                <View style={[styles.readinessDot, { backgroundColor: val.color }]} />
                <Text style={[styles.readinessNum, { color: val.color }]}>{count}</Text>
                <Text style={styles.readinessLabel}>{val.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Team chips horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.teamScroll}
          contentContainerStyle={styles.teamScrollContent}
        >
          {sortedTeam.map((member) => (
            <TeamChip key={member.id} member={member} />
          ))}
        </ScrollView>
      </ScrollView>

      {selectedIncident && (
        <IncidentDetailOverlay
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
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
    gap: 0,
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
  incidentList: {
    gap: 8,
  },

  readinessPanel: {
    flexDirection: 'row',
    backgroundColor: Colors.surface1,
    borderRadius: 13,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 8,
  },
  readinessItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  readinessBorder: {
    borderRightWidth: 0.5,
    borderRightColor: Colors.border,
  },
  readinessDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  readinessNum: {
    fontSize: 16,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  readinessLabel: {
    fontSize: 9,
    color: Colors.text3,
  },

  teamScroll: {
    marginHorizontal: -14,
  },
  teamScrollContent: {
    paddingHorizontal: 14,
    gap: 10,
    paddingVertical: 4,
  },

  chip: {
    width: 64,
    alignItems: 'center',
  },
  chipOffline: {
    opacity: 0.55,
  },
  chipAvatarWrap: {
    position: 'relative',
    marginBottom: 6,
  },
  chipAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.surface1,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipInitial: {
    fontSize: 20,
    fontWeight: '500',
  },
  chipDot: {
    position: 'absolute',
    bottom: 0,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: Colors.bg,
  },
  chipName: {
    fontSize: 11,
    color: Colors.text1,
    textAlign: 'center',
  },
  chipRole: {
    fontSize: 9,
    color: Colors.text3,
    textAlign: 'center',
  },
});
