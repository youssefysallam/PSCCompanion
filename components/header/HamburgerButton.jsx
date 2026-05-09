import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../../constants/theme';

export default function HamburgerButton() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
      <Ionicons name="menu" size={24} color={colors.text2} />
    </TouchableOpacity>
  );
}
