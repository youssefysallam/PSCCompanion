import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Colors } from '../constants/colors';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('hasLaunched').then((val) => {
      if (val) {
        router.replace('/(drawer)/(tabs)/checkin');
      } else {
        router.replace('/onboarding');
      }
    });
  }, []);

  return <View style={{ flex: 1, backgroundColor: Colors.bg }} />;
}
