// src/components/WaveBar.js
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

function Bar({ delay, color }) {
  const scaleY = useSharedValue(0.2);

  useEffect(() => {
    const timeout = setTimeout(() => {
      scaleY.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.2, { duration: 300, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scaleY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 3,
          height: 20,
          backgroundColor: color || '#00D4FF',
          borderRadius: 2,
          marginHorizontal: 1,
          opacity: 0.8,
        },
        animStyle,
      ]}
    />
  );
}

export default function WaveBar({ barCount = 12, color }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 24 }}>
      {Array.from({ length: barCount }).map((_, i) => (
        <Bar key={i} delay={i * 50} color={color} />
      ))}
    </View>
  );
}
