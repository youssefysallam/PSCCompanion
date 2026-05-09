import { useState } from 'react';
import { Alert } from 'react-native';
import { TEAM, USER_PROFILE } from '../../constants/mockData';
import { useAlerts } from '../../context/AlertContext';
import { getClosestResponders } from './mapHelpers';

export function useManDown(userCoords) {
  const [manDownActive, setManDownActive] = useState(false);
  const [manDownResponders, setManDownResponders] = useState(null);
  const { addAlert } = useAlerts();


  const triggerManDown = () => {
    const closest = getClosestResponders(USER_PROFILE.coords, TEAM);
    setManDownResponders(closest);
    setManDownActive(true);
    addAlert({
      id: `mandown-${Date.now()}`,
      type: 'urgent',
      title: `Man-down — ${USER_PROFILE.name}`,
      detail: `${USER_PROFILE.assignment} · Auto-triggered in hazard zone`,
      createdAt: Date.now(),
      status: 'active',
      requiresAction: true,
      linkedMemberId: USER_PROFILE.id,
      linkedCoords: userCoords,
    });
  };

  const handleManDown = () => {
    Alert.alert(
      'MAN-DOWN EMERGENCY',
      'This will broadcast an emergency alert to your team and command. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'CONFIRM',
          style: 'destructive',
          onPress: triggerManDown,
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
