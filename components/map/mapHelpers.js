/** Distance between two coords in meters (haversine). */
export function getDistanceMeters(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/** Get all unique divisions for the current incident. */
export function getDivisions(team, incidentId) {
  const divs = new Set();
  team.forEach((m) => {
    if (m.incidentId === incidentId && m.division) divs.add(m.division);
  });
  return ['All', ...Array.from(divs)];
}

/** Get 2 closest qualified (not offline, not needshelp) responders. */
export function getClosestResponders(fromCoords, team) {
  return team
    .filter((m) => m.status !== 'offline' && m.status !== 'needshelp')
    .map((m) => ({
      ...m,
      dist: getDistanceMeters(fromCoords, m.coords),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 2);
}

export const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4a6080' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1117' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#161b22' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a2332' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#040810' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

export const HAZARD_COLORS = {
  danger: { fill: 'rgba(255,59,59,0.12)', stroke: 'rgba(255,59,59,0.5)' },
  warning: { fill: 'rgba(255,176,32,0.10)', stroke: 'rgba(255,176,32,0.4)' },
  caution: { fill: 'rgba(0,212,255,0.08)', stroke: 'rgba(0,212,255,0.3)' },
};

export const INITIAL_REGION = {
  latitude: 40.7142,
  longitude: -74.0060,
  latitudeDelta: 0.006,
  longitudeDelta: 0.006,
};
