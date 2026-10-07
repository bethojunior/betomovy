import React, {useEffect} from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

export const AnimatedSlideY = ({children, showAddress, containerStyle}) => {
  const opacity = useSharedValue(showAddress ? 1 : 0);
  const translateY = useSharedValue(showAddress ? 0 : -100); // adjust -100 according to your needs
  const visible = useSharedValue(showAddress);

  useEffect(() => {
    opacity.value = withTiming(showAddress ? 1 : 0, {duration: 300});
    translateY.value = withTiming(showAddress ? 0 : -100, {duration: 500}); // adjust -100 according to your needs
    visible.value = showAddress;
  }, [opacity, translateY, showAddress]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{translateY: translateY.value}],
      display: visible.value ? 'flex' : 'none',
      ...(containerStyle || {}),
    };
  });

  return (
    <Animated.View
      style={animatedStyles}
      pointerEvents={showAddress ? 'auto' : 'none'}
    >
      {children}
    </Animated.View>
  );
};
