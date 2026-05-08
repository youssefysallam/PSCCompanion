import { Ionicons } from '@expo/vector-icons';
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
        <Ionicons name="home" size={18} color={Colors.cyan} />
        <Text style={styles.drawerLabel}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push('(drawer)/(tabs)/profile')}
      >
        <Ionicons name="person" size={18} color={Colors.cyan} />
        <Text style={styles.drawerLabel}>PROFILE</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => router.push('(drawer)/(tabs)/')}
      >
        <Ionicons name="people" size={18} color={Colors.cyan} />
        <Text style={styles.drawerLabel}>TEAM</Text>
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
          width: 250}
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
    color: Colors.cyan,
    fontFamily: 'monospace',
    letterSpacing: 1.5,
    fontSize: 13,
    fontWeight: '700',
  },
});