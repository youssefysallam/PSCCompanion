import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../constants/theme';

export default function HamburgerButton() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={styles.glass}
      activeOpacity={0.7}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <Ionicons name="menu" size={22} color={colors.text2} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  glass: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(31,34,40,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
});
