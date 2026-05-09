import React from 'react';

export const darkColors = {
  bg:       '#16181c',
  surface1: '#1f2228',
  surface2: '#1c1f24',
  surface3: '#22262d',
  border:   '#2a2e35',
  text1:    '#e8e8e6',
  text2:    '#9ca0a8',
  text3:    '#7d8087',
  text4:    '#5a5d63',
  navIdle:  '#4a4d54',
  accent:   '#ffffff',
  available: '#7eb281',
  enRoute:   '#c69556',
  onScene:   '#c46b66',
  urgent:    '#cf4040',
  offDuty:   '#7d8087',
  info:      '#6a8fb8',
};

export const lightColors = {
  bg:       '#f5f2ed',  // warm parchment — Monokai-inspired off-white
  surface1: '#faf8f4',  // slightly warmer white for cards
  surface2: '#f0ece4',  // warm light gray for nested surfaces
  surface3: '#e8e3d8',  // warm divider fill
  border:   '#d8d0c4',  // warm border
  text1:    '#272320',  // warm near-black
  text2:    '#5c5248',  // warm mid-brown
  text3:    '#8c8078',  // warm gray
  text4:    '#b8afa4',  // warm light gray
  navIdle:  '#a89e94',  // warm idle nav icon
  accent:   '#000000',
  available: '#4a8a4d',
  enRoute:   '#9a6020',
  onScene:   '#a03030',
  urgent:    '#b82020',
  offDuty:   '#7a7068',
  info:      '#3a6090',
};

export const buildStatusStyles = (colors) => ({
  safe: {
    color: colors.available,
    label: 'Available',
    icon: 'checkmark-circle-outline',
    iconLib: 'Ionicons',
  },
  enroute: {
    color: colors.enRoute,
    label: 'En route',
    icon: 'navigation-outline',
    iconLib: 'MaterialCommunityIcons',
  },
  onscene: {
    color: colors.info,
    label: 'On scene',
    icon: 'map-marker-outline',
    iconLib: 'MaterialCommunityIcons',
  },
  needshelp: {
    color: colors.urgent,
    label: 'Needs help',
    icon: 'alert-circle-outline',
    iconLib: 'MaterialCommunityIcons',
  },
  offline: {
    color: colors.offDuty,
    label: 'Offline',
    icon: 'wifi-off-outline',
    iconLib: 'Ionicons',
  },
});

export const ThemeContext = React.createContext({
  colors: darkColors,
  isDark: true,
  toggleTheme: () => {},
});

export function useTheme() {
  return React.useContext(ThemeContext);
}
