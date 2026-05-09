export const Colors = {
  // Surfaces
  bg:        '#16181c',
  surface1:  '#1f2228',
  surface2:  '#1c1f24',
  surface3:  '#22262d',
  border:    '#2a2e35',

  // Text
  text1:     '#e8e8e6',
  text2:     '#9ca0a8',
  text3:     '#7d8087',
  text4:     '#5a5d63',
  navIdle:   '#4a4d54',

  // Status accents (desaturated)
  available: '#7eb281',   // sage
  enRoute:   '#c69556',   // ember
  onScene:   '#c46b66',   // brick
  urgent:    '#cf4040',   // bright red — needs-help only
  offDuty:   '#7d8087',   // slate
  info:      '#6a8fb8',   // slate blue
};

export const StatusStyles = {
  safe: {
    color: Colors.available,
    label: 'Available',
    icon: 'checkmark-circle-outline',
    iconLib: 'Ionicons',
  },
  enroute: {
    color: Colors.enRoute,
    label: 'En route',
    icon: 'navigation-outline',
    iconLib: 'MaterialCommunityIcons',
  },
  onscene: {
    color: Colors.onScene,
    label: 'On scene',
    icon: 'map-marker-outline',
    iconLib: 'MaterialCommunityIcons',
  },
  needshelp: {
    color: Colors.urgent,
    label: 'Needs help',
    icon: 'alert-circle-outline',
    iconLib: 'MaterialCommunityIcons',
  },
  offline: {
    color: Colors.offDuty,
    label: 'Offline',
    icon: 'wifi-off-outline',
    iconLib: 'Ionicons',
  },
};

export const STATUS_SORT_ORDER = {
  needshelp: 0,
  onscene: 1,
  enroute: 2,
  safe: 3,
  offline: 4,
};
