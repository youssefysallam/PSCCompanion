import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PAGES = [
  {
    key: 'checkin',
    title: 'Status check-in',
    desc: 'Update your field status in seconds. Your team sees it instantly across all their devices.',
    art: () => (
      <View style={artStyles.container}>
        <View style={artStyles.heroMini}>
          <View style={artStyles.heroLeft}>
            <Text style={artStyles.heroMicro}>Current status</Text>
            <Text style={[artStyles.heroWord, { color: Colors.available }]}>Available</Text>
          </View>
          <MaterialCommunityIcons name="radio-tower" size={22} color={Colors.available} />
        </View>
        <View style={artStyles.grid}>
          {[
            { label: 'Available', color: Colors.available, selected: true },
            { label: 'En route', color: Colors.enRoute, selected: false },
            { label: 'On scene', color: Colors.onScene, selected: false },
            { label: 'Needs help', color: Colors.onScene, selected: false },
          ].map((btn) => (
            <View key={btn.label} style={[artStyles.btn, btn.selected && { borderTopColor: btn.color, borderTopWidth: 1.5 }]}>
              <Text style={[artStyles.btnLabel, { color: btn.selected ? btn.color : Colors.text2 }]}>
                {btn.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    ),
  },
  {
    key: 'map',
    title: 'Tactical map',
    desc: 'See your whole team on the map in real time. Filter by division, status, or proximity.',
    art: () => (
      <View style={artStyles.container}>
        <View style={artStyles.mapPlaceholder}>
          <View style={artStyles.mapBg} />
          {[
            { x: 30, y: 40, color: Colors.available, label: 'R' },
            { x: 55, y: 55, color: Colors.enRoute, label: 'C' },
            { x: 75, y: 35, color: Colors.onScene, label: 'M' },
          ].map((pin, i) => (
            <View key={i} style={[artStyles.pin, { left: `${pin.x}%`, top: `${pin.y}%`, borderColor: pin.color }]}>
              <Text style={[artStyles.pinText, { color: pin.color }]}>{pin.label}</Text>
            </View>
          ))}
        </View>
        <View style={artStyles.controlsRow}>
          <View style={artStyles.controlBtn}>
            <Ionicons name="options-outline" size={14} color={Colors.text2} />
          </View>
          <View style={artStyles.controlBtn}>
            <MaterialCommunityIcons name="crosshairs-gps" size={14} color={Colors.text2} />
          </View>
        </View>
      </View>
    ),
  },
  {
    key: 'alerts',
    title: 'Alerts',
    desc: 'Critical alerts surface immediately. Swipe to acknowledge. Nothing gets missed.',
    art: () => (
      <View style={artStyles.container}>
        <View style={artStyles.alertList}>
          {[
            { color: Colors.onScene, label: 'Critical', title: 'Man-down reported — Div A' },
            { color: Colors.enRoute, label: 'Warning', title: 'Structural instability' },
            { color: Colors.info,    label: 'Info',    title: 'Resource request approved' },
          ].map((item, i) => (
            <View key={i} style={artStyles.alertRow}>
              <View style={[artStyles.alertBar, { backgroundColor: item.color }]} />
              <Ionicons name="warning-outline" size={14} color={item.color} style={{ marginLeft: 12 }} />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={artStyles.alertTitle} numberOfLines={1}>{item.title}</Text>
              </View>
              <Text style={[artStyles.alertLabel, { color: item.color }]}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    ),
  },
];

function Dots({ total, active }) {
  return (
    <View style={dotStyles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={i === active ? dotStyles.active : dotStyles.inactive}
        />
      ))}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  active: { width: 16, height: 5, borderRadius: 999, backgroundColor: Colors.text2 },
  inactive: { width: 5, height: 5, borderRadius: 999, backgroundColor: Colors.border },
});

const artStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  heroMini: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface1,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderTopWidth: 1.5,
    borderTopColor: Colors.available,
    padding: 14,
    marginBottom: 10,
  },
  heroLeft: { gap: 2 },
  heroMicro: { fontSize: 9, color: Colors.text3 },
  heroWord: { fontSize: 20, fontWeight: '500' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    width: '90%',
    justifyContent: 'space-between',
  },
  btn: {
    width: '48%',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
  },
  btnLabel: { fontSize: 11, fontWeight: '500' },

  mapPlaceholder: {
    width: '90%',
    height: 160,
    borderRadius: 12,
    backgroundColor: Colors.surface2,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
  },
  mapBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.surface2,
  },
  pin: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: Colors.surface1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinText: { fontSize: 11, fontWeight: '500' },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.surface1,
    borderWidth: 0.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  alertList: {
    width: '90%',
    backgroundColor: Colors.surface1,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    position: 'relative',
  },
  alertBar: { width: 3, position: 'absolute', left: 0, top: 0, bottom: 0 },
  alertTitle: { fontSize: 11, fontWeight: '500', color: Colors.text1 },
  alertLabel: { fontSize: 10, fontWeight: '500' },
});

export default function TourScreen() {
  const router = useRouter();
  const flatRef = useRef(null);
  const [page, setPage] = useState(0);

  const goNext = () => {
    if (page < PAGES.length - 1) {
      const next = page + 1;
      flatRef.current?.scrollToIndex({ index: next, animated: true });
      setPage(next);
    } else {
      router.replace('/login');
    }
  };

  const skip = () => router.replace('/login');

  return (
    <View style={styles.screen}>
      <FlatList
        ref={flatRef}
        data={PAGES}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <TouchableOpacity style={styles.skipBtn} onPress={skip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <View style={styles.artArea}>
              {item.art()}
            </View>

            <View style={styles.copy}>
              <Text style={styles.pageTitle}>{item.title}</Text>
              <Text style={styles.pageDesc}>{item.desc}</Text>

              <View style={styles.footer}>
                <Dots total={PAGES.length} active={page} />
                <TouchableOpacity style={styles.nextBtn} onPress={goNext} activeOpacity={0.8}>
                  <Text style={styles.nextLabel}>
                    {page === PAGES.length - 1 ? 'Sign in' : 'Next'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingBottom: 48,
  },
  skipBtn: {
    position: 'absolute',
    top: 56,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 12,
    color: Colors.text3,
  },
  artArea: {
    flex: 1,
  },
  copy: {
    paddingHorizontal: 24,
    gap: 8,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text1,
    letterSpacing: -0.2,
  },
  pageDesc: {
    fontSize: 12,
    color: Colors.text3,
    lineHeight: 19.2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  nextBtn: {
    height: 36,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: Colors.surface1,
    borderWidth: 0.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text1,
  },
});
