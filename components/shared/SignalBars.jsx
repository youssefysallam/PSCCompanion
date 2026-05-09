import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../constants/theme';

export default function SignalBars({ strength = 0 }) {
  const { colors } = useTheme();
  const barColor =
    strength <= 1 ? colors.onScene
    : strength <= 2 ? colors.enRoute
    : colors.available;

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={[
            styles.bar,
            {
              height: 2 + i * 2.5,
              backgroundColor: i <= strength ? barColor : colors.text4,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 12,
  },
  bar: {
    width: 3,
    borderRadius: 1,
  },
});
