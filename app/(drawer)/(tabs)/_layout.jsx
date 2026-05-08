import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.text1,
        tabBarInactiveTintColor: Colors.navIdle,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flash-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="checkin"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.checkinButton}>
              <MaterialCommunityIcons name="radio-tower" size={22} color={Colors.text1} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="map/index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
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
    backgroundColor: Colors.bg,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    height: 68,
    paddingBottom: 16,
    paddingTop: 12,
  },
  checkinButton: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: Colors.surface1,
    borderWidth: 0.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
