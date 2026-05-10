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
  const warningActiveRef = useRef(false); 
  const onTriggerRef = useRef(onTrigger);

  //keep onTriggerRef fresh
  useEffect(() => {
    onTriggerRef.current = onTrigger;
  }, [onTrigger]);

  // Clear everything
  const reset = useRef(() => {
    clearTimeout(noMovementTimer.current);
    clearInterval(countdownInterval.current);
    noMovementTimer.current = null;
    countdownInterval.current = null;
    warningActiveRef.current = false;
    setWarningActive(false);
    setCountdown(WARNING_COUNTDOWN_S);
  }).current;


  // Start the 15-second countdown, then fire man-down
  const startWarning = useRef(() => {
    if (warningActiveRef.current) return;
    warningActiveRef.current = true;
    setWarningActive(true);
    setCountdown(WARNING_COUNTDOWN_S);
 
    let remaining = WARNING_COUNTDOWN_S;
    countdownInterval.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(countdownInterval.current);
        countdownInterval.current = null;
        warningActiveRef.current = false;
        setWarningActive(false);
        onTriggerRef.current?.();
      }
    }, 1000);
  }).current;

  const dismiss = () => {
    reset();
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
      noMovementTimer.current = null;
    }

    const inDanger = isInsideDangerZone(coords, incidentId);

    if (inDanger && !warningActiveRef.current && !noMovementTimer.current) {
      noMovementTimer.current = setTimeout(() => {
        startWarning();
      }, NO_MOVEMENT_MS);
    } else if (!inDanger) {
      reset();
    }
  }, [coords, simRunning, incidentId]);
 
  // Cleanup on unmount
  useEffect(() => () => reset(), []);
 
  return { warningActive, countdown, dismiss };
}