import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

import HamburgerButton from '../../../../components/header/HamburgerButton';
import { useTheme } from '../../../../constants/theme';
import { HAZARD_ZONES, TEAM, USER_PROFILE } from '../../../../constants/mockData';

import AutoManDownWarning from '../../../../components/map/AutoManDownWarning';
import FilterPanel from '../../../../components/map/FilterPanel';
import ICSBanner from '../../../../components/map/ICSBanner';
import ManDownOverlay from '../../../../components/map/ManDownOverlay';
import {
  DARK_MAP_STYLE,
  HAZARD_COLORS,
  INITIAL_REGION,
  getDistanceMeters,
  getDivisions,
} from '../../../../components/map/mapHelpers';
import MapLegend from '../../../../components/map/MapLegend';
import TeamMarker from '../../../../components/map/TeamMarker';
import { useAutoManDown } from '../../../../components/map/useAutoManDown';
import { useManDown } from '../../../../components/map/useManDown';
import { useProximityResolver } from '../../../../components/map/useProximityResolver';
import { useSimulatedLocation } from '../../../../components/map/useSimulatedLocation';
import { useBatteryResolver } from '../../../../hooks/useBatteryResolver';




export default function MapScreen() {
  const mapRef = useRef(null);

  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    division: 'All',
    status: 'All',
    radius: 0,
    hazards: true,
  });

  const [selectedMemberId, setSelectedMemberId] = useState(null);

  //simulation toggle - off by default
  const [simRunning, setSimRunning] = useState(false);

  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { manDownActive, manDownResponders, handleManDown, clearManDown } = useManDown();
  //simulated location - returns real coords when sim is off 
  const userCoords = useSimulatedLocation(simRunning);

  useProximityResolver(userCoords);
  useBatteryResolver();
  
  // Auto man-down detection
  const { warningActive, countdown, dismiss } = useAutoManDown({
    coords: userCoords,
    incidentId: USER_PROFILE.incidentId,
    simRunning,
    onTrigger: handleManDown,
  });

  const currentIncidentId = USER_PROFILE.incidentId;
  const divisions = useMemo(
    () => (currentIncidentId ? getDivisions(TEAM, currentIncidentId) : ['All']),
    [currentIncidentId]
  );

  const filteredTeam = useMemo(() => {
    return TEAM.filter((m) => {
      if (filters.division !== 'All' && m.division !== filters.division) return false;
      if (filters.status !== 'All' && m.status !== filters.status) return false;
      if (filters.radius > 0) {
        const dist = getDistanceMeters(userCoords, m.coords);
        if (dist > filters.radius) return false;
      }
      return true;
    });
  }, [filters]);

  const hazards = filters.hazards
    ? HAZARD_ZONES.filter((h) => h.incidentId === currentIncidentId)
    : [];

  const activeFilterCount = [
    filters.division !== 'All',
    filters.status !== 'All',
    filters.radius > 0,
  ].filter(Boolean).length;

  // Simulated user profile with live coords
  const liveUserProfile = { ...USER_PROFILE, coords: userCoords };
  
  return (
    <View style={styles.screen}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        customMapStyle={DARK_MAP_STYLE}
        showsUserLocation={false}
        showsCompass={false}
        showsMyLocationButton={false}
        onPress={() => setSelectedMemberId(null)}
      >
        {hazards.map((hz) => {
          const hc = HAZARD_COLORS[hz.type] || HAZARD_COLORS.caution;
          return (
            <Circle
              key={hz.id}
              center={hz.center}
              radius={hz.radius}
              fillColor={hc.fill}
              strokeColor={hc.stroke}
              strokeWidth={1.5}
            />
          );
        })}

        <Marker coordinate={userCoords} anchor={{ x: 0.5, y: 1.0 }}>
          <TeamMarker
            member={USER_PROFILE}
            isUser
            selected={selectedMemberId === USER_PROFILE.id}
            onPress={() => setSelectedMemberId(prev => prev === USER_PROFILE.id ? null : USER_PROFILE.id)}
          />
        </Marker>

        {filteredTeam.map((m) => (
          <Marker key={m.id} coordinate={m.coords} anchor={{ x: 0.5, y: 1.0 }}>
            <TeamMarker
              member={m}
              selected={selectedMemberId === m.id}
              onPress={() => setSelectedMemberId(prev => prev === m.id ? null : m.id)}
            />
          </Marker>
        ))}
      </MapView>

      <View style={{ position: 'absolute', top: 110, left: 12, zIndex: 10 }}>
        <HamburgerButton />
      </View>

      <ICSBanner profile={USER_PROFILE} />

      <MapLegend visibleCount={filteredTeam.length} totalCount={TEAM.length} />

      {/* Simulation toggle button */}
      <TouchableOpacity
        style={[styles.simButton, simRunning && styles.simButtonActive]}
        onPress={() => setSimRunning((v) => !v)}
      >
        <Ionicons
          name={simRunning ? 'stop-circle' : 'play-circle'}
          size={14}
          color={simRunning ? colors.urgent : colors.text3}
        />
        <Text style={[styles.simLabel, simRunning && styles.simLabelActive]}>
          {simRunning ? 'STOP SIM' : 'RUN SIM'}
        </Text>
      </TouchableOpacity>
 

      {/* Bottom controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={() => setShowFilter(true)}>
          <Ionicons name="filter" size={18} color={colors.info} />
          <Text style={styles.controlLabel}>FILTER</Text>
          {activeFilterCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.manDownButton} onPress={handleManDown} activeOpacity={0.7}>
          <Ionicons name="alert-circle" size={28} color={colors.urgent} />
          <Text style={styles.manDownLabel}>MAN{'\n'}DOWN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => mapRef.current?.animateToRegion(INITIAL_REGION, 300)}
        >
          <Ionicons name="locate" size={18} color={colors.info} />
          <Text style={styles.controlLabel}>CENTER</Text>
        </TouchableOpacity>
      </View>

      <FilterPanel
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        setFilters={setFilters}
        divisions={divisions}
      />

      {/* Auto man-down 15-second warning */}
      <AutoManDownWarning
        visible={warningActive}
        countdown={countdown}
        onDismiss={dismiss}
      />

      {/* Manual / auto-triggered man-down result overlay */}
      <ManDownOverlay
        visible={manDownActive}
        responders={manDownResponders}
        onClose={clearManDown}
      />
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    controls: {
      position: 'absolute',
      bottom: 24,
      left: 12,
      right: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    controlButton: {
      backgroundColor: colors.surface1,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.info + '40',
      paddingVertical: 10,
      paddingHorizontal: 14,
      alignItems: 'center',
      gap: 4,
      minWidth: 70,
    },
    controlLabel: {
      fontSize: 8,
      fontWeight: '700',
      fontFamily: 'monospace',
      color: colors.info,
      letterSpacing: 1.5,
    },
    badge: {
      position: 'absolute',
      top: -5,
      right: -5,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.info,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      fontSize: 9,
      fontWeight: '700',
      color: colors.bg,
      fontFamily: 'monospace',
    },
    manDownButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.surface1,
      borderWidth: 2,
      borderColor: colors.urgent + '60',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      shadowColor: colors.urgent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 10,
    },
    manDownLabel: {
      fontSize: 8,
      fontWeight: '700',
      fontFamily: 'monospace',
      color: colors.urgent,
      letterSpacing: 1.5,
      textAlign: 'center',
      lineHeight: 10,
    },
    simButton: {
      position: 'absolute',
      top: 160,
      left: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: colors.surface1,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 6,
      paddingHorizontal: 10,
      zIndex: 10,
    },
    simButtonActive: {
      borderColor: colors.urgent + '60',
      backgroundColor: colors.urgent + '18',
    },
    simLabel: {
      fontSize: 8,
      fontWeight: '700',
      fontFamily: 'monospace',
      color: colors.text3,
      letterSpacing: 1.5,
    },
    simLabelActive: { color: colors.urgent },
  });
}