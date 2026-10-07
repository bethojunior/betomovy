import {useEffect} from 'react';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {styles} from './styles';

export const PulseComponent = ({delay = 0, repeat}) => {
  const animation = useSharedValue(0.7);
  useEffect(() => {
    animation.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 2400,
          easing: Easing.linear,
        }),
        repeat ? -1 : 1,
        false,
      ),
    );
  }, []);
  const animatedStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      animation.value,
      [1, 1],
      [0.6, 0],
      Extrapolate.CLAMP,
    );
    return {
      opacity,
      transform: [{scale: animation.value}],
    };
  });
  return <Animated.View style={[styles.circle, animatedStyles]} />;
};
