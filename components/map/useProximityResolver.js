import { useEffect, useRef } from 'react';
import { USER_PROFILE } from '../../constants/mockData';
import { useAlerts } from '../../context/AlertContext';
import { getDistanceMeters } from './mapHelpers';

const RESOLUTION_RADIUS_M = 10;

export function useProximityResolver(userCoords) {
  const { alerts, resolveByMember } = useAlerts();
  const resolvedIds = useRef(new Set());

  useEffect(() => {
    if (!userCoords) return;

    alerts.forEach((alert) => {
      if (
        alert.linkedMemberId &&
        alert.linkedCoords &&
        alert.linkedMemberId !== USER_PROFILE.id &&
        alert.status !== 'resolved' &&
        !resolvedIds.current.has(alert.id)
      ) {
        const dist = getDistanceMeters(userCoords, alert.linkedCoords);
        if (dist <= RESOLUTION_RADIUS_M) {
          resolvedIds.current.add(alert.id);
          resolveByMember(alert.linkedMemberId);
        }
      }
    });
  }, [userCoords, alerts, resolveByMember]);
}