import * as Battery from 'expo-battery';
import { useEffect } from 'react';
import { useAlerts } from '../context/AlertContext';

/**
 * Watches real device battery/charging state.
 * Resolves any alert with resolveKey === 'battery_low' when the device is plugged in.
 */
export function useBatteryResolver() {
  const { resolveByType } = useAlerts();

  useEffect(() => {
    let subscription: ReturnType<typeof Battery.addBatteryStateListener> | null = null;

    async function init() {
      const state = await Battery.getBatteryStateAsync();
      if (
        state === Battery.BatteryState.CHARGING ||
        state === Battery.BatteryState.FULL
      ) {
        resolveByType('battery_low');
      }

      subscription = Battery.addBatteryStateListener(({ batteryState }) => {
        if (
          batteryState === Battery.BatteryState.CHARGING ||
          batteryState === Battery.BatteryState.FULL
        ) {
          resolveByType('battery_low');
        }
      });
    }

    init();
    return () => { subscription?.remove(); };
  }, [resolveByType]);
}