import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HEADER_HEIGHT = 49;

export function useScrollHeader() {
  const insets = useSafeAreaInsets();
  const topInset = insets.top;

  const translateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);

  const show = useCallback(() => {
    if (!isHidden.current) return;
    isHidden.current = false;
    Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  }, [translateY]);

  const hide = useCallback(() => {
    if (isHidden.current) return;
    isHidden.current = true;
    Animated.timing(translateY, {
      toValue: -(HEADER_HEIGHT + topInset),
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [translateY, topInset]);

  const onScroll = useCallback(
    (event) => {
      const y = event.nativeEvent.contentOffset.y;
      const dy = y - lastScrollY.current;
      lastScrollY.current = y;
      if (y <= 4) show();
      else if (dy > 4) hide();
      else if (dy < -4) show();
    },
    [show, hide]
  );

  return {
    // paddingTop: topInset + 12 — topInset clears the status bar, +12 restores the top breathing
    // room from paddingVertical:12 that this style override would otherwise remove
    headerStyle: { transform: [{ translateY }], paddingTop: topInset + 12 },
    onScroll,
    // SafeAreaView already offsets the ScrollView by topInset, so only the visible
    // header content height (HEADER_HEIGHT) needs to be compensated here
    scrollPaddingTop: HEADER_HEIGHT,
  };
}
