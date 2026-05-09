import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

// Clockwise from top-left: TL (sage fill), TR, BR, BL
const CELLS = [
  { x: 20, y: 20, fill: '#7eb281', stroke: 'none',    strokeWidth: 0 },
  { x: 54, y: 20, fill: 'none',    stroke: '#e8e8e6', strokeWidth: 2.5 },
  { x: 54, y: 54, fill: 'none',    stroke: '#e8e8e6', strokeWidth: 2.5 },
  { x: 20, y: 54, fill: 'none',    stroke: '#e8e8e6', strokeWidth: 2.5 },
];

export function SplashLogo({ size = 160 }) {
  const fades = useRef(CELLS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // 160ms lead-in then cells stagger 320ms apart, each fading over 320ms
    Animated.sequence([
      Animated.delay(160),
      Animated.stagger(
        320,
        fades.map((f) =>
          Animated.timing(f, { toValue: 1, duration: 320, useNativeDriver: true })
        )
      ),
    ]).start();
  }, []);

  return (
    <View style={{ width: size, height: size }}>
      {CELLS.map((c, i) => (
        <Animated.View key={i} style={[StyleSheet.absoluteFill, { opacity: fades[i] }]}>
          <Svg viewBox="0 0 100 100" width={size} height={size}>
            <Rect
              x={c.x} y={c.y}
              width="26" height="26" rx="4"
              fill={c.fill}
              stroke={c.stroke}
              strokeWidth={c.strokeWidth}
            />
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
}
