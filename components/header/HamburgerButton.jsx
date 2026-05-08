import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';

export default function HamburgerButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
      <Ionicons name="menu" size={24} color={Colors.text2} />
    </TouchableOpacity>
  );
}
