import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { buildStatusStyles, useTheme } from '../../constants/theme';
import { USER_PROFILE } from '../../constants/mockData';
import { useUser } from '../../context/UserContext';

function MiniProfileCard({ colors, StatusStyles, router }) {
  const { userStatus } = useUser();
  const p = USER_PROFILE;
  const s = StatusStyles[userStatus] || StatusStyles.offline;
  const name = p.name.replace('You (', '').replace(')', '');
  const initial = name.split(' ').pop()[0];

  return (
    <TouchableOpacity
      style={[styles.profileCard, {
        borderTopColor: s.color,
        backgroundColor: colors.surface1,
        borderColor: colors.border,
      }]}
      onPress={() => router.push('/(tabs)/profile')}
      activeOpacity={0.8}
    >
      {/* Avatar */}
      <View style={[styles.profileAvatar, { borderColor: s.color, backgroundColor: colors.surface2 }]}>
        <Text style={[styles.profileInitial, { color: s.color }]}>{initial}</Text>
        <View style={[styles.profileStatusRing, { borderColor: colors.bg }]}>
          <View style={[styles.profileStatusDot, { backgroundColor: s.color }]} />
        </View>
      </View>

      {/* Info */}
      <View style={styles.profileInfo}>
        <Text style={[styles.profileName, { color: colors.text1 }]}>{name}</Text>
        <Text style={[styles.profileSub, { color: colors.text3 }]}>{p.rank} · {p.station.split('—')[0].trim()}</Text>
        <View style={[styles.profileChip, { backgroundColor: s.color + '18', borderColor: s.color + '55' }]}>
          <View style={[styles.chipDot, { backgroundColor: s.color }]} />
          <Text style={[styles.chipLabel, { color: s.color }]}>{s.label}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={14} color={colors.text4} />
    </TouchableOpacity>
  );
}

function CustomDrawerContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const StatusStyles = useMemo(() => buildStatusStyles(colors), [colors]);

  return (
    <ScrollView
      style={[styles.drawer, { backgroundColor: colors.bg }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      {/* Profile card — top, aligned with navbar */}
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 14, paddingBottom: 8 }}>
        <MiniProfileCard colors={colors} StatusStyles={StatusStyles} router={router} />
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Nav items */}
      <View style={styles.navSection}>
        <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/(tabs)/checkin')}>
          <Ionicons name="home-outline" size={18} color={colors.text2} />
          <Text style={[styles.drawerLabel, { color: colors.text2 }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/(tabs)/')}>
          <MaterialCommunityIcons name="account-group-outline" size={18} color={colors.text2} />
          <Text style={[styles.drawerLabel, { color: colors.text2 }]}>Team</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/(tabs)/alerts')}>
          <Ionicons name="notifications-outline" size={18} color={colors.text2} />
          <Text style={[styles.drawerLabel, { color: colors.text2 }]}>Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/(tabs)/map')}>
          <Ionicons name="map-outline" size={18} color={colors.text2} />
          <Text style={[styles.drawerLabel, { color: colors.text2 }]}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/(tabs)/settings')}>
          <Ionicons name="settings-outline" size={18} color={colors.text2} />
          <Text style={[styles.drawerLabel, { color: colors.text2 }]}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.devSection, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.devBtn, { borderColor: colors.border, backgroundColor: colors.surface1 }]}
          activeOpacity={0.7}
          onPress={async () => {
            await AsyncStorage.removeItem('hasLaunched');
            router.replace('/onboarding');
          }}
        >
          <Ionicons name="refresh-outline" size={13} color={colors.text4} />
          <Text style={[styles.devLabel, { color: colors.text4 }]}>Demo onboarding</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ drawerStyle: { width: 260 } }}
    >
      <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawer: { flex: 1 },
  divider: { height: 0.5, marginHorizontal: 14, marginBottom: 6 },
  navSection: { paddingHorizontal: 6, paddingTop: 4 },
  drawerItem: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, paddingVertical: 12, paddingHorizontal: 10,
    borderRadius: 10,
  },
  drawerLabel: { fontSize: 13, fontWeight: '500' },

  // Mini profile card
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 13, borderWidth: 0.5,
    borderTopWidth: 2,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
  },
  profileAvatar: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative', flexShrink: 0,
  },
  profileInitial: { fontSize: 20, fontWeight: '500' },
  profileStatusRing: {
    position: 'absolute', bottom: -1, right: -1,
    width: 15, height: 15, borderRadius: 7.5,
    borderWidth: 2.5, alignItems: 'center', justifyContent: 'center',
  },
  profileStatusDot: { width: 8, height: 8, borderRadius: 4 },
  profileInfo: { flex: 1, gap: 3 },
  profileName: { fontSize: 15, fontWeight: '500' },
  profileSub: { fontSize: 10 },
  profileChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
    paddingVertical: 3, paddingHorizontal: 8, borderRadius: 999, borderWidth: 0.5,
    marginTop: 2,
  },
  chipDot: { width: 4, height: 4, borderRadius: 2 },
  chipLabel: { fontSize: 10, fontWeight: '500' },

  devSection: {
    paddingHorizontal: 14, paddingTop: 12, borderTopWidth: 0.5,
  },
  devBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingVertical: 9, paddingHorizontal: 12,
    borderRadius: 10, borderWidth: 0.5,
  },
  devLabel: { fontSize: 11, fontWeight: '500' },
});
