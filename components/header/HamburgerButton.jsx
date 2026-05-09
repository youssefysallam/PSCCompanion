import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../../constants/theme';

export default function HamburgerButton() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface1 + 'c8',
        borderWidth: 1,
        borderColor: colors.border + '80',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
      }}
      activeOpacity={0.7}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <Ionicons name="menu" size={22} color={colors.text2} />
    </TouchableOpacity>
  );
}
