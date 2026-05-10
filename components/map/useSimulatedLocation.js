import { useEffect, useRef, useState } from 'react';
import { USER_PROFILE } from '../../constants/mockData';

// Start just outside the hz-1 danger zone (center: 40.7142, -74.0064, r: 40m)
// ~60m north of center = safely outside
const SIM_START = { latitude: 40.71474, longitude: -74.0064 };
// ~20m inside the zone
const SIM_INSIDE = { latitude: 40.7142, longitude: -74.0064 }

export function useSimulatedLocation(isRunning) {
  const [coords, setCoords] = useState(USER_PROFILE.coords);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isRunning) {
      // Reset to real profile coords when sim is off
      setCoords(USER_PROFILE.coords);
      clearTimeout(timerRef.current);
      return;
    }

    // Start outside the zone
    setCoords(SIM_START);

    // Walk into the zone after 5 seconds
    timerRef.current = setTimeout(() => {
      setCoords(SIM_INSIDE);
    }, 5000);

    return () => clearTimeout(timerRef.current);
  }, [isRunning]);

  return coords;
}