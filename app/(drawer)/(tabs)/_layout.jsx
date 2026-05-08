/**
 * Tab Layout — Solo Leveling system UI tab bar.
 */

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.cyan,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ href: null}}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'ALERTS',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flash" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="checkin"
        options={{
          title: 'CHECK IN',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.checkinButton}>
              <Ionicons name="radio" size={24} color={Colors.cyan} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{href: null}}
      />
      <Tabs.Screen
        name="map/index"
        options={{
          title: 'MAP',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen name="map/_components/TeamMarker" options={{ href: null }} />
      <Tabs.Screen name="map/_components/ICSBanner" options={{ href: null }} />
      <Tabs.Screen name="map/_components/FilterPanel" options={{ href: null }} />
      <Tabs.Screen name="map/_components/ManDownOverlay" options={{ href: null }} />
      <Tabs.Screen name="map/_components/MapLegend" options={{ href: null }} />
      <Tabs.Screen name="map/_components/useManDown" options={{ href: null }} />
      <Tabs.Screen name="map/_components/mapHelpers" options={{ href: null }} /> */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 80,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 1.5,
  },
  checkinButton: {
    width: 52,
    height: 52,
    borderRadius: 4,
    backgroundColor: Colors.cyanFaint,
    borderWidth: 1.5,
    borderColor: Colors.cyanBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
});
