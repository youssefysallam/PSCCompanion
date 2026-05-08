import { useState } from 'react';
import { Alert } from 'react-native';
import { TEAM, USER_PROFILE } from '../../constants/mockData';
import { getClosestResponders } from './mapHelpers';

export function useManDown() {
  const [manDownActive, setManDownActive] = useState(false);
  const [manDownResponders, setManDownResponders] = useState(null);

  const handleManDown = () => {
    Alert.alert(
      'MAN-DOWN EMERGENCY',
      'This will broadcast an emergency alert to your team and command. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'CONFIRM',
          style: 'destructive',
          onPress: () => {
            const closest = getClosestResponders(USER_PROFILE.coords, TEAM);
            setManDownResponders(closest);
            setManDownActive(true);
          },
        },
      ]
    );
  };

  const clearManDown = () => {
    setManDownActive(false);
    setManDownResponders(null);
  };

  return { manDownActive, manDownResponders, handleManDown, clearManDown };
}
