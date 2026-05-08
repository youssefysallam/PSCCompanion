import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';

function CustomDrawerContent(props) {
  const router = useRouter();

  return (
    <ScrollView style={styles.drawer}>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push('(drawer)/(tabs)/checkin')}
      >
        <Ionicons name="home-outline" size={18} color={Colors.text2} />
        <Text style={styles.drawerLabel}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push('(drawer)/(tabs)/profile')}
      >
        <Ionicons name="person-outline" size={18} color={Colors.text2} />
        <Text style={styles.drawerLabel}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push('(drawer)/(tabs)/')}
      >
        <MaterialCommunityIcons name="account-group-outline" size={18} color={Colors.text2} />
        <Text style={styles.drawerLabel}>Team</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: 250,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingTop: 60,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  drawerLabel: {
    color: Colors.text2,
    fontSize: 13,
    fontWeight: '500',
  },
});
