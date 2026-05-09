import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { buildStatusStyles, useTheme } from '../../constants/theme';

const RADIUS_OPTIONS = [0, 50, 100, 200, 500];

export default function FilterPanel({ visible, onClose, filters, setFilters, divisions = [] }) {
  const { colors } = useTheme();
  const StatusStyles = buildStatusStyles(colors);

  const chipInactive = { backgroundColor: colors.surface2, borderColor: colors.border };
  const chipActive   = { backgroundColor: colors.surface3, borderColor: colors.text1 + '45' };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable
        style={[styles.overlay, { backgroundColor: 'rgba(3,7,18,0.8)' }]}
        onPress={onClose}
      >
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface1, borderTopColor: colors.border }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.glowLine, { backgroundColor: colors.border }]} />
          <View style={[styles.handle, { backgroundColor: colors.text3 }]} />

          <Text style={[styles.title, { color: colors.text1 }]}>FILTER TEAMMATES</Text>
          <Text style={[styles.subtitle, { color: colors.text3 }]}>
            Narrow down who appears on the map
          </Text>

          {/* Division */}
          <Text style={[styles.sectionTitle, { color: colors.text2 }]}>DIVISION</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {divisions.map((div) => {
              const active = filters.division === div;
              return (
                <TouchableOpacity
                  key={div}
                  onPress={() => setFilters({ ...filters, division: div })}
                  style={[styles.chip, active ? chipActive : chipInactive]}
                >
                  <Text style={[styles.chipText, { color: active ? colors.text1 : colors.text3 }]}>
                    {div.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Status */}
          <Text style={[styles.sectionTitle, { color: colors.text2 }]}>STATUS</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {['All', ...Object.keys(StatusStyles)].map((key) => {
              const active = filters.status === key;
              const s = StatusStyles[key];
              const isAll = key === 'All';
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setFilters({ ...filters, status: key })}
                  style={[
                    styles.chip,
                    active
                      ? isAll
                        ? chipActive
                        : { backgroundColor: s.color + '15', borderColor: s.color + '50' }
                      : chipInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: active ? (isAll ? colors.text1 : s.color) : colors.text3 },
                    ]}
                  >
                    {key.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Radius */}
          <Text style={[styles.sectionTitle, { color: colors.text2 }]}>NEARBY RADIUS</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {RADIUS_OPTIONS.map((r) => {
              const active = filters.radius === r;
              const label = r === 0 ? 'ALL' : `${r}m`;
              return (
                <TouchableOpacity
                  key={r}
                  onPress={() => setFilters({ ...filters, radius: r })}
                  style={[styles.chip, active ? chipActive : chipInactive]}
                >
                  <Text style={[styles.chipText, { color: active ? colors.text1 : colors.text3 }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Overlays */}
          <Text style={[styles.sectionTitle, { color: colors.text2 }]}>OVERLAYS</Text>
          <TouchableOpacity
            onPress={() => setFilters({ ...filters, hazards: !filters.hazards })}
            style={[
              styles.toggleRow,
              {
                backgroundColor: colors.surface2,
                borderColor: filters.hazards ? colors.urgent + '50' : colors.border,
              },
            ]}
          >
            <Ionicons
              name={filters.hazards ? 'checkbox' : 'square-outline'}
              size={18}
              color={filters.hazards ? colors.urgent : colors.text3}
            />
            <Text style={[styles.toggleLabel, { color: filters.hazards ? colors.urgent : colors.text3 }]}>
              HAZARD ZONES
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: colors.surface3, borderColor: colors.border }]}
            onPress={onClose}
          >
            <Text style={[styles.applyText, { color: colors.text1 }]}>APPLY FILTERS</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  glowLine: { height: 1, marginBottom: 4 },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 2.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 2,
    marginTop: 14,
    marginBottom: 8,
  },
  chipRow: { gap: 6, paddingRight: 16 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 2, borderWidth: 1 },
  chipText: { fontSize: 10, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 1 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
  },
  toggleLabel: { fontSize: 10, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 1.5 },
  applyButton: { marginTop: 20, borderWidth: 1, borderRadius: 4, paddingVertical: 14, alignItems: 'center' },
  applyText: { fontSize: 12, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 2 },
});
