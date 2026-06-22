// src/components/HUDRing.js
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export default function HUDRing({ size, duration = 6000, reverse = false, color = '#00D4FF', opacity = 0.3, borderWidth = 1 }) {
  const rotation = useSharedValue(reverse ? 360 : 0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(reverse ? 0 : 360, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth,
          borderColor: color,
          opacity,
        },
        animStyle,
      ]}
    />
  );
}
