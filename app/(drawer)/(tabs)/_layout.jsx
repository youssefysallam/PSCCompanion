import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useTheme } from '../../../constants/theme';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          height: 68,
          paddingBottom: 16,
          paddingTop: 12,
        },
        tabBarActiveTintColor: colors.text1,
        tabBarInactiveTintColor: colors.navIdle,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
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
          tabBarIcon: () => (
            <View style={{
              width: 44, height: 44, borderRadius: 13,
              backgroundColor: colors.surface1,
              borderWidth: 0.5, borderColor: colors.border,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <MaterialCommunityIcons name="radio-tower" size={22} color={colors.text1} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen
        name="map/index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
