import { useEffect, useRef, useState } from 'react';
import { HAZARD_ZONES } from '../../constants/mockData';
import { getDistanceMeters } from './mapHelpers';

const NO_MOVEMENT_MS = 2 * 60 * 1000; // 2 minutes
const WARNING_COUNTDOWN_S = 15;        // 15-second warning

function isInsideDangerZone(coords, incidentId) {
  return HAZARD_ZONES.some(
    (hz) =>
      hz.type === 'danger' &&
      hz.incidentId === incidentId &&
      getDistanceMeters(coords, hz.center) <= hz.radius
  );
}

export function useAutoManDown({ coords, incidentId, simRunning, onTrigger }) {
  const [warningActive, setWarningActive] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_COUNTDOWN_S);

  const noMovementTimer = useRef(null);
  const countdownInterval = useRef(null);
  const lastCoords = useRef(coords);

  // Clear everything
  const reset = () => {
    clearTimeout(noMovementTimer.current);
    clearInterval(countdownInterval.current);
    setWarningActive(false);
    setCountdown(WARNING_COUNTDOWN_S);
  };

  const dismiss = () => {
    reset();
  };

  // Start the 15-second countdown, then fire man-down
  const startWarning = () => {
    setWarningActive(true);
    setCountdown(WARNING_COUNTDOWN_S);

    let remaining = WARNING_COUNTDOWN_S;
    countdownInterval.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(countdownInterval.current);
        setWarningActive(false);
        onTrigger();
      }
    }, 1000);
  };

  // Watch coords for movement — reset no-movement timer if moved
  useEffect(() => {
    if (!simRunning) {
      reset();
      return;
    }

    const moved =
      lastCoords.current.latitude !== coords.latitude ||
      lastCoords.current.longitude !== coords.longitude;

    if (moved) {
      lastCoords.current = coords;
      // Movement detected — reset the no-movement timer
      clearTimeout(noMovementTimer.current);
    }

    const inDanger = isInsideDangerZone(coords, incidentId);

    if (inDanger && !warningActive) {
      // Start (or restart) the 2-minute no-movement timer
      clearTimeout(noMovementTimer.current);
      noMovementTimer.current = setTimeout(() => {
        startWarning();
      }, NO_MOVEMENT_MS);
    } else if (!inDanger) {
      // Left the zone — cancel everything
      reset();
    }

    return () => {
      // Don't clear on every re-render, only on unmount
    };
  }, [coords, simRunning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => reset();
  }, []);

  return { warningActive, countdown, dismiss };
}