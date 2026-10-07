import {useEffect} from 'react';

import {
  withTiming,
  withRepeat,
  withSequence,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {SkeletonComponent} from './styles';

const Skeleton = ({
  width = 0,
  height = 0,
  mv = 0,
  mh = 0,
  circle = 0,
  loading = false,
  children = null,
}) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, {
          duration: 1000,
        }),
        withTiming(1, {
          duration: 1000,
        }),
      ),
      Infinity,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return loading ? (
    <SkeletonComponent
      style={animatedStyle}
      width={width}
      height={height}
      mv={mv}
      mh={mh}
      circle={circle}
    />
  ) : (
    children
  );
};

export default Skeleton;
