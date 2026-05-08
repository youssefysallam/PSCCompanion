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
import { Colors, StatusStyles } from '../../constants/colors';

const RADIUS_OPTIONS = [0, 50, 100, 200, 500];

export default function FilterPanel({ visible, onClose, filters, setFilters, divisions = [] }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.glowLine} />
          <View style={styles.handle} />

          <Text style={styles.title}>FILTER TEAMMATES</Text>
          <Text style={styles.subtitle}>Narrow down who appears on the map</Text>

          {/* Division */}
          <Text style={styles.sectionTitle}>DIVISION</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {divisions.map((div) => {
              const active = filters.division === div;
              return (
                <TouchableOpacity
                  key={div}
                  onPress={() => setFilters({ ...filters, division: div })}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {div.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Status */}
          <Text style={styles.sectionTitle}>STATUS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {['All', ...Object.keys(StatusStyles)].map((key) => {
              const active = filters.status === key;
              const s = key === 'All' ? { color: Colors.cyan } : StatusStyles[key];
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setFilters({ ...filters, status: key })}
                  style={[
                    styles.chip,
                    active && { backgroundColor: s.bg || Colors.cyanFaint, borderColor: s.color + '50' },
                  ]}
                >
                  <Text style={[styles.chipText, active && { color: s.color }]}>
                    {key.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Radius */}
          <Text style={styles.sectionTitle}>NEARBY RADIUS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {RADIUS_OPTIONS.map((r) => {
              const active = filters.radius === r;
              const label = r === 0 ? 'ALL' : `${r}m`;
              return (
                <TouchableOpacity
                  key={r}
                  onPress={() => setFilters({ ...filters, radius: r })}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Overlays */}
          <Text style={styles.sectionTitle}>OVERLAYS</Text>
          <TouchableOpacity
            onPress={() => setFilters({ ...filters, hazards: !filters.hazards })}
            style={[styles.toggleRow, filters.hazards && { borderColor: Colors.danger + '50' }]}
          >
            <Ionicons
              name={filters.hazards ? 'checkbox' : 'square-outline'}
              size={18}
              color={filters.hazards ? Colors.danger : Colors.textTertiary}
            />
            <Text style={[styles.toggleLabel, filters.hazards && { color: Colors.danger }]}>
              HAZARD ZONES
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.applyButton} onPress={onClose}>
            <Text style={styles.applyText}>APPLY FILTERS</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3,7,18,0.8)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.cyanBorder,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  glowLine: {
    height: 1,
    backgroundColor: Colors.cyan + '40',
    marginBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textTertiary,
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 2.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textSecondary,
    letterSpacing: 2,
    marginTop: 14,
    marginBottom: 8,
  },
  chipRow: { gap: 6, paddingRight: 16 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.panel,
  },
  chipActive: {
    backgroundColor: Colors.cyanFaint,
    borderColor: Colors.cyan + '50',
  },
  chipText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  chipTextActive: {
    color: Colors.cyan,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.panel,
  },
  toggleLabel: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.textTertiary,
    letterSpacing: 1.5,
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: Colors.cyanFaint,
    borderWidth: 1,
    borderColor: Colors.cyanBorder,
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
    color: Colors.cyan,
    letterSpacing: 2,
  },
});